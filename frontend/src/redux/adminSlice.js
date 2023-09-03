import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        login: {
            currentAdmin: null,
            isFetching: false,
            error: false
        },
        // register: {
        //     isFetching: false,
        //     error: false,
        //     success: false
        // },
    },
    reducers: {
        loginAdminStart: (state) => {
            state.login.isFetching = true;
        },
        loginAdminSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentAdmin = action.payload
            state.login.error = false;
        },
        loginAdminFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        // registerStart: (state) => {
        //     state.register.isFetching = true;
        // },
        // registerSuccess: (state) => {
        //     state.register.isFetching = false;
        //     state.register.error = false;
        //     state.register.success = true;
        // },
        // registerFailed: (state) => {
        //     state.register.isFetching = false;
        //     state.register.error = true;
        //     state.register.success = false;
        // },
        logOutAdminStart: (state) => {
            state.login.isFetching = true;
        },
        logOutAdminSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentAdmin = null;
            state.login.error = false;
        },
        logOutAdminFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
    }
});


export const {
    loginAdminStart,
    loginAdminSuccess,
    loginAdminFailed,
    // registerStart,
    // registerSuccess,
    // registerFailed,
    logOutAdminStart,
    logOutAdminSuccess,
    logOutAdminFailed
} = adminSlice.actions;

export default adminSlice.reducer;