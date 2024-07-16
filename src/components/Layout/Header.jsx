'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { IoIosAddCircleOutline } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import dynamic from 'next/dynamic';
import { Drawer, Popover, Select } from 'antd'
import { GrLocation } from "react-icons/gr";
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import { TiArrowSortedDown } from "react-icons/ti";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { placeholderImage, t } from '@/utils';
import { BiPlanet } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import CategoryDrawer from '../Drawer/CategoryDrawer';
import { MdClose } from 'react-icons/md';
import { logoutSuccess, userSignUpData } from '@/redux/reuducer/authSlice';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import FirebaseData from '@/utils/Firebase';
// import { CategoryData } from '@/redux/reuducer/categorySlice';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { getLanguageApi, getLimitsApi } from '@/utils/api';
import { CurrentLanguageData, setCurrentLanguage } from '@/redux/reuducer/languageSlice';
import LanguageDropdown from '../HeaderDropdowns/LanguageDropdown';
import LocationModal from '../LandingPage/LocationModal';
import { useRouter, usePathname } from 'next/navigation';
import { SearchData, setSearch } from "@/redux/reuducer/searchSlice"
import { isLogin } from '@/utils';
import { CategoryData, CurrentPage, LastPage, setCatCurrentPage, setCatLastPage, setCateData } from '@/redux/reuducer/categorySlice'
import { categoryApi } from '@/utils/api'
import { Collapse } from 'antd';
import FilterTree from '../Category/FilterTree';
import { DownOutlined } from '@ant-design/icons';
import { RiArrowRightSFill } from 'react-icons/ri';
import { Autoplay } from 'swiper/modules';

const ProfileDropdown = dynamic(() => import('../Profile/ProfileDropdown.jsx'))


const MailSentSucessfully = dynamic(() => import('../Auth/MailSentSucessfully.jsx'), { ssr: false })
const LoginModal = dynamic(() => import('../Auth/LoginModal.jsx'), { ssr: false })
const RegisterModal = dynamic(() => import('../Auth/RegisterModal.jsx'), { ssr: false })

const { Panel } = Collapse

