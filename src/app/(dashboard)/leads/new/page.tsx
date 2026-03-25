import { Header } from "@/components/layout/header"
import { LeadForm } from "@/components/leads/lead-form"

export default function NewLeadPage() {
  return (
    <div>
      <Header title="New Lead" />
      <div className="p-6">
        <LeadForm />
      </div>
    </div>
  )
}
