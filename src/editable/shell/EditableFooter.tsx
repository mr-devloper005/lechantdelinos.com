'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight, Building2, Mail, MapPin, Phone } from 'lucide-react'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = { '--editable-footer-bg': '#ffffff', '--editable-footer-text': 'var(--editable-page-text, #092f2c)' } as CSSProperties
  const brandName = globalContent.site.name
  const directoryLinks = globalContent.footer.columns[0]?.links || []
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer style={footerVars} className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[var(--editable-border)] bg-white">
              <img src="/favicon.png?v=20260413" alt={brandName} className="h-9 w-9 object-contain" />
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">{brandName}</span>
              <span className="block text-[11px] font-black uppercase tracking-[0.18em] opacity-45">{globalContent.footer.tagline}</span>
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 opacity-70">{globalContent.footer.description}</p>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.22em] opacity-55">Directory</h3>
          <div className="mt-4 grid gap-2">
            {directoryLinks.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 text-sm font-bold opacity-75 hover:opacity-100">
                {item.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.22em] opacity-55">Account</h3>
          <div className="mt-4 grid gap-2">
            {[['About', '/about'], ['Contact', '/contact'], ...(session ? [['Create listing', '/create']] : [['Login', '/login'], ['Sign up', '/signup']])].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-bold opacity-75 hover:opacity-100">{label}</Link>
            ))}
            {session ? <button type="button" onClick={logout} className="text-left text-sm font-bold opacity-75 hover:opacity-100">Logout</button> : null}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.22em] opacity-55">Directory Trust</h3>
          <div className="mt-4 grid gap-3 text-sm font-bold opacity-75">
            <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4" /> Business profiles</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Location details</span>
            <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Direct contact paths</span>
            <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Listing support</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--editable-border)] px-4 py-5 text-center text-xs font-bold opacity-55">
        (c) {year} {brandName}. All rights reserved.
      </div>
    </footer>
  )
}
