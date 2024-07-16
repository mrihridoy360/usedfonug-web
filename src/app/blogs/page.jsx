import Blogs from '@/components/PagesComponent/Blogs/Blogs'


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
      <Blogs />
    </div>
  )
}

export default page
