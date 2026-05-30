import ArticleDetailPage, {
  generateMetadata as generateArticleMetadata,
} from '@/editable/pages/ArticleDetailPage'

export const revalidate = 3
export const dynamic = 'force-dynamic'
export const generateMetadata = generateArticleMetadata
export const generateStaticParams = generateArticleStaticParams
export default ArticleDetailPage
