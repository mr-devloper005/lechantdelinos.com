import ImageDetailPage, {
  generateMetadata as generateImageMetadata,
} from '@/editable/pages/ImageDetailPage'

export const revalidate = 3
export const dynamic = 'force-dynamic'
export const generateMetadata = generateImageMetadata
export const generateStaticParams = generateImageStaticParams
export default ImageDetailPage
