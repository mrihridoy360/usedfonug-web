import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";  // Ensure this import path is correct

const initialState = {
    data: null,
    loading: false,
};

export const authSlice = createSlice({
    name: "UserSignup",
    initialState,
    reducers: {
        signupRequested: (usersignup, action) => {
            usersignup.loading = true;
        },
        signupSucess: (usersignup, action) => {
            usersignup.data = action.payload;
            usersignup.loading = true;
        },
        signupFailure: (usersignup, action) => {
            usersignup.loading = false;
        },
        updateDataSuccess: (usersignup, action) => {
            usersignup.data = action.payload;
        },
        userUpdateData: (usersignup, action) => {
            usersignup.data.data = action.payload.data;
        },
        userLogout: (usersignup) => {
            usersignup = initialState;
            return usersignup;
        },

    },
});

export const { signupRequested, signupSucess, signupFailure, updateDataSuccess, userUpdateData, userLogout } = authSlice.actions;
export default authSlice.reducer;

export const loadUpdateData = (data) => {
    store.dispatch(updateDataSuccess(data));
};
export const loadUpdateUserData = (data) => {
    store.dispatch(userUpdateData({ data }));
};
export const logoutSuccess = (logout) => {
    store.dispatch(userLogout({ logout }));
};

export const userSignUpData = createSelector(
    (state) => state.UserSignup,
    (UserSignup) => UserSignup?.data?.data
);


