import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Select } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function AddAdministrator() {
  const navigate = useNavigate();
  const [gender, setGender] = useState("Nam");
  const [department, setDepartment] = useState("Nhân viên");

  //Tạo ra tên đăng nhập và mật khẩu ngẫu nhiên
  const [createAccountRandom, setCreateAccountRandom] = useState({});

  //Set giới tính
  const handleChange = (value) => {
    setGender(value);
  };

  //Set bộ phận phòng ban
  const handleChangeDepartment = (value) => {
    setDepartment(value);
  };

  //Tạo mật khẩu ngẫu nhiên
  function generateRandomPassword() {
    // Tạo mảng gồm 26 chữ cái và 10 số
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // Tạo mật khẩu gồm 4 kí tự và 2 số
    let password = "";
    for (let i = 0; i < 6; i++) {
      if (i < 4) {
        password += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      } else {
        password += String(Math.floor(Math.random() * 10));
      }
    }

    return password;
  }

  //Tạo tài khoản và mật khẩu ngẫu nhiên
  const get_account_admin = async () => {
    try {
      let data_account = await axios.get(`/v1/admin/show_all_admin`);
      let index_dataAccount = Number(data_account.data.length + 1);

      //Tạo ra tên đăng nhập
      const user_name_create = "QT399900" + index_dataAccount;

      // Tạo và in mật khẩu
      const password = generateRandomPassword();

      if (user_name_create && password) {
        const ob_create_random_account = {
          username: user_name_create,
          password: password,
        };

        setCreateAccountRandom(ob_create_random_account);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    get_account_admin(); //Tạo tên đăng nhập và mật khẩu ngẫu nhiên
  }, []);

  //Validation form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [image, setImage] = useState("");
  const [imgURL, setImgURL] = useState(""); //Link hình ảnh

  // Upload Img
  function uploadImg(e) {
    setImage(e.target.files[0]);
  }

  const onSubmit = async (data) => {
    try {
      if (image || imgURL !== "") {
        //Xử lý ngày tháng
        const date_get = data.date_of_birth;
        const date_split = date_get.split("-");
        const date_new = `${date_split[2]}-${date_split[1]}-${date_split[0]}`;

        const formData = new FormData();
        formData.append("file", image);
        formData.append("imgURL", imgURL);
        formData.append("username", createAccountRandom.username);
        formData.append("password", createAccountRandom.password);
        formData.append("profile_code", data.profile_code);
        formData.append("gender", gender);
        formData.append("citizen_id", data.citizen_id);
        formData.append("phonenumber", data.phonenumber);
        formData.append("fullname", data.fullname);
        formData.append("date_of_birth", date_new);
        formData.append("email", data.email);
        formData.append("address", data.address);
        formData.append("department", department);
        await axios
          .post(`/v1/admin/create_admin`, formData)
          .then((data) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Thêm hồ sơ quản trị viên thành công!",
              showConfirmButton: false,
              timer: 1200,
            });
            navigate("/admin/administrator");
          })
          .catch((e) => {
            console.log(e);
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Thêm hồ sơ quản trị viên thất bại!",
              text: "Vui lòng thực hiện lại !",
              showConfirmButton: false,
              timer: 1000,
            });
          });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm hồ sơ quản trị viên thất bại!",
          text: "Dữ liệu nhập chưa đủ !",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Thêm hồ sơ quản trị viên thất bại!",
        text: "Vui lòng thực hiện lại ! - Có thể dung lượng ảnh quá lớn !",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return (
    <>
      <LayoutAdmin>
        <div className="driver_add_admin">
          <div>
            <Breadcrumb
              routes={[
                {
                  title: "Admin",
                },
                {
                  title: <Link to="/admin/administrator">Quản trị viên</Link>,
                },
                {
                  title: "Thêm tài khoản quản trị viên",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Thêm tài khoản quản trị viên</p>
            </TopCssContent>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex" style={{ flexDirection: "column" }}>
                  <div
                    style={{
                      border: "1px solid #ed883b",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      padding: "10px",
                    }}
                  >
                    <h4
                      style={{
                        color: "white",
                        width: "fit-content",
                        backgroundColor: "#ed883b",
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                    >
                      Thông tin tài khoản
                    </h4>
                    <div className="row">
                      <div className="col">
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="username"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Tên đăng nhập
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              type="text"
                              id="username"
                              value={createAccountRandom.username}
                              className="form-control form-control-lg"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              disabled
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="password"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Mật khẩu
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="password"
                              value={createAccountRandom.password}
                              className="form-control form-control-lg"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              disabled
                            />
                          </div>
                        </div>

                        <h4
                          style={{
                            color: "white",
                            width: "fit-content",
                            backgroundColor: "#ed883b",
                            borderRadius: "10px",
                            padding: "10px",
                          }}
                        >
                          Thông tin hồ sơ
                        </h4>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="profile_code"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Mã hồ sơ
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="profile_code"
                              maxLength={10}
                              className="form-control form-control-lg"
                              placeholder="Nhập vào mã hồ sơ"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("profile_code", {
                                required: true,
                              })}
                            />
                            {errors?.profile_code?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="citizen_id"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            CCCD/CMND
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="citizen_id"
                              maxLength={12}
                              className="form-control form-control-lg"
                              placeholder="Nhập vào căn cước công dân hoặc chứng minh thư"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("citizen_id", {
                                required: true,
                              })}
                            />
                            {errors?.citizen_id?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="phonenumber"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Số điện thoại
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              minLength={10}
                              maxLength={11}
                              id="phonenumber"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào số điện thoại"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("phonenumber", {
                                required: true,
                              })}
                            />
                            {errors?.phonenumber?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="gender"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Giới tính
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <Select
                              defaultValue="Nam"
                              style={{
                                width: 200,
                                display: "flex",
                                alignItems: "center",
                              }}
                              onChange={handleChange}
                              options={[
                                {
                                  value: "Nam",
                                  label: "Nam",
                                },
                                {
                                  value: "Nữ",
                                  label: "Nữ",
                                },
                                {
                                  value: "Khác",
                                  label: "Khác",
                                },
                              ]}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          style={{
                            backgroundColor: "#344767",
                            color: "white",
                            float: "left",
                            marginBottom: "12px",
                            marginTop: "20px",
                            width: "fit-content",
                            height: "50px",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                        >
                          Xác nhận
                        </button>
                      </div>
                      <div className="col">
                        {/* Image */}
                        <div style={{ marginBottom: "28px" }}>
                          <label
                            htmlFor="avatar"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Ảnh đại diện&nbsp;
                          </label>
                          <br />
                          <div className="d-flex">
                            <input
                              accept="image/*"
                              type="file"
                              onChange={uploadImg}
                            />

                            {image && (
                              <img
                                src={URL.createObjectURL(image)}
                                width={100}
                                height={100}
                                alt="Image"
                                style={{
                                  objectFit: "contain",
                                  marginTop: "-16px",
                                }}
                              />
                            )}
                          </div>

                          <input
                            type="text"
                            value={imgURL}
                            onChange={(e) => setImgURL(e.target.value)}
                            placeholder="Hoặc nhập đường dẫn hình ảnh vào đây"
                            style={{
                              marginTop: "10px",
                              borderRadius: "5px",
                              padding: "5px",
                              width: "500px",
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: "74px" }}></div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="fullname"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Họ và tên
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="fullname"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào họ và tên quản trị viên"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("fullname", {
                                required: true,
                              })}
                            />
                            {errors?.fullname?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="date_of_birth"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Ngày sinh
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="date"
                              name="dob"
                              pattern="dd/mm/yyyy"
                              placeholder="dd/mm/yyyy"
                              id="date_of_birth"
                              className="form-control form-control-lg"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("date_of_birth", {
                                required: true,
                              })}
                            />
                            {errors?.date_of_birth?.type === "required" && (
                              <p>Không được để trống</p>
                            )}{" "}
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="email"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Email
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="email"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào Email"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("email", {
                                required: true,
                              })}
                            />
                            {errors?.email?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="address"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Địa chỉ thường trú
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="address"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào địa chỉ thường trú"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("address", {
                                required: true,
                              })}
                            />
                            {errors?.address?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="department"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Thuộc bộ phận
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <Select
                              defaultValue="Nhân viên"
                              style={{
                                width: 200,
                                display: "flex",
                                alignItems: "center",
                              }}
                              onChange={handleChangeDepartment}
                              options={[
                                {
                                  value: "Nhân sự",
                                  label: "Nhân sự",
                                },
                                {
                                  value: "Quản lý",
                                  label: "Quản lý",
                                },
                                {
                                  value: "Nhân viên",
                                  label: "Nhân viên",
                                },
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default AddAdministrator;
