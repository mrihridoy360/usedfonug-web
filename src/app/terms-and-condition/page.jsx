import TermsAndCondition from '@/components/PagesComponent/TermsAndCondition/TermsAndCondition'
import SEO from '@/components/SEO/SEO'
import React from 'react'

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
const page = () => {
    return (
        <div>
            {/* <SEO /> */}
            <TermsAndCondition />
        </div>
    )
}

export default page
