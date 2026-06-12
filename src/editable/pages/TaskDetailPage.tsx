import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, CheckSquare, Clock3, Download, ExternalLink, FileText, Flag, Folder, Globe2, Heart, Image as ImageIcon, Mail, MapPin, MessageCircle, Navigation, Phone, Share2, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { globalContent } from '@/editable/content/global.content'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const decodeHtmlEntities = (value: string) => value
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')

const stripHtmlToText = (value: string) => decodeHtmlEntities(value)
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const looksLikeScrapedNavigation = (value: string) => {
  const normalized = stripHtmlToText(value).toLowerCase()
  if (!normalized) return false
  const badPhrases = [
    'account log in', 'register contact info', 'shopping cart', 'your cart is empty',
    'go to shop', 'subtotal', 'view cart', 'checkout', 'follow us', 'all categories',
    'search explore', 'trending now', 'popular listings', 'latest jobs', 'job categories',
    'join our whatsapp', 'telegram channel', 'featured administrator', 'description manage',
    'home improvement automotive travel blog shopping service lifestyle', 'casino cbd social media game'
  ]
  if (badPhrases.some((phrase) => normalized.includes(phrase))) return true
  return normalized.length > 220
}

const isCleanAddress = (value: string) => {
  const text = stripHtmlToText(value)
  if (!text || looksLikeScrapedNavigation(text)) return false
  if (text.length > 180) return false
  if (/https?:\/\//i.test(text) || /@/.test(text)) return false
  const hasAddressCue = /\b(road|rd\.?|street|st\.?|avenue|ave\.?|sector|floor|suite|sco|chandigarh|kuwait|city|building|block|lane|near|india|usa|uk|uae|pin|zip|\d{4,})\b/i.test(text)
  return hasAddressCue
}

const cleanAddressField = (post: SitePost, keys: string[]) => {
  const value = getField(post, keys)
  return isCleanAddress(value) ? stripHtmlToText(value) : ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  const decoded = /&lt;[a-z][\s\S]*?&gt;/i.test(value) ? decodeHtmlEntities(value) : value
  if (/<[a-z][\s\S]*>/i.test(decoded)) return sanitizeHtml(linkifyMarkdown(decoded))
  return decoded
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const normalizeExternalUrl = (value: string) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : ''
const phoneHrefFor = (value: string) => value ? `tel:${value.replace(/[^\d+]/g, '')}` : ''
const mapQueryFor = (post: SitePost) => {
  const address = cleanAddressField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `${lat},${lng}`
  return address || post.title
}
const mapSrcFor = (post: SitePost) => {
  const address = cleanAddressField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const detailVars = { '--detail-bg': '#f7faf8', '--detail-text': '#092f2c', '--detail-surface': '#ffffff', '--detail-accent': '#f36c4f' } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-2 text-sm font-black">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_350px] lg:px-8 lg:py-16">
      <article className="min-w-0 rounded-[2.7rem] border border-[var(--editable-border)] bg-[var(--detail-surface)] p-5 shadow-[0_30px_90px_rgba(15,23,42,0.09)] sm:p-8 lg:p-12">
        <BackLink task="article" />
        <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">{categoryOf(post, 'Article')}</p>
        <h1 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-5xl lg:text-7xl">{post.title}</h1>
        {images[0] ? <img src={images[0]} alt="" className="mt-8 max-h-[620px] w-full rounded-[2rem] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableComments slug={post.slug} comments={comments} />
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0]
  const address = cleanAddressField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const category = categoryOf(post, 'Business')
  const mapSrc = mapSrcFor(post)
  const websiteHref = normalizeExternalUrl(website)
  const phoneHref = phoneHrefFor(phone)
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQueryFor(post))}`
  const supportEmail = `support@${globalContent.site.domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '') || 'example.com'}`
  const reportHref = `mailto:${email || supportEmail}?subject=${encodeURIComponent(`Report listing: ${post.title}`)}`
  const shareUrl = `${globalContent.site.baseUrl.replace(/\/$/, '')}/listing/${post.slug}`
  const tags = [category, ...(post.tags || [])].filter(Boolean).slice(0, 6)
  const amenities = [
    getField(post, ['amenities']),
    getField(post, ['features']),
    getField(post, ['services']),
  ].filter(Boolean).join(',').split(/[,|]/).map((item) => item.trim()).filter(Boolean).slice(0, 8)
  const defaultAmenities = ['Verified business details', 'Direct contact available', 'Service information included', 'Location-ready profile']
  const featureRows = [
    ['Category', category],
    ['Service area', address || getField(post, ['city', 'location'])],
    ['Website', website ? website.replace(/^https?:\/\//, '') : ''],
    ['Listing type', 'Business directory profile'],
  ].filter(([, value]) => value)

  return (
    <section className="bg-[#f4fbf7]">
      <div className="relative min-h-[430px] overflow-hidden bg-[#0b1d2e]">
        {heroImage ? <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" /> : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,47,44,0.92)_0%,rgba(9,47,44,0.66)_48%,rgba(9,47,44,0.28)_100%)]" />
        <div className="relative mx-auto flex min-h-[430px] max-w-[var(--editable-container)] flex-col justify-center px-4 py-12 text-white sm:px-6 lg:px-8">
          <BackLink task="listing" />
          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/listing?category=${encodeURIComponent(category.toLowerCase())}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#0b7669]">
                <Folder className="h-4 w-4" /> {category}
              </Link>
              {address ? <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black text-white backdrop-blur"><MapPin className="h-4 w-4" /> {address}</span> : null}
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
            
            <div className="mt-5 flex items-center gap-2 text-[#ffd166]">
              {[0, 1, 2, 3, 4].map((item) => <Star key={item} className="h-5 w-5 fill-current" />)}
              <span className="ml-2 text-sm font-black text-white/85">Trusted business profile</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {phone ? <a href={phoneHref} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-[#092f2c] shadow-sm"><Phone className="h-4 w-4" /> Call</a> : null}
            {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-[#092f2c] shadow-sm"><Mail className="h-4 w-4" /> Send Message</a> : null}
            {website ? <Link href={websiteHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#f36c4f] px-5 py-3 text-sm font-black text-white shadow-sm"><ExternalLink className="h-4 w-4" /> Visit Website</Link> : null}
            <Link href={directionsHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/12 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 backdrop-blur"><Navigation className="h-4 w-4" /> Directions</Link>
            <a href={reportHref} className="inline-flex items-center gap-2 rounded-lg bg-white/12 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 backdrop-blur"><Flag className="h-4 w-4" /> Report</a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[var(--editable-container)] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_370px] lg:px-8 lg:py-14">
        <article className="space-y-8">
          <ListingSection icon={FileText} title="Description">
            <BodyContent post={post} compact />
          </ListingSection>

          <ListingGallery images={images.slice(1).length ? images.slice(1) : images} />

          {mapSrc ? (
            <ListingSection icon={MapPin} title="Location Map">
              <MapBox src={mapSrc} label={address || post.title} />
            </ListingSection>
          ) : null}

          <ListingSection icon={CheckSquare} title="Amenities">
            <div className="grid gap-3 sm:grid-cols-2">
              {(amenities.length ? amenities : defaultAmenities).map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-bold text-[#41635f]">
                  <CheckCircle2 className="h-4 w-4 text-[#0b7669]" /> {item}
                </div>
              ))}
            </div>
          </ListingSection>

          {featureRows.length ? <ListingInfoTable title="Additional Features" icon={Tag} rows={featureRows} /> : null}
          <ListingInfoTable title="Contact Information" icon={UserRound} rows={[['Address', address], ['Phone Number', phone], ['Email Address', email], ['Website', website]].filter(([, value]) => value)} />
          {related.length ? <ListingRelated related={related} /> : null}
        </article>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <ListingAgentCard title={post.title} category={category} address={address} phone={phone} email={email} website={website} />
          <ListingHoursCard />
          {tags.length ? <ListingTagCard title="Categories" icon={Folder} tags={tags} hrefBase="/listing?category=" /> : null}
          {address ? <ListingTagCard title="Location" icon={MapPin} tags={[address]} hrefBase="https://www.google.com/maps/search/?api=1&query=" external /> : null}
          <div className="rounded-2xl border border-[var(--editable-border)] bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6f8580]">Share listing</p>
            <div className="mt-4 flex gap-3">
              <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#d7f4ec] text-[#0b7669]"><Share2 className="h-4 w-4" /></Link>
              <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`} className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff8df] text-[#092f2c]"><Mail className="h-4 w-4" /></a>
              <a href={reportHref} className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fee4dc] text-[#f36c4f]"><Flag className="h-4 w-4" /></a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

function ListingSection({ icon: Icon, title, children }: { icon: typeof FileText; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--editable-border)] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3 border-b border-[var(--editable-border)] pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7f4ec] text-[#0b7669]"><Icon className="h-5 w-5" /></span>
        <h2 className="text-2xl font-black tracking-tight text-[#092f2c]">{title}</h2>
      </div>
      <div className="pt-1">{children}</div>
    </section>
  )
}

