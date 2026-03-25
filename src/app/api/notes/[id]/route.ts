import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateNoteSchema } from "@/lib/validations/note"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const note = await prisma.note.findUnique({ where: { id: params.id } })
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (note.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = updateNoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updated = await prisma.note.update({
    where: { id: params.id },
    data: { content: parsed.data.content },
    include: { user: { select: { id: true, name: true, image: true } } },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const note = await prisma.note.findUnique({ where: { id: params.id } })
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (note.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.note.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
