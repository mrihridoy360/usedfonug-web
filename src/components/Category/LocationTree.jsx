import { t } from "@/utils";
import { getCitiesApi, getCoutriesApi, getStatesApi } from "@/utils/api";
import { Tree } from "antd"
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";


const LocationTree = ({ setCountry, setState, setCity, setIsFetchSingleCatItem, selectedLocationKey, setSelectedLocationKey }) => {

    const [treeData, setTreeData] = useState([]);

    // country pages
    const [countryCurrentPage, setCountryCurrentPage] = useState(1);
    const [countryLastPage, setCountryLastPage] = useState(1);

    // state pages
    const [stateCurrentPage, setStateCurrentPage] = useState({});
    const [stateLastPage, setStateLastPage] = useState({});


    // city pages
    const [cityCurrentPage, setCityCurrentPage] = useState({});
    const [cityLastPage, setCityLastPage] = useState({});

    const getCountriesData = async (page) => {

        try {
            // Fetch countries
            const res = await getCoutriesApi.getCoutries({ page });
            setCountryCurrentPage(res?.data?.data?.current_page)
            setCountryLastPage(res?.data?.data?.last_page)
            const allCountries = res?.data?.data?.data || [];

            // Construct tree data with only countries
            const countriesData = allCountries.map((country) => ({
                title: country.name,
                key: country.name,
                id: country.id,
                isCountry: true,
                isLeaf: false,
            }));

            if (page > 1) {
                setTreeData((prevTreeData) => [...prevTreeData, ...countriesData]);
            }
            else {
                setTreeData(countriesData);
            }


        } catch (error) {
            console.error("Error fetching countries data:", error);
        }
    };


    useEffect(() => {
        getCountriesData(1);
    }, []);

    const getStatesData = async (countryId, page = 1) => {


        try {
            const res = await getStatesApi.getStates({ country_id: countryId, page });
            const allStates = res?.data?.data?.data || [];

            setStateCurrentPage((prev) => ({
                ...prev,
                [countryId]: res?.data?.data?.current_page,
            }));

            setStateLastPage((prev) => ({
                ...prev,
                [countryId]: res?.data?.data?.last_page,
            }));


            return allStates.map((state) => ({
                title: state.name,
                key: `${countryId}_${state.id}`,
                id: state.id,
                children: [],
                isState: true,
                isLeaf: false, // Indicate that these nodes do not have further children
            }));
        } catch (error) {
            console.error("Error fetching states data:", error);
            return [];
        }
    };

    const getCitiesData = async (stateId, page = 1) => {
        try {
            const res = await getCitiesApi.getCities({ state_id: stateId, page });
            const allCities = res?.data?.data?.data || [];

            setCityCurrentPage((prev) => ({
                ...prev,
                [stateId]: res?.data?.data?.current_page,
            }));

            setCityLastPage((prev) => ({
                ...prev,
                [stateId]: res?.data?.data?.last_page,
            }));


            return allCities.map((city) => ({
                title: city.name,
                key: `${stateId}_${city.id}`,
                id: city.id,
                isCity: true,
                isLeaf: true, // Indicate that these nodes do not have further children
            }));
        } catch (error) {
            console.error("Error fetching cities data:", error);
            return [];
        }
    };


    const handleLoadData = async (node) => {
        const { id, isLeaf, children, isState } = node;

        if (!isLeaf && (!children || children.length === 0) && !isState) { // If expanding a country and it doesn't already have children
            const states = await getStatesData(id); // Fetch states of the country
            setTreeData((prevTreeData) => {
                return prevTreeData.map((country) => {
                    if (country.id === id) {
                        return {
                            ...country,
                            children: states,
                        };
                    }
                    return country;
                });
            });
        } else if (!isLeaf && (!children || children.length === 0) && isState) { // If expanding a state and it doesn't already have children
            const cities = await getCitiesData(id); // Fetch cities of the state
            setTreeData((prevTreeData) => {
                return prevTreeData.map((country) => {
                    const updatedCountry = { ...country };
                    if (updatedCountry.children) {
                        updatedCountry.children = updatedCountry.children.map((state) => {
                            if (state.id === id) {
                                return {
                                    ...state,
                                    children: cities,
                                };
                            }
                            return state;
                        });
                    }
                    return updatedCountry;
                });
            });
        }
    };


    const renderTreeNode = (node) => {
        return (
            <div className='filter_item_cont'>
                <span className={`filter_item`}>{node?.title}</span>

                {node.isCountry && stateCurrentPage[node.id] < stateLastPage[node.id] && (
                    <span
                        className="loc_tree_load"
                        onClick={() => loadMoreStates(node.id)}
                    >
                        {t("loadMore")}
                    </span>
                )}


                {node.isState && cityCurrentPage[node.id] < cityLastPage[node.id] && (
                    <span
                        className="loc_tree_load"
                        onClick={() => loadMoreCities(node.id)} // Adjusted for state id
                    >
                        {t("loadMore")}
                    </span>
                )}

            </div>
        );
    };

    const switcherIcon = ({ expanded }) => {
        return expanded ? <LuMinus size={14} color='#595b6c' fontWeight={600} /> : <GoPlus size={14} color='#595b6c' fontWeight={600} />;
    };

    const handleLocationSelect = (selectedKeys, info) => {
        const { node } = info;

        setSelectedLocationKey(selectedKeys);

        if (selectedKeys.length === 0) {
            setState('');
            setCity('');
            setCountry('');
            setIsFetchSingleCatItem((prev) => !prev);
        } else {
            if (node?.isCountry) {
                setCity('');
                setCountry(node.title);
                setState('');
            } else if (node?.isState) {
                setCountry('');
                setState(node.title);
                setCity('');
            } else {
                setState('');
                setCountry('');
                setCity(node.title);
            }
            // Trigger API call after state update
            setIsFetchSingleCatItem((prev) => !prev);
        }
    };

    const loadMoreCountries = () => {
        getCountriesData(countryCurrentPage + 1)
    }

    const loadMoreStates = (countryId) => {
        getStatesData(countryId, stateCurrentPage[countryId] + 1).then(
            (newStates) => {
                setTreeData((prevTreeData) =>
                    prevTreeData.map((country) => {
                        if (country.id === countryId) {
                            return {
                                ...country,
                                children: [...country.children, ...newStates],
                            };
                        }
                        return country;
                    })
                );
            }
        );
    };

    const loadMoreCities = async (stateId) => {
        const nextPage = cityCurrentPage[stateId] + 1;
        try {
            const newCities = await getCitiesData(stateId, nextPage);
            setTreeData((prevTreeData) =>
                prevTreeData.map((country) => {
                    const updatedCountry = { ...country };
                    if (updatedCountry.children) {
                        updatedCountry.children = updatedCountry.children.map((state) => {
                            if (state.id === stateId) {
                                return {
                                    ...state,
                                    children: [...state.children, ...newCities],
                                };
                            }
                            return state;
                        });
                    }
                    return updatedCountry;
                })
            );
        } catch (error) {
            console.error("Error loading more cities:", error);
        }
    };


    return (
        <>
            <Tree
                treeData={treeData}
                titleRender={(node, index) => renderTreeNode(node, index === 0)}
                className="catTree"
                switcherIcon={switcherIcon}
                loadData={handleLoadData}
                onSelect={handleLocationSelect}
                selectedKeys={selectedLocationKey}
            />

            {
                countryCurrentPage < countryLastPage &&
                <span className="loc_tree_load" onClick={loadMoreCountries}>{t('loadMore')}</span>
            }
        </>
    )
}

export default LocationTree