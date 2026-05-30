import ClassifiedDetailPage, { generateMetadata as generateClassifiedMetadata } from '@/editable/pages/ClassifiedDetailPage'

export const revalidate = 3
export const dynamic = 'force-dynamic'
export const generateMetadata = generateClassifiedMetadata
export const generateStaticParams = generateClassifiedStaticParams
export default ClassifiedDetailPage
