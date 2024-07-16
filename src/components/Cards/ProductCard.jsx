'use client'
import Image from "next/image"
import { FaRegHeart } from "react-icons/fa";
import { formatDate, formatPriceAbbreviated, placeholderImage, t, truncate } from "@/utils";
import { BiBadgeCheck } from "react-icons/bi";
import { FaHeart } from "react-icons/fa6";
import { manageFavouriteApi } from "@/utils/api";
import toast from "react-hot-toast";
import { userSignUpData } from '@/redux/reuducer/authSlice';
import { useSelector } from "react-redux";


const ProductCard = ({ data, handleLike }) => {
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
        <div className="product_card">
            <div className="position-relative">
                <Image src={data?.image} width={220} height={190} alt="Product" className="product_card_prod_img" onErrorCapture={placeholderImage} />
                {data?.is_feature ? (
                    <div className="product_card_featured_cont">
                        <BiBadgeCheck size={16} color="white" />
                        <p className="product_card_featured">{t('featured')}</p>
                    </div>
                ) : null}
                <div className="product_card_black_heart_cont">
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
            <div className="product_card_prod_price_cont">
                <p className="product_card_prod_price">{CurrencySymbol} {formatPriceAbbreviated(data?.price)}</p>
                <p className="product_card_prod_date">{formatDate(data?.created_at)}</p>
            </div>
            <p className="product_card_prod_name">{data?.name}</p>
            <span className='decs'>{truncate(data?.description, 60)}</span>
            <p className="product_card_prod_det">
                {data?.city}{data?.city ? "," : null}{data?.state}{data?.state ? "," : null}{data?.country}
            </p>
        </div>
    )
}

export default ProductCard