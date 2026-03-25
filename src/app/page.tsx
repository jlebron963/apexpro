import Link from "next/link"
import { CaptureForm } from "@/components/landing/capture-form"
import { ApexProLogo } from "@/components/ui/logo"
import { Users, Calendar, BarChart3, CheckCircle2, ArrowRight, Shield, Zap, Globe } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Visual Lead Pipeline",
    description: "Drag-and-drop Kanban board moves prospects through every stage — from first touch to closed deal.",
  },
  {
    icon: Calendar,
    title: "Smart Appointment Booking",
    description: "Schedule meetings with real-time conflict detection. No double-bookings, ever.",
  },
  {
    icon: BarChart3,
    title: "Executive Analytics",
    description: "Conversion funnels, pipeline velocity, and appointment trends — in one clean dashboard.",
  },
  {
    icon: CheckCircle2,
    title: "Full Activity History",
    description: "Every note, status change, and call automatically logged with timestamps.",
  },
]

const stats = [
  { value: "3×",    label: "Faster lead follow-up" },
  { value: "68%",   label: "Higher close rate" },
  { value: "< 15m", label: "To get fully set up" },
]

const trust = [
  { icon: Shield,  label: "SOC 2 Compliant" },
  { icon: Zap,     label: "99.9% Uptime SLA" },
  { icon: Globe,   label: "Used in 40+ countries" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <ApexProLogo theme="dark" size={26} />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-[#374151] hover:text-[#111827] transition-colors">
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af] transition-colors"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#374151]">
                Sales CRM Platform
              </span>
            </div>

            <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.08]">
              Turn leads into{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #1D4ED8, #06B6D4)" }}
              >
                booked appointments
              </span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-[#6B7280]">
              ApexPro captures leads from your website, routes them through a
              visual pipeline, and fills your calendar — on autopilot.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap gap-8 border-t border-[#F3F4F6] pt-8">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
                  <p className="mt-0.5 text-sm text-[#9CA3AF]">{label}</p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {trust.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
                  <Icon className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <CaptureForm />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-[#F3F4F6] bg-[#F8FAFC] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              Everything your team needs to close
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[#6B7280]">
              Built for high-performance sales teams that need speed, visibility, and control.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[#EFF6FF] p-3">
                  <Icon className="h-5 w-5 text-[#1D4ED8]" />
                </div>
                <h3 className="font-semibold text-[#111827]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-[#0F172A] px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-white">Ready to grow faster?</h2>
          <p className="mt-2 text-[#94A3B8]">Join thousands of sales teams already using ApexPro.</p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#1e40af] transition-colors"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#F3F4F6] px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <ApexProLogo theme="dark" size={22} />
          <p className="text-xs text-[#9CA3AF]">© {new Date().getFullYear()} ApexPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
