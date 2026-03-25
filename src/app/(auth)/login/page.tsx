"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ApexProLogo } from "@/components/ui/logo"
import Link from "next/link"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError("Invalid email or password. Please try again.")
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between bg-[#0F172A] px-12 py-10">
        <Link href="/">
          <ApexProLogo theme="light" size={26} />
        </Link>

        <div className="space-y-8">
          <div>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <svg className="h-6 w-6 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Everything you need to close more deals</h2>
            <p className="mt-3 text-[#94A3B8] leading-relaxed">
              Capture leads, manage your pipeline, book appointments, and track every interaction — all in one premium platform.
            </p>
          </div>

          <blockquote className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-relaxed text-white/80">
              &ldquo;ApexPro transformed how we handle inbound leads. Response time went from hours to minutes — and our close rate jumped 40%.&rdquo;
            </p>
            <footer className="mt-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D4ED8] text-xs font-bold text-white">
                SJ
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Sarah Johnson</p>
                <p className="text-xs text-[#64748B]">VP of Sales, Meridian Tech</p>
              </div>
            </footer>
          </blockquote>
        </div>

        <p className="text-xs text-[#334155]">© {new Date().getFullYear()} ApexPro. All rights reserved.</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 items-center justify-center bg-[#F8FAFC] px-6 py-12">
        <div className="w-full max-w-[360px]">
          {/* Mobile logo */}
          <Link href="/" className="mb-10 inline-block lg:hidden">
            <ApexProLogo theme="dark" size={26} />
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Welcome back</h1>
            <p className="mt-1.5 text-sm text-[#6B7280]">Sign in to your ApexPro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email" name="email" type="email" label="Email address"
              placeholder="you@company.com" required autoComplete="email"
            />
            <Input
              id="password" name="password" type="password" label="Password"
              placeholder="••••••••" required autoComplete="current-password"
            />

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign in to ApexPro
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-center">
            <p className="text-xs text-[#6B7280]">Demo account</p>
            <p className="mt-0.5 text-sm font-medium text-[#111827]">
              admin@example.com&nbsp;/&nbsp;admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
