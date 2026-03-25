import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { AppointmentCalendar } from "@/components/appointments/calendar-view"
import { SessionProvider } from "next-auth/react"

export default async function AppointmentsPage() {
  const session = await auth()

  const [leads, agents] = await Promise.all([
    prisma.lead.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      select: { id: true, name: true },
    }),
  ])

  return (
    <SessionProvider session={session}>
      <div>
        <Header title="Appointments" />
        <div className="p-6">
          <AppointmentCalendar leads={leads} agents={agents} />
        </div>
      </div>
    </SessionProvider>
  )
}
