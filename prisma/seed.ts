import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const adminHash = await bcrypt.hash("admin123", 12)
  const agentHash = await bcrypt.hash("agent123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
      password: adminHash,
    },
  })

  const agent = await prisma.user.upsert({
    where: { email: "agent@example.com" },
    update: {},
    create: {
      email: "agent@example.com",
      name: "Sales Agent",
      role: "AGENT",
      password: agentHash,
    },
  })

  const sources = ["WEBSITE", "REFERRAL", "SOCIAL_MEDIA", "COLD_CALL", "EVENT"]
  const sampleLeads = [
    { firstName: "Alice",  lastName: "Johnson",  email: "alice@acmecorp.com",   company: "Acme Corp",     status: "NEW" },
    { firstName: "Bob",    lastName: "Smith",    email: "bob@techstart.io",     company: "TechStart",     status: "CONTACTED" },
    { firstName: "Carol",  lastName: "Williams", email: "carol@bigco.com",      company: "BigCo",         status: "QUALIFIED" },
    { firstName: "David",  lastName: "Brown",    email: "david@ventures.co",    company: "Ventures Co",   status: "PROPOSAL" },
    { firstName: "Eve",    lastName: "Davis",    email: "eve@globalinc.com",    company: "Global Inc",    status: "NEGOTIATION" },
    { firstName: "Frank",  lastName: "Miller",   email: "frank@startup.xyz",    company: "Startup XYZ",   status: "WON" },
    { firstName: "Grace",  lastName: "Wilson",   email: "grace@solutions.biz",  company: "Solutions Biz", status: "LOST" },
    { firstName: "Henry",  lastName: "Moore",    email: "henry@newco.io",       company: "NewCo",         status: "NEW" },
    { firstName: "Iris",   lastName: "Taylor",   email: "iris@growthco.com",    company: "GrowthCo",      status: "CONTACTED" },
    { firstName: "Jack",   lastName: "Anderson", email: "jack@enterprises.net", company: "Enterprises",   status: "QUALIFIED" },
  ]

  for (let i = 0; i < sampleLeads.length; i++) {
    const leadData = sampleLeads[i]
    const lead = await prisma.lead.upsert({
      where: { email: leadData.email },
      update: {},
      create: {
        ...leadData,
        source: sources[i % sources.length],
        priority: i % 3 === 0 ? "HIGH" : i % 2 === 0 ? "LOW" : "MEDIUM",
        assignedTo: i % 2 === 0 ? admin.id : agent.id,
        activities: {
          create: {
            type: "LEAD_CREATED",
            description: "Lead created during database seed",
          },
        },
      },
    })

    await prisma.note.create({
      data: {
        content: `Initial contact made. ${leadData.firstName} is interested in our enterprise plan.`,
        leadId: lead.id,
        userId: admin.id,
      },
    })
  }

  // Sample appointment tomorrow
  const firstLead = await prisma.lead.findFirst()
  if (firstLead) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)
    const end = new Date(tomorrow)
    end.setHours(11, 0, 0, 0)

    await prisma.appointment.create({
      data: {
        title: "Discovery Call",
        description: "Initial discovery call to understand requirements.",
        startTime: tomorrow,
        endTime: end,
        leadId: firstLead.id,
        agentId: admin.id,
        status: "SCHEDULED",
      },
    })
  }

  console.log("\n✓ Seed complete")
  console.log("  Admin:  admin@example.com / admin123")
  console.log("  Agent:  agent@example.com / agent123")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
