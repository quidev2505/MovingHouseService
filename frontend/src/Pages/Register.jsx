import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";
import BackPrevious from "../Components/BackPrevious";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(true);
  const [visible, setVisible] = useState(false);

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
      fullname: data.fullname,
      email: data.email,
      phonenumber: data.phonenumber,
      password: data.password,
    };

    registerUser(newUser, dispatch, navigate);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div classname="container">
          <section style={{ backgroundColor: "#f9f9f9", height: "100%" }}>
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
                      <div
                        className="card-body p-5 text-center"
                        style={{
                          height: "fit-content",
                          padding: "1rem 3rem !important",
                        }}
                      >
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

                        {/* Họ và tên */}
                        <div className="form-outline mb-4  form_input_handle">
                          <input
                            type="text"
                            id="fullname"
                            className="form-control form-control-lg"
                            placeholder="Họ và tên"
                            style={{ fontSize: "17px", borderRadius: "3px" }}
                            {...register("fullname", {
                              required: true,
                              minLength: 12,
                            })}
                          />
                          {errors?.fullname?.type === "required" && (
                            <p>Họ và tên không được để trống !</p>
                          )}
                          {errors?.fullname?.type === "minLength" && (
                            <p>Họ và tên ít nhất 12 kí tự</p>
                          )}
                        </div>

                        {/* Email */}
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

                        {/* Số điện thoại */}
                        <div className="form-outline mb-4  form_input_handle">
                          <input
                            type="text"
                            id="phonenumber"
                            className="form-control form-control-lg"
                            placeholder="Số điện thoại"
                            style={{ fontSize: "17px", borderRadius: "3px" }}
                            {...register("phonenumber", {
                              required: true,
                              minLength: 10,
                              maxLength: 11,
                              pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                            })}
                          />
                          {errors?.phonenumber?.type === "required" && (
                            <p>Số điện thoại không được để trống !</p>
                          )}
                          {errors?.phonenumber?.type === "minLength" && (
                            <p>Số điện thoại ít nhất 10 số !</p>
                          )}
                          {errors?.phonenumber?.type === "maxLength" && (
                            <p>Số điện thoại không quá 10 số !</p>
                          )}
                          {errors?.phonenumber?.type === "pattern" && (
                            <p>Số điện thoại chưa đúng định dạng !</p>
                          )}
                        </div>

                        <div className="input-group mb-3 form-outline mb-4 form_input_handle">
                          <input
                            type="text"
                            id="password"
                            className="form-control form-control-lg"
                            placeholder="Mật khẩu (tối thiểu 8 kí tự)"
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

                        <div style={{ textAlign: "left" }}>
                          Bằng cách nhấp vào Đăng ký bên dưới, bạn đã đọc toàn
                          bộ văn bản và đồng ý với
                          <span style={{ color: "#f16622" }}>
                            &nbsp;Điều khoản & Điều kiện
                          </span>{" "}
                          và
                          <span style={{ color: "#f16622" }}>
                            &nbsp;Chính sách quyền riêng tư.
                          </span>
                        </div>

                        <button
                          className="btn btn-lg"
                          type="submit"
                          style={{
                            height: "54px",
                            width: "100%",
                            backgroundColor: "#f16622",
                            color: "white",
                            marginTop: "20px",
                            borderRadius: "5px",
                            fontSize: "17px",
                            marginBottom: "10px",
                            fontWeight: "500",
                          }}
                        >
                          Đăng ký
                        </button>

                        <p
                          style={{
                            color: "#9297a7",
                            userSelect: "none",
                            textAlign: "center",
                            marginTop: "20px",
                          }}
                        >
                          Đã có tài khoản ?
                          <span style={{ color: "#f16622 " }}>
                            &nbsp;
                            <Link
                              to="/login"
                              style={{
                                textDecoration: "none",
                                color: "#f16622 ",
                              }}
                            >
                              Đăng nhập ngay.
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

export default Register;
