// import AdListing from '@/components/PagesComponent/AdListing/AdListing'
import SEO from '@/components/SEO/SEO'
import dynamic from 'next/dynamic'
const AdListing = dynamic(() => import('@/components/PagesComponent/AdListing/AdListing'), { ssr: false })


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

const AdListingPage = () => {
    return (
        <>
            <SEO />
            <AdListing />
        </>
    )
}

export default AdListingPage