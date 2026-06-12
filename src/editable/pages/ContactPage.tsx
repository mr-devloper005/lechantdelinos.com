'use client'

import { Building2, MapPin, Phone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const tone = {
  shell: 'bg-[#f4fbf7] text-[#092f2c]',
  panel: 'border border-[var(--editable-border)] bg-white',
  soft: 'border border-[var(--editable-border)] bg-[#f7faf8]',
  muted: 'text-[#41635f]',
}

export default function ContactPage() {
  const lanes = [
    { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business profile live quickly.' },
    { icon: Phone, title: 'Listing support', body: 'Get help with account access, contact details, business descriptions, images, and submission questions.' },
    { icon: MapPin, title: 'Coverage requests', body: 'Need a new city, service area, or category lane? We can shape the directory around it.' },
  ]

  return (
    <EditableSiteShell className={tone.shell}>
      <main className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-full bg-[#d7f4ec] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0b7669]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{pagesContent.contact.title}</h1>
            <p className={`mt-5 max-w-2xl text-sm leading-8 ${tone.muted}`}>{pagesContent.contact.description}</p>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className={`rounded-2xl p-5 ${tone.soft}`}>
                  <lane.icon className="h-5 w-5" />
                  <h2 className="mt-3 text-xl font-semibold">{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl p-7 shadow-[0_24px_70px_rgba(9,47,44,0.08)] ${tone.panel}`}>
            <h2 className="text-2xl font-black tracking-tight">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
