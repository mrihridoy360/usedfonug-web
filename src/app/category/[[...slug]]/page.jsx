import SingleCategory from "@/components/PagesComponent/SingleCategory/SingleCategory"
import SEO from "@/components/SEO/SEO"


export const metadata = {
    title: process.env.NEXT_PUBLIC_META_TITLE,
    description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
    keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
    openGraph: {
        title: process.env.NEXT_PUBLIC_META_TITLE,
        description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
        keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
      },
}
const SingleCategoryPage = ({ params }) => {
    return (
        <>
         {/* <SEO /> */}
        <SingleCategory slug={params.slug} />
        </>
    )
}

export default SingleCategoryPage