import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "success" | "warning" | "danger" | "info" | "navy"
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger:  "bg-red-50 text-red-700 border border-red-200",
    info:    "bg-blue-50 text-blue-700 border border-blue-200",
    navy:    "bg-[#0F172A] text-white",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
