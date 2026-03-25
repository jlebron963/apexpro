import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAppointmentSchema } from "@/lib/validations/appointment"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const start = searchParams.get("start")
  const end = searchParams.get("end")
  const leadId = searchParams.get("leadId")

  const where: Record<string, unknown> = {}
  if (start && end) {
    where.startTime = { gte: new Date(start), lte: new Date(end) }
  }
  if (leadId) where.leadId = leadId

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      lead: { select: { id: true, firstName: true, lastName: true, email: true } },
      agent: { select: { id: true, name: true, email: true } },
    },
    orderBy: { startTime: "asc" },
  })

  return NextResponse.json(appointments)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createAppointmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { startTime, endTime, agentId } = parsed.data

  // Check for scheduling conflicts
  const conflict = await prisma.appointment.findFirst({
    where: {
      agentId,
      status: { notIn: ["CANCELLED"] },
      OR: [{ startTime: { lt: new Date(endTime) }, endTime: { gt: new Date(startTime) } }],
    },
  })

  if (conflict) {
    return NextResponse.json({ error: "Agent has a conflicting appointment" }, { status: 409 })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { startTime: _st, endTime: _et, ...rest } = parsed.data
  const appointment = await prisma.appointment.create({
    data: {
      ...rest,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
    include: {
      lead: { select: { id: true, firstName: true, lastName: true } },
      agent: { select: { id: true, name: true } },
    },
  })

  await prisma.activity.create({
    data: {
      type: "APPOINTMENT_BOOKED",
      description: `Appointment "${parsed.data.title}" booked`,
      leadId: parsed.data.leadId,
    },
  })

  return NextResponse.json(appointment, { status: 201 })
}
