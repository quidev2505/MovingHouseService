import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import LoadingOverlayComponent from "../../../Components/LoadingOverlayComponent";
import { loginAdmin } from "../../../redux/apiRequest";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";

function LoginAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    const newAdmin = {
      username: data.username,
      password: data.password,
    };

    loginAdmin(newAdmin, dispatch, navigate);
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
                      <div className="card-body p-5 text-center">
                        {/* //Img icon */}
                        <div style={{ textAlign: "left" }}>
                          <img
                            src="/img/logo_main.png"
                            alt="anh_logo"
                            style={{
                              width: "105px",
                              height: "58px",
                              objectFit: "contain",
                              margiBottom: "13px",
                              marginTop: "-44px",
                            }}
                          />
                        </div>

                        <h2
                          style={{
                            fontWeight: "600",
                            fontSize: "35px",
                            color: "#e16c27 ",
                            marginBottom:"15px"
                          }}
                        >
                          ADMIN LOGIN
                        </h2>
                        <div className="form-outline mb-4  form_input_handle">
                          <input
                            type="text"
                            id="username"
                            className="form-control form-control-lg"
                            placeholder="Tên đăng nhập"
                            style={{ fontSize: "17px", borderRadius: "3px" }}
                            {...register("username", {
                              required: true,
                              minLength: 5,
                            })}
                          />
                          {errors?.username?.type === "required" && (
                            <p>Tên đăng nhập không được để trống !</p>
                          )}
                          {errors?.username?.type === "minLength" && (
                            <p>Tên đăng nhập chưa đủ kí tự !</p>
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

export default LoginAdmin;
