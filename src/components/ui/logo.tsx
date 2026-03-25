import { cn } from "@/lib/utils"

interface ApexProLogoProps {
  /** "premium" = navy-to-cyan gradient bolt (default), "enterprise" = solid monochrome bolt */
  variant?: "premium" | "enterprise"
  /** "light" = renders on dark backgrounds, "dark" = renders on light backgrounds */
  theme?: "light" | "dark"
  size?: number
  showWordmark?: boolean
  className?: string
}

export function ApexProLogo({
  variant = "premium",
  theme = "dark",
  size = 28,
  showWordmark = true,
  className,
}: ApexProLogoProps) {
  const gradId = `apex-grad-${theme}`

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {variant === "premium" ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradId} x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
              {theme === "dark" ? (
                <>
                  <stop stopColor="#0F172A" />
                  <stop offset="0.5" stopColor="#1E3A8A" />
                  <stop offset="1" stopColor="#06B6D4" />
                </>
              ) : (
                <>
                  <stop stopColor="#FFFFFF" />
                  <stop offset="0.6" stopColor="#BAE6FD" />
                  <stop offset="1" stopColor="#67E8F9" />
                </>
              )}
            </linearGradient>
          </defs>
          <path
            d="M14.2 2L7.2 11.8C6.85 12.3 7.2 13 7.85 13H11.8L10.5 22L18.2 10.8C18.6 10.25 18.2 9.5 17.55 9.5H13.5L14.2 2Z"
            fill={`url(#${gradId})`}
          />
        </svg>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={theme === "dark" ? "text-[#0F172A]" : "text-white"}
        >
          <path d="M13 2L6 13H11L9 22L18 10H13L13 2Z" />
        </svg>
      )}

      {showWordmark && (
        <span
          className={cn(
            "font-bold tracking-tight leading-none select-none",
            theme === "dark" ? "text-[#0F172A]" : "text-white"
          )}
          style={{ fontSize: size * 0.57 }}
        >
          ApexPro
        </span>
      )}
    </div>
  )
}
