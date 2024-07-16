'use client'
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent"
import NotificationTable from "@/components/Profile/NotificationTable"
import ProfileSidebar from "@/components/Profile/ProfileSidebar"
import { t } from "@/utils"


const Notifications = () => {
  return (
    <>
      <BreadcrumbComponent title2={t('notifications')} />
      <div className='container'>
        <div className="row my_prop_title_spacing">
          <h4 className="pop_cat_head">{t('notifications')}</h4>
        </div>
        <div className="row profile_sidebar">
          <ProfileSidebar />
          <div className="col-lg-9 p-0">
            <div className="notif_cont">
              <NotificationTable />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notifications