'use client'
import React, { useEffect, useState } from 'react'
import BreadcrumbComponent from '../../Breadcrumb/BreadcrumbComponent'
import ContentOne from './ContentOne'
import ContentTwo from './ContentTwo'
import ContentThree from './ContentThree'
import ContentFour from './ContentFour'
import ContentFive from './ContentFive'
import AdSuccessfulModal from './AdSuccessfulModal'
import { useDispatch, useSelector } from 'react-redux'
import { setBreadcrumbPath } from '@/redux/reuducer/breadCrumbSlice'
import { t } from '@/utils'
import { addItemApi, categoryApi, getAreasApi, getCitiesApi, getCoutriesApi, getCustomFieldsApi, getStatesApi } from '@/utils/api'
import toast from 'react-hot-toast'
import axios from 'axios'
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
import { useRouter } from 'next/navigation'
import { settingsData } from '@/redux/reuducer/settingSlice'
import { CurrentPage, LastPage, CategoryData } from "@/redux/reuducer/categorySlice"
import { userSignUpData } from '@/redux/reuducer/userSlice'



const AdListing = () => {

  const router = useRouter();
  const dispatch = useDispatch()
  const userToken = useSelector(userSignUpData)
  const CurrentLanguage = useSelector(CurrentLanguageData)
  const systemSettingsData = useSelector(settingsData)
  const settings = systemSettingsData?.data
  const [currentPage, setCurrentPage] = useState()
  const [lastPage, setLastPage] = useState()
  const [activeTab, setActiveTab] = useState(1)
  const [IsAdSuccessfulModal, setIsAdSuccessfulModal] = useState(false)
  const [CurrenCategory, setCurrenCategory] = useState([])
  const [CurrentPath, setCurrentPath] = useState([])
  const [CustomFields, setCustomFields] = useState([])
  const [AdListingDetails, setAdListingDetails] = useState({
    title: '',
    desc: '',
    price: '',
    phonenumber: '',
    link: '',
  })

  const [extraDetails, setExtraDetails] = useState({})
  const [uploadedImages, setUploadedImages] = useState([]);
  const [OtherImages, setOtherImages] = useState([]);
  const [Location, setLocation] = useState({})
  const [Countries, setCountries] = useState([])
  const [States, setStates] = useState([])
  const [Cities, setCities] = useState([])
  const [Area, setArea] = useState([])
  const [SelectedCountry, setSelectedCountry] = useState({})
  const [SelectedState, setSelectedState] = useState({})
  const [SelectedCity, setSelectedCity] = useState({})
  const [SelectedArea, setSelectedArea] = useState({})
  const [CountrySearch, setCountrySearch] = useState('')
  const [StateSearch, setStateSearch] = useState('')
  const [CitySearch, setCitySearch] = useState('')
  const [AreaSearch, setAreaSearch] = useState('')
  const [ActiveLocation, setActiveLocation] = useState('manually')
  const [position, setPosition] = useState([51.505, -0.09]);
  const [Address, setAddress] = useState('')
  const [LocationByMap, setLocationByMap] = useState({})
  const [isAdPlaced, setIsAdPlaced] = useState(false)



  const getCountriesData = async (search) => {
    try {
      // Fetch countries
      const res = await getCoutriesApi.getCoutries({ search });
      const allCountries = res?.data?.data?.data || [];
      setCountries(allCountries)
    } catch (error) {
      console.error("Error fetching countries data:", error);
    }
  };

  const getStatesData = async (search) => {
    try {
      const res = await getStatesApi.getStates({ country_id: SelectedCountry?.id, search });
      const allStates = res?.data?.data?.data || [];
      setStates(allStates)
    } catch (error) {
      console.error("Error fetching states data:", error);
      return [];
    }
  };

  const getCitiesData = async (search) => {
    try {
      const res = await getCitiesApi.getCities({ state_id: SelectedState?.id, search });
      const allCities = res?.data?.data?.data || [];
      setCities(allCities)
    } catch (error) {
      console.error("Error fetching cities data:", error);
      return [];
    }
  };

  const getAreaData = async (search) => {
    try {
      const res = await getAreasApi.getAreas({ city_id: SelectedCity?.id, search });
      const allArea = res?.data?.data?.data || [];
      setArea(allArea)
    } catch (error) {
      console.error("Error fetching cities data:", error);
      return [];
    }
  };



  useEffect(() => {
    const timeout = setTimeout(() => {
      getCountriesData(CountrySearch);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [CountrySearch])

  useEffect(() => {
    const timeout = setTimeout(() => {
      getStatesData(StateSearch);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [SelectedCountry?.id, StateSearch])

  useEffect(() => {

    const timeout = setTimeout(() => {
      getCitiesData(CitySearch);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };

  }, [SelectedState?.id, CitySearch])

  useEffect(() => {
    const timeout = setTimeout(() => {
      SelectedCity?.id && getAreaData(AreaSearch);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };

  }, [SelectedCity?.id, AreaSearch])

  const getLocationWithMap = async (pos) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=${settings?.place_api_key}`);
      const results = response.data.results[0];

      // Extract address components
      const addressComponents = results.address_components;
      const getAddressComponent = (type) => {
        const component = addressComponents.find(comp => comp.types.includes(type));
        return component ? component.long_name : '';
      };

      const locationData = {
        lat: pos.lat,
        long: pos.lng,
        city: getAddressComponent("locality"),
        state: getAddressComponent("administrative_area_level_1"),
        country: getAddressComponent("country"),
        address: results.formatted_address
      };

      setLocationByMap(locationData);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  }


  const getCurrentLocation = async () => {
    setActiveLocation('locate');
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

            // Extract address components
            const addressComponents = results.address_components;
            const getAddressComponent = (type) => {
              const component = addressComponents.find(comp => comp.types.includes(type));
              return component ? component.long_name : '';
            };

            const cityData = {
              lat: locationData.latitude,
              long: locationData.longitude,
              city: getAddressComponent("locality"),
              state: getAddressComponent("administrative_area_level_1"),
              country: getAddressComponent("country"),
              address: results.formatted_address
            };

            setLocation(cityData);
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

  const allCategoryIdsString = CurrentPath.map(category => category.id).join(',');

  let lastItemId = CurrentPath[CurrentPath.length - 1]?.id;

  const getCategoriesData = async (type) => {

    try {
      const res = await categoryApi.getCategory({ category_id: type ? type : lastItemId })
      const data = res?.data?.data?.data
      setCurrenCategory(data)
      setCurrentPage(res?.data?.data?.current_page); // Update the current page
      setLastPage(res?.data?.data?.last_page); // Update the current page
    } catch (error) {
      console.log(error)
    }
  }
  const getCustomFieldsData = async (id) => {
    try {

      const res = await getCustomFieldsApi.getCustomFields({ category_ids: allCategoryIdsString })
      const data = res?.data?.data
      setCustomFields(data)
      const newExtraDetails = {};
      data.forEach(item => {
        switch (item.type) {
          case 'checkbox':
            newExtraDetails[item.id] = []; // Initialize with an empty array
            break;
          case 'dropdown':
            newExtraDetails[item.id] = ''; // Initialize with an empty string
            break;
          case 'radio':
            newExtraDetails[item.id] = []; // Initialize with an empty string
            break;
          case 'fileinput':
            newExtraDetails[item.id] = null; // Initialize with null
            break;
          case 'textbox':
            newExtraDetails[item.id] = ''; // Initialize with an empty string
            break;
          case 'number':
            newExtraDetails[item.id] = null; // Initialize with null
            break;
          case 'text':
            newExtraDetails[item.id] = ''; // Initialize with an empty string
            break;
          default:
            break;
        }
      });
      setExtraDetails(newExtraDetails);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCategoriesData()
  }, [lastItemId, CurrentLanguage])



  const handleCategoryTabClick = async (category) => {
    const idExists = CurrentPath.some(item => item.id === category?.id);
    if (CurrentPath.length === 1 && CurrentPath[0]?.subcategories_count === 0) {
      setCurrentPath([category]);
    } else if (!idExists) {
      setCurrentPath((prevPath) => [...prevPath, category]);
    }
    if (category?.subcategories_count > 0) {
      if (category?.subcategories?.length > 0) {
        setCurrenCategory(category?.subcategories)
      } else {
        getCategoriesData(category?.id)
      }
    }
    else {
      setActiveTab(2)

    }
  }

  useEffect(() => {

  }, [CurrenCategory, CurrentPath])
  useEffect(() => {
    if (activeTab === 2) {
      if (allCategoryIdsString) {
        getCustomFieldsData()
      }
    }
  }, [activeTab, allCategoryIdsString])



  const handleGoBack = () => {

    setActiveTab((prev) => {

      if (CustomFields.length === 0 && activeTab === 4) {
        return prev - 2
      }
      else {
        return prev - 1;
      }
    })
  }


  const handleSelectedTabClick = (id) => {
    if (activeTab !== 1) {
      setActiveTab(1);
    }
    const index = CurrentPath.findIndex(item => item.id === id);
    if (index !== -1) {
      const newPath = CurrentPath.slice(0, index + 1);
      setCurrentPath(newPath);
    }
    if (index === 0) {
      setCurrenCategory([])
      getCategoriesData("")
      setCurrentPath([])
      setCustomFields([])
    }

  };


  const handleAdListingChange = (e) => {
    const { name, value } = e.target;
    setAdListingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };


  const handleDetailsSubmit = () => {
    if (AdListingDetails.title == "") {
      toast.error(t('titleRequired'))
      return;
    } else if (AdListingDetails.desc == "") {
      toast.error(t('descriptionRequired'))
      return;
    } else if (AdListingDetails.price == "") {
      toast.error(t('priceRequired'))
      return;
    }
    else if (AdListingDetails.phonenumber == "") {
      toast.error(t('phoneRequired'))
      return;
    }

    if (CustomFields?.length === 0) {
      setActiveTab(4)
    }
    else {
      setActiveTab(3)
    }
  }

  const submitExtraDetails = (e) => {
    if (CustomFields) {
      for (let field of CustomFields) {
        if (field?.required == 1) {
          if (extraDetails[field?.id] == '' || extraDetails[field?.id] == null) {
            toast.error(`${field?.name} ${t('isRequired')}`);
            return;
          }
        }
      }
    }
    setActiveTab(4);
  };


  const handleImageSubmit = () => {
    setActiveTab(5)
  }

  const validateExtraDetails = (CustomFields, extraDetails) => {
    for (const field of CustomFields) {
      const { name, type, required, id } = field;

      if (required) {
        if (type !== 'checkbox' && type !== 'radio' && !extraDetails[id]) {
          toast.error(`${t('fillDetails')} ${name}.`);
          return false;
        }

        if ((type === 'checkbox' || type === 'radio') && extraDetails[id].length === 0) {
          toast.error(`${t('selectAtleastOne')} ${name}.`);
          return false;
        }
      }
    }
    return true;
  };


  const isValidURL = (url) => {
    const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return pattern.test(url);
  };


  const postAd = async () => {

    const slug = AdListingDetails.title.toLowerCase().replace(/\s+/g, '-');
    const cat = CurrentPath[CurrentPath.length - 1];
    const catId = cat.id;

    let countryName, stateName, cityName, latitude, longitude, address;

    if (ActiveLocation === 'manually') {
      countryName = SelectedCountry.name;
      stateName = SelectedState.name;
      cityName = SelectedCity.name;
      address = Area.length !== 0 ? SelectedArea.name : Address;
      latitude = SelectedCity.latitude;
      longitude = SelectedCity.longitude;
    } else if (ActiveLocation === 'locate') {
      countryName = Location?.country;
      stateName = Location?.state;
      cityName = Location?.city;
      latitude = Location?.lat;
      longitude = Location?.long;
      address = Location?.address;
    } else {
      countryName = LocationByMap.country;
      stateName = LocationByMap.state;
      cityName = LocationByMap.city;
      latitude = LocationByMap.lat;
      longitude = LocationByMap.long;
      address = LocationByMap.address;
    }


    const transformedCustomFields = {};
    const customFieldFiles = [];
    Object.entries(extraDetails).forEach(([key, value]) => {
      if (value instanceof File || (Array.isArray(value) && value[0] instanceof File)) {
        customFieldFiles.push({ key, files: value });
      } else {
        transformedCustomFields[key] = Array.isArray(value) ? value : [value];
      }
    });

    const show_only_to_premium = 1;
    const allData = {
      name: AdListingDetails.title,
      slug: slug,
      description: AdListingDetails?.desc,
      category_id: catId,
      all_category_ids: allCategoryIdsString,
      price: AdListingDetails.price,
      contact: AdListingDetails.phonenumber,
      video_link: AdListingDetails?.link,
      custom_fields: transformedCustomFields,
      image: uploadedImages[0],
      gallery_images: OtherImages,
      address: address,
      latitude: latitude,
      longitude: longitude,
      custom_field_files: customFieldFiles,
      show_only_to_premium: show_only_to_premium,
      country: countryName,
      state: stateName,
      city: cityName
    }

    setIsAdPlaced(true)

    const res = await addItemApi.addItem(allData)
    if (res?.data?.error === true) {
      setIsAdPlaced(false)
      toast.error(res?.data?.message)
      return
    }

    if (res?.data?.error === false) {
      setIsAdPlaced(true)
      setIsAdSuccessfulModal(true)
      router.push("/ads")
    }
  }


  const handleFullSubmission = () => {

    if (!userToken?.token) {
      toast.error(t('loginFirst'))
      return
    }

    const { title, desc, price, phonenumber, link } = AdListingDetails;

    const cat = CurrentPath[CurrentPath.length - 1];
    const catId = cat?.id;

    if (!catId) {
      toast.error(t('selectCategory'))
      return
    }

    if (!title || !desc || !price || !phonenumber) {
      toast.error(t('completeDetails'));
      setActiveTab(2);
      return;
    }

    // Additional validation logic (e.g., format checks) can be added here
    if (price <= 0) {
      toast.error(t('enterValidPrice'));
      setActiveTab(2);
      return;
    }



    if (link && !isValidURL(link)) {
      toast.error(t('enterValidUrl'));
      setActiveTab(2);
      return;
    }

    if (CustomFields.length !== 0 && !validateExtraDetails(CustomFields, extraDetails)) {
      setActiveTab(3);
      return;
    }
    if (uploadedImages.length === 0) {
      toast.error(t('uploadMainPicture'));
      setActiveTab(4);
      return
    }
    if (ActiveLocation === 'manually' && Object.keys(SelectedCountry).length === 0) {
      toast.error(t('selectCountry'));
      return
    }
    if (ActiveLocation === 'manually' && Object.keys(SelectedState).length === 0) {
      toast.error(t('selectState'));
      return
    }
    if (ActiveLocation === 'manually' && Object.keys(SelectedCity).length === 0) {
      toast.error(t('selectCity'));
      return
    }
    if (ActiveLocation === 'manually' && Area.length !== 0 && Object.keys(SelectedArea).length === 0) {
      toast.error(t('selectArea'));
      return
    }
    if (ActiveLocation === 'manually' && Area.length === 0 && !Address) {
      toast.error(t('enterAddress'));
      return
    }

    const isLocation = Location?.city && Location?.country && Location?.state && Location?.lat && Location?.long

    if (ActiveLocation === 'locate' && !isLocation) {
      toast.error(t('locationSetFailed'));
      return
    }

    const isLocationByMap = LocationByMap.country && LocationByMap.state && LocationByMap.city && LocationByMap.address;

    if (ActiveLocation === 'map' && !isLocationByMap) {
      toast.error(t('pleaseSelectLocation'));
      return
    }
    postAd()
  }

  return (
    <>
      <BreadcrumbComponent title2={t('adListing')} />
      <section className='adListingSect container'>
        <div className="row">
          <div className="col-12">
            <span className='heading'>{t('adListing')}</span>
          </div>
          <div className="row tabsWrapper">

            <div className="col-12">
              <div className="tabsHeader">
                <span className={`tab ${activeTab === 1 ? 'activeTab' : ''}`} onClick={() => setActiveTab(1)}>{t('selectedCategory')}</span>
                <span className={`tab ${activeTab === 2 ? 'activeTab' : ''}`} onClick={() => setActiveTab(2)}>{t('details')}</span>

                {
                  CustomFields.length !== 0 &&
                  <span className={`tab ${activeTab === 3 ? 'activeTab' : ''}`} onClick={() => setActiveTab(3)}>{t('extraDetails')}</span>
                }


                <span className={`tab ${activeTab === 4 ? 'activeTab' : ''}`} onClick={() => setActiveTab(4)}>{t('images')}</span>
                <span className={`tab ${activeTab === 5 ? 'activeTab' : ''}`} onClick={() => setActiveTab(5)}>{t('location')}</span>
              </div>
            </div>
            {
              activeTab === 1 || activeTab === 2 ?
                CurrentPath.length > 0 &&
                <div className="col-12">
                  <div className="tabBreadcrumb">
                    <span className='title1'>{t('selected')}</span>

                    <div className='selected_wrapper'>
                      {
                        CurrentPath.map((item, index) => (

                          <span className='title2' key={item.id} onClick={() => handleSelectedTabClick(item?.id)}>
                            {item.name}
                            {
                              index !== CurrentPath.length - 1 && CurrentPath.length > 1 ? ',' : ''
                            }
                          </span>
                        ))
                      }
                    </div>
                  </div>
                </div> : null
            }

            <div className="col-12">
              <div className="contentWrapper">
                {
                  activeTab === 1 && CurrenCategory.length > 0 &&
                  <span className='contentTitle'>{t('allCategory')}</span>
                }
                <div className='row'>

                  {
                    activeTab === 1 &&
                    <ContentOne handleCategoryTabClick={handleCategoryTabClick} CurrenCategory={CurrenCategory} setCurrenCategory={setCurrenCategory} setCurrentPage={setCurrentPage} setLastPage={setLastPage} currentPage={currentPage} lastPage={lastPage} />
                  }

                  {
                    activeTab === 2 &&
                    <ContentTwo AdListingDetails={AdListingDetails} handleAdListingChange={handleAdListingChange} handleDetailsSubmit={handleDetailsSubmit} handleGoBack={handleGoBack} />
                  }

                  {
                    activeTab === 3 && CustomFields.length !== 0 &&
                    <ContentThree CustomFields={CustomFields} extraDetails={extraDetails} setExtraDetails={setExtraDetails} submitExtraDetails={submitExtraDetails} handleGoBack={handleGoBack} />
                  }

                  {
                    activeTab === 4 &&
                    <ContentFour setUploadedImages={setUploadedImages} uploadedImages={uploadedImages} OtherImages={OtherImages} setOtherImages={setOtherImages} handleImageSubmit={handleImageSubmit} handleGoBack={handleGoBack} />
                  }

                  {
                    activeTab === 5 &&
                    <ContentFive getCurrentLocation={getCurrentLocation} Countries={Countries} SelectedState={SelectedState} setSelectedState={setSelectedState} setSelectedCountry={setSelectedCountry} States={States} setCountrySearch={setCountrySearch} setStateSearch={setStateSearch} setCitySearch={setCitySearch} Cities={Cities} setSelectedCity={setSelectedCity} handleGoBack={handleGoBack} setActiveLocation={setActiveLocation} ActiveLocation={ActiveLocation} Location={Location} handleFullSubmission={handleFullSubmission} position={position} setPosition={setPosition} SelectedCountry={SelectedCountry} getLocationWithMap={getLocationWithMap} setAreaSearch={setAreaSearch} Area={Area} setSelectedArea={setSelectedArea} LocationByMap={LocationByMap} Address={Address} setAddress={setAddress} SelectedCity={SelectedCity} isAdPlaced={isAdPlaced} />
                  }
                  {/* {
                    activeTab !== 1 &&
                    <div className="col-12 formBtns">
                      <button className='backBtn' onClick={() => handleGoBack()}>{t('back')}</button>
                      {
                        activeTab === 5 ?
                          <button className='nextBtn postBtn' onClick={handlePost} >{t('post')}</button> :
                          <button className='nextBtn' onClick={() => handleGoNext()}>{t('next')}</button>
                      }
                    </div>
                  } */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AdSuccessfulModal IsAdSuccessfulModal={IsAdSuccessfulModal} OnHide={() => setIsAdSuccessfulModal(false)} />
    </>
  )
}

export default AdListing