const Header = () => {

    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const UserData = useSelector(userSignUpData)
    const systemSettings = useSelector(settingsData)
    const settings = systemSettings?.data
    const cateData = useSelector(CategoryData)
    const search = useSelector(SearchData)
    const currentCatPage = useSelector(CurrentPage)
    const lastCatPage = useSelector(LastPage)
    const languages = settings && settings?.languages
    const { signOut } = FirebaseData();
    const [IsRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [IsLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [IsMailSentOpen, setIsMailSentOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);
    const [IsBuySellDrawerOpen, setIsBuySellDrawerOpen] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(settings?.default_language);
    const [IsLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [catId, setCatId] = useState('')
    const [slug, setSlug] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const cityData = useSelector(state => state?.Location?.cityData);


    const CurrentLanguage = useSelector(CurrentLanguageData)

    const [prevLang, setPrevLang] = useState(CurrentLanguage)
    // this api call only in pop cate swiper 
    const getCategoriesData = (async (page) => {

        try {
            const response = await categoryApi.getCategory({ page: `${page}` });
            const { data } = response.data;
            if (data && Array.isArray(data.data)) {

                dispatch(setCateData(data.data));
                dispatch(setCatLastPage(data?.last_page))
                dispatch(setCatCurrentPage(data?.current_page))
            }
        } catch (error) {
            console.error("Error:", error);
        }

    });

    useEffect(() => {
        getCategoriesData(1);
    }, [CurrentLanguage]);
    const getLanguageData = async (lang_code) => {
        try {
            let language_code;

            if (lang_code) {
                language_code = lang_code;
            } else {
                language_code = settings?.default_language
            }
            const res = await getLanguageApi.getLanguage({ language_code, type: 'web' });
            dispatch(setCurrentLanguage(res?.data?.data));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const defaultLanguage = languages?.find((lang) => lang.code === settings?.default_language)
        setSelectedLanguage(defaultLanguage)
        getLanguageData()
    }, [])


    useEffect(() => {
        const categoryPathRegex = /^\/category(\/|$)/;
        if (pathname != '/products' && !categoryPathRegex.test(pathname)) {
            dispatch(setSearch(''))
            setSearchQuery("")
            setCatId("")
        }
    }, [pathname])


    const catSwiperRef = useRef(null);




    const closeDrawer = () => {
        if (show) {
            setShow(false)
        }
    }

    const openRegisterModal = () => {
        if (show) {
            setShow(false)
        }
        if (IsLoginModalOpen) {
            setIsLoginModalOpen(false)
        }
        setIsRegisterModalOpen(true)
    }
    const openLoginModal = () => {
        if (show) {
            setShow(false)
        }
        if (IsRegisterModalOpen) {
            setIsRegisterModalOpen(false)
        }
        setIsLoginModalOpen(true)
    }
    const openSentMailModal = () => {
        setIsRegisterModalOpen(false)
        setIsMailSentOpen(true)
    }

    const openBuySellDrawer = (cat) => {
        setSelectedCategory(cat)
        setIsBuySellDrawerOpen(true)
    }
    const openLocationEditModal = () => {
        setIsLocationModalOpen(true)

    }

    const handleLogout = () => {
        if (show) {
            setShow(false)
        }
        Swal.fire({
            title: t("areYouSure"),
            text: t("logoutConfirmation"),
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: t("yes"),
        }).then((result) => {
            if (result.isConfirmed) {
                // // Clear the recaptchaVerifier by setting it to null
                // window.recaptchaVerifier = null;

                // Perform the logout action
                logoutSuccess();
                signOut()

                toast.success(t('signOutSuccess'));
                router.push("/")
            } else {
                toast.error(t('signOutCancelled'));
            }
        });
    };

    const breakpoints = {
        320: {
            slidesPerView: 2
        },
        329: {
            slidesPerView: 2.7
        },
        427: {
            slidesPerView: 3
        },

        576: {
            slidesPerView: 3.5
        },

        768: {
            slidesPerView: 5
        },

        992: {
            slidesPerView: 6
        },
        1200: {
            slidesPerView: 7
        },
        1400: {
            slidesPerView: 9
        }
    }

    const content = (category) => {

        return (
            <div className='product_tab_popover'>
                <div className='buy_sell'>
                    <Link className='popover_title' href={`/category/${category?.slug}`}>See all in {category?.translated_name}</Link>
                    <div className='popover_items'>
                        {category?.subcategories.map((item, index) => {

                            const subcategoriesLength = item?.subcategories ? item.subcategories.length : 0;

                            return subcategoriesLength === 0 ? (
                                <Link
                                    key={item?.id}
                                    className='cat_subcat_item'
                                    href={`/category/${item?.slug}`}
                                    onMouseEnter={() => setActiveCategory(item?.name)}
                                >
                                    {item?.translated_name}
                                </Link>
                            ) : (
                                <Link
                                    href={`/category/${item?.slug}`}
                                    key={item?.id}
                                    className='cat_subcat_item'
                                    onMouseEnter={() => setActiveCategory(item?.name)}
                                >
                                    {item?.translated_name}
                                    <RiArrowRightSFill />
                                </Link>
                            );
                        })}
                    </div>
                </div>
                {category?.subcategories?.map((cat, index) => (
                    cat?.name === activeCategory && cat?.subcategories?.length > 0 && (
                        <div key={cat?.id} className='buy_sell'>
                            <Link className='popover_title' href={`/category/${cat?.slug}`}>See all in {cat.translated_name}</Link>
                            <div className='popover_items'>
                                {cat.subcategories.map((subItem, subIndex) => {
                                    const subSubcategoriesLength = subItem?.subcategories ? subItem.subcategories.length : 0;

                                    return subSubcategoriesLength === 0 ? (
                                        <Link className='cat_subcat_item' key={subItem?.id} href={`/category/${subItem.slug}`} onMouseEnter={() => setActiveSubCategory(subItem?.translated_name)}>
                                            {subItem.translated_name}
                                        </Link>
                                    ) : (
                                        <div className='cat_subcat_item' key={subItem?.id} onMouseEnter={() => setActiveSubCategory(subItem?.translated_name)}>
                                            {subItem.translated_name}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                ))}
                {category?.subcategories.map((category) => (
                    category?.translated_name === activeCategory && category?.subcategories?.length > 0 && (
                        category.subcategories.map((nestedSubCat, nestedIndex) => {
                            if (nestedSubCat.translated_name === activeSubCategory && nestedSubCat?.subcategories?.length > 0) {
                                return (
                                    <div key={nestedSubCat?.id} className='buy_sell'>
                                        <Link className='popover_title' href='/'>See all in {nestedSubCat.translated_name}</Link>
                                        <div className='popover_items'>
                                            {nestedSubCat.subcategories.map((subItem, subIndex) =>
                                                <Link className='cat_subcat_item' key={subItem?.id} href={`/category/${subItem.slug}`}>{subItem.translated_name}</Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        })
                    )
                ))}
            </div>
        );
    }

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>


    const handleCategoryChange = (value) => {
        if (value?.value === "") {
            setCatId('')
            return
        }
        const category = cateData.find((item) => item?.id === Number(value.key))
        const catId = category?.id
        const slug = category?.slug
        
        if (catId) {
            setCatId(catId)
        }
        if (slug) {
            setSlug(slug)
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSearchNav = () => {


        if (catId) {
            dispatch(setSearch(searchQuery))
            router.push(`/category/${slug}`)
        } else {
            dispatch(setSearch(searchQuery))
            router.push(`/products`)
        }
    }

    const mobileSearchNav = () => {
        if (catId) {
            dispatch(setSearch(searchQuery))
            router.push(`/category/${slug}`)
        } else {
            dispatch(setSearch(searchQuery))
            router.push(`/products`)
        }
        handleClose()
    }
    const getLimitsData = async () => {
        try {
            const res = await getLimitsApi.getLimits({ package_type: 'item_listing' })
            if (res?.data?.error === false) {
                router.push('/ad-listing')
            } else {
                toast.error(t('purchasePlan'))
                router.push('/subscription')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleCheckLogin = (e) => {
        e.preventDefault()
        if (isLogin()) {
            if (UserData?.name && UserData?.email && UserData?.mobile) {
                getLimitsData()
            } else {
                Swal.fire({
                    title: "Opps!",
                    text: "You need to update your profile first for ad item!",
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
        } else {
            toast.error(t('loginFirst'))
        }
        handleClose()
    }
    const handlePopoverOpenChange = (open) => {
        setIsPopoverOpen(open);
    };

    const calculateSlidesPerView = () => {
        const maxTextLength = Math.max(...cateData.map(cat => cat.translated_name.length));
        if (maxTextLength > 20) return 5;
        if (maxTextLength > 15) return 7;
        return 9;
    };

    useEffect(() => {
        if (catSwiperRef.current && catSwiperRef.current.autoplay) {
            if (isPopoverOpen) {
                catSwiperRef.current.autoplay.stop();
            } else {
                catSwiperRef.current.autoplay.start();
            }
        }
    }, [isPopoverOpen]);

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <div className="left_side">
                        <div className="nav_logo">
                            <Link href="/">
                                <Image src={settings?.header_logo} alt='logo' width={0} height={0} className='header_logo' onErrorCapture={placeholderImage} />
                            </Link>
                        </div>
                        <span onClick={handleShow} id="hamburg">
                            <GiHamburgerMenu size={25} />
                        </span>
                    </div>

                    <div className='select_search_cont'>
                        <div className="cat_select_wrapper">

                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                onChange={handleCategoryChange}
                                labelInValue
                                placeholder={t('categorySelect')}
                                filterOption={true} // Disable default filter to use custom filter
                                defaultValue=''
                                className='web_ant_select'
                            >
                                <Option value=''>{t('allCategories')}</Option>
                                {cateData && cateData?.map((cat, index) => (
                                    <>
                                        <Option key={cat?.id} value={cat.name}>
                                            {cat.name}
                                        </Option>
                                    </>
                                ))}
                            </Select>


                            {/* <select name="category" id="category" >
                                <option value="all category" title='All Categoriess' >{truncate('All Categoriess', 14)}</option>
                                <option value="all category" title='Categoryyyyyyyyyyyyy 1' >{truncate('Category 1', 14)}</option>
                                <option value="all category" title='Category 2'>{truncate('Category 2', 14)}</option>
                            </select>
                            <FaAngleDown className='cat_select_arrow' /> */}
                        </div>
                        <div className='search_cont'>
                            <BiPlanet size={22} color='#595B6C' className='planet' />
                            <input type="text" placeholder={t('searchItem')} onChange={(e) => handleSearch(e)} value={searchQuery} />
                            <button onClick={handleSearchNav}><FaSearch className='searchIcon' /><span className='srch'>{t('search')}</span></button>
                        </div>
                    </div>
                    {cityData &&
                        <div className='home_header_location' onClick={openLocationEditModal}>
                            <GrLocation className='loc_icon' />
                            <p>{cityData?.city} {cityData?.city ? "," : null} {cityData?.state}{cityData?.state ? "," : null} {cityData?.country}</p>
                        </div>
                    }

                    <div className="right_side">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto align-items-center">
                                {!isLogin() ? (
                                    <>
                                        <li className="nav-item nav-link lg_in" onClick={openLoginModal} >
                                            {t('login')}
                                        </li>
                                        <span className='vl'></span>
                                        <li className='nav-item nav-link' onClick={openRegisterModal}>
                                            {t('register')}
                                        </li>
                                    </>
                                ) : (
                                    <ProfileDropdown closeDrawer={closeDrawer} settings={settings} handleLogout={handleLogout} isDrawer={false} />
                                )}

                                {
                                    isLogin() &&
                                    <div className="item_add">
                                        <button className='ad_listing' onClick={handleCheckLogin}>
                                            <IoIosAddCircleOutline size={20} className='ad_listing_icon' />
                                            <span>
                                                {t('adListing')}
                                            </span>
                                        </button>
                                    </div>
                                }



                                <li className="nav-item dropdown mx-2 item_add">
                                    <LanguageDropdown setSelectedLanguage={setSelectedLanguage} selectedLanguage={selectedLanguage} getLanguageData={getLanguageData} settings={settings} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <div className='shopping_items_cont'>
                <div className="container">
                    <div className="row">
                        <div className="shopping_items">
                            {/* {FiX} */}
                            <Swiper
                                onSwiper={(swiper) => (catSwiperRef.current = swiper)} // Store swiper instance in ref
                                loop={false}
                                spaceBetween={20}
                                slidesPerView={"auto"}
                                className='prod_head_swiper'
                                modules={[Autoplay]}
                                autoplay={{
                                    delay: 1500,
                                    disableOnInteraction: false,
                                }}

                            >
                                {cateData?.map((cat, index) => (
                                    <SwiperSlide key={index}>
                                        {cat.subcategories.length > 0 ? (
                                            <Popover
                                                placement='bottomLeft'
                                                content={() => content(cat)}
                                                trigger="hover"
                                                className='buysellweb_popover'
                                                onOpenChange={handlePopoverOpenChange}
                                            >
                                                <Link href={`/category/${cat.slug}`}>
                                                    <span>{cat?.translated_name}<TiArrowSortedDown size={20} /></span>
                                                </Link>
                                            </Popover>
                                        ) : (
                                            <Link href={`/category/${cat.slug}`} className='buysellweb_popover'>
                                                <span>
                                                    {cat?.translated_name}
                                                </span>
                                            </Link>
                                        )}
                                        {cat.subcategories.length > 0 ? (
                                            <span className='buysellmob' onClick={() => openBuySellDrawer(cat)}>{cat?.translated_name}<TiArrowSortedDown /></span>
                                        ) : (
                                            <Link href={`/category/${cat.slug}`} className='buysellmob'>
                                                <span>
                                                    {cat?.translated_name}
                                                </span>
                                            </Link>
                                        )}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
            <Drawer className='eclassify_drawer' title={<Image src={settings?.header_logo} width={195} height={92} alt="Close Icon" onErrorCapture={placeholderImage} />} onClose={handleClose} open={show} closeIcon={CloseIcon} >
                <ul className="mobile_nav">
                    <li className='mobile_nav_tab'>
                        <div className="cat_select_wrapper">
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                onChange={handleCategoryChange}
                                labelInValue
                                placeholder={t('categorySelect')}
                                filterOption={true}
                                defaultValue=''
                                className='mob_search_sel'
                            >
                                <Option value=''>{t('allCategories')}</Option>
                                {cateData && cateData.map((cat, index) => (
                                    <>
                                        <Option key={cat?.id} value={cat.name}>
                                            {cat.name}
                                        </Option>
                                    </>
                                ))}
                            </Select>
                        </div>
                    </li>
                    <li className='mobile_nav_tab'>
                        <div className='mob_search_cont'>
                            <BiPlanet size={22} color='#595B6C' className='planet' />
                            <input type="text" placeholder={t('searchItem')} onChange={(e) => handleSearch(e)} value={searchQuery} className='search_input' />
                            <button onClick={mobileSearchNav}><FaSearch className='searchIcon mob_search' /></button>
                        </div>
                        {/* <div className='mob_search_cont'>
                            <div className='search_input_cont'>
                                <BiPlanet size={22} color='#595B6C' className='planet' />
                                <input type="text" placeholder={t('searchOn')} className='search_input' />
                            </div>
                            <button><FaSearch className='searchIcon mob_search' /></button>
                        </div> */}
                    </li>
                    {cityData &&
                        <li className='mob_header_location' onClick={openLocationEditModal}>
                            <GrLocation className='loc_icon' />
                            <p>{cityData?.city} {cityData?.state} {cityData?.country}</p>
                        </li>
                    }
                    <li className='mobile_nav_tab login_reg_nav_tab'>
                        {!isLogin() ? (
                            <>
                                <li className="nav-item nav-link lg_in" onClick={openLoginModal} >
                                    {t('login')}
                                </li>
                                <span className='vl'></span>
                                <li className='nav-item nav-link' onClick={openRegisterModal}>
                                    {t('register')}
                                </li>
                            </>
                        ) : (
                            <ProfileDropdown closeDrawer={closeDrawer} settings={settings} handleLogout={handleLogout} isDrawer={true} />
                        )}
                    </li>
                    <li className='mobile_nav_tab'>

                        <LanguageDropdown setSelectedLanguage={setSelectedLanguage} selectedLanguage={selectedLanguage} getLanguageData={getLanguageData} settings={settings} />
                    </li>
                    <li className='mobile_nav_tab'>
                        <Link href={"/ad-listing"}>
                            <button className='ad_listing' onClick={handleCheckLogin} >
                                <IoIosAddCircleOutline size={20} />
                                <span>
                                    {t('adListing')}
                                </span>
                            </button>
                        </Link>
                    </li>
                    <div className='card-body'>
                        <Collapse
                            className="all_filters"
                            expandIconPosition="right"
                            expandIcon={({ isActive }) => (
                                <DownOutlined rotate={isActive ? 180 : 0} size={24} />
                            )}
                            defaultActiveKey={['1']}
                        >
                            <Panel header={t("category")} key="1">
                                <FilterTree show={show} setShow={setShow} />
                            </Panel>
                        </Collapse>
                    </div>

                </ul>
            </Drawer>
            <CategoryDrawer IsBuySellDrawerOpen={IsBuySellDrawerOpen} OnHide={() => setIsBuySellDrawerOpen(false)} Category={selectedCategory} />

            <RegisterModal IsRegisterModalOpen={IsRegisterModalOpen} OnHide={() => setIsRegisterModalOpen(false)} setIsLoginModalOpen={setIsLoginModalOpen} openSentMailModal={openSentMailModal} IsLoginModalOpen={IsLoginModalOpen} />

            <LoginModal IsLoginModalOpen={IsLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen} setIsRegisterModalOpen={openRegisterModal} IsMailSentOpen={IsMailSentOpen} setIsMailSentOpen={setIsMailSentOpen} />

            <MailSentSucessfully IsMailSentOpen={IsMailSentOpen} OnHide={() => setIsMailSentOpen(false)} IsLoginModalOpen={() => setIsLoginModalOpen(true)} />

            <LocationModal IsLocationModalOpen={IsLocationModalOpen} OnHide={() => setIsLocationModalOpen(false)} />
        </>
    )
}

export default Header
