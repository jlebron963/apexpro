"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { LeadCard } from "./lead-card"
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/utils"
import { cn } from "@/lib/utils"

const COLUMNS = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  company?: string | null
  status: string
  priority: string
  createdAt: string
  _count?: { notes: number; appointments: number }
}

interface PipelineBoardProps {
  initialLeads: Lead[]
}

export function PipelineBoard({ initialLeads }: PipelineBoardProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveId(null)
      const { active, over } = event
      if (!over || active.id === over.id) return

      const newStatus = over.id as string
      if (!COLUMNS.includes(newStatus)) return

      const prev = leads.find((l) => l.id === active.id)
      if (!prev || prev.status === newStatus) return

      setLeads((ls) => ls.map((l) => (l.id === active.id ? { ...l, status: newStatus } : l)))

      try {
        const res = await fetch(`/api/leads/${active.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })
        if (!res.ok) throw new Error("Update failed")
      } catch {
        setLeads((ls) => ls.map((l) => (l.id === active.id ? { ...l, status: prev.status } : l)))
      }
    },
    [leads]
  )

  const activeLead = leads.find((l) => l.id === activeId)

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((status) => {
          const columnLeads = leads.filter((l) => l.status === status)
          return (
            <div key={status} className="flex w-64 shrink-0 flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_COLORS[status])}>
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-xs text-gray-400">{columnLeads.length}</span>
              </div>

              <SortableContext
                id={status}
                items={columnLeads.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  id={status}
                  className="flex min-h-[120px] flex-col gap-2 rounded-xl bg-gray-50 p-2"
                >
                  {columnLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>

      <DragOverlay>
        {activeLead && <LeadCard lead={activeLead} overlay />}
      </DragOverlay>
    </DndContext>
  )
}
