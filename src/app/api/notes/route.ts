import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNoteSchema } from "@/lib/validations/note"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createNoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const note = await prisma.note.create({
    data: {
      content: parsed.data.content,
      leadId: parsed.data.leadId,
      userId: session.user.id,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  })

  await prisma.activity.create({
    data: {
      type: "NOTE_ADDED",
      description: `Note added by ${session.user.name ?? session.user.email}`,
      leadId: parsed.data.leadId,
    },
  })

  return NextResponse.json(note, { status: 201 })
}
