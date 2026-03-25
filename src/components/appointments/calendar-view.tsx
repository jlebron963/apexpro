"use client"

import { useState, useEffect, useCallback } from "react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { AppointmentForm } from "./appointment-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDateTime, APPOINTMENT_STATUS_COLORS } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Plus, Calendar, Clock, User } from "lucide-react"

interface Lead {
  id: string
  firstName: string
  lastName: string
}

interface Agent {
  id: string
  name: string | null
}

interface Appointment {
  id: string
  title: string
  startTime: string
  endTime: string
  status: string
  lead: { id: string; firstName: string; lastName: string }
  agent: { id: string; name: string | null }
}

interface Props {
  leads: Lead[]
  agents: Agent[]
}

export function AppointmentCalendar({ leads, agents }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [currentDate] = useState(new Date())

  const fetchAppointments = useCallback(async () => {
    const start = startOfMonth(currentDate).toISOString()
    const end = endOfMonth(currentDate).toISOString()
    const res = await fetch(`/api/appointments?start=${start}&end=${end}`)
    if (res.ok) {
      const data = await res.json()
      setAppointments(data)
    }
  }, [currentDate])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const grouped = appointments.reduce<Record<string, Appointment[]>>((acc, apt) => {
    const day = format(new Date(apt.startTime), "yyyy-MM-dd")
    if (!acc[day]) acc[day] = []
    acc[day].push(apt)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentForm
              leads={leads}
              agents={agents}
              onSuccess={() => {
                setShowForm(false)
                fetchAppointments()
              }}
            />
          </CardContent>
        </Card>
      )}

      {appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <Calendar className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-400">No appointments this month.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([day, apts]) => (
              <div key={day}>
                <p className="mb-2 text-sm font-medium text-gray-500">
                  {format(new Date(day), "EEEE, MMMM d")}
                </p>
                <div className="space-y-2">
                  {apts.map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-lg border border-gray-200 bg-white p-4 flex items-start justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{apt.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(apt.startTime)}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {apt.lead.firstName} {apt.lead.lastName}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          APPOINTMENT_STATUS_COLORS[apt.status]
                        )}
                      >
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
