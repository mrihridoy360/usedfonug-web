'use client'
import ProfileSidebar from "@/components/Profile/ProfileSidebar"
import Image from "next/image"
import user from '../../../../public/assets/Transperant_Placeholder.png'
import { BiEditAlt } from "react-icons/bi"
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { placeholderImage, t } from "@/utils";
import { useSelector } from "react-redux"
import { userSignUpData } from "@/redux/reuducer/authSlice"
import { useState } from "react"
import { MdAddPhotoAlternate } from "react-icons/md"
import { updateProfileApi } from "@/utils/api"
import { Fcmtoken } from "@/redux/reuducer/settingSlice"
import toast from "react-hot-toast"
import { loadUpdateUserData } from "@/redux/reuducer/userSlice"
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent"

const EditProfile = () => {
    // const User = store.getState().UserSignup
    const User = useSelector(userSignUpData)
    const UserData = User
    const fetchFCM = useSelector(Fcmtoken);
    const [formData, setFormData] = useState({
        name: UserData?.name || '',
        email: UserData?.email || '',
        phone: UserData?.mobile || '',
        address: UserData?.address || '',
        notification: UserData?.notification
    });

    const [profileImage, setProfileImage] = useState(UserData?.profile || user);
    const [mapSrc, setMapSrc] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [profileFile, setProfileFile] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const location = `${latitude}, ${longitude}`;
                setFormData((prevData) => ({
                    ...prevData,
                    location
                }));
                setMapSrc(`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31156.11447445189!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${latitude},${longitude}!5e0!3m2!1sen!2sin!4v1641611639403!5m2!1sen!2sin`);

                // Reverse Geocoding to get address details
                const apiKey = 'AIzaSyD4RhWLkRaW-kah6lb36_e9yuxKSi6Tkrw';
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

                try {
                    const response = await fetch(geocodeUrl);
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        const address = data.results[0].formatted_address;
                        setFormData((prevData) => ({
                            ...prevData,
                            address
                        }));
                    } else {
                        alert("No address found for the location.");
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                }
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleToggleChange = () => {
        setFormData((prevData) => ({
            ...prevData,
            notification: prevData.notification === 1 ? 0 : 1
        }));
    };

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();

        try {
            if (formData?.name == '' || formData?.phone == '' || formData?.address == '' || formData?.profileFile == '') {
                toast.error(t("emptyFieldNotAllowed"));
                setIsLoading(false)

                return
            }
            const response = await updateProfileApi.updateProfile({
                name: formData.name,
                email: formData.email,
                mobile: formData.phone,
                address: formData.address,
                profile: profileFile,
                fcm_id: fetchFCM ? fetchFCM : "",
                notification: formData.notification
            });
            const data = response.data;
            if (data.error !== true) {
                loadUpdateUserData(data?.data);
                toast.success(data.message);
                setIsLoading(false)

            } else {
                toast.error(data.message)
                setIsLoading(false)

            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (

        <>
            <BreadcrumbComponent title2={t('editProfile')} />
            <div className='container'>
                <div className="row my_prop_title_spacing">
                    <h4 className="pop_cat_head">{t('myProfile')}</h4>
                </div>

                <div className="row profile_sidebar">
                    <ProfileSidebar />
                    <div className="col-lg-9 p-0">
                        <div className="profile_content">
                            <div className='user_detail'>
                                <div className="profile_image_div">
                                    <Image src={profileImage} width={120} height={120} alt='User' className='user_img' onErrorCapture={placeholderImage} />
                                    <div className="add_profile">
                                        <input
                                            type="file"
                                            id="profileImageUpload"
                                            className="upload_input"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="profileImageUpload" className="upload_label">
                                            <MdAddPhotoAlternate size={22} />
                                        </label>
                                    </div>
                                </div>
                                <div className='user_info'>
                                    <h5 className='username'>{UserData?.name}</h5>
                                    <p className='user_email'>{UserData?.email}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className='personal_info'>
                                    <h5 className='personal_info_text'>{t('personalInfo')}</h5>
                                    <div className="authrow">
                                        <div className='auth_in_cont'>
                                            <label htmlFor="name" className='auth_pers_label'>{t('name')}</label>
                                            <input type="text" id='name' className='auth_input personal_info_input' value={formData.name} onChange={handleChange} />
                                        </div>
                                        <div className='auth_in_cont'>
                                            <label htmlFor="notification" className='auth_pers_label'>{t('notification')} </label>
                                            <span className="switch mt-2">
                                                <input id="switch-rounded"
                                                    type="checkbox"
                                                    checked={formData.notification === "1" || formData.notification === 1}
                                                    onChange={handleToggleChange} />
                                                <label htmlFor="switch-rounded"></label>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="authrow">
                                        <div className='auth_in_cont'>
                                            <label htmlFor="email" className='auth_pers_label'>{t('email')}</label>
                                            <input type="email" id='email' className='auth_input personal_info_input' value={formData.email} onChange={handleChange} readOnly={UserData?.type === "email" ? true : false} />
                                        </div>
                                        <div className='auth_in_cont'>
                                            <label htmlFor="phone" className='auth_pers_label'>{t('phoneNumber')}</label>
                                            <input type="number" id='phone' className='auth_input personal_info_input' value={formData.phone} onChange={handleChange} readOnly={UserData?.type === "phone" ? true : false} />
                                        </div>
                                    </div>
                                </div>
                                <div className="address">
                                    <h5 className='personal_info_text'>{t('address')}</h5>
                                    <div className="address_wrapper">
                                        <div className='auth_in_cont'>
                                            <label htmlFor="address" className='auth_pers_label'>{t('address')}</label>
                                            <textarea name="address" id="address" rows="3" className='auth_input personal_info_input' value={formData.address} onChange={handleChange}></textarea>
                                        </div>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <button className="sv_chng_btn">
                                        <div className="loader-container-otp">
                                            <div className="loader-otp"></div>
                                        </div>
                                    </button>
                                ) : (
                                    <button type="submit" className='sv_chng_btn'>{t('saveChanges')}</button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfile
