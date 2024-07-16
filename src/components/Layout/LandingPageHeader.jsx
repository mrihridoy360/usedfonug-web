'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
// import { IoIosAddCircleOutline } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
// import dynamic from 'next/dynamic';
// import { Button, Drawer, Dropdown, Menu } from 'antd';
import { Drawer } from 'antd';
import Link from 'next/link';
import { placeholderImage, t, truncate } from '@/utils';
import { getLanguageApi } from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { setCurrentLanguage } from '@/redux/reuducer/languageSlice';
import LanguageDropdown from '../HeaderDropdowns/LanguageDropdown';
// import { logoutSuccess, userSignUpData } from '@/redux/reuducer/authSlice';
// import Swal from 'sweetalert2';
// import FirebaseData from '@/utils/Firebase';
// import { FaAngleDown } from 'react-icons/fa6';
// import toast from 'react-hot-toast';
// import { isLogin } from '@/utils';
import { MdClose } from 'react-icons/md';


// const MailSentSucessfully = dynamic(() => import('../Auth/MailSentSucessfully.jsx'), { ssr: false })
// const LoginModal = dynamic(() => import('../Auth/LoginModal.jsx'), { ssr: false })
// const RegisterModal = dynamic(() => import('../Auth/RegisterModal.jsx'), { ssr: false })
// const SignIn = dynamic(() => import('../Auth/SignIn.jsx'), { ssr: false })

