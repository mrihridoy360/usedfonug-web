import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";


const initialState = {
    cityData: {
        city: "",
        state: "",
        country: "",
        lat: "",
        long: ""
    },
}
export const locationSlice = createSlice({
    name: "Location",
    initialState,
    reducers: {

        setCityData: (location, action) => {
            location.cityData = action.payload.data;
        },


    },
});

export default locationSlice.reducer;
export const { setCityData } = locationSlice.actions;



// Action to store location 
export const saveCity = (data) => {
    store.dispatch(setCityData({ data }));
}



export const getCityData = createSelector(
    (state) => state.Location,
    (Location) => Location.cityData
)
