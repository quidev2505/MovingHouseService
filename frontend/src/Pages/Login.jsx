import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import BackPrevious from "../Components/BackPrevious";
import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";
import { FaEye, FaEyeSlash } from "react-icons/fa";

//Oauth Google
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";

// import { useGoogleLogin } from "@react-oauth/google";

//Import Component Chatbot
import ChatBotIcon from "../Components/ChatBotIcon";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [visible, setVisible] = useState(false);

  // const login = useGoogleLogin({
  //   onSuccess: (tokenResponse) => console.log(tokenResponse),
  // });

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

  const onSubmit = (data) => {
    const newUser = {
      email: data.email,
      password: data.password,
    };

    loginUser(newUser, dispatch, navigate);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ChatBotIcon />
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
                      <BackPrevious path="/" />
                      <div className="card-body p-5 text-center">
                        {/* //Img icon */}
                        <img
                          src="./img/logo_new_version.png"
                          alt="anh_logo"
                          style={{
                            width: "194px",
                            height: "176px",
                            objectFit: "cover",
                            marginBottom: "-38px",
                            marginTop: "-41px",
                          }}
                        />
                        <div className="form-outline mb-4  form_input_handle">
                          <input
                            type="text"
                            id="email"
                            className="form-control form-control-lg"
                            placeholder="Email hoặc Số điện thoại"
                            style={{ fontSize: "17px", borderRadius: "3px" }}
                            {...register("email", {
                              required: true,
                              minLength: 5,
                              pattern: /[\w]*@*[a-z]*\.*[\w]{5,}(\.)*(com)*(@gmail\.com|@student\.ctu.edu.vn)/g,
                              // pattern: /[\w]*@*[a-z]*\.*[\w]{5,}(\.)*(com)*(@gmail\.com|@student\.ctu.edu.vn)/g ||
                            })}
                          />
                          {errors?.email?.type === "required" && (
                            <p>Không được để trống !</p>
                          )}
                          {errors?.email?.type === "minLength" && (
                            <p>Chưa đủ kí tự !</p>
                          )}
                          {errors?.email?.type === "pattern" && (
                            <p>Email chưa đúng định dạng !</p>
                          )}
                        </div>
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
                              pattern: /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/,
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
                        {/* //Quên mật khẩu */}
                        <div
                          className="form-check d-flex justify-content-end mb-4"
                          style={{ color: "#f16622", marginTop: "-10px" }}
                        >
                          <Link
                            to="/forgot_password"
                            style={{
                              color: "#f16622",
                              textDecoration: "none",
                              userSelect: "none",
                            }}
                          >
                            Quên mật khẩu ?
                          </Link>
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
                          Đăng nhập
                        </button>
                        {/* <p style={{ color: "#b7c5d6", userSelect: "none" }}>
                          HOẶC
                        </p> */}
                        {/* 
                

                        {/* Login with google */}
                        {/* <div className="loginGoogle">
                          <GoogleOAuthProvider clientId="111676382550-rum66le23duruqii92dv781tf40sd0sb.apps.googleusercontent.com">
                            <GoogleLogin
                              onSuccess={(credentialResponse) => {
                                var decoded = jwt_decode(
                                  credentialResponse.credential
                                );

                                const newUser = {
                                  email: decoded.email,
                                  fullname: decoded.name,
                                  id: decoded.sub,
                                };

                                loginUserWithGoogle(
                                  newUser,
                                  dispatch,
                                  navigate
                                );
                              }}
                              onError={() => {
                                console.log("Login Failed");
                              }}
                            />
                          </GoogleOAuthProvider>
                        </div> */}

                        <p
                          style={{
                            color: "#9297a7",
                            userSelect: "none",
                            marginTop: "20px",
                          }}
                        >
                          Đây là lần đầu tiên bạn sử dụng Fastmove ?
                          <span style={{ color: "#f16622 " }}>
                            &nbsp;
                            <Link
                              to="/register"
                              style={{
                                textDecoration: "none",
                                color: "#f16622 ",
                              }}
                            >
                              Hãy tạo ngay một tài khoản mới.
                            </Link>
                          </span>
                        </p>
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

export default Login;
