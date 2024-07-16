'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from "swiper/modules";
import 'swiper/css';
import "swiper/css/free-mode";
import SubscriptionCard from '@/components/Cards/SubscriptionCard';
import { assigFreePackageApi, getPackageApi, getPackageSettingsApi } from '@/utils/api';
import { t } from '@/utils';
import PaymentModal from './PaymentModal';
import SubscriptionCardSkeleton from '@/components/Skeleton/SubscriptionCardSkeleton';
import { store } from '@/redux/store';
import toast from 'react-hot-toast';
import { isLogin } from '@/utils';
import BreadcrumbComponent from '@/components/Breadcrumb/BreadcrumbComponent';

const Subscription = () => {
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
            slidesPerView: 2,
        },
        1400: {
            slidesPerView: 3,
        },
    }

    const assignPackage = async (id) => {


        try {
            const res = await assigFreePackageApi.assignFreePackage({ package_id: id })
            const data = res?.data
            console.log(data)
            toast.success(data.message)
            router.push('/')

        } catch (error) {
            toast.error(data.message)
            console.log(error)
        }
    }

    const handlePurchasePackage = (e, data) => {
        e.preventDefault();

        if (!isLogin()) {
            toast.error(t('loginFirst'))
            return
        }

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
        <section className='static_pages'>
            <BreadcrumbComponent title2={t("subscription")} />
            <div className='container'>
                <div className="static_div">
                    {/* <div className="main_title">
                        <span>
                            {t('subscription')}
                        </span>
                    </div> */}
                    <div className="page_content">
                        <div className="subscription_cont">
                            <div className='sub_content'>
                                <div className="title">
                                    <span>{t('adListingPlan')}</span>
                                </div>
                                <Swiper
                                    slidesPerView={3}
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
                                        itemPackages && itemPackages.map((data, index) => (
                                            <SwiperSlide key={index}>
                                                <SubscriptionCard data={data} handlePurchasePackage={handlePurchasePackage} />
                                            </SwiperSlide>
                                        ))
                                    )}
                                </Swiper>
                            </div>
                            <div className='sub_content'>
                                <div className="title">
                                    <span>{t('featuredAdPlan')}</span>
                                </div>
                                <Swiper
                                    slidesPerView={3}
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
                                        advertisementPackage && advertisementPackage.map((data, index) => (
                                            <SwiperSlide key={index}>
                                                <SubscriptionCard data={data} handlePurchasePackage={handlePurchasePackage} />
                                            </SwiperSlide>
                                        ))
                                    )}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PaymentModal isPaymentModal={isPaymentModal} OnHide={() => setIsPaymentModal(false)} packageSettings={packageSettings} priceData={priceData} settingsData={settingsData} user={UserData} />
        </section>
    )
}

export default Subscription
