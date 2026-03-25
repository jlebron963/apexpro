import { cn } from "@/lib/utils"
import { SelectHTMLAttributes, forwardRef } from "react"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#111827]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "block w-full rounded-lg border bg-white px-3.5 py-2.5",
            "text-sm text-[#111827] border-[#D1D5DB] shadow-sm",
            "transition-colors duration-150 appearance-none",
            "focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20",
            error && "border-red-400",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"
export { Select }
