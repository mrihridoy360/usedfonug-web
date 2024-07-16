'use client'
import Image from 'next/image'
import { FaRegHeart } from 'react-icons/fa6'
import { formatDate, formatPriceAbbreviated, placeholderImage, t } from '@/utils'
import { BiBadgeCheck } from 'react-icons/bi'
import { FaHeart } from "react-icons/fa6";
import { manageFavouriteApi } from "@/utils/api";
import toast from "react-hot-toast";
import { userSignUpData } from '@/redux/reuducer/authSlice';
import { useSelector } from "react-redux";

const ProdcutHorizontalCard = ({ data, handleLike }) => {
    const userData = useSelector(userSignUpData)
    const systemSettingsData = useSelector((state) => state?.Settings)
    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol
    const handleLikeItem = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (!userData) {
                toast.error(t('loginToAdd'))
                return
            }
            const response = await manageFavouriteApi.manageFavouriteApi({ item_id: data?.id })
            if (response?.data?.error === false) {
                toast.success(response?.data?.message)
                handleLike(data?.id)
            }
            else {
                toast.success('failedToLike')
            }

        } catch (error) {
            console.log(error)
            toast.success('failedToLike')
        }
    }
    return (

        <div className='product_horizontal_card card'>
            <div className="product_img_div">
                <Image src={data?.image} width={220} height={190} alt="Product" className="prodcut_img" onErrorCapture={placeholderImage} />
            </div>
            <div className="product_details">
                <div className="product_featured_header">
                    {data?.is_feature ? (
                        <div className='product_featured'>
                            <BiBadgeCheck size={16} color="white" />
                            <p className="product_card_featured">{t('featured')}</p>
                        </div>
                    ) : null}
                    <div className="like_div product_card_black_heart_cont">
                        {data?.is_liked ? (
                            <button className="isLiked" onClick={handleLikeItem}>
                                <FaHeart size={24} />
                            </button>
                        ) : (

                            <button onClick={handleLikeItem}>
                                <FaRegHeart size={24} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="title_details">
                    <span className='price'>
                        {CurrencySymbol} {formatPriceAbbreviated(data?.price)}
                    </span>
                    <span className='title'>
                        {data?.name}
                    </span>
                    <span className='decs'>{data?.description}</span>
                    <p className="product_card_prod_det">
                        {data?.city}{data?.city ? "," : null}{data?.state}{data?.state ? "," : null}{data?.country}
                    </p>
                </div>
                <div className="post_time">
                    <span>{formatDate(data?.created_at)}</span>
                </div>
            </div>
        </div>

    )
}

export default ProdcutHorizontalCard
