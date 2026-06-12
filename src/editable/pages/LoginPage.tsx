import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--editable-page-bg,#f4fbf7)] text-[var(--editable-page-text,#092f2c)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div>
            <p className="inline-flex rounded-full bg-[#d7f4ec] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0b7669]">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-sm leading-8 opacity-70">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-2xl border border-[var(--editable-border)] bg-white p-6 shadow-[0_24px_70px_rgba(16,36,31,0.12)] sm:p-8">
            <h2 className="text-2xl font-black tracking-tight">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm opacity-70">New here? <Link href="/signup" className="font-black underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
