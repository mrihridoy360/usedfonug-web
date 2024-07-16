import React, { useRef, useState } from 'react'
// Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ProductCard from '../Cards/ProductCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Link from 'next/link';
import { userSignUpData } from '@/redux/reuducer/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FreeMode } from 'swiper/modules';


const SimilarProducts = ({ similarData, setSimilarData }) => {
    const swiperRef = useRef();
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const userData = useSelector(userSignUpData);
    const swipePrev = () => {
        swiperRef?.current?.slidePrev()
    }
    const swipeNext = () => {
        swiperRef?.current?.slideNext()
    }

    const handleSlideChange = () => {
        setIsEnd(swiperRef?.current?.isEnd);
        setIsBeginning(swiperRef?.current?.isBeginning);
    };



    const breakpoints = {
        0: {
            slidesPerView: 1,
        },
        450: {
            slidesPerView: 1,
        },
        576: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3.5,
        },
        1200: {
            slidesPerView: 3,
        },
        1400: {
            slidesPerView: 4,
        },
    };

    const handleLike = (id) => {
        const updatedItems = similarData.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        setSimilarData(updatedItems);
    }

    return (

        <>
            {similarData?.length > 4 ? (
                <div className='similar_prod_swiper'>


                    <Swiper
                        className="similar_product_swiper"
                        slidesPerView={4}
                        spaceBetween={30}
                        breakpoints={breakpoints}
                        onSlideChange={handleSlideChange}
                        modules={[FreeMode]}
                        freeMode={true}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                            setIsEnd(swiper.isEnd);
                            setIsBeginning(swiper.isBeginning);
                        }}
                    >
                        {similarData && similarData.map((data, index) => (
                            <SwiperSlide key={index}>
                                <Link href={userData?.id == data?.user_id ? `/my-listing/${data?.slug}` : `/product-details/${data.slug}`} prefetch={false}>
                                    <ProductCard data={data} handleLike={handleLike} />
                                </Link>
                            </SwiperSlide>
                        ))}



                    </Swiper>

                    {similarData?.length > 4 &&

                        <>
                            <div className={`pag_leftarrow_cont leftarrow ${isBeginning ? 'PagArrowdisabled' : ''}`} onClick={swipePrev}>
                                <FaArrowLeft size={24} />
                            </div>
                            <div className={`pag_rightarrow_cont rightarrow ${isEnd ? 'PagArrowdisabled' : ''}`} onClick={swipeNext} >
                                <FaArrowRight size={24} />
                            </div>
                        </>
                    }

                </div>
            ) : (
                <div className="row">
                    {similarData && similarData.map((data, index) => (
                        <div className="col-sm-12 col-md-6 col-lg-3" key={index}>
                            <Link href={userData?.id == data?.user_id ? `/my-listing/${data?.slug}` : `/product-details/${data.slug}`} prefetch={false}>
                                <ProductCard data={data} handleLike={handleLike} />
                            </Link>
                        </div>
                    ))}

                </div>
            )}

        </>

    )
}

export default SimilarProducts
