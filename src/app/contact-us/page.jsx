import ContactUs from "@/components/PagesComponent/ContactUs/ContactUs"
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

const ContactUsPage = () => {
    return (
        <>
            {/* <SEO /> */}
            <ContactUs />
        </>
    )
}

export default ContactUsPage