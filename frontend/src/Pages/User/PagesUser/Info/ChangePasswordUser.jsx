import React, { useState, useEffect } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";

import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";
import { Table, Tag, Drawer, Timeline, Space, Modal, Rate, Avatar } from "antd";

import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";

import { logOut } from "../../../../redux/apiRequest";

function ChangePasswordUser() {
  const [visible, setVisible] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(true);
  const params = useParams();
  //Validation form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let btnVisible_1 = document.querySelector("#password_current");
    let btnVisible_2 = document.querySelector("#password_new");
    let btnVisible_3 = document.querySelector("#password_reinput");

    if (
      btnVisible_1.type === "text" &&
      btnVisible_2.type === "text" &&
      btnVisible_3.type === "text"
    ) {
      btnVisible_1.type = "password";
      btnVisible_2.type = "password";
      btnVisible_3.type = "password";
    } else {
      btnVisible_1.type = "text";
      btnVisible_2.type = "text";
      btnVisible_3.type = "text";
    }
    setIsActive(false);
  }, [visible]);

  const onSubmit = async (data) => {
    const password_current = data.password_current;
    const password_new = data.password_new;
    const password_reinput = data.password_reinput;

    const dataUser = {
      password_current: password_current,
      password_new: password_new,
    };

    if (password_new !== password_reinput) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Không khớp nhau",
        text: "Mật khẩu mới và mật khẩu nhập lại không khớp",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      await axios
        .put(`/v1/user/change_password/${params.id_user}`, dataUser)
        .then((data) => {
          Swal.fire({
            title: "Đổi mật khẩu thành công !",
            icon: "success",
            text: "Vui lòng đăng nhập lại!",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác nhận",
          }).then((result) => {
            if (result.isConfirmed) {
              logOut(nav, dispatch);
              nav("/login");
            }
          });
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Đổi mật khẩu thất bại!",
            text: "Vui lòng thực hiện nhập mật khẩu lại !",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    }
  };

  return (
    <>
      <HeaderUser />
      <LoadingOverlayComponent status={isActive}>
        <div className="infoUser d-flex">
          <div className="d-flex" style={{ alignItems: "center" }}>
            <ArrowLeftOutlined
              style={{
                borderRadius: "50%",
                padding: "5px",
                backgroundColor: "#ccc",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={() => nav("/user/info_user")}
            />
          </div>
          <div style={{ margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "50px",
                backgroundColor: "#f16622",
                color: "white",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              ĐỔI MẬT KHẨU
            </h2>
          </div>
        </div>

        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: "50%",
              margin: "0 auto",
            }}
          >
            <div className="card-body p-3 text-center">
              <div className="form-outline mb-4  form_input_handle">
                <div
                  className="change_password_visible"
                  id="basic-addon1"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>}
                </div>
                <input
                  type="text"
                  id="password_current"
                  className="form-control form-control-lg"
                  placeholder="Nhập mật khẩu hiện tại"
                  style={{
                    fontSize: "17px",
                    borderRadius: "3px",
                  }}
                  {...register("password_current", {
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors?.password_current?.type === "required" && (
                  <p>Mật khẩu không được để trống !</p>
                )}
                {errors?.password_current?.type === "minLength" && (
                  <p>Mật khẩu nhập chưa đủ kí tự !</p>
                )}
              </div>
              <div className="form-outline mb-4  form_input_handle">
                <input
                  type="text"
                  id="password_new"
                  className="form-control form-control-lg"
                  placeholder="Nhập mật khẩu mới"
                  style={{
                    fontSize: "17px",
                    borderRadius: "3px",
                  }}
                  {...register("password_new", {
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors?.password_new?.type === "required" && (
                  <p>Mật khẩu không được để trống !</p>
                )}
                {errors?.password_new?.type === "minLength" && (
                  <p>Mật khẩu nhập chưa đủ kí tự !</p>
                )}
              </div>
              <div className="form-outline mb-4  form_input_handle">
                <input
                  type="text"
                  id="password_reinput"
                  className="form-control form-control-lg"
                  placeholder="Nhập lại mật khẩu mới"
                  style={{
                    fontSize: "17px",
                    borderRadius: "3px",
                  }}
                  {...register("password_reinput", {
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors?.password_reinput?.type === "required" && (
                  <p>Mật khẩu không được để trống !</p>
                )}
                {errors?.password_reinput?.type === "minLength" && (
                  <p>Mật khẩu nhập chưa đủ kí tự !</p>
                )}
              </div>

              <button
                className="btn btn-lg"
                type="submit"
                style={{
                  height: "54px",
                  width: "100%",
                  backgroundColor: "#f16622",
                  color: "white",
                  marginTop: "5px",
                  borderRadius: "5px",
                  fontSize: "17px",
                  marginBottom: "10px",
                  fontWeight: "500",
                }}
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </LoadingOverlayComponent>
    </>
  );
}

export default ChangePasswordUser;
