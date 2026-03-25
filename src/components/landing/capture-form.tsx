"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { captureLeadSchema, type CaptureLeadInput } from "@/lib/validations/lead"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CaptureForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CaptureLeadInput>({ resolver: zodResolver(captureLeadSchema) })

  async function onSubmit(data: CaptureLeadInput) {
    const res = await fetch("/api/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#111827]">You&apos;re all set!</h3>
        <p className="mt-1.5 text-sm text-[#6B7280]">Our team will reach out within one business day.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-xl shadow-slate-200/60">
      <div className="mb-6">
        <h3 className="text-xl font-bold tracking-tight text-[#0F172A]">Request a free demo</h3>
        <p className="mt-1 text-sm text-[#6B7280]">See ApexPro in action — no credit card required.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input id="firstName" label="First name" placeholder="Jane"
            error={errors.firstName?.message} {...register("firstName")} />
          <Input id="lastName" label="Last name" placeholder="Smith"
            error={errors.lastName?.message} {...register("lastName")} />
        </div>
        <Input id="email" label="Work email" type="email" placeholder="jane@company.com"
          error={errors.email?.message} {...register("email")} />
        <Input id="phone" label="Phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
        <Input id="company" label="Company" placeholder="Acme Inc." {...register("company")} />

        <Button type="submit" loading={isSubmitting} className="w-full mt-2" size="lg">
          Get started free →
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-[#9CA3AF]">
        No spam. Unsubscribe anytime. SOC 2 compliant.
      </p>
    </div>
  )
}
