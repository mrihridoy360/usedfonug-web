'use client'
import React, { useState } from 'react'
import { FaAngleRight } from "react-icons/fa";
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux';
import { placeholderImage } from '@/utils';
import { t } from "@/utils"
import { settingsData } from '@/redux/reuducer/settingSlice';
import { setCatCurrentPage, setCatLastPage, setCateData } from '@/redux/reuducer/categorySlice';
import { categoryApi } from '@/utils/api';



const ContentOne = ({ handleCategoryTabClick, CurrenCategory, setCurrenCategory,  currentPage, lastPage, setCurrentPage, setLastPage }) => {
  const dispatch = useDispatch()
  const systemSettingsData = useSelector(settingsData)
  const settings = systemSettingsData?.data

  const fetchMoreCategory = async () => {
    try {
      if (currentPage < lastPage) {
        const response = await categoryApi.getCategory({ page: `${currentPage + 1}` });
        const { data } = response.data;
        if (data && Array.isArray(data.data)) {
          setCurrenCategory(prev => [...prev, ...data.data]);

          setCurrentPage(data?.data?.current_page); // Update the current page
          setLastPage(data?.data?.last_page); // Update the current page
        } else {
          console.error("Error: Data is not an array", data);
          // setIsLoading(false);
        }
      } else {
        return
      }

    } catch (error) {
      // setIsLoading(false)
      console.error("Error:", error);
    }
  }

  return (
    <>
      <>
        {CurrenCategory && CurrenCategory.map((tab1) => (
          <div className="col-md-6 col-lg-4 catDetails" key={tab1.id} onClick={() => handleCategoryTabClick(tab1)}>
            <div>
              <span className='imgWrapper'>
                <Image src={tab1?.image ? tab1.image : settings?.placeholder_image} height={25} width={25} alt='categoryImg' onErrorCapture={placeholderImage} />
              </span>
              <span>{tab1.translated_name}</span>
            </div>
            {tab1?.subcategories_count && tab1?.subcategories_count > 0 ?
              (
                <span><FaAngleRight /></span>
              ) : null
            }
          </div>
        ))}
      </>
      {lastPage > currentPage ?
        <div className="loadMore">
          <button onClick={fetchMoreCategory}> {t('loadMore')} </button>
        </div> : null}
    </>
  );

}

export default ContentOne
