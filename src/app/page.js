
import HomePage from '@/components/Home';
import SEO from '@/components/SEO/SEO';


export const metadata = {
  title:process.env.NEXT_PUBLIC_META_TITLE,
  description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
  keywords: process.env.NEXT_PUBLIC_META_kEYWORDS
}
const index = () => {

  return (
    <>
      {/* <SEO /> */}
      <HomePage />
    </>
  )
}

export default index

