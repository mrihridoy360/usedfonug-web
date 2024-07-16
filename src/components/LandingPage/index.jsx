import React from 'react'
import AnythingYouWant from './AnythingYouWant'
import WorkProcess from './WorkProcess'
import ClassifiedPosting from './ClassifiedPosting'
import Subscription from './Subscription'
import OurBlogs from './OurBlogs'
import QuickAnswers from './QuickAnswers'


const LandingPage = () => {
  return (
    <>
      <AnythingYouWant />
      <WorkProcess />
      {/* <Subscription /> */}
      {/* <ClassifiedPosting /> */}
      <OurBlogs />
      <QuickAnswers />
    </>
  )
}

export default LandingPage
