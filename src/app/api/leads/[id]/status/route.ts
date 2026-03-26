import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateLeadStatusSchema } from "@/lib/validations/lead"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = updateLeadStatusSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.lead.findUnique({
    where: { id: params.id },
  })

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status,
      convertedAt: parsed.data.status === "WON" ? new Date() : undefined,
      activities: {
        create: {
          type: "STATUS_CHANGE",
          description: `Status changed from ${existing.status} to ${parsed.data.status}`,
          metadata: JSON.stringify({
            from: existing.status,
            to: parsed.data.status,
          }),
        },
      },
    },
  })

  return NextResponse.json(lead)
}
