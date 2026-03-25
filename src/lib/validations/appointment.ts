import { z } from "zod"

export const createAppointmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  leadId: z.string().min(1, "Lead is required"),
  agentId: z.string().min(1, "Agent is required"),
  location: z.string().optional(),
  meetingUrl: z.string().url().optional().or(z.literal("")),
})

export const updateAppointmentSchema = createAppointmentSchema.partial().extend({
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  cancelReason: z.string().optional(),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
