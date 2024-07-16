'use client'
import MakeOfferModal from "@/components/ProductDetails/MakeOfferModal";
import SimilarProducts from "@/components/ProductDetails/SimilarProducts";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaHeart, FaRegCalendarCheck, FaRegHeart, FaRegLightbulb } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import { IoChatboxEllipsesOutline, IoGiftOutline, IoLocationOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import TopAd from "@/components/Advertisements/TopAd";
import { placeholderImage, t } from "@/utils";
import { useParams, useRouter } from "next/navigation";
import { allItemApi, manageFavouriteApi } from "@/utils/api";
import Swal from "sweetalert2";
import { savechatOfferData } from "@/redux/reuducer/offerSlice";
import { getFavData, saveFavData } from "@/redux/reuducer/favouriteSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ReportModal from "@/components/User/ReportModal";
import { isLogin } from "@/utils";
import { FaPlayCircle } from "react-icons/fa";
import Map from "@/components/MyListing/GoogleMap";
import NoData from "@/components/NoDataFound/NoDataFound";
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent";
import ReactPlayer from "react-player";
import { userSignUpData } from "@/redux/reuducer/authSlice";


const SingleProductDetail = () => {

    const dispatch = useDispatch()
    const swiperRef = useRef();
    const systemSettingsData = useSelector((state) => state?.Settings)
    const userDetails = useSelector(userSignUpData)
    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol
    const [productData, setProductData] = useState({});
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [displayedImage, setDisplayedImage] = useState();
    const [images, setImages] = useState([])
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [IsOpenMakeOffer, setIsOpenMakeOffer] = useState(false)
    const descriptionRef = useRef(null);
    const router = useRouter()
    const pathname = useParams();
    const slug = pathname.slug;
    const [similarData, setSimilarData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isReportModal, setIsReportModal] = useState(false)
    const [isReported, setIsReported] = useState(false)
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [isVideClicked, setIsVideClicked] = useState(false)
    const [videoUrl, setVideoUrl] = useState('')

    const isLikeddata = useSelector(getFavData)
    const isLiked = isLikeddata?.data?.isLiked

    const fetchProductData = async () => {
        try {
            setIsLoading(true); // Set loading to true when fetching data
            const response = await allItemApi.getItems({
                slug: slug,
                // sort_by: sort_by === "default" ? "" : sort_by // Map "default" to ""
            });
            const responseData = response?.data?.data;
            if (responseData) {
                const { data } = responseData;
                setProductData(data[0]);
                setDisplayedImage(data[0]?.image)
            } else {
                console.error("Invalid response:", response);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false); // Set loading to false after data is fetched
        }
    }
    useEffect(() => {
        fetchProductData()
    }, [slug, isLiked, isReported])






    const fullDescription = productData?.description


    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
        const descriptionBody = descriptionRef.current;
        if (descriptionBody) {
            descriptionBody.classList.toggle('show-full-description');
        }
    };

    const getDescriptionHeight = () => {
        return showFullDescription ? "100%" : '300px'; // Adjust height as needed
    };

    const maxLength = 350; // Maximum length for truncated description

    const truncatedDescription = fullDescription?.length > maxLength && !showFullDescription
        ? `${fullDescription?.slice(0, maxLength)}...`
        : fullDescription;

    const swipePrev = () => {
        swiperRef?.current?.slidePrev();
    };

    const swipeNext = () => {
        swiperRef?.current?.slideNext();
    };

    const handleSlideChange = () => {
        setIsEnd(swiperRef?.current?.isEnd);
        setIsBeginning(swiperRef?.current?.isBeginning);
    };

    useEffect(() => {
        const galleryImages = productData?.gallery_images?.map(img => img.image) || [];
        setImages([productData?.image, ...galleryImages])
        if (productData?.video_link !== null) {
            setVideoUrl(productData?.video_link)
            const videoId = getYouTubeVideoId(productData?.video_link)
            if (videoId === false) {
                setThumbnailUrl("")
            } else {
                setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
            }
        }
    }, [productData])

    const getYouTubeVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url?.match(regExp);
        if (match) {
            return (match && match[2].length === 11) ? match[2] : null;
        } else {
            return false
        }
    };


    const handleImageClick = (img, index) => {
        if (isVideClicked) {
            setIsVideClicked(false)
        }
        setActiveIndex(index); // Update active slide index
        setDisplayedImage(img); // Update displayed image
    };

    const handleVideoClick = () => {
        setIsVideClicked(true)
    }


    const userData = productData && productData?.user

    const breakpoints = {
        0: {
            slidesPerView: 1,
        },
        430: {
            slidesPerView: 2,
        },
        576: {
            slidesPerView: 2.5,
        },
        768: {
            slidesPerView: 4,
        },
        1200: {
            slidesPerView: 6,
        },
        1400: {
            slidesPerView: 6,
        },
    };


    const handleMakeOffer = () => {
        if (!isLogin()) {
            toast.error(t("loginToOffer"))
            return;
        }
        if (userDetails?.name && userDetails?.email && userDetails?.mobile) {

            setIsOpenMakeOffer(true)
        } else {
            Swal.fire({
                title: "Opps!",
                text: "You need to update your profile first for make offer!",
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },
                confirmButtonText: "Ok",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/profile/edit-profile')
                }
            });
        }
    }

    const handleChat = () => {
        if (!isLogin()) {
            toast.error(t("loginToStartChat"))
            return;
        }

        if (!productData?.is_already_offered) {
            Swal.fire({
                title: "Opps!",
                text: "Please make offer for chat",
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },
                confirmButtonText: "Ok",
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsOpenMakeOffer(true)
                }
            });
        } else {
            savechatOfferData(productData?.item_offers)
            router.push('/chat')
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const formattedDate = productData?.created_at ? formatDate(productData.created_at) : '';

    const extractYear = (dateString) => {
        const date = new Date(dateString);
        return date.getFullYear();
    };
    const memberSinceYear = userData?.created_at ? extractYear(userData.created_at) : '';
    const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.2945974084782!2d${productData?.longitude}!3d${productData?.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39511e5b00000001%3A0xc42d67c61628af6d!2sWRTeam!5e0!3m2!1sen!2sin!4v1715421120065!5m2!1sen!2sin`;

    const handleShowMapClick = () => {
        // Construct the Google Maps URL with dynamic city, state, country, latitude, and longitude
        const locationQuery = `${productData?.city}, ${productData?.state}, ${productData?.country}`;
        const googleMapsUrl = `https://www.google.com/maps?q=${locationQuery}&ll=${productData?.latitude},${productData?.longitude}&z=12&t=m`;

        // Open Google Maps in a new tab
        window.open(googleMapsUrl, '_blank');
    };

    const fetchSimilarData = async (cateID) => {
        try {
            setIsLoading(true); // Set loading to true when fetching data
            const response = await allItemApi.getItems({
                category_id: cateID,
            });
            const responseData = response?.data;
            if (responseData) {
                const { data } = responseData;

                const filteredData = data?.data.filter(item => item.id !== productData?.id);
                setSimilarData(filteredData);

            } else {
                console.error("Invalid response:", response);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false); // Set loading to false after data is fetched
        }
    }
    useEffect(() => {
        if (productData?.category_id) {
            fetchSimilarData(productData?.category_id)
        }
    }, [productData?.category_id])
    useEffect(() => {
    }, [similarData])

    const offerData = {
        itemPrice: productData?.price,
        itemId: productData?.id
    }

    const handleLikeItem = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLogin()) {
            toast.error(t("loginToAddToFavourite"))
            return
        }
        saveFavData({
            id: productData?.id,
            isLiked: true
        })
        try {
            const response = await manageFavouriteApi.manageFavouriteApi({ item_id: productData?.id })
            toast.success(response?.data?.message)
            saveFavData({
                id: productData?.id,
                isLiked: false
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleReportModal = () => {
        if (isLogin()) {
            setIsReportModal(true)
        } else {
            toast.error(t("loginFirst"))
        }
    }

    return (
        <>
            <BreadcrumbComponent title2={productData?.name} />
            <section id='product_details_page'>
                {productData ? (
                    <div className="container">
                        {/* <TopAd /> */}


                        <div className="main_details">
                            <div className="row" id='details_main_row'>
                                <div className="col-md-12 col-lg-8">
                                    <div className="gallary_section">
                                        <div className="display_img">
                                            {
                                                isVideClicked == false ? <Image loading="lazy" src={displayedImage} height={0} width={0} alt='display_img' onErrorCapture={placeholderImage} /> : <ReactPlayer url={videoUrl} controls className="react-player" width="100%"
                                                    height="500px" />
                                            }
                                            {/* <Image loading="lazy" src={displayedImage} height={0} width={0} alt='display_img' onErrorCapture={placeholderImage} /> */}
                                        </div>
                                        <div className="gallary_slider">
                                            <Swiper
                                                slidesPerView={6}
                                                className="gallary-swiper"
                                                spaceBetween={20}
                                                freeMode={true}
                                                loop={false}
                                                pagination={false}
                                                modules={[FreeMode, Pagination]}
                                                breakpoints={breakpoints}
                                                onSlideChange={handleSlideChange}
                                                onSwiper={(swiper) => {
                                                    swiperRef.current = swiper;
                                                    setIsBeginning(swiper.isBeginning);
                                                    setIsEnd(swiper.isEnd);

                                                }}
                                                allowSlideNext={!swiperRef.current?.isEnd}
                                            >
                                                {[...images, ...(videoUrl ? [videoUrl] : [])]?.map((item, index) => (
                                                    <SwiperSlide key={index} className={index === activeIndex ? 'swiper-slide-active' : ''}>
                                                        <div className={`swiper_img_div ${index === activeIndex ? 'selected' : ''}`}>
                                                            {index === images.length && videoUrl ? (
                                                                <div className="video-thumbnail">
                                                                    <div className="thumbnail-container" style={{ height: '8rem' }} onClick={handleVideoClick}>
                                                                        <Image
                                                                            src={thumbnailUrl}
                                                                            width={0}
                                                                            height={0}
                                                                            className='swiper_images'
                                                                            loading='lazy'
                                                                            onErrorCapture={placeholderImage}

                                                                        />
                                                                        <div className="video-overlay" style={{ position: 'relative', bottom: '5rem', left: '3rem' }}>
                                                                            <FaPlayCircle size={24} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <Image
                                                                    src={item}
                                                                    width={0}
                                                                    height={0}
                                                                    className='swiper_images'
                                                                    loading='lazy'
                                                                    onErrorCapture={placeholderImage}
                                                                    onClick={() => handleImageClick(item, index)}
                                                                />
                                                            )}
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>

                                            {images?.length > 6 &&
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
                                    </div>
                                    {productData?.custom_fields?.length > 0 &&
                                        <div className="product_spacs card">
                                            <div className="highlights">
                                                <span>
                                                    <FaRegLightbulb size={22} />
                                                </span>
                                                <span>
                                                    {t('highlights')}
                                                </span>
                                            </div>
                                            <div className="spacs_list">
                                                {productData?.custom_fields && productData.custom_fields.map((e, index) => (

                                                    <div className="spac_item" key={index}>
                                                        <div className="spac_img_title">
                                                            <div className="spac_item_img">
                                                                <Image src={e?.image} loading='lazy' alt='spacs_item_img' width={24} height={24} onErrorCapture={placeholderImage} />
                                                            </div>
                                                            <span>
                                                                {e?.name}
                                                            </span>
                                                        </div>
                                                        <div className="spacs_value">
                                                            <div className="diveder">
                                                                :
                                                            </div>
                                                            <p> {e?.value}</p>
                                                        </div>
                                                    </div>

                                                ))}

                                            </div>
                                        </div>
                                    }
                                    {fullDescription &&
                                        <div className="description_card card">
                                            <div className="card-header">
                                                <span>{t('description')}</span>
                                            </div>
                                            <div
                                                className="card-body"
                                                style={{ maxHeight: getDescriptionHeight() }}
                                                ref={descriptionRef}
                                            >
                                                <p>{truncatedDescription}</p>
                                            </div>
                                            {fullDescription?.length > maxLength && (
                                                <div className="card-footer">
                                                    <button onClick={toggleDescription}>
                                                        {showFullDescription ? t('seeLess') : t('seeMore')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    }

                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <div className="product card">
                                        <div className="card-body">
                                            <div className="product_div">
                                                <div className="title_and_price">
                                                    <span className='title'>
                                                        {productData?.name}
                                                    </span>
                                                    <span className="price">
                                                        {CurrencySymbol} {productData?.price}
                                                    </span>
                                                </div>
                                                <div className="like_share">
                                                    {productData?.is_liked === true ? (
                                                        <button className="isLiked" onClick={handleLikeItem}><FaHeart size={20} /></button>

                                                    ) : (
                                                        <button onClick={handleLikeItem}><FaRegHeart size={20} /></button>
                                                    )}
                                                    {/* <button><FiShare2 size={20} /></button> */}
                                                </div>
                                            </div>
                                            <div className="product_id">
                                                <span><FaRegCalendarCheck size={16} /> {t('postedOn')}: {formattedDate} </span>
                                                <span>
                                                    {t('adId')} #{productData?.id}
                                                </span>
                                            </div>
                                        </div>
                                        {productData?.is_already_reported === false &&
                                            <div className="card-footer" onClick={handleReportModal}>
                                                <button >
                                                    {t('reportAd')}
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    <div className="user_profile_card card">
                                        <div className="card-body">
                                            <div className="profile_sec">
                                                <div className="profile_img">

                                                    <Image loading='lazy' src={userData?.profile !== null ? userData?.profile : systemSettingsData?.data?.data?.placeholder_image} alt='profile' width={0} height={0} onErrorCapture={placeholderImage} />
                                                </div>
                                                <div className="user_details">
                                                    <span className="user_name">
                                                        {userData?.name}
                                                    </span>
                                                    <span className="user_connected">
                                                        {t('memberSince')}: {memberSinceYear}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer">

                                            {!productData?.is_already_offered &&
                                                <button className='offer' onClick={handleMakeOffer}>
                                                    <span><IoGiftOutline size={20} /></span>
                                                    <span>{t('makeOffer')}</span>
                                                </button>
                                            }
                                            <button className='chat' onClick={handleChat}>
                                                <span><IoChatboxEllipsesOutline size={20} /></span>
                                                <span>{t('startChat')}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="posted_in_card card">
                                        <div className="card-header">
                                            <span>{t('postedIn')}</span>
                                        </div>
                                        <div className="card-body">
                                            <div className="location">
                                                <span><IoLocationOutline size={24} /></span>
                                                <span>
                                                    {productData?.city}{productData?.city ? "," : null} {productData?.state}{productData?.state ? "," : null} {productData?.country}
                                                </span>
                                            </div>
                                            <div className="location_details_map">
                                                {/* <iframe src={googleMapsUrl} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
                                                <Map latitude={productData?.latitude} longitude={productData?.longitude} />
                                            </div>
                                            <div className="show_full_map">
                                                <button onClick={handleShowMapClick}>{t('showOnMap')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {similarData?.length > 0 &&
                            <>
                                <div className="row related_prod_head">
                                    <h4 className="pop_cat_head">{t('relatedAds')}</h4>
                                </div>
                                <div className="row">
                                    <SimilarProducts similarData={similarData} setSimilarData={setSimilarData} />
                                </div>
                            </>
                        }
                    </div>
                ) : (
                    <div>
                        <NoData />
                    </div>
                )
                }
            </section>
            <MakeOfferModal IsOpenMakeOffer={IsOpenMakeOffer} OnHide={() => setIsOpenMakeOffer(false)} offerData={offerData} />
            {isReportModal && <ReportModal isReportModal={isReportModal} OnHide={() => setIsReportModal(false)} itemID={productData?.id} setIsReported={setIsReported} />}
        </>
    )
}

export default SingleProductDetail