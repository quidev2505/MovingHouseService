import React from "react";
import LayoutAdmin from "../ComponentAdmin/LayoutAdmin";
import TopCssContent from "./TopCssContent";
import BottomCssContent from "./BottomCssContent";
import { Link, useParams, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingOverlayComponent from "../../../Components/LoadingOverlayComponent";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Breadcrumb } from "antd";

import Swal from "sweetalert2/dist/sweetalert2.js";
import { logOutAdmin } from "../../../redux/apiRequest";
import axios from "axios";


function ChangePasswordAdmin() {
  const [isActive, setIsActive] = useState(true);
  const params = useParams();

  const navigate = useNavigate()
  useEffect(() => {
    setIsActive(false);
  }, []);

  //Validation form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const password_current = data.password_current;
    const password_new = data.password_new;
    const password_reinput = data.password_reinput;

    const dataAdmin = {
      password_current: password_current,
      password_new: password_new
    }

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
        .put(`/v1/admin/change_password/${params.id}`, dataAdmin)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Đổi mật khẩu thành công !",
            text: "Vui lòng đăng nhập lại",
            showConfirmButton: false,
            timer: 1000,
          });
            logOutAdmin(navigate, dispatch);
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
      <LayoutAdmin>
        <div className="change_password_admin">
          <div>
            <Breadcrumb
              routes={[
                {
                  title: <Link to="/admin/dashboard">Tài khoản</Link>,
                  key: "Dashboard",
                },
                {
                  title: "Đổi mật khẩu",
                },
              ]}
            />
          </div>

          <TopCssContent>
            <p>Đổi mật khẩu</p>
          </TopCssContent>

          <BottomCssContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ width: "50%", margin: "0 auto" }}
            >
              <LoadingOverlayComponent status={isActive}>
                <div className="card-body p-5 text-center">
                  <div className="form-outline mb-4  form_input_handle">
                    <input
                      type="password"
                      id="password_current"
                      className="form-control form-control-lg"
                      placeholder="Nhập mật khẩu hiện tại"
                      style={{ fontSize: "17px", borderRadius: "3px" }}
                      {...register("password_current", {
                        required: true,
                        minLength: 8,
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
                      type="password"
                      id="password_new"
                      className="form-control form-control-lg"
                      placeholder="Nhập mật khẩu mới"
                      style={{ fontSize: "17px", borderRadius: "3px" }}
                      {...register("password_new", {
                        required: true,
                        minLength: 8,
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
                      type="password"
                      id="password_reinput"
                      className="form-control form-control-lg"
                      placeholder="Nhập lại mật khẩu mới"
                      style={{ fontSize: "17px", borderRadius: "3px" }}
                      {...register("password_reinput", {
                        required: true,
                        minLength: 8,
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
              </LoadingOverlayComponent>
            </form>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default ChangePasswordAdmin;
