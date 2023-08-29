import React from "react";
import { useForm } from "react-hook-form";
import BackPrevious from "../Components/BackPrevious";
import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useNavigate } from "react-router-dom";


function ForgotPassword() {
  const [isActive, setIsActive] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setIsActive(false);
  }, []);

  //Validation form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const email_input = data.email;
    await axios
      .post("/v1/auth/forgotPassword", { email_input })
      .then((data) => {
        //Success Sending
        nav("/verify_otp");
        localStorage.setItem('otp_user', JSON.stringify(email_input));
        // console.log(data);
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Email chưa được đăng ký",
          text: "Vui lòng nhập lại địa chỉ email !",
          showConfirmButton: false,
          timer: 1000,
        });

        console.log(e)
      });
  };

  return (
    <>
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
                    <BackPrevious path="/login" />
                    <div className="card-body p-5 text-center">
                      <h3 style={{ textAlign: "left", marginTop: "17px" }}>
                        Nhập email bạn đã đăng ký để đặt lại mật khẩu
                      </h3>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Phonenumber */}
                        <div className="form-outline mb-4  form_input_handle">
                          <input
                            type="email"
                            id="email"
                            className="form-control form-control-lg"
                            placeholder="Email"
                            style={{ fontSize: "17px", borderRadius: "3px" }}
                            {...register("email", {
                              required: true,
                              minLength: 5,
                              pattern:
                                /[\w]*@*[a-z]*\.*[\w]{5,}(\.)*(com)*(@gmail\.com|@student\.ctu.edu.vn)/g,
                            })}
                          />
                          {errors?.email?.type === "required" && (
                            <p>Email không được để trống !</p>
                          )}
                          {errors?.email?.type === "minLength" && (
                            <p>Email chưa đủ kí tự !</p>
                          )}
                          {errors?.email?.type === "pattern" && (
                            <p>Email chưa đúng định dạng !</p>
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
                          Tiếp tục
                        </button>
                      </form>
                    </div>
                  </LoadingOverlayComponent>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ForgotPassword;
