import React from "react";
import OtpInput from "react-otp-input";
// import { useForm } from "react-hook-form";
// import BackPrevious from "../Components/BackPrevious";
import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useNavigate } from "react-router-dom";


function VerifyOTP() {
  const [isActive, setIsActive] = useState(true);
  const [otp, setOtp] = useState("");
  const nav = useNavigate();
  let OTP_USER = JSON.parse(localStorage.getItem("otp_user"));
  
  useEffect(() => {
    //Turn off loading
    setIsActive(false);

    //Get from localstorage
    if (!OTP_USER) {
      nav("/forgot_password");
    }
    // eslint-disable-next-line
  }, []);

  const handleVerify = async() => {
    const email_input = OTP_USER;
    const otp_input = otp;

    await axios
      .post("/v1/auth/verify_otp", { email_input, otp_input })
      .then((data) => {
        nav("/change_password");
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "OTP không chính xác",
          text: "Vui lòng nhập lại !",
          showConfirmButton: false,
          timer: 1000,
        });
        console.log(e);
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
                    {/* btn back
                    <BackPrevious path="/forgot_password" /> */}
                    <div className="card-body p-5 text-center">
                      {/* //Img icon */}
                      <img
                        src="./img/logo_main.png"
                        alt="anh_logo"
                        style={{
                          width: "213px",
                          height: "64px",
                          objectFit: "contain",
                          marginBottom: "5px",
                        }}
                      />

                      <h3 style={{ textAlign: "center", marginTop: "17px" }}>
                        Nhập vào mã OTP gồm 6 số
                      </h3>

                      {/* OTP */}
                      <div
                        className="form-outline mb-4  form_input_handle form_otp"
                        style={{
                          justifyContent: "center",
                          display: "flex",
                          marginTop: "20px",
                        }}
                      >
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          className="form-control form-control-lg"
                          numInputs={6}
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => <input {...props} />}
                        />
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
                        onClick={() => handleVerify()}
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
    </>
  );
}

export default VerifyOTP;
