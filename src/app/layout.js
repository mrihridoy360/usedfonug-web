'use client'
import { Providers } from "@/redux/store/providers";
import { persistor, store } from "@/redux/store";
import "../../public/css/style.css";
import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css'
import Layout from "@/components/Layout/Layout";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";


export default function RootLayout({ children }) {

  return (
    <html lang="en">


      <Head>



        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
        <script src="https://js.paystack.co/v1/inline.js"></script>

        {/* Google Adsence */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxxxxxx"
          crossorigin="anonymous"></script> */}

      </Head>

      <body>
        <Providers store={store}>

          <Toaster position="top-center" reverseOrder={false} />
          <>
            <Layout>
              {children}
            </Layout>
          </>
        </Providers>

      </body>
    </html>
  );
}

