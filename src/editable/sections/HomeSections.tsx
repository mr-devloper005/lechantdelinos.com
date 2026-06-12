import Link from 'next/link'
import { ArrowRight, Building2, CheckCircle2, MapPin, Search, ShieldCheck } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function MiniPoster({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group block w-[230px] shrink-0 ${dc.motion.fade}`}>
      <article className="relative overflow-hidden rounded-lg border border-black/[0.07] bg-white p-2 shadow-[0_18px_48px_rgba(16,51,47,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(16,51,47,0.16)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.72)_100%)]" />
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--slot4-page-text)] shadow-sm">
            Listed
          </span>
          <h3 className="absolute bottom-3 left-3 right-3 line-clamp-2 text-base font-black leading-tight tracking-tight text-white drop-shadow-sm">
            {post.title}
          </h3>
        </div>
      </article>
    </Link>
  )
}

function FeatureTile({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const style = index % 3
  if (style === 0) {
    return (
      <Link href={href} className="group relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#24150f] p-5 text-white shadow-[0_24px_70px_rgba(47,29,22,0.18)] transition duration-300 hover:-translate-y-1">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.78))]" />
        <div className="relative z-10 flex min-h-[320px] flex-col justify-end">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">Featured</p>
          <h3 className="mt-3 line-clamp-3 text-3xl font-black leading-[0.98] tracking-[-0.06em]">{post.title}</h3>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/76">{getExcerpt(post, 110)}</p>
        </div>
      </Link>
    )
  }
  if (style === 1) {
    return (
      <Link href={href} className={`group grid overflow-hidden rounded-[2rem] border ${pal.border} bg-white shadow-[0_18px_54px_rgba(47,29,22,0.10)] transition duration-300 hover:-translate-y-1 md:grid-cols-[0.82fr_1fr]`}>
        <div className="relative min-h-[190px] bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        </div>
        <div className="p-6">
          <p className={`text-[11px] font-black uppercase tracking-[0.26em] ${pal.accentText}`}>Spotlight {index + 1}</p>
          <h3 className="mt-4 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h3>
          <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getExcerpt(post, 135)}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className={`group relative overflow-hidden rounded-[2rem] border ${pal.border} bg-[var(--slot4-accent-soft)] p-6 shadow-[0_18px_54px_rgba(47,29,22,0.08)] transition duration-300 hover:-translate-y-1`}>
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-sm">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
      </div>
      <p className={`mt-8 text-[11px] font-black uppercase tracking-[0.26em] ${pal.accentText}`}>Deep read</p>
      <h3 className="mt-3 line-clamp-4 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getExcerpt(post, 125)}</p>
    </Link>
  )
}

function WideStoryCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid gap-4 overflow-hidden rounded-[1.75rem] border ${pal.border} bg-white p-3 shadow-[0_14px_42px_rgba(47,29,22,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_58px_rgba(47,29,22,0.14)] sm:grid-cols-[150px_minmax(0,1fr)]`}>
      <div className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-[var(--slot4-media-bg)] sm:aspect-square">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/72 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
          Pick {index + 1}
        </span>
      </div>
      <div className="min-w-0 py-2 pr-2">
        <p className={`text-[11px] font-extrabold uppercase tracking-[0.24em] ${pal.accentText}`}>Editor's lane</p>
        <h3 className="mt-2 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getExcerpt(post, 145)}</p>
      </div>
    </Link>
  )
}

