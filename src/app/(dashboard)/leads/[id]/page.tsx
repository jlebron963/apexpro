import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { NotesPanel } from "@/components/leads/notes-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatDate, formatDateTime, formatRelative } from "@/lib/utils"
import { ArrowLeft, Mail, Phone, Building2, Calendar, User } from "lucide-react"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"

const STATUS_STYLES: Record<string, string> = {
  NEW:         "bg-sky-50 text-sky-700 border border-sky-200",
  CONTACTED:   "bg-amber-50 text-amber-700 border border-amber-200",
  QUALIFIED:   "bg-violet-50 text-violet-700 border border-violet-200",
  PROPOSAL:    "bg-orange-50 text-orange-700 border border-orange-200",
  NEGOTIATION: "bg-pink-50 text-pink-700 border border-pink-200",
  WON:         "bg-emerald-50 text-emerald-700 border border-emerald-200",
  LOST:        "bg-red-50 text-red-700 border border-red-200",
}

const PRIORITY_STYLES: Record<string, string> = {
  LOW:    "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]",
  MEDIUM: "bg-amber-50 text-amber-700 border border-amber-200",
  HIGH:   "bg-red-50 text-red-700 border border-red-200",
}

const APT_STATUS_STYLES: Record<string, string> = {
  SCHEDULED:  "bg-sky-50 text-sky-700 border border-sky-200",
  CONFIRMED:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  COMPLETED:  "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]",
  CANCELLED:  "bg-red-50 text-red-700 border border-red-200",
  NO_SHOW:    "bg-orange-50 text-orange-700 border border-orange-200",
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      assignedUser: { select: { id: true, name: true, email: true } },
      notes: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      appointments: {
        include: { agent: { select: { id: true, name: true } } },
        orderBy: { startTime: "asc" },
      },
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  })

  if (!lead) notFound()

  const serializedNotes = lead.notes.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  }))

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Header title={`${lead.firstName} ${lead.lastName}`} />

        <div className="flex-1 p-6 space-y-5">
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pipeline
          </Link>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* ── Main column ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Lead info */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-[#0F172A]">
                        {lead.firstName} {lead.lastName}
                      </h2>
                      {lead.company && (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
                          <Building2 className="h-3.5 w-3.5" />
                          {lead.company}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[lead.status])}>
                        {lead.status}
                      </span>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", PRIORITY_STYLES[lead.priority])}>
                        {lead.priority}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#9CA3AF]" />
                      <a href={`mailto:${lead.email}`}
                        className="text-sm text-[#1D4ED8] hover:underline truncate">
                        {lead.email}
                      </a>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#9CA3AF]" />
                        <span className="text-sm text-[#374151]">{lead.phone}</span>
                      </div>
                    )}
                    {lead.assignedUser && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#9CA3AF]" />
                        <span className="text-sm text-[#374151]">{lead.assignedUser.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-[#374151]">
                      <span className="text-[#9CA3AF]">Source:</span>
                      <span className="font-medium">{lead.source}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#374151]">
                      <span className="text-[#9CA3AF]">Created:</span>
                      <span className="font-medium">{formatDate(lead.createdAt)}</span>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.appointments.length === 0 ? (
                    <p className="text-sm text-[#9CA3AF]">No appointments scheduled yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {lead.appointments.map((apt) => (
                        <div key={apt.id}
                          className="flex items-start justify-between rounded-lg border border-[#F3F4F6] bg-[#F8FAFC] p-4">
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{apt.title}</p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#6B7280]">
                              <Calendar className="h-3 w-3" />
                              {formatDateTime(apt.startTime)}
                            </p>
                            {apt.agent.name && (
                              <p className="mt-0.5 text-xs text-[#9CA3AF]">with {apt.agent.name}</p>
                            )}
                          </div>
                          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", APT_STATUS_STYLES[apt.status])}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <NotesPanel leadId={lead.id} initialNotes={serializedNotes} />
                </CardContent>
              </Card>
            </div>

            {/* ── Activity sidebar ── */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.activities.length === 0 ? (
                    <p className="text-sm text-[#9CA3AF]">No activity yet.</p>
                  ) : (
                    <div className="relative space-y-4">
                      {lead.activities.map((act, i) => (
                        <div key={act.id} className="flex gap-3">
                          <div className="relative flex flex-col items-center">
                            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#1D4ED8]" />
                            {i < lead.activities.length - 1 && (
                              <div className="mt-1 w-px flex-1 bg-[#E5E7EB]" />
                            )}
                          </div>
                          <div className="pb-4 min-w-0">
                            <p className="text-sm text-[#374151] leading-snug">{act.description}</p>
                            <p className="mt-0.5 text-xs text-[#9CA3AF]">{formatRelative(act.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}