function ListingGallery({ images }: { images: string[] }) {
  if (!images.length) return null
  const visible = images.slice(0, 4)
  return (
    <ListingSection icon={ImageIcon} title="Photo">
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visible.map((image, index) => (
          <a key={`${image}-${index}`} href={image} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-xl border border-[var(--editable-border)] bg-[#0b1d2e]">
            <img src={image} alt="" className="aspect-[4/3] w-full object-cover opacity-88 transition duration-500 group-hover:scale-105 group-hover:opacity-70" />
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white opacity-0 transition group-hover:opacity-100">+</span>
          </a>
        ))}
      </div>
    </ListingSection>
  )
}

function ListingInfoTable({ title, icon, rows }: { title: string; icon: typeof FileText; rows: string[][] }) {
  if (!rows.length) return null
  return (
    <ListingSection icon={icon} title={title}>
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--editable-border)]">
        {rows.map(([label, value]) => (
          <div key={label} className="grid border-b border-[var(--editable-border)] last:border-b-0 sm:grid-cols-[220px_minmax(0,1fr)]">
            <div className="bg-[#f7faf8] px-4 py-3 text-sm font-black text-[#092f2c]">{label}</div>
            <div className="break-words px-4 py-3 text-sm font-semibold leading-6 text-[#41635f]">{value}</div>
          </div>
        ))}
      </div>
    </ListingSection>
  )
}

