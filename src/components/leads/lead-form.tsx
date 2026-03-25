"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createLeadSchema, type CreateLeadInput } from "@/lib/validations/lead"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function LeadForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: { status: "NEW", priority: "MEDIUM", source: "WEBSITE" },
  })

  async function onSubmit(data: CreateLeadInput) {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const lead = await res.json()
      router.push(`/leads/${lead.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="firstName"
          label="First Name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          id="lastName"
          label="Last Name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <Input
        id="email"
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input id="phone" label="Phone" {...register("phone")} />
        <Input id="company" label="Company" {...register("company")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="source"
          label="Source"
          options={[
            { value: "WEBSITE", label: "Website" },
            { value: "REFERRAL", label: "Referral" },
            { value: "SOCIAL_MEDIA", label: "Social Media" },
            { value: "EMAIL_CAMPAIGN", label: "Email Campaign" },
            { value: "COLD_CALL", label: "Cold Call" },
            { value: "EVENT", label: "Event" },
            { value: "OTHER", label: "Other" },
          ]}
          {...register("source")}
        />
        <Select
          id="priority"
          label="Priority"
          options={[
            { value: "LOW", label: "Low" },
            { value: "MEDIUM", label: "Medium" },
            { value: "HIGH", label: "High" },
          ]}
          {...register("priority")}
        />
      </div>

      <Button type="submit" loading={isSubmitting}>
        Create Lead
      </Button>
    </form>
  )
}
