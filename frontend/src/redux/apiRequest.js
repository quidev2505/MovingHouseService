import axios from "axios";
import {
    loginFailed, loginStart, loginSuccess, registerStart, registerSuccess, registerFailed, logOutSuccess
} from "./authSlice";

import {
    getUserStart,
    getUserSuccess,
    getUserFailed
} from "./userSlice"

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (err) {
        dispatch(loginFailed());
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart())
    try {
        await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (err) {
        console.log(err)
        dispatch(registerFailed());
    }
}

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUserStart());
    try {
        const res = await axiosJWT.get("/v1/user", {
            headers: { token: `Bearer ${accessToken}` }
        })

        dispatch(getUserSuccess(res.data))
    } catch (err) {
        dispatch(getUserFailed())
    }
};


export const logOut = async (navigate, dispatch) => {
    // dispatch(logOutStart());
    // console.log('Token luc logout'+accessToken)
    navigate("/login")
    dispatch(logOutSuccess())
    // try {
    //     await axiosJWT.post("/v1/auth/logout", id, {
    //         headers: { token: `Bearer ${accessToken}` },
    //     })
    //     // localStorage.removeItem('persist:root')
    //     dispatch(logOutSuccess())
    //     navigate("/login");
    // } catch (err) {
    //     console.log(err)
    //     dispatch(logOutFailed());
    // }
}