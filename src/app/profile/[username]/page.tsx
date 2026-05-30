import ProfileDetailPage, { generateMetadata as generateProfileMetadata } from '@/editable/pages/ProfileDetailPage'

export const revalidate = 3
export const dynamic = 'force-dynamic'
export const generateMetadata = generateProfileMetadata
export const generateStaticParams = generateProfileStaticParams
export default ProfileDetailPage
