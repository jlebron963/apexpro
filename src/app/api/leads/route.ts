import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createLeadSchema } from "@/lib/validations/lead"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const assignedTo = searchParams.get("assignedTo")
  const search = searchParams.get("search")
  const page = parseInt(searchParams.get("page") ?? "1")
  const limit = parseInt(searchParams.get("limit") ?? "50")

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (assignedTo) where.assignedTo = assignedTo
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ]
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
        _count: { select: { notes: true, appointments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ])

  return NextResponse.json({ leads, total, page, limit })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const lead = await prisma.lead.create({
    data: {
      ...parsed.data,
      activities: {
        create: {
          type: "LEAD_CREATED",
          description: `Lead created manually by ${session.user.name ?? session.user.email}`,
        },
      },
    },
  })

  return NextResponse.json(lead, { status: 201 })
}
