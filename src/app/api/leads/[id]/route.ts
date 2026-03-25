import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateLeadSchema } from "@/lib/validations/lead"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      assignedUser: { select: { id: true, name: true, email: true } },
      tags: { include: { tag: true } },
      notes: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      appointments: {
        include: { agent: { select: { id: true, name: true } } },
        orderBy: { startTime: "asc" },
      },
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  })

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(lead)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = updateLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: parsed.data,
  })

  return NextResponse.json(lead)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.lead.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
