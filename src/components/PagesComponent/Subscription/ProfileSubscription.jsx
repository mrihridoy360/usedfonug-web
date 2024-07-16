'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from "swiper/modules";
import 'swiper/css';
import "swiper/css/free-mode";
import ProfileSidebar from '@/components/Profile/ProfileSidebar';
import SubscriptionCard from '@/components/Cards/SubscriptionCard';
import { assigFreePackageApi, getPackageApi, getPackageSettingsApi } from '@/utils/api';
import { useEffect, useState } from 'react';
import { t } from '@/utils';
import PaymentModal from './PaymentModal';
import { useRouter } from 'next/navigation';
import SubscriptionCardSkeleton from '@/components/Skeleton/SubscriptionCardSkeleton';
import { store } from '@/redux/store';
import toast from 'react-hot-toast';
import BreadcrumbComponent from '@/components/Breadcrumb/BreadcrumbComponent';
import NoData from '@/components/NoDataFound/NoDataFound';

const ProfileSubscription = () => {

    const router = useRouter()
    const settingsData = store.getState().Settings?.data
    const isDemoMode = settingsData?.data?.demo_mode
    const UserData = store.getState().UserSignup?.data?.data
    const [isLoading, setIsLoading] = useState(false)
    const [itemPackages, setItemPackages] = useState([])
    const [advertisementPackage, setAdvertisementPackage] = useState([])
    const [packageSettings, setPackageSettings] = useState([])
    const [priceData, setPriceData] = useState({})
    const [isPaymentModal, setIsPaymentModal] = useState(false)


    const getPackageSettingsData = async () => {
        try {
            const res = await getPackageSettingsApi.getPackageSettings()
            const { data } = res.data
            setPackageSettings(data)
        } catch (error) {
            console.log(error)
        }
    }
    const getItemsPackageData = async () => {
        try {
            setIsLoading(true)
            const res = await getPackageApi.getPackage({ type: 'item_listing' })
            const { data } = res.data
            setItemPackages(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    const getAdvertisementPackageData = async () => {
        try {
            setIsLoading(true)
            const res = await getPackageApi.getPackage({ type: 'advertisement' })
            const { data } = res.data
            setAdvertisementPackage(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getItemsPackageData()
        getAdvertisementPackageData()
    }, [])
    useEffect(() => {
        if (isPaymentModal) {
            getPackageSettingsData()
        }
    }, [isPaymentModal])

    const breakpoints = {
        0: {
            slidesPerView: 1,
        },
        430: {
            slidesPerView: 1.1,
        },
        576: {
            slidesPerView: 1.3,
        },
        768: {
            slidesPerView: 1.5,
        },
        1200: {
            slidesPerView: 1.8,
        },
        1400: {
            slidesPerView: 2.2,
        },
    }

    const assignPackage = async (id) => {
        try {
            const res = await assigFreePackageApi.assignFreePackage({ package_id: id })
            const data = res?.data
            toast.success(data.message)
            router.push('/')

        } catch (error) {
            toast.error(data.message)

            console.log(error)
        }
    }

    const handlePurchasePackage = (e, data) => {
        e.preventDefault();
        if (data?.final_price === 0) {
            assignPackage(data.id)
        } else {
            setIsPaymentModal(true)
            setPriceData(data)
        }
    }

    useEffect(() => {
    }, [isPaymentModal, priceData])

    return (
        <>
            <BreadcrumbComponent title2={t("userSubscription")} />
            <div className='container'>
                <div className="row my_prop_title_spacing">
                    <h4 className="pop_cat_head">{t('subscription')}</h4>
                </div>
                <div className="row profile_sidebar">
                    <ProfileSidebar />
                    <div className="col-lg-9 p-0">
                        <div className="subscription_cont">

                            {
                                itemPackages && itemPackages.length > 0 &&
                                <div className='sub_content'>
                                    <div className="title">
                                        <span>{t('adListingPlan')}</span>
                                    </div>
                                    <Swiper
                                        slidesPerView={2.3}
                                        spaceBetween={30}
                                        className="subscription-swiper"
                                        breakpoints={breakpoints}
                                        freeMode={true}
                                        modules={[FreeMode]}
                                    >
                                        {isLoading ? (
                                            Array(4).fill(0).map((_, index) => (
                                                <SwiperSlide key={index}>
                                                    <SubscriptionCardSkeleton />
                                                </SwiperSlide>
                                            ))
                                        ) : (
                                            itemPackages.map((data, index) => (
                                                <SwiperSlide key={index}>
                                                    <SubscriptionCard data={data} handlePurchasePackage={handlePurchasePackage} />
                                                </SwiperSlide>
                                            ))
                                        )}
                                    </Swiper>
                                </div>
                            }


                            {
                                advertisementPackage && advertisementPackage.length > 0 &&
                                <div className='sub_content'>
                                    <div className="title">
                                        <span>{t('featuredAdPlan')}</span>
                                    </div>
                                    <Swiper
                                        slidesPerView={2.3}
                                        spaceBetween={30}
                                        className="subscription-swiper"
                                        breakpoints={breakpoints}
                                        freeMode={true}
                                        modules={[FreeMode]}
                                    >
                                        {isLoading ? (
                                            Array(4).fill(0).map((_, index) => (
                                                <SwiperSlide key={index}>
                                                    <SubscriptionCardSkeleton />
                                                </SwiperSlide>
                                            ))
                                        ) : (
                                            advertisementPackage.map((data, index) => (
                                                <SwiperSlide key={index}>
                                                    <SubscriptionCard data={data} handlePurchasePackage={handlePurchasePackage} />
                                                </SwiperSlide>
                                            ))
                                        )}
                                    </Swiper>
                                </div>
                            }

                        </div>
                        {
                            advertisementPackage.length === 0 && itemPackages.length === 0 && !isLoading && <NoData />
                        }
                    </div>


                </div>
                <PaymentModal isPaymentModal={isPaymentModal} OnHide={() => setIsPaymentModal(false)} packageSettings={packageSettings} priceData={priceData} settingsData={settingsData} user={UserData} />
            </div>
        </>
    )
}

export default ProfileSubscription