function IndexPill({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group relative overflow-hidden rounded-[1.55rem] border ${pal.border} bg-white p-5 shadow-[0_12px_34px_rgba(47,29,22,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(47,29,22,0.13)]`}>
      <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--slot4-accent-soft)] opacity-70 transition group-hover:scale-125" />
      <p className={`relative text-[11px] font-black uppercase tracking-[0.26em] ${pal.accentText}`}>No. {String(index + 1).padStart(2, '0')}</p>
      <h3 className="relative mt-3 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className={`relative mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getExcerpt(post, 120)}</p>
      <span className="relative mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)] opacity-70">
        Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

function Rail({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${dc.layout.rail} ${className}`}>{children}</div>
}

export function EditableHomeHero({ primaryTask, primaryRoute }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title.join(' ') || `Come for the ${taskLabel(primaryTask).toLowerCase()}. Stay for the connection.`
  return (
    <section className="relative overflow-hidden bg-[#e1f4ec]">
      <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:px-8 lg:py-16">
        <div>
          <p className="inline-flex rounded-full bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0b7669] shadow-sm">{pagesContent.home.hero.badge}</p>
          <h1 className={`${dc.type.heroTitle} mt-5 max-w-xl text-[#092f2c]`}>{heroTitle}</h1>
          <p className={`mt-5 max-w-lg text-base leading-relaxed ${pal.mutedText} sm:text-lg`}>{pagesContent.home.hero.description}</p>
          <form action="/search" className="mt-8 flex max-w-xl rounded-full border border-[var(--editable-border)] bg-white p-2 shadow-[0_20px_55px_rgba(9,47,44,0.10)]">
            <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent px-5 text-sm font-bold text-[#092f2c] outline-none placeholder:text-[#6f8580]" />
            <button className="inline-flex items-center gap-2 rounded-full bg-[#0b1d2e] px-5 py-3 text-sm font-black text-white"><Search className="h-4 w-4" /> Search</button>
          </form>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/listing" className={dc.button.primary}>Browse listings <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/create" className={dc.button.secondary}>Add your business</Link>
          </div>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_24px_80px_rgba(9,47,44,0.12)]">
          <div className="rounded-xl bg-[#0b7669] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">{pagesContent.home.hero.featureCardBadge}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight">{pagesContent.home.hero.featureCardTitle}</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-white/78">{pagesContent.home.hero.featureCardDescription}</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Building2, title: 'Business profiles', body: 'Company names, categories, and service summaries.' },
              { icon: MapPin, title: 'Local context', body: 'Cities, addresses, and map-friendly details.' },
              { icon: ShieldCheck, title: 'Trust signals', body: 'Clear descriptions and direct contact paths.' },
              { icon: CheckCircle2, title: 'Easy actions', body: 'Search, compare, call, email, or visit websites.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-[var(--editable-border)] bg-[#f7faf8] p-4">
                <Icon className="h-5 w-5 text-[#0b7669]" />
                <h3 className="mt-3 text-sm font-black text-[#092f2c]">{title}</h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#41635f]">{body}</p>
              </div>
            ))}
            </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 12)
  if (!railPosts.length) return null
  return (
    <section className={`${pal.warmBg} relative border-t border-black/[0.06]`}>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-[linear-gradient(to_bottom,transparent,#ffffff)]" />
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className={dc.type.sectionTitle}>Featured businesses</h2>
          <Link href={primaryRoute} className="hidden text-sm font-semibold text-[#006d6d] hover:underline sm:inline">See all</Link>
        </div>
        <Rail className="mt-8">
          {railPosts.map((post) => <MiniPoster key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
        </Rail>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts.slice(0, 8)
  if (!featured.length) return null
  return (
    <section className={`${pal.lavenderBg} relative overflow-hidden`}>
      <div className="pointer-events-none absolute -left-20 top-8 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Business listings worth a closer look</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.slice(0, 6).map((post, index) => (
            <FeatureTile key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const categoryPosts = timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts.slice(8)
  const feature = categoryPosts[0] || posts[0]
  const picks = categoryPosts.slice(1, 5)
  const indexPosts = categoryPosts.slice(5, 13)
  return (
    <section className={pal.grayBg}>
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8">
        <div>
          <h2 className={dc.type.sectionTitle}>Search by service, city, or category.</h2>
          <p className={`mt-4 max-w-md text-base leading-relaxed ${pal.mutedText}`}>Find a business faster with focused search, compact cards, and listing details that are easy to compare.</p>
          <form action="/search" className="mt-8 flex max-w-md rounded-full border border-black/[0.08] bg-white p-2 shadow-sm">
            <input name="q" placeholder="Search businesses" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" />
            <button className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"><Search className="h-4 w-4" /> Search</button>
          </form>
        </div>
        <div className="grid gap-4">
          {picks.map((post, index) => <WideStoryCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </div>
      </div>
      {feature ? (
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:px-8">
          <Link href={postHref(primaryTask, feature, primaryRoute)} className="group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-black text-white shadow-[0_18px_70px_rgba(0,0,0,0.16)]">
            <img src={getEditablePostImage(feature)} alt={feature.title} className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.74))]" />
            <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-7 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">Featured stream</p>
              <h3 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{feature.title}</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/78">{getExcerpt(feature, 180)}</p>
            </div>
          </Link>
          <div className="grid gap-4 sm:grid-cols-2">
            {indexPosts.map((post, index) => <IndexPill key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className={`${pal.panelBg} relative scroll-mt-24 overflow-hidden`}>
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{pagesContent.home.cta.title}</h2>
          <p className={`mt-4 text-lg ${pal.mutedText}`}>{pagesContent.home.cta.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4"><Link href="/create" className={dc.button.primary}>{pagesContent.home.cta.primaryCta.label}</Link><Link href="/search" className={dc.button.secondary}>{pagesContent.home.cta.secondaryCta.label}</Link></div>
        </div>
      </div>
    </section>
  )
}
