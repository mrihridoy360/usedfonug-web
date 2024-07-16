'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import OfferSlider from './OfferSlider'
import PopularCategories from './PopularCategories'
import FreshRecommendations from './FeaturedSections'
import { FeaturedSectionApi, categoryApi, sliderApi } from '@/utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { SliderData, setSlider } from '@/redux/reuducer/sliderSlice'
import { CategoryData, resetCateData, replaceAllCateData, setCatLastPage, setCatCurrentPage, setCateData } from '@/redux/reuducer/categorySlice'
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice'
import { getFavData } from '@/redux/reuducer/favouriteSlice'
import { usePathname } from 'next/navigation'

const HomePage = () => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const slider = useSelector(SliderData);
    const cateData = useSelector(CategoryData)
    const swiperRef = useRef()
    const CurrentLanguage = useSelector(CurrentLanguageData)
    const [isLoading, setIsLoading] = useState(true);
    const [featuredData, setFeaturedData] = useState([])
    // const [cateData, setCatData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [cachedData, setCachedData] = useState({});


    const isLikeddata = useSelector(getFavData)
    const isLiked = isLikeddata?.data?.isLiked

    const cityData = useSelector(state => state?.Location?.cityData);

    useEffect(() => {
        const fetchSliderData = async () => {
            try {
                const response = await sliderApi.getSlider();
                const data = response.data;
                dispatch(setSlider(data.data))
                setIsLoading(false)
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        };
        fetchSliderData();
    }, []);


    useEffect(() => {
        const fetchFeaturedSectionData = async () => {
            try {
                const response = await FeaturedSectionApi.getFeaturedSections({ city: cityData?.city, state: cityData?.state, country: cityData?.country });
                const { data } = response.data;
                setFeaturedData(data)
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        };
        fetchFeaturedSectionData();
    }, [cityData, CurrentLanguage, isLiked]);

    return (
        <>
            <OfferSlider sliderData={slider} isLoading={isLoading} />
            <PopularCategories
            />
            <FreshRecommendations featuredData={featuredData} isLoading={isLoading} setFeaturedData={setFeaturedData} />
        </>
    )
}

export default HomePage
