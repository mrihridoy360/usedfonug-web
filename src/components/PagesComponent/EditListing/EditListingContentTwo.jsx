import { t } from '@/utils'
import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2'

const ContentTwo = ({ AdListingDetails, handleAdListingChange, handleDetailsSubmit, handleGoBack }) => {

    return (
        <>
            <div className="col-12">
                <div className="row formWrapper">
                    <div className="col-12">
                        <label htmlFor="title" className='auth_label' >{t('title')}</label>
                        <input placeholder={t('enterTitle')} className={`${AdListingDetails.title !== '' ? 'bg' : ''}`} value={AdListingDetails.title} type='text' name='title' onChange={handleAdListingChange} required />
                    </div>

                    <div className="col-12">
                        <label className='auth_label' htmlFor="description">{t('description')}</label>
                        <textarea placeholder={t('enterDescription')} name='desc' className={`${AdListingDetails.desc !== '' ? 'bg' : ''}`} value={AdListingDetails.desc} onChange={handleAdListingChange} required />
                    </div>

                    <div className="col-12">
                        <label className='auth_label' htmlFor="price">{t('price')}</label>
                        <input placeholder='$ 00' value={AdListingDetails.price} name='price' className={`${AdListingDetails.price !== '' ? 'bg' : ''}`} type='number' onChange={handleAdListingChange} required />
                    </div>

                    <div className="col-12">
                        <label className='auth_label' htmlFor="number">{t('phoneNumber')}</label>
                        <input type="number" placeholder={t('enterPhoneNumber')} pattern='[0-9]{10}' name='phonenumber' value={AdListingDetails.phonenumber} onChange={handleAdListingChange} className={`${AdListingDetails.phonenumber !== '' ? 'bg' : ''}`} required />
                    </div>

                    <div className="col-12">
                        <label className='auth_pers_label' htmlFor="links">{t('videoLink')}</label>
                        <input placeholder={t('enterAdditionalLinks')} name='link' className={`${AdListingDetails.link !== '' ? 'bg' : ''}`} value={AdListingDetails.link} type='url' onChange={handleAdListingChange} />
                    </div>

                    <div className="formBtns">
                        <button className='backBtn' onClick={handleGoBack}>{t('back')}</button>
                        <button type='button' className='nextBtn' onClick={handleDetailsSubmit}>{t('next')}</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ContentTwo
