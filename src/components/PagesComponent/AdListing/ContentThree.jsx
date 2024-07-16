import { t } from '@/utils'
import { Checkbox, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa6'
import { HiOutlineUpload } from 'react-icons/hi'
import { MdOutlineAttachFile } from 'react-icons/md'

const ContentThree = ({ CustomFields, extraDetails, setExtraDetails, submitExtraDetails, handleGoBack }) => {


    const handleChange = (id, value) => {

        setExtraDetails((prevDetails) => ({ ...prevDetails, [id]: value !== null ? value : '' }));

    };


    const handleCheckboxChange = (id, value, checked) => {
        setExtraDetails((prevDetails) => {
            const newValue = checked
                ? [...(prevDetails[id] || []), value]
                : (prevDetails[id] || []).filter((v) => v !== value);
            return { ...prevDetails, [id]: newValue };
        });
    };
    const handleKeyDown = (e, maxLength) => {

        if (maxLength === null || maxLength === undefined) {
            return
        }

        const value = e.target.value;

        // Allow control keys (Backspace, Delete, Arrow keys, etc.)
        const controlKeys = [
            'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Tab',
        ];

        if (
            value.length >= maxLength &&
            !controlKeys.includes(e.key)
        ) {
            e.preventDefault();
        }
    };

    const renderInputField = (field) => {
        let { id, name, type, required, values, min_length, max_length } = field;

        const inputProps = {
            id,
            name,
            required: !!required,
            onChange: (e) => handleChange(id, e.target.value),
            value: extraDetails[id] || '',
            // minLength: min_length,
            // maxLength: max_length
            ...(type === 'number'
                ? { min: min_length, max: max_length }
                : { minLength: min_length, maxLength: max_length }
            )
        };
        switch (type) {
            case 'text':
            case 'number':
                {
                    return <div className="input-container">
                        <input
                            type={type}
                            placeholder={`${t('enter')} ${name}`}
                            {...inputProps}
                            onKeyDown={(e) => type === 'number' && handleKeyDown(e, max_length)}
                            onChange={(e) => {
                                handleChange(id, e.target.value);
                                // Force re-render to update character count
                                setExtraDetails(prev => ({ ...prev }));
                            }}
                            className={`${extraDetails[name] ? 'bg' : ''}`}
                        />
                        {max_length && (
                            <span className='fixed-right'>
                                {`${extraDetails[id] ? extraDetails[id].length : 0}/${max_length}`}
                            </span>
                        )}
                    </div>
                }
            case 'textbox':
                return <div className="input-container">
                    <textarea
                        placeholder={`${t('enter')} ${name}`}
                        className={`${extraDetails[name] ? 'bg' : ''}`}
                        {...inputProps}
                        onChange={(e) => {
                            handleChange(id, e.target.value);
                            // Force re-render to update character count
                            setExtraDetails(prev => ({ ...prev }));
                        }}
                    />
                    {max_length !== null && (
                        <span className='fixed-right'>
                            {`${extraDetails[id] ? extraDetails[id].length : 0}/${max_length}`}
                        </span>
                    )}
                </div>
            case 'fileinput':
                return (
                    <label htmlFor={id} className='fileinput_wrap'>
                        <div className='click_upld_wrap'>
                            <HiOutlineUpload size={24} fontWeight='400' />
                            <span>{t('Upload')}</span>
                        </div>
                        {
                            extraDetails[id] &&
                            <div className='file_wrap'>
                                <MdOutlineAttachFile size={20} />
                                <span>{extraDetails[id].name}</span>
                            </div>
                        }

                        <input type="file" id={id} name={name} className='fileinput' onChange={(e) => handleChange(id, e.target.files[0])} required={required === 1} />
                        <span className='fixed-left'>{t('allowedFileType')}</span>
                    </label>
                )
            case 'dropdown':
                return (
                    <div className="cat_select_wrapper">
                        <select {...inputProps} className='bg extra_det_select'>
                            <option value="">{t('select')} {name}</option>
                            {values?.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <FaAngleDown className='cat_select_arrow' />
                    </div>
                );
            case 'checkbox':

                return (
                    <div className='date_posted_checkbox extradet_checkbox'>
                        {values?.map((value, index) => (
                            <Checkbox
                                key={value}
                                value={value}
                                checked={extraDetails[id]?.includes(value)}
                                onChange={(e) => handleCheckboxChange(id, e.target.value, e.target.checked)}
                            >
                                {value}
                            </Checkbox>
                        ))}
                    </div>
                );
            case 'radio':

                return (
                    <Radio.Group {...inputProps} className='radio_group extradet_radio_group' onChange={(e) => handleChange(id, e.target.value)}>
                        {values?.map((option) => (
                            <Radio key={option} value={option}>{option}</Radio>
                        ))}
                    </Radio.Group>
                );
            default:
                return null;
        }
    };


    return (
        <>
            <div className="col-12">
                <div className="row formWrapper">
                    {CustomFields.map((field) => (
                        <div key={field.id} className="col-12 col-lg-6">
                            <label className={`${field?.required ? 'auth_label' : 'auth_pers_label'}`} htmlFor={field.id}>{field.name}</label>
                            {renderInputField(field)}
                        </div>
                    ))}




                    {/* <div className="col-12 col-lg-6">
                                <label className='auth_pers_label' htmlFor="title">{t('operatingSystem')}</label>
                                <input placeholder={t('enterOperatingSystem')} className={`${extraDetails.system !== '' ? 'bg' : ''}`} value={extraDetails.system} type='text' onChange={(e) => setExtraDetails({ system: e.target.value })} />
                            </div>

                            <div className="col-12 col-lg-6">
                                <label className='auth_pers_label' htmlFor="Brand">{t('brand')}</label>
                                <input placeholder={t('enterBrand')} className={`${extraDetails.brand !== '' ? 'bg' : ''}`} type='text' value={extraDetails.brand} onChange={(e) => setExtraDetails({ brand: e.target.value })} />
                            </div>

                            <div className="col-12 col-lg-6">
                                <label className='auth_pers_label' htmlFor="Modal">{t('modal')}</label>
                                <input placeholder={t('enterModal')} className={`${extraDetails.modal !== '' ? 'bg' : ''}`} value={extraDetails.modal} type='text' onChange={(e) => setExtraDetails({ modal: e.target.value })} />
                            </div>

                            <div className="col-12 col-lg-6">
                                <label className='auth_pers_label' htmlFor="Storage">{t('storage')}</label>
                                <input placeholder={t('enterStorage')} className={`${extraDetails.storage !== '' ? 'bg' : ''}`} value={extraDetails.storage} type='file' onChange={(e) => setExtraDetails({ storage: e.target.value })}  />
                            </div>

                            <div className="col-12">
                                <label className='auth_pers_label' htmlFor="Feature">{t('feature')}</label>
                                <textarea placeholder={t('enterFeature')} className={`${extraDetails.feature !== '' ? 'bg' : ''}`} value={extraDetails.feature} type='text' onChange={(e) => setExtraDetails({ feature: e.target.value })} />
                            </div>

                            <div className="col-12 colorDiv">
                                <label className='auth_pers_label' htmlFor="color">{t("color")}</label>
                                <div>
                                    {
                                        colorsData.map((ele) => {
                                            return <span className={`${selectedColor === ele.color ? 'selectedColor' : ''}`} onClick={() => setSelectedColor(ele.color)}>{ele.color}</span>
                                        })
                                    }
                                </div>
                            </div> */}
                    <div className="formBtns">
                        <button className='backBtn' onClick={handleGoBack}>{t('back')}</button>
                        <button type='button' className='nextBtn' onClick={submitExtraDetails}>{t('next')}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContentThree
