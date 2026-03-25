import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { PipelineBoard } from "@/components/leads/pipeline-board"
import { Plus } from "lucide-react"

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: { _count: { select: { notes: true, appointments: true } } },
    orderBy: { createdAt: "desc" },
  })

  const serialized = leads.map((l) => ({
    ...l,
    value: l.value ? Number(l.value) : null,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
    convertedAt: l.convertedAt?.toISOString() ?? null,
  }))

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header title="Leads" />
      <div className="flex-1 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6B7280]">
              <span className="font-semibold text-[#111827]">{leads.length}</span> total leads in pipeline
            </p>
          </div>
          <Link
            href="/leads/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Link>
        </div>
        <PipelineBoard initialLeads={serialized} />
      </div>
    </div>
  )
}
