import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateAppointmentSchema } from "@/lib/validations/appointment"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: {
      lead: { select: { id: true, firstName: true, lastName: true, email: true } },
      agent: { select: { id: true, name: true, email: true } },
    },
  })

  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(appointment)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = updateAppointmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.startTime) data.startTime = new Date(parsed.data.startTime)
  if (parsed.data.endTime) data.endTime = new Date(parsed.data.endTime)
  if (parsed.data.status === "CANCELLED") data.cancelledAt = new Date()

  const appointment = await prisma.appointment.update({
    where: { id: params.id },
    data,
  })

  if (parsed.data.status === "COMPLETED") {
    await prisma.activity.create({
      data: {
        type: "APPOINTMENT_COMPLETED",
        description: `Appointment "${appointment.title}" marked as completed`,
        leadId: appointment.leadId,
      },
    })
  }

  return NextResponse.json(appointment)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.appointment.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
