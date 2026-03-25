import { cn } from "@/lib/utils"
import { TextareaHTMLAttributes, forwardRef } from "react"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#111827]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "block w-full rounded-lg border bg-white px-3.5 py-2.5",
            "text-sm text-[#111827] placeholder:text-[#9CA3AF]",
            "border-[#D1D5DB] shadow-sm resize-none",
            "transition-colors duration-150",
            "focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"
export { Textarea }
