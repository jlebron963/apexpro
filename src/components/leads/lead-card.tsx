"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Link from "next/link"
import { MessageSquare, Calendar, Building2, Mail } from "lucide-react"
import { cn, PRIORITY_COLORS, formatRelative } from "@/lib/utils"

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

interface LeadCardProps {
  lead: Lead
  overlay?: boolean
}

export function LeadCard({ lead, overlay }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing",
        overlay && "shadow-xl rotate-2"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/leads/${lead.id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-medium text-gray-900 hover:text-indigo-600 text-sm leading-tight"
        >
          {lead.firstName} {lead.lastName}
        </Link>
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", PRIORITY_COLORS[lead.priority])}>
          {lead.priority}
        </span>
      </div>

      {lead.company && (
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <Building2 className="h-3 w-3" />
          {lead.company}
        </div>
      )}

      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
        <Mail className="h-3 w-3" />
        <span className="truncate">{lead.email}</span>
      </div>

      <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
        {lead._count && (
          <>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {lead._count.notes}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {lead._count.appointments}
            </span>
          </>
        )}
        <span className="ml-auto">{formatRelative(lead.createdAt)}</span>
      </div>
    </div>
  )
}