const LandingPageHeader = () => {

    const dispatch = useDispatch()
    // const { signOut } = FirebaseData();

    const systemSettingsData = useSelector(settingsData)
    // const UserData = useSelector(userSignUpData)
    const settings = systemSettingsData?.data
    const languages = settings && settings?.languages
    // const [IsRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    // const [IsLoginModalOpen, setIsLoginModalOpen] = useState(false)
    // const [IsSignInWithEmailOpen, setIsSignInWithEmailOpen] = useState(false)
    // const [IsMailSentOpen, setIsMailSentOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState(languages && languages[0]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Sample language data with images (you can replace with your own)

    const getLanguageData = async (language_code = settings?.default_language) => {
        try {
            const res = await getLanguageApi.getLanguage({ language_code: language_code })
            dispatch(setCurrentLanguage(res?.data?.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const defaultLanguage = languages && languages.find((lang) => lang.code === settings?.default_language)
        setSelectedLanguage(defaultLanguage)
        getLanguageData()
    }, [])

    // const openRegisterModal = () => {
    //     if (show) {
    //         setShow(false)
    //     }
    //     if (IsLoginModalOpen) {
    //         setIsLoginModalOpen(false)
    //     }
    //     setIsRegisterModalOpen(true)
    // }
    // const openLoginModal = () => {
    //     if (show) {
    //         setShow(false)
    //     }
    //     if (IsRegisterModalOpen) {
    //         setIsRegisterModalOpen(false)
    //     }
    //     setIsLoginModalOpen(true)
    // }

    // const OpenSignInWithEmail = () => {
    //     setIsLoginModalOpen(false)
    //     setIsSignInWithEmailOpen(true)
    // }

    // const openSentMailModal = () => {
    //     setIsRegisterModalOpen(false)
    //     setIsMailSentOpen(true)
    // }


    // const handleLogout = () => {
    //     if (show) {
    //         handleClose()
    //     }
    //     Swal.fire({
    //         title: t("areYouSure"),
    //         text: t("logoutConfirmation"),
    //         icon: "warning",
    //         showCancelButton: true,
    //         customClass: {
    //             confirmButton: 'Swal-confirm-buttons',
    //             cancelButton: "Swal-cancel-buttons"
    //         },
    //         confirmButtonText: t("yes"),
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             // // Clear the recaptchaVerifier by setting it to null
    //             // window.recaptchaVerifier = null;

    //             // Perform the logout action
    //             logoutSuccess();
    //             signOut()

    //             toast.success(t('signOutSuccess'));
    //         } else {
    //             toast.error(t('signOutCancelled'));
    //         }
    //     });
    // };
    // const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    // const handleProfileDropdownToggle = (visible) => {
    //     setShowProfileDropdown(visible);
    // };

    // const menu = (
    //     <Menu>
    //         <Menu.Item>
    //             <Link href='/profile/edit-profile'>
    //                 {t('myProfile')}
    //             </Link>
    //         </Menu.Item>
    //         <Menu.Item>
    //             <Link href='/notifications'>
    //                 {t('notification')}
    //             </Link>
    //         </Menu.Item>
    //         <Menu.Item>
    //             <Link href='/chat'>
    //                 {t('chat')}
    //             </Link>
    //         </Menu.Item>
    //         <Menu.Item>
    //             <Link href='/user-subscription'>
    //                 {t('subscription')}
    //             </Link>
    //         </Menu.Item>
    //         <Menu.Item>
    //             <Link href='/ads'>
    //                 {t('ads')}
    //             </Link>
    //         </Menu.Item>
    //         <Menu.Item>
    //             <Link href='/favorites'>
    //                 {t('favorites')}
    //             </Link>
    //         </Menu.Item>
    //         <Menu.Item>
    //             <Link href='/transactions'>
    //                 {t('transaction')}
    //             </Link>
    //         </Menu.Item>
    //         <Menu.Item onClick={handleLogout}>
    //             {t('signOut')}
    //         </Menu.Item>
    //     </Menu>
    // );

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            if (show) {
                handleClose()
            }
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <div className="left_side">
                        <div className="nav_logo">
                            <Link href="/home">
                                <Image src={settings?.header_logo} alt='logo' width={0} height={0} className='header_logo' onErrorCapture={placeholderImage} />
                            </Link>
                        </div>
                        <span onClick={handleShow} id="hamburg">
                            <GiHamburgerMenu size={25} />
                        </span>
                    </div>
                    <div className="nav_items_div">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item nav-link active">
                                    {t('home')}
                                </li>
                                <li className="nav-item nav-link" onClick={() => scrollToSection('work_process')}>
                                    {t('whyChooseUs')}
                                </li>
                                {/* <li className="nav-item nav-link" onClick={() => scrollToSection('sucscription')}>
                                    {t('pricing')}
                                </li> */}
                                <li className="nav-item nav-link" onClick={() => scrollToSection('faq')}>
                                    {t('faqs')}
                                </li>
                                <li className="nav-item nav-link" onClick={() => scrollToSection('ourBlogs')}>
                                    {t('blog')}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="right_side">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto">
                                {/* {!isLogin() ? (
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
                                    <Dropdown
                                        overlay={menu}
                                        trigger={['hover']}
                                        visible={showProfileDropdown}
                                        onVisibleChange={handleProfileDropdownToggle}
                                        className='profile_dropdown'
                                    >
                                        <Button className="d-flex align-items-center" id="dropdown-basic">
                                            <div className='profile_img_div'>
                                                <Image
                                                    src={UserData?.profile ? UserData?.profile : placeholderImage}
                                                    alt={UserData?.name}
                                                    width={40}
                                                    height={40}
                                                    onErrorCapture={placeholderImage}
                                                />
                                            </div>
                                            <span className='username_header'>
                                                {isLogin() ? (
                                                    UserData.name !== null && UserData.name !== "null" ? (
                                                        truncate(UserData.name, 8)
                                                    ) : UserData.email !== "null" || UserData.email !== null ? (
                                                        truncate(UserData.email, 10)
                                                    ) : UserData.mobile !== "undefined" ? (
                                                        UserData.mobile
                                                    ) : "Hello"
                                                ) : null}
                                            </span>
                                            <FaAngleDown className='prof_down_arrow' />
                                        </Button>
                                    </Dropdown>
                                )}
                                {
                                    isLogin() &&
                                    <div className="item_add">
                                        <Link href='/ad-listing'>
                                            <button className='ad_listing'>
                                                <IoIosAddCircleOutline size={20} className='ad_listing_icon' />
                                                <span>
                                                    {t('adListing')}
                                                </span>
                                            </button>
                                        </Link>
                                    </div>
                                } */}

                                <li className="nav-item dropdown mx-2">
                                    <LanguageDropdown setSelectedLanguage={setSelectedLanguage} selectedLanguage={selectedLanguage} getLanguageData={getLanguageData} settings={settings} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <Drawer className='eclassify_drawer' title={<Image src={settings?.header_logo} width={195} height={92} alt="Close Icon" onErrorCapture={placeholderImage} />} onClose={handleClose} open={show} closeIcon={<div className="close_icon_cont"><MdClose size={24} color="black" /></div>} >
                <ul className="mobile_nav">
                    <li className='mobile_nav_tab mob_nav_tab_active' >{t('home')}</li>
                    <li className='mobile_nav_tab' onClick={() => scrollToSection('work_process')}>{t('whyChooseUs')}</li>
                    {/* <li className='mobile_nav_tab' onClick={() => scrollToSection('sucscription')}>{t('pricing')}</li> */}
                    <li className="mobile_nav_tab" onClick={() => scrollToSection('faq')}>{t('faqs')}</li>
                    <li className='mobile_nav_tab' onClick={() => scrollToSection('ourBlogs')}>{t('blog')}</li>
                    {/* <li className='mobile_nav_tab login_reg_nav_tab'>
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
                            <Dropdown
                                overlay={menu}
                                trigger={['hover']}
                                visible={showProfileDropdown}
                                onVisibleChange={handleProfileDropdownToggle}
                                className='profile_dropdown'
                            >
                                <Button className="d-flex align-items-center" id="dropdown-basic">
                                    <div className='profile_img_div'>
                                        <Image
                                            src={UserData?.profile ? UserData?.profile : placeholderImage}
                                            alt={UserData?.name}
                                            width={40}
                                            height={40}
                                            onErrorCapture={placeholderImage}
                                        />
                                    </div>
                                    <span className='username_header'>
                                        {isLogin() ? (
                                            UserData.name !== null && UserData.name !== "null" ? (
                                                truncate(UserData.name, 8)
                                            ) : UserData.email !== "null" || UserData.email !== null ? (
                                                truncate(UserData.email, 10)
                                            ) : UserData.mobile !== "undefined" ? (
                                                UserData.mobile
                                            ) : "Hello"
                                        ) : null}
                                    </span>
                                    <FaAngleDown className='prof_down_arrow' />
                                </Button>
                            </Dropdown>
                        )}
                    </li> */}
                    <li className='mobile_nav_tab'>

                        <LanguageDropdown setSelectedLanguage={setSelectedLanguage} selectedLanguage={selectedLanguage} getLanguageData={getLanguageData} settings={settings} />
                    </li>

                    {/* {
                        isLogin() &&
                        <li className='mobile_nav_tab'>
                            <div className="item_add">
                                <Link href='/ad-listing'>
                                    <button className='ad_listing'>
                                        <IoIosAddCircleOutline size={20} className='ad_listing_icon' />
                                        <span>
                                            {t('adListing')}
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </li>
                    } */}



                </ul>
            </Drawer>

            {/* <RegisterModal IsRegisterModalOpen={IsRegisterModalOpen} OnHide={() => setIsRegisterModalOpen(false)} setIsLoginModalOpen={openLoginModal} openSentMailModal={openSentMailModal} /> */}

            {/* <LoginModal IsLoginModalOpen={IsLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen} setIsRegisterModalOpen={openRegisterModal} /> */}

            {/* <SignIn IsSignInWithEmailOpen={IsSignInWithEmailOpen} OnHide={() => setIsSignInWithEmailOpen(false)} IsSignInWithEmail={true} /> */}

            {/* <MailSentSucessfully IsMailSentOpen={IsMailSentOpen} OnHide={() => setIsMailSentOpen(false)} IsLoginModalOpen={() => setIsLoginModalOpen(true)} /> */}
        </>
    )
}

export default LandingPageHeader
