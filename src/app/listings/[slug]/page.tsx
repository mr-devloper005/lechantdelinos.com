import ListingDetailPage, {
  generateMetadata as generateListingMetadata,
} from '@/editable/pages/ListingDetailPage'

export const revalidate = 3
export const dynamic = 'force-dynamic'
export const generateMetadata = generateListingMetadata
export const generateStaticParams = generateListingStaticParams
export default ListingDetailPage
