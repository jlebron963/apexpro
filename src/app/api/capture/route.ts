import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { captureLeadSchema } from "@/lib/validations/lead"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = captureLeadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { firstName, lastName, email, phone, company } = parsed.data

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        company,
        source: "WEBSITE",
        status: "NEW",
        activities: {
          create: {
            type: "LEAD_CREATED",
            description: `Lead created via website capture form`,
          },
        },
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
