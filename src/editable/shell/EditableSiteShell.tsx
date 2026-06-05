import type { ReactNode } from 'react'
import { EditableNavbar } from './EditableNavbar'
import { EditableFooter } from './EditableFooter'

export function EditableSiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--editable-page-bg,#fffaf3)] text-[var(--editable-page-text,#241915)]">
      <EditableNavbar />
      <main>{children}</main>
      <EditableFooter />
    </div>
  )
}
