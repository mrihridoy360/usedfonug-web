import { t, truncate } from '@/utils';
import { Checkbox, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { HiOutlineUpload } from 'react-icons/hi';
import { MdOutlineAttachFile } from 'react-icons/md';

const ContentThree = ({ CustomFields, extraDetails, setExtraDetails, submitExtraDetails, handleGoBack, extraFieldValue }) => {

    useEffect(() => {


        CustomFields?.forEach(field => {
            const fieldId = field.id;
            const extraField = extraFieldValue.find(item => item.id === fieldId);
            const fieldValue = extraField ? extraField.value : null;

            if (field.type === "checkbox") {
                // For checkbox fields, initialize with the values from extraFieldValue
                const checkboxValues = fieldValue || [];
                setExtraDetails(prevDetails => ({
                    ...prevDetails,
                    [fieldId]: checkboxValues
                }));
            } else if (field.type === "radio") {
                // For radio fields, initialize as a single value
                const radioValue = fieldValue ? fieldValue[0] : '';
                setExtraDetails(prevDetails => ({
                    ...prevDetails,
                    [fieldId]: radioValue
                }));
            }
            // else if (field.type === "fileinput") {

            //     const value = fieldValue ? fieldValue?.name : '';
            //     setExtraDetails(prevDetails => ({
            //         ...prevDetails,
            //         [fieldId]: value
            //     }));
            // } 
            else {
                // For other fields
                const initialValue = fieldValue ? fieldValue[0] : '';
                setExtraDetails(prevDetails => ({
                    ...prevDetails,
                    [fieldId]: initialValue
                }));
            }
        });
    }, [CustomFields, extraFieldValue, setExtraDetails]);

    const handleChange = (id, value) => {
        setExtraDetails((prevDetails) => ({ ...prevDetails, [id]: value !== null ? value : '' }));
    };

    const handleCheckboxChange = (id, value, checked) => {
        setExtraDetails((prevDetails) => {
            const currentValues = Array.isArray(prevDetails[id]) ? prevDetails[id] : [];
            let newValues;
            if (checked) {
                newValues = [...currentValues, value];
            } else {
                newValues = currentValues.filter((v) => v !== value);
            }
            return { ...prevDetails, [id]: newValues };
        });
    };

    const handleKeyDown = (e, maxLength) => {
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
        let { id, name, type, required, values, min_length, max_length, value } = field;
        const currentValue = extraDetails[id] !== undefined ? extraDetails[id] : (value && value.length > 0 ? value[0] : '');

        const inputProps = {
            id,
            name,
            required: !!required,
            onChange: (e) => handleChange(id, e.target.value),
            value: currentValue,
            ...(type === 'number'
                ? { min: min_length, max: max_length }
                : { minLength: min_length, maxLength: max_length }
            )
        };

        switch (type) {
            case 'text':
            case 'number':
                return (
                    <div className="input-container">
                        <input
                            type={type}
                            placeholder={`${t('enter')} ${name}`}
                            {...inputProps}
                            onKeyDown={(e) => type === 'number' && handleKeyDown(e, max_length)}
                            onChange={(e) => {
                                handleChange(id, e.target.value);
                                setExtraDetails(prev => ({ ...prev })); // Force re-render
                            }}
                            className={`${extraDetails[name] ? 'bg' : ''}`}
                        />
                        {max_length && (
                            <span className='fixed-right'>
                                {`${currentValue.length}/${max_length}`}
                            </span>
                        )}
                    </div>
                );
            case 'textbox':
                return (
                    <div className="input-container">
                        <textarea
                            placeholder={`${t('enter')} ${name}`}
                            className={`${extraDetails[id] ? 'bg' : ''}`}
                            {...inputProps}
                            onChange={(e) => {
                                handleChange(id, e.target.value);
                                setExtraDetails(prev => ({ ...prev })); // Force re-render
                            }}
                        />
                        {max_length && (
                            <span className='fixed-right'>
                                {`${currentValue.length}/${max_length}`}
                            </span>
                        )}
                    </div>
                );
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
                                {/* <span>{extraFieldValue ? <a>Document</a> : ''}</span> */}
                            </div>
                        }
                        <input type="file" id={id} name={name} className='fileinput' onChange={(e) => handleChange(id, e.target.files[0])} required={required === 1} />
                    </label>
                );
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
                        {values?.map((val) => (
                            <Checkbox
                                key={val}
                                value={val}
                                checked={Array.isArray(extraDetails[id]) && extraDetails[id].includes(val)}
                                onChange={(e) => handleCheckboxChange(id, val, e.target.checked)}
                            >
                                {val}
                            </Checkbox>
                        ))}
                    </div>
                );
            case 'radio':
                return (
                    <Radio.Group
                        {...inputProps}
                        className='radio_group extradet_radio_group'
                        onChange={(e) => handleChange(id, e.target.value)}
                        value={currentValue}
                    >
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
        <div className="col-12">
            <div className="row formWrapper">
                {CustomFields?.map((field) => (
                    <div key={field.id} className="col-12 col-lg-6">
                        <label className={`${field?.required ? 'auth_label' : 'auth_pers_label'}`} htmlFor={field.id}>{field.name}</label>
                        {renderInputField(field)}
                    </div>
                ))}

                <div className="formBtns">
                    <button className='backBtn' onClick={handleGoBack}>{t('back')}</button>
                    <button type='button' className='nextBtn' onClick={submitExtraDetails}>{t('next')}</button>
                </div>
            </div>
        </div>
    );
};

export default ContentThree;
