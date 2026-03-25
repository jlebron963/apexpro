import { prisma } from "@/lib/prisma"
import { startOfWeek, subWeeks, format } from "date-fns"

export async function getDashboardStats() {
  const now = new Date()
  const weekStart = startOfWeek(now)

  const [totalLeads, newThisWeek, upcomingAppointments, wonLeads, lostLeads, leadsByStatus] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.appointment.count({
        where: { status: "SCHEDULED", startTime: { gte: now } },
      }),
      prisma.lead.count({ where: { status: "WON" } }),
      prisma.lead.count({ where: { status: "LOST" } }),
      prisma.lead.groupBy({ by: ["status"], _count: { id: true } }),
    ])

  const total = wonLeads + lostLeads
  const conversionRate = total > 0 ? Math.round((wonLeads / total) * 100) : 0

  return {
    totalLeads,
    newThisWeek,
    upcomingAppointments,
    conversionRate,
    leadsByStatus: leadsByStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
  }
}

export async function getAppointmentsTrend() {
  const weeks = 12
  const since = subWeeks(new Date(), weeks)

  const appointments = await prisma.appointment.findMany({
    where: { startTime: { gte: since } },
    select: { startTime: true },
    orderBy: { startTime: "asc" },
  })

  // Group by week in JS (SQLite-compatible — no DATE_TRUNC)
  const counts: Record<string, number> = {}
  for (const apt of appointments) {
    const weekKey = format(startOfWeek(apt.startTime), "yyyy-MM-dd")
    counts[weekKey] = (counts[weekKey] ?? 0) + 1
  }

  return Object.entries(counts).map(([week, count]) => ({ week, count }))
}
