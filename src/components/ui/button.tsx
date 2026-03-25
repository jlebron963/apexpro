"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base = [
      "inline-flex items-center justify-center font-semibold rounded-lg",
      "transition-all duration-150 select-none",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
    ].join(" ")

    const variants = {
      primary:
        "bg-[#1D4ED8] text-white shadow-sm hover:bg-[#1e40af] active:bg-[#1e3a8a] focus:ring-blue-500",
      secondary:
        "bg-white text-[#111827] border border-[#E5E7EB] shadow-sm hover:bg-[#F8FAFC] focus:ring-gray-400",
      ghost:
        "text-[#374151] hover:bg-[#F3F4F6] focus:ring-gray-400",
      danger:
        "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus:ring-red-500",
      outline:
        "border border-[#1D4ED8] text-[#1D4ED8] bg-white hover:bg-blue-50 focus:ring-blue-500",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-5 py-2.5 text-sm gap-2",
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="h-3.5 w-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
export { Button }
