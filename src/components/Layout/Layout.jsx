import React, { useEffect, useState } from 'react';
import MainHeader from './MainHeader';
import Footer from './Footer';
import Loader from '@/components/Loader/Loader';
import { settingsSucess } from '@/redux/reuducer/settingSlice';
import { settingsApi } from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
const PushNotificationLayout = dynamic(() => import('../firebaseNotification/PushNotificationLayout.jsx'), { ssr: false });
import { store } from '@/redux/store';
import ScrollToTopButton from './ScrollToTopButton';

const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const cityData = useSelector(state => state?.Location?.cityData);
    const settingsData = store.getState().Settings?.data
    const placeApiKey = settingsData?.data?.place_api_key
    const favicon = settingsData?.data?.favicon_icon
    const router = useRouter();
    const [isLoading, setisLoading] = useState(true);
    const lang = useSelector(CurrentLanguageData);
    useSelector(CurrentLanguageData)
    useEffect(() => {
        if (lang && lang.rtl === true) {
            document.documentElement.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
        }
    }, [lang]);
    useEffect(() => {
        const getSystemSettings = async () => {
            try {
                const response = await settingsApi.getSettings({
                    type: "" // or remove this line if you don't need to pass the "type" parameter
                });
                const data = response.data;
                dispatch(settingsSucess({ data }));
                setisLoading(false);
                document.documentElement.style.setProperty('--primary-color', data?.data?.web_theme_color);
                requestLocationPermission(); // Request location after settings are loaded
            } catch (error) {
                console.error("Error:", error);
                setisLoading(false);
            }
        };
        getSystemSettings();
    }, [dispatch]);

    const requestLocationPermission = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                },
                (error) => {
                    console.error('Location permission denied:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };


    useEffect(() => {
        if (cityData?.city === "") {
            router.push('/home');
        }
    }, [cityData]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <head>
                        <link rel="shortcut icon" href={favicon} sizes="32x32" type="image/png" />

                        <meta property="og:image" content={favicon} />
                        
                        <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${placeApiKey}&libraries=places&loading=async`}></script>
                    </head>

                    <PushNotificationLayout>
                        <MainHeader />
                        {children}
                        <Footer />
                    </PushNotificationLayout>
                    <ScrollToTopButton />

                </>
            )}
        </>
    );
};

export default Layout;
