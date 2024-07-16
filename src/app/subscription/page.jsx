import Subscription from "@/components/PagesComponent/Subscription/Subscription"
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
const SubscriptionPage = () => {
    return (
        <>
        {/* <SEO /> */}
        <Subscription />
        </>
    )
}

export default SubscriptionPage