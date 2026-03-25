import { auth } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header title="Settings" />
      <div className="p-6 max-w-xl space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-[#F3F4F6]">
              {[
                { label: "Name",  value: session?.user?.name ?? "—" },
                { label: "Email", value: session?.user?.email ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <dt className="text-sm text-[#6B7280]">{label}</dt>
                  <dd className="text-sm font-medium text-[#111827]">{value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between py-3">
                <dt className="text-sm text-[#6B7280]">Role</dt>
                <dd>
                  <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-semibold text-[#1D4ED8]">
                    {session?.user?.role}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
