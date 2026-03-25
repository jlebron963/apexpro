import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-[#E5E7EB] bg-white px-6 py-5 shadow-sm",
      className
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-[#9CA3AF]">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "mt-1.5 inline-flex items-center gap-1 text-xs font-semibold",
              trend.value >= 0 ? "text-emerald-600" : "text-red-500"
            )}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              <span className="font-normal text-[#9CA3AF]">{trend.label}</span>
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
          {icon}
        </div>
      </div>
    </div>
  )
}
