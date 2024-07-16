'use client'
import { userSignUpData } from "@/redux/reuducer/authSlice"
import { isLogin, placeholderImage, t, truncate } from "@/utils"
import { Button, Dropdown, Menu } from "antd"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FaAngleDown } from "react-icons/fa6"
import { useSelector } from "react-redux"

const ProfileDropdown = ({ closeDrawer, settings, handleLogout, isDrawer }) => {

    const router = useRouter()
    const UserData = useSelector(userSignUpData)

    const items = [
        {
            key: 1,
            href: '/profile/edit-profile',
            label: (
                <span>
                    {t('myProfile')}
                </span>
            )
        },
        {
            key: 2,
            href: '/notifications',
            label: (
                <span>
                    {t('notification')}
                </span>
            )
        },
        {
            key: 3,
            href: '/chat',
            label: (
                <span>
                    {t('chat')}
                </span>
            )
        },
        {
            key: 4,
            href: '/user-subscription',
            label: (
                <span>
                    {t('subscription')}
                </span>
            )
        },
        {
            key: 5,
            href: '/ads',
            label: (
                <span>
                    {t('ads')}
                </span>
            )
        },
        {
            key: 6,
            href: '/favourites',
            label: (
                <span>
                    {t('favorites')}
                </span>
            )
        },
        {
            key: 7,
            href: '/transactions',
            label: (
                <span >
                    {t('transaction')}
                </span>
            )
        },
        {
            key: 8,
            label: (
                <span>
                    {t('signOut')}
                </span>
            )
        },
    ]

    const handleMenuClick = (props) => {
        closeDrawer()
        if (Number(props.key) === 8) {
            handleLogout()
            return
        }
        const item = items.find(item => item.key === Number(props.key))
        if (item?.href) {
            router.push(item.href)
        } else {
            console.error("href is undefined for menu item with key: ", props.key) // Error logging
        }
    }

    const menuProps = {
        items,
        onClick: handleMenuClick
    };

    return (
        <Dropdown
            menu={menuProps}
            className='profile_dropdown'
        // onChange={handleClose}
        >
            <Button className="d-flex align-items-center" id="dropdown-basic">
                <div className='profile_img_div'>
                    <Image
                        src={UserData?.profile ? UserData?.profile : settings?.placeholder_image}
                        alt={UserData?.name}
                        width={40}
                        height={40}
                        onErrorCapture={placeholderImage}
                    />
                </div>
                <span className='username_header'>
                    {isLogin() ? (
                        UserData.name !== null && UserData.name !== "null" ? (
                            isDrawer ? truncate(UserData.name, 27) : truncate(UserData.name, 8)
                        ) : UserData.email !== "null" || UserData.email !== null ? (
                            isDrawer ? truncate(UserData.email, 27) : truncate(UserData.email, 10)
                        ) : UserData.mobile !== "undefined" ? (
                            UserData.mobile
                        ) : "Hello"
                    ) : null}
                </span>
                <FaAngleDown className='prof_down_arrow' />
            </Button>
        </Dropdown>
    )
}

export default ProfileDropdown