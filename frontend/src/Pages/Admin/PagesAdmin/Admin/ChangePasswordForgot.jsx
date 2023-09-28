import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { loginUser } from "../redux/apiRequest";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ChangePaswordForgot() {
  const nav = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let OTP_ADMIN = JSON.parse(localStorage.getItem("otp_admin"));
    //Get from localstorage
    if (!OTP_ADMIN) {
      nav("/admin/forgot_password_admin");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsActive(false);
    let btnVisible = document.querySelector("#password");
    if (btnVisible.type === "text") {
      btnVisible.type = "password";
    } else {
      btnVisible.type = "text";
    }
  }, [visible]);

  //Validation form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let email_local = JSON.parse(localStorage.getItem("otp_admin"));

    const email_otp = email_local;
    const new_password = data.password;

    await axios
      .post("/v1/adminAccount/changePasswordAdmin", {
        email_otp,
        new_password,
      })
      .then((data) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Đổi mật khẩu thành công !",
          text: "Hãy đi đến đăng nhập",
          showConfirmButton: false,
          timer: 1700,
        });
        console.log(data);
        nav("/admin/login");
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Đổi mật khẩu thất bại !",
          showConfirmButton: false,
          timer: 2000,
        });
        nav("/");
      });

    localStorage.removeItem("otp_admin");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div classname="container">
          <section className="vh-100" style={{ backgroundColor: "#f9f9f9" }}>
            <div className="container py-5 h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                  <div
                    className="card shadow-2-strong"
                    style={{
                      borderRadius: "1rem",
                      overflow: "hidden",
                      boxShadow: "10px 10px 10px #ccc",
                    }}
                  >
                    <LoadingOverlayComponent status={isActive}>
                      {/* btn back */}
                      {/* <BackPrevious path="/" /> */}
                      <div className="card-body p-5 text-center">
                        {/* //Img icon */}
                        <img
                          src="./img/logo_main.png"
                          alt="anh_logo"
                          style={{
                            width: "213px",
                            height: "64px",
                            objectFit: "contain",
                            marginBottom: "15px",
                          }}
                        />
                        <h3
                          style={{
                            textAlign: "center",
                            marginTop: "5px",
                            marginBottom: "20px",
                          }}
                        >
                          Cài đặt lại mật khẩu
                        </h3>
                        <div className="input-group mb-3 form-outline mb-4 form_input_handle">
                          <input
                            type="text"
                            id="password"
                            className="form-control form-control-lg"
                            placeholder="Mật khẩu"
                            style={{ fontSize: "17px", borderRadius: "3px" }}
                            {...register("password", {
                              required: true,
                              minLength: 8,
                              pattern:
                                /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/,
                            })}
                          />

                          <div
                            className="input-group-text"
                            id="basic-addon1"
                            onClick={() => setVisible(!visible)}
                          >
                            {visible ? (
                              <FaEye></FaEye>
                            ) : (
                              <FaEyeSlash></FaEyeSlash>
                            )}
                          </div>
                        </div>
                        <div
                          className="form_input_handle"
                          style={{ marginTop: "-10px" }}
                        >
                          {errors?.password?.type === "required" && (
                            <p>Mật khẩu không được để trống !</p>
                          )}
                          {errors?.password?.type === "minLength" && (
                            <p>Mật khẩu phải ít nhất là 8 kí tự !</p>
                          )}
                          {errors?.password?.type === "pattern" && (
                            <p>
                              Mật khẩu phải ít nhất 1 chữ cái viết hoa, 1 chữ số
                              và kí tự đặc biệt !
                            </p>
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
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </form>
    </>
  );
}

export default ChangePaswordForgot;