function ListingAgentCard({ title, category, address, phone, email, website }: { title: string; category: string; address: string; phone: string; email: string; website: string }) {
  const websiteHref = normalizeExternalUrl(website)
  return (
    <div className="rounded-2xl border border-[var(--editable-border)] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-[var(--editable-border)] pb-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e1f4ec] text-[#0b7669]"><Building2 className="h-6 w-6" /></span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-black text-[#092f2c]">{title}</h2>
          <p className="text-sm font-bold text-[#0b7669]">{category}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 text-sm font-semibold text-[#41635f]">
        {address ? <p className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0b7669]" /> <span>{address}</span></p> : null}
        {phone ? <a href={phoneHrefFor(phone)} className="flex gap-3 hover:text-[#0b7669]"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#0b7669]" /> <span>{phone}</span></a> : null}
        {email ? <a href={`mailto:${email}`} className="flex gap-3 hover:text-[#0b7669]"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#0b7669]" /> <span>{email}</span></a> : null}
        {website ? <Link href={websiteHref} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-[#0b7669]"><Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0b7669]" /> <span className="break-all">{website.replace(/^https?:\/\//, '')}</span></Link> : null}
      </div>
      <div className="mt-6 grid gap-3">
        {phone ? <a href={phoneHrefFor(phone)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b1d2e] px-5 text-sm font-black text-white"><Phone className="h-4 w-4" /> Call Business</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--editable-border)] px-5 text-sm font-black text-[#092f2c]"><Mail className="h-4 w-4" /> Send Message</a> : null}
      </div>
    </div>
  )
}

function ListingHoursCard() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return (
    <div className="rounded-2xl border border-[var(--editable-border)] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-[var(--editable-border)] pb-4">
        <Clock3 className="h-5 w-5 text-[#0b7669]" />
        <h2 className="text-lg font-black text-[#092f2c]">Opening Hours</h2>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--editable-border)]">
        {days.map((day) => (
          <div key={day} className="grid grid-cols-[1fr_1fr] border-b border-[var(--editable-border)] text-sm last:border-b-0">
            <span className="bg-[#f7faf8] px-3 py-2 font-bold text-[#092f2c]">{day}</span>
            <span className="px-3 py-2 font-semibold text-[#41635f]">Contact business</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ListingTagCard({ title, icon: Icon, tags, hrefBase, external = false }: { title: string; icon: typeof FileText; tags: string[]; hrefBase: string; external?: boolean }) {
  return (
    <div className="rounded-2xl border border-[var(--editable-border)] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-[var(--editable-border)] pb-4">
        <Icon className="h-5 w-5 text-[#0b7669]" />
        <h2 className="text-lg font-black text-[#092f2c]">{title}</h2>
      </div>
      <div className="mt-4 grid gap-2">
        {tags.map((tag) => (
          <Link key={tag} href={`${hrefBase}${encodeURIComponent(tag.toLowerCase())}`} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#0b7669] hover:bg-[#d7f4ec]">
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" /> {tag}
          </Link>
        ))}
      </div>
    </div>
  )
}

function ListingRelated({ related }: { related: SitePost[] }) {
  return (
    <ListingSection icon={Heart} title="Similar Businesses">
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {related.slice(0, 4).map((item) => {
          const image = getImages(item)[0]
          return (
            <Link key={item.id || item.slug} href={buildPostUrl('listing', item.slug)} className="group overflow-hidden rounded-xl border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              {image ? <img src={image} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" /> : null}
              <div className="p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0b7669]">{categoryOf(item, 'Business')}</p>
                <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight text-[#092f2c]">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#41635f]">{summaryText(item)}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </ListingSection>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = cleanAddressField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
      <aside className="rounded-[2.5rem] border border-[var(--editable-border)] bg-[var(--detail-text)] p-7 text-[var(--detail-bg)] shadow-xl lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-xs font-black uppercase tracking-[0.28em] opacity-60">Classified notice</p>
        <h1 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-5xl">{post.title}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[var(--detail-bg)] px-5 py-3 text-sm font-black text-[var(--detail-text)]">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/25 px-5 py-3 text-sm font-black">Email</a> : null}
        </div>
      </aside>
      <article className="rounded-[2.7rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-9">
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const website = getField(post, ['website', 'url', 'targetUrl', 'sourceUrl', 'link'])
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-8 text-[#f8fafc] sm:px-6 lg:px-8 lg:py-14">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(360px,0.78fr)_1.22fr]">
        <aside className="rounded-[2.5rem] border border-white/10 bg-[#f8fafc] p-7 text-[#101828] shadow-[0_26px_90px_rgba(0,0,0,0.28)] lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#101828] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white"><Camera className="h-4 w-4" /> Image story</div>
          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.07em] text-[#0b1220] sm:text-5xl">{post.title}</h1>
          {summaryText(post) ? <p className="mt-5 text-base font-semibold leading-8 text-[#475467]">{summaryText(post)}</p> : null}
          <BodyContent post={post} compact tone="light" />
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,107,53,0.28)]">Visit target page <ExternalLink className="h-4 w-4" /></Link> : null}
        </aside>
        <div className="rounded-[2.5rem] border border-white/10 bg-[#101828] p-3 shadow-[0_26px_90px_rgba(0,0,0,0.22)] sm:p-4">
          <div className="columns-1 gap-4 space-y-4 md:columns-2">
            {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
              <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[1.7rem] border border-white/12 bg-white/8 shadow-sm">
                <img src={image} alt="" className="w-full object-cover" />
                {index === 0 ? <figcaption className="p-5 text-sm font-bold text-slate-200">Featured visual from this image post.</figcaption> : null}
              </figure>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 text-[#101828]"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.7rem] border border-[var(--editable-border)] bg-white p-7 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-10">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--detail-text)] text-[var(--detail-bg)]"><Bookmark className="h-9 w-9" /></div>
        <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-5 py-3 text-sm font-black text-[var(--detail-bg)]">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.7rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-9">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[var(--detail-text)] text-[var(--detail-bg)]"><FileText className="h-12 w-12" /></div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">PDF resource</p>
            <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-[var(--detail-bg)]">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--editable-border)] bg-white p-4">
              <span className="text-sm font-black">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-xs font-black text-[var(--detail-bg)]">Download <Download className="h-4 w-4" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8 lg:py-16">
      <aside className="rounded-[2.7rem] border border-[var(--editable-border)] bg-white p-8 text-center shadow-[0_30px_90px_rgba(15,23,42,0.08)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--detail-bg)] ring-1 ring-[var(--editable-border)]">
          {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
        </div>
        <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.07em]">{post.title}</h1>
        {role ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--detail-accent)]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-[2.7rem] border border-[var(--editable-border)] bg-white p-7 shadow-sm sm:p-10">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false, tone = 'default' }: { post: SitePost; compact?: boolean; tone?: 'default' | 'light' }) {
  const toneClass = tone === 'light'
    ? 'text-[#344054] [&_a]:font-black [&_a]:text-[#f26a3d] [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-[#101828] [&_h3]:text-[#101828] [&_strong]:text-[#101828]'
    : 'opacity-80 [&_a]:font-black [&_a]:text-[var(--detail-accent)] [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-black'
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} ${toneClass}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--detail-bg)] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] opacity-55"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 opacity-80">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--detail-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[var(--editable-border)]" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  const websiteHref = website ? (/^https?:\/\//i.test(website) ? website : `https://${website}`) : ''
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : ''
  return (
    <div className="mt-5 rounded-2xl border border-[var(--editable-border)] bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] opacity-55">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={websiteHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0b1d2e] px-4 py-2 text-sm font-black text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={phoneHref} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] opacity-60">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact ? (
        <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white/70 p-5 backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.22em] opacity-55">About this listing</p>
          <div className="mt-4 grid gap-3 text-sm font-bold opacity-75">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {globalContent.site.name}</p>
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white/70 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] opacity-55">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-2xl border border-[var(--editable-border)] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--detail-bg)]"><FileText className="h-6 w-6 opacity-45" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 opacity-60">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-[var(--editable-border)] bg-white/70 p-5">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-[var(--editable-border)] bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 opacity-70">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm opacity-60">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
