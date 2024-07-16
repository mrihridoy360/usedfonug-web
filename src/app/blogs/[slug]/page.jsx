import SingleBlog from '@/components/PagesComponent/SingleBlog/SingleBlog'


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
const SingleBlogPage = () => {
    return (
        <>
            <SingleBlog />
        </>
    )
}

export default SingleBlogPage