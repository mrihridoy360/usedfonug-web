import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';
import { loadGoogleMaps, t } from '@/utils';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { BiCurrentLocation } from 'react-icons/bi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { saveCity } from '@/redux/reuducer/locationSlice';
import { settingsData } from '@/redux/reuducer/settingSlice';

const LocationModal = ({ IsLocationModalOpen, OnHide }) => {
    const { isLoaded } = loadGoogleMaps();
    const [googleMaps, setGoogleMaps] = useState(null);
    const router = useRouter();
    const systemSettingsData = useSelector(settingsData);

    const settings = systemSettingsData?.data;
    const searchBoxRef = useRef(null);
    const [isValidLocation, setIsValidLocation] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);


    useEffect(() => {
        if (isLoaded) {
            setGoogleMaps(window.google);
        }
    }, [isLoaded]);

    const handlePlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const cityData = {
                lat: place.geometry.location.lat(),
                long: place.geometry.location.lng(),
                city: place.address_components.find(comp => comp.types.includes("locality"))?.long_name,
                state: place.address_components.find(comp => comp.types.includes("administrative_area_level_1"))?.long_name,
                country: place.address_components.find(comp => comp.types.includes("country"))?.long_name
            };
            setSelectedCity(cityData);
            setIsValidLocation(true);
        } else {
            setIsValidLocation(false);
        }
    };
    const getCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const locationData = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationData.latitude},${locationData.longitude}&key=${settings?.place_api_key}`);
                        const results = response.data.results[0];
                        const cityData = {
                            lat: locationData.latitude,
                            long: locationData.longitude,
                            city: results.address_components.find(comp => comp.types.includes("locality")).long_name,
                            state: results.address_components.find(comp => comp.types.includes("administrative_area_level_1")).long_name,
                            country: results.address_components.find(comp => comp.types.includes("country")).long_name,
                            formattedAddress: results.formatted_address
                        };
                        saveCity(cityData);
                        OnHide();
                    } catch (error) {
                        console.error('Error fetching location data:', error);
                    }
                },
                (error) => {
                    toast.error(t('locationNotGranted'));
                }
            );
        } else {
            toast.error(t('geoLocationNotSupported'));
        }
    };

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>;

    useEffect(() => {
        if (window.google && isLoaded) {
            // Initialize any Google Maps API-dependent logic here
        }
    }, [isLoaded]);


    const handleSearch = (value) => {
        setSelectedCity({ city: value });
        setIsValidLocation(false);
    };
    const handleUpdateLocation = (e) => {
        e.preventDefault();

        if (selectedCity) {
            if (isValidLocation) {

                saveCity(selectedCity);
                router.push('/');
                OnHide();
            } else {
                toast.error("Please Select valid location")
            }
        } else {
            toast.error(t('pleaseSelectCity'));
        }
    };

    return (
        <Modal
            centered
            visible={IsLocationModalOpen}
            closeIcon={CloseIcon}
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
        >
            <div className='location_modal'>
                <h5 className='head_loc'>{selectedCity ? t('editLocation') : t('addLocation')}</h5>
                <div className="card">
                    <div className="card-body">
                        <div className="location_city">
                            <div className="row">
                                <div className="col-12">
                                    <div className="useCurrentLocation">
                                        <button onClick={getCurrentLocation}>
                                            <span>
                                                <BiCurrentLocation size={22} />
                                            </span>
                                            <span>
                                                {t('currentLocation')}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <span>{t('or')}</span>
                                </div>
                                <div className="col-12">
                                    {isLoaded && googleMaps && (
                                        <StandaloneSearchBox
                                            onLoad={ref => (searchBoxRef.current = ref)}
                                            onPlacesChanged={handlePlacesChanged}
                                        >
                                            <input
                                                type="text"
                                                placeholder={t('selectLocation')}
                                                value={selectedCity?.formatted_address}
                                                onChange={(e) => handleSearch(e.target.value)}
                                            />
                                        </StandaloneSearchBox>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button
                            onClick={handleUpdateLocation}

                        >
                            {t('save')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LocationModal;
