import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/analytics/stat-card"
import { LeadsByStatusChart } from "@/components/analytics/leads-by-status-chart"
import { AppointmentsChart } from "@/components/analytics/appointments-chart"
import { getDashboardStats, getAppointmentsTrend } from "@/lib/analytics"
import { Users, Calendar, TrendingUp, UserPlus } from "lucide-react"

export default async function DashboardPage() {
  const [stats, trend] = await Promise.all([getDashboardStats(), getAppointmentsTrend()])

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header title="Dashboard" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="New This Week"
            value={stats.newThisWeek}
            icon={<UserPlus className="h-5 w-5" />}
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            subtitle="Won ÷ (Won + Lost)"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Upcoming Appointments"
            value={stats.upcomingAppointments}
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-5 lg:grid-cols-2">
          <LeadsByStatusChart data={stats.leadsByStatus} />
          <AppointmentsChart data={trend} />
        </div>
      </div>
    </div>
  )
}
