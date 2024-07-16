'use client';
import Image from "next/image";
import Ad from '../../../public/assets/ad_image.png';
import ProductCard from "../Cards/ProductCard";
import { placeholderImage, t } from "@/utils";
import FeaturedSectionsSkeleton from "../Skeleton/FeaturedSectionsSkeleton";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { userSignUpData } from "@/redux/reuducer/authSlice";
import { useSelector } from "react-redux";
import NoData from "../NoDataFound/NoDataFound";

const FeaturedSections = ({ isLoading, featuredData, setFeaturedData }) => {
    const userData = useSelector(userSignUpData);

    // Check if all section_data arrays are empty
    const allEmpty = featuredData?.every(ele => ele?.section_data.length === 0);

    const handleLike = (id) => {
        const updatedData = featuredData.map(section => {
            const updatedSectionData = section.section_data.map(item => {
                if (item.id === id) {
                    return { ...item, is_liked: !item.is_liked };
                }
                return item;
            });
            return { ...section, section_data: updatedSectionData };
        });
        setFeaturedData(updatedData);
    };


    return (
        isLoading ? (
            Array.from({ length: 4 }, (_, index) => (
                <FeaturedSectionsSkeleton key={index} />
            ))
        ) : (
            <div className="container">
                <div className="row product_card_card_gap col_rev">
                    <div className="col-12">
                        <div className="all_sections">
                            {featuredData && !allEmpty ? (
                                featuredData.map((ele, index) => (
                                    ele?.section_data.length > 0 && (
                                        <div className="main_featured_sec" key={index}>
                                            <div className="pop_categ_mrg_btm">
                                                <h4 className="pop_cat_head">{ele?.title}</h4>
                                                {ele?.section_data.length > 4 &&
                                                    <Link href={`/featured-sections/${ele?.slug}`} prefetch={false}>
                                                        <span className="view_all">{t('viewAll')}</span>
                                                    </Link>
                                                }
                                            </div>
                                            <div className="row product_card_card_gap">
                                                {ele?.section_data.slice(0, 4).map((data, index) => (
                                                    <div className="col-xxl-3 col-lg-4 col-sm-6 col-12 card_col_gap" key={index}>
                                                        <Link href={userData?.id == data?.user_id ? `/my-listing/${data?.slug}` : `/product-details/${data.slug}`} prefetch={false}>
                                                            <ProductCard data={data} handleLike={handleLike}/>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))
                            ) : (
                                <NoData />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default FeaturedSections;
