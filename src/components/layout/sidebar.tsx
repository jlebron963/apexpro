"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Calendar, Settings, LogOut, Home } from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { ApexProLogo } from "@/components/ui/logo"

const nav = [
  { href: "/",             label: "Home",         icon: Home },
  { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/leads",        label: "Leads",        icon: Users },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/settings",     label: "Settings",     icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#0F172A]">
      {/* Logo */}
      <Link href="/" className="flex h-16 items-center border-b border-white/10 px-5 hover:opacity-80 transition-opacity">
        <ApexProLogo theme="light" size={26} />
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[#06B6D4]" : "text-white/40")} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white/70 transition-all duration-150"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
