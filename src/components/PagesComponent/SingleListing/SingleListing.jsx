'use client'
import TopAd from "@/components/Advertisements/TopAd";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FaArrowLeft, FaArrowRight, FaRegLightbulb } from 'react-icons/fa6';
import { FaRegCalendarCheck } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { RxEyeOpen } from 'react-icons/rx';
import { LuHeart } from 'react-icons/lu';
import { MdKeyboardArrowDown } from 'react-icons/md';
import adIcon from '../../../../public/assets/ad_icon.svg'
import NoPackageModal from "@/components/MyListing/NoPackageModal";
import Image from "next/image";
import { placeholderImage, t } from "@/utils";
import { allItemApi, chanegItemStatusApi, deleteItemApi, getLimitsApi, getMyItemsApi } from "@/utils/api";
import Link from "next/link"
import 'leaflet/dist/leaflet.css';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import placeholderImg from "../../../../public/assets/Transperant_Placeholder.png";
import { FaPlayCircle } from "react-icons/fa"
import ReactPlayer from "react-player";
import Map from "@/components/MyListing/GoogleMap";
import { useDispatch } from "react-redux";
import { setBreadcrumbPath } from "@/redux/reuducer/breadCrumbSlice";
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent";
import Swal from "sweetalert2";



const SingleListing = ({ slug }) => {

    const dispatch = useDispatch()
    const router = useRouter()
    const swiperRef = useRef();
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [SingleListing, setSingleListing] = useState([])
    const [activeIndex, setActiveIndex] = useState(-1);
    const [Status, setStatus] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [displayedImage, setDisplayedImage] = useState();
    const [similarData, setSimilarData] = useState([]);
    const [IsNoPackageModal, setIsNoPackageModal] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [IsGranted, setIsGranted] = useState(false)
    const [IsShowCreateFeaturedAd, setIsShowCreateFeaturedAd] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [images, setImages] = useState([])
    const [videoUrl, setVideoUrl] = useState('')
    const descriptionRef = useRef(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [isVideClicked, setIsVideClicked] = useState(false)
    const [IsCallSingleListing, setIsCallSingleListing] = useState(false)


    const getSingleListingData = async () => {
        try {
            const res = await getMyItemsApi.getMyItems({ slug: slug })
            setSingleListing(res?.data?.data?.data?.[0])
            const adName = res?.data?.data?.data?.[0]?.name
            setStatus(res?.data?.data?.data?.[0]?.status)
            setDisplayedImage(res?.data?.data?.data?.[0]?.image)
            dispatch(setBreadcrumbPath([
                {
                    name: t('ads'),
                    slug: '/ads'
                },
                {
                    name: adName
                }
            ]))
            if (res?.data?.data?.data?.[0]?.status === 'approved' && res?.data?.data?.data?.[0]?.is_feature === false) {
                setIsShowCreateFeaturedAd(true)
            }
            else {
                setIsShowCreateFeaturedAd(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSingleListingData()
    }, [IsNoPackageModal, IsCallSingleListing])


    useEffect(() => {
        const galleryImages = SingleListing?.gallery_images?.map(img => img.image) || [];
        setImages([SingleListing?.image, ...galleryImages])
        if (SingleListing?.video_link !== null) {
            setVideoUrl(SingleListing?.video_link)
            const videoId = getYouTubeVideoId(SingleListing?.video_link)
            if (videoId === false) {
                setThumbnailUrl("")
            } else {
                setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
            }
        }
    }, [SingleListing])

    const getYouTubeVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url?.match(regExp);
        if (match) {
            return (match && match[2].length === 11) ? match[2] : null;
        } else {
            return false
        }
    };


    const deleteAd = () => {
        Swal.fire({
            title: t('areYouSure'),
            text: 'You want to delete this Ad',
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: t("yes"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await deleteItemApi.deleteItem({ id: SingleListing?.id })
                    if (res?.data?.error === false) {
                        toast.success(t('adDeleted'))
                        router.push('/ads')
                    }

                } catch (error) {
                    console.log(error)
                }
            }
        });
    }



    const updateItemStatus = async () => {
        if (SingleListing?.status === Status) {
            toast.error(t('changeStatusToSave'))
            return
        }
        const res = await chanegItemStatusApi.changeItemStatus({ item_id: SingleListing?.id, status: Status })
        if (res?.data?.error === false) {

            setIsCallSingleListing((prev) => !prev)
            if (Status === 'inactive') {
                toast.success(t('statusUpdated'));
            } else if (Status === 'active') {
                toast.success(t('advertisementUnderReview'));
            } else {
                toast.success(t('statusUpdated'));
                setIsShowCreateFeaturedAd(false);
            }
        }
    }


    const fullDescription = SingleListing?.description


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

    const handleImageClick = (index, item) => {
        setIsVideClicked(false)
        setActiveIndex(index); // Update active slide index
        if (images[index]) {
            setDisplayedImage(item)
        }
    };

    const handleVideoClick = () => {
        setIsVideClicked(true)
    }





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

    const getLimitsData = async () => {
        try {
            const res = await getLimitsApi.getLimits({ package_type: 'advertisement' })
            if (res?.data?.error === false && res?.data?.message === 'User is allowed to create Item') {
                setIsGranted(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleLikedItems = () => {
        setIsLiked(!isLiked)
    }



    const handleCreateFeaturedAd = () => {
        setIsNoPackageModal(true)
        getLimitsData()
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);

        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }

        const options = { month: 'short', day: '2-digit', year: 'numeric' };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        const [month, day, year] = formattedDate.split(' ');

        return `${month}, ${day.slice(0, -1)}, ${year}`;
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value)
    }

    const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.2945974084782!2d${SingleListing?.longitude}!3d${SingleListing?.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39511e5b00000001%3A0xc42d67c61628af6d!2sWRTeam!5e0!3m2!1sen!2sin!4v1715421120065!5m2!1sen!2sin`;

    const handleShowMapClick = () => {
        // Construct the Google Maps URL with dynamic city, state, country, latitude, and longitude
        const locationQuery = `${SingleListing?.city}, ${SingleListing?.state}, ${SingleListing?.country}`;
        const googleMapsUrl = `https://www.google.com/maps?q=${locationQuery}&ll=${SingleListing?.latitude},${SingleListing?.longitude}&z=12&t=m`;

        // Open Google Maps in a new tab
        window.open(googleMapsUrl, '_blank');
    };

    return (
        <>
            <BreadcrumbComponent />
            <section id='product_details_page'>
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
                                    </div>
                                    {
                                        SingleListing?.gallery_images?.length !== 0 &&
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
                                                    setIsBeginning(swiper?.isBeginning);
                                                    setIsEnd(swiper?.isEnd);

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
                                                                    onClick={() => handleImageClick(index, item)}
                                                                />
                                                            )}
                                                            {/* <Image src={item} width={0} height={0} className='swiper_images' loading='lazy' alt='Product' onErrorCapture={placeholderImage} /> */}
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                            <div className={`pag_leftarrow_cont leftarrow ${isBeginning ? 'PagArrowdisabled' : ''}`} onClick={swipePrev}>
                                                <FaArrowLeft size={24} />
                                            </div>
                                            <div className={`pag_rightarrow_cont rightarrow ${isEnd ? 'PagArrowdisabled' : ''}`} onClick={swipeNext} >
                                                <FaArrowRight size={24} />
                                            </div>
                                        </div>
                                    }
                                </div>

                                {
                                    IsShowCreateFeaturedAd &&
                                    <div className='feature_ad_section'>
                                        <div className='ad_content'>
                                            <div className='adicon_cont'>
                                                <Image src={adIcon} alt='Ad' width={62} height={75} onErrorCapture={placeholderImage} />
                                            </div>
                                            <p>{t("featureAdPrompt")}</p>
                                        </div>
                                        <button onClick={handleCreateFeaturedAd}>{t("createFeaturedAd")}</button>
                                    </div>
                                }

                                {SingleListing?.custom_fields?.length !== 0 && (
                                    <div className="product_spacs card">
                                        <div className="highlights">
                                            <span>
                                                <FaRegLightbulb size={22} />
                                            </span>
                                            <span>
                                                {t("highlights")}
                                            </span>
                                        </div>
                                        <div className="spacs_list">
                                            {SingleListing?.custom_fields?.map((e, index) => (
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
                                                        <p>{e?.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="description_card card">
                                    <div className="card-header">
                                        <span>{t("description")}</span>
                                    </div>
                                    <div
                                        className="card-body"
                                        style={{ maxHeight: getDescriptionHeight() }}
                                        ref={descriptionRef}
                                    >
                                        <p>{truncatedDescription}</p>
                                    </div>
                                    <div className="card-footer">
                                        {fullDescription?.length > maxLength && (
                                            <button onClick={toggleDescription}>
                                                {showFullDescription ? t('seeLess') : t('seeMore')}
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-12 col-lg-4">
                                <div className='listing_product_card'>
                                    <div className='listing_product_card_head'>
                                        <div className='prod_name'>
                                            <span>{SingleListing?.name}</span>
                                            {/* <button><FiShare2 size={20} /></button> */}
                                        </div>
                                        <div className='price_ad'>
                                            <span className='price'>${SingleListing?.price}</span>
                                            <span className='ad'>{t("adId")} #{SingleListing?.id}</span>
                                        </div>
                                    </div>
                                    <div className='ad_details'>
                                        <div className='date'>
                                            <FaRegCalendarCheck size={14} />
                                            <span>{t("listedOn")}: {formatDate(SingleListing?.created_at)}</span>
                                        </div>
                                        <div className='h_line'></div>
                                        <div className='date'>
                                            <RxEyeOpen size={14} />
                                            <span>{t("views")}: {SingleListing?.clicks}</span>
                                        </div>
                                        <div className='h_line'></div>
                                        <div className='date'>
                                            <LuHeart size={14} />
                                            <span>{t("favorites")}: {SingleListing?.favourites_count}</span>
                                        </div>
                                    </div>
                                    <div className='btn_container'>
                                        <button className='blakcbtn' onClick={deleteAd} >{t("delete")}</button>
                                        {SingleListing?.status == "sold out" || SingleListing?.status == "rejected" || SingleListing?.status === "inactive" ? <></> :
                                            <button className='cyna_btn'>
                                                <Link href={`/edit-listing/${SingleListing?.id}`}>
                                                    {t("edit")}
                                                </Link>
                                            </button>
                                        }

                                    </div>
                                </div>
                                <div className='change_status'>

                                    <p className='status'>{t("changeStatus")}</p>
                                    <div className='change_status_content'>
                                        <div className='status_select_wrapper'>
                                            <select name="status" id="status" value={Status} disabled={SingleListing?.status === 'review' || SingleListing?.status === "rejected" || SingleListing?.status === "inactive" || SingleListing?.status === "sold out"} onChange={handleStatusChange} className='status_select'>
                                                <option value="active">{t('active')}</option>
                                                <option value="inactive">{t('deactivate')}</option>
                                                <option value="review" disabled>{t('review')}</option>
                                                <option value="rejected" disabled>{t('rejected')}</option>
                                                <option value="sold out">{t('soldOut')}</option>
                                            </select>
                                            <MdKeyboardArrowDown size={20} className='down_select_arrow' />
                                        </div>
                                        <span className="text-danger fw-bold">{SingleListing?.rejected_reason ? SingleListing?.rejected_reason : ""}</span>
                                        {SingleListing?.status === 'review' || SingleListing?.status == "rejected" || SingleListing?.status == "sold out" || SingleListing?.status === "inactive" ? <></> : <button onClick={updateItemStatus} className='save_btn'>{t("save")}</button>}

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
                                                {SingleListing?.city}{SingleListing?.city ? "," : null} {SingleListing?.state}{SingleListing?.state ? "," : null} {SingleListing?.country}
                                            </span>
                                        </div>
                                        <div className="location_details_map">
                                            <Map latitude={SingleListing?.latitude} longitude={SingleListing?.longitude} />
                                            {/* <iframe src={googleMapsUrl} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
                                        </div>
                                        <div className="show_full_map">
                                            <button onClick={handleShowMapClick}>{t('showOnMap')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
            <NoPackageModal IsNoPackageModal={IsNoPackageModal} OnHide={() => setIsNoPackageModal(false)} IsGranted={IsGranted} item_id={SingleListing?.id} />
        </>
    )
}

export default SingleListing