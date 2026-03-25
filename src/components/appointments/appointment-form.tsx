"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createAppointmentSchema, type CreateAppointmentInput } from "@/lib/validations/appointment"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface Lead {
  id: string
  firstName: string
  lastName: string
}

interface Agent {
  id: string
  name: string | null
}

interface AppointmentFormProps {
  leads: Lead[]
  agents: Agent[]
  defaultLeadId?: string
  onSuccess?: () => void
}

export function AppointmentForm({ leads, agents, defaultLeadId, onSuccess }: AppointmentFormProps) {
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAppointmentInput>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: { leadId: defaultLeadId },
  })

  async function onSubmit(data: CreateAppointmentInput) {
    setError(null)
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.status === 409) {
      setError("Agent has a conflicting appointment at that time.")
      return
    }
    if (!res.ok) {
      setError("Failed to create appointment.")
      return
    }
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="title"
        label="Title"
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        id="description"
        label="Description"
        rows={2}
        {...register("description")}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="startTime"
          label="Start Time"
          type="datetime-local"
          error={errors.startTime?.message}
          {...register("startTime")}
        />
        <Input
          id="endTime"
          label="End Time"
          type="datetime-local"
          error={errors.endTime?.message}
          {...register("endTime")}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="leadId" className="block text-sm font-medium text-gray-700">
          Lead
        </label>
        <select
          id="leadId"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...register("leadId")}
        >
          <option value="">Select a lead...</option>
          {leads.map((l) => (
            <option key={l.id} value={l.id}>
              {l.firstName} {l.lastName}
            </option>
          ))}
        </select>
        {errors.leadId && <p className="text-xs text-red-600">{errors.leadId.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="agentId" className="block text-sm font-medium text-gray-700">
          Agent
        </label>
        <select
          id="agentId"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...register("agentId")}
        >
          <option value="">Select an agent...</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name ?? a.id}
            </option>
          ))}
        </select>
        {errors.agentId && <p className="text-xs text-red-600">{errors.agentId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input id="location" label="Location" {...register("location")} />
        <Input id="meetingUrl" label="Meeting URL" type="url" {...register("meetingUrl")} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Book Appointment
      </Button>
    </form>
  )
}
