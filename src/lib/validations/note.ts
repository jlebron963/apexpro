import { z } from "zod"

export const createNoteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty"),
  leadId: z.string().min(1),
})

export const updateNoteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty"),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
