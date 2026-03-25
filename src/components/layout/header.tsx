"use client"

import { useSession } from "next-auth/react"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { data: session } = useSession()
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U"

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-6">
      <h1 className="text-lg font-bold tracking-tight text-[#0F172A]">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D4ED8] text-xs font-bold text-white">
            {initials}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-[#111827]">{session?.user?.name ?? "User"}</p>
            <p className="text-xs text-[#6B7280] capitalize">{session?.user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
