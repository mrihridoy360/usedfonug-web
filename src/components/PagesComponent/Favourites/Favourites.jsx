"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/Cards/ProductCard";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import { t } from "@/utils";
import { getFavouriteApi } from "@/utils/api";
import Link from "next/link";
import { userSignUpData } from "@/redux/reuducer/authSlice";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader/Loader";
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent";
import NoData from "@/components/NoDataFound/NoDataFound";

const Favourites = () => {
    const [favoritesData, setFavoriteData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [likeChanged, setLikedChange] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const userData = useSelector(userSignUpData);

    useEffect(() => {
        const fetchFavoriteItems = async (page) => {
            try {
                setIsLoading(true);
                const response = await getFavouriteApi.getFavouriteApi({ page });
                const { data } = response?.data?.data;
                if (page === 1) {
                    setFavoriteData(data);
                } else {
                    setFavoriteData((prevData) => [...prevData, ...data]);
                }
                setIsLoading(false);
                if (response?.data?.data.current_page === response?.data?.data.last_page) {
                    setHasMore(false); // Check if there's more data
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };

        fetchFavoriteItems(currentPage);
    }, [likeChanged, currentPage]);
    useEffect(() => {

    }, [hasMore])



    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleLike = (id) => {
        const updatedItems = favoritesData.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        setFavoriteData(updatedItems);
    }

    const isLikedMoreThanOne = favoritesData.filter(fav => fav.is_liked).length > 0

    return (
        <>
            <BreadcrumbComponent title2={t('favourites')} />
            <div className="container">
                <div className="row my_prop_title_spacing">
                    <h4 className="pop_cat_head">{t("myFavorites")}</h4>
                </div>
                <div className="row profile_sidebar">
                    <ProfileSidebar />
                    <div className="col-lg-9 p-0">
                        <div className="container">
                            <div className="row ad_card_wrapper">



                                {favoritesData && favoritesData.length > 0 && isLikedMoreThanOne ? (

                                    favoritesData?.map((fav, index) => {
                                        return (
                                            fav?.is_liked &&
                                            <div className="col-xl-4 col-md-6 col-sm-12" key={index}>
                                                <Link
                                                    href={userData?.id === fav?.user_id ? `/my-listing/${fav?.slug}` : `/product-details/${fav.slug}`}
                                                    prefetch={false}
                                                >
                                                    <ProductCard data={fav} handleLike={handleLike} />
                                                </Link>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <NoData />
                                )}
                            </div>
                            {isLoading && <div><Loader /></div>}
                            {hasMore && !isLoading && (
                                <div className="loadMore">
                                    <button onClick={handleLoadMore}> {t('loadMore')} </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Favourites;
