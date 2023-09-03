import axios from "axios";
import {
    loginFailed, loginStart, loginSuccess, registerStart, registerSuccess, registerFailed, logOutSuccess
} from "./authSlice";

import {
    loginAdminFailed, loginAdminStart, loginAdminSuccess, logOutAdminSuccess
} from "./adminSlice";

import Swal from 'sweetalert2/dist/sweetalert2.js'

import 'sweetalert2/src/sweetalert2.scss'




import {
    getUserStart,
    getUserSuccess,
    getUserFailed
} from "./userSlice"

import { Toast } from "../Components/ToastColor";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());

    try {
        const res = await axios.post("/v1/auth/login", user);
        await Toast.fire({
            icon: 'success',
            title: 'Đăng nhập thành công',
            text: "Hãy đặt đơn hàng đầu tiên đi nào !"
        })
        navigate("/");

        // let role_check = res.data.role;
        // switch (role_check) {
        //     case 'user':
        //         navigate("/");
        //         break;
        //     case 'admin':
        //         //Email: admin@gmail.com
        //         //Password: Admin@123
        //         navigate("/admin/dashboard");
        //         break;
        //     default:
        //         await Toast.fire({
        //             icon: 'error',
        //             title: 'Đăng nhập không thành công',
        //             text: "Hãy thử đăng nhập lại !"
        //         })
        // }

        dispatch(loginSuccess(res.data));

    } catch (err) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Đăng nhập thất bại',
            text: 'Sai email hoặc mật khẩu',
            showConfirmButton: false,
            timer: 1000
        })
        dispatch(loginFailed());
    }
}

export const loginAdmin = async (admin, dispatch, navigate) => {
    dispatch(loginAdminStart());

    try {
        const res = await axios.post("/v1/admin/login", admin);
        await Toast.fire({
            icon: 'success',
            title: 'Đăng nhập thành công',
            text: "Tiến hành vào giao diện quản trị Admin!"
        })
        
        dispatch(loginAdminSuccess(res.data));
        navigate("/admin/dashboard");


    } catch (err) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Đăng nhập thất bại',
            text: 'Sai tên đăng nhập hoặc mật khẩu',
            showConfirmButton: false,
            timer: 1000
        })
        dispatch(loginAdminFailed());
    }
}


export const loginUserWithGoogle = async (user, dispatch, navigate) => {
    dispatch(loginStart());

    try {
        const res = await axios.post("/v1/auth/loginWithGoogle", user);
        await Toast.fire({
            icon: 'success',
            title: 'Đăng nhập thành công',
            text: "Hãy đặt đơn hàng đầu tiên đi nào !"
        })

        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (err) {
        console.log(err)
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Đăng nhập thất bại',
            text: 'Sai email hoặc mật khẩu',
            showConfirmButton: false,
            timer: 1000
        })
        dispatch(loginFailed());
    }
}


export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart())
    try {
        await axios.post("/v1/auth/register", user).then(() => {
            dispatch(registerSuccess());
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Đăng ký tài khoản thành công !',
                text: 'Hãy tiến hành đăng nhập !',
                showConfirmButton: false,
                timer: 1000
            })
            navigate("/login");
        })
    } catch (err) {
        console.log(err)
        if (err.response.data === 'AlreadyUseEmail') {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Email đã được sử dụng',
                text: 'Hãy nhập một email mới',
                showConfirmButton: false,
                timer: 1000
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Đăng ký tài khoản thất bại !',
                text: 'Hãy thử lại sau...',
                showConfirmButton: false,
                timer: 1000
            })
        }

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
    Swal.fire({
        title: 'Bạn muốn đăng xuất khỏi tài khoản?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận'
    }).then((result) => {
        if (result.isConfirmed) {
            navigate("/login")
            dispatch(logOutSuccess())
            dispatch(logOutAdminSuccess())
        }
    })



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


export const logOutAdmin = async (navigate, dispatch) => {
    // dispatch(logOutStart());
    // console.log('Token luc logout'+accessToken)
    Swal.fire({
        title: 'Bạn muốn đăng xuất khỏi tài khoản?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận'
    }).then((result) => {
        if (result.isConfirmed) {
            navigate("/admin/login")
            dispatch(logOutAdminSuccess())
        }
    })
}