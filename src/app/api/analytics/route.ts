import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getDashboardStats, getAppointmentsTrend } from "@/lib/analytics"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [stats, appointmentsTrend] = await Promise.all([
    getDashboardStats(),
    getAppointmentsTrend(),
  ])

  return NextResponse.json({ ...stats, appointmentsTrend })
}
