import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

const hash = await bcrypt.hash("admin123", 12)

const user = await db.user.upsert({
  where: { email: "admin@example.com" },
  update: { password: hash },
  create: {
    email: "admin@example.com",
    name: "Admin User",
    role: "ADMIN",
    password: hash,
  },
})

console.log("✓ Password reset for", user.email)
console.log("  hash prefix:", hash.slice(0, 7))

const check = await bcrypt.compare("admin123", user.password)
console.log("  bcrypt.compare check:", check ? "PASS ✓" : "FAIL ✗")

await db.$disconnect()
