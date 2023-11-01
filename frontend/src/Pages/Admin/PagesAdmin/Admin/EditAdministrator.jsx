import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Select } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function EditAdministrator() {
  const params = useParams();
  const navigate = useNavigate();
  const [gender, setGender] = useState("");

  //Validation form
  const { handleSubmit } = useForm();

  const [imgURL, setImgURL] = useState(""); //Link hình ảnh
  const [image, setImage] = useState("");
  const [imageOld, setImageOld] = useState("");

  // Upload Img
  function uploadImg(e) {
    setImage(e.target.files[0]);
  }

  //Set giới tính
  const handleChange = (value) => {
    setGender(value);
  };

  const [dataAdmin, setDataAdmin] = useState({});

  const onSubmit = async () => {
    dataAdmin.avatar = image;
    const isKeyEmpty = (key) => {
      return (
        dataAdmin[key] === undefined ||
        dataAdmin[key] === null ||
        dataAdmin[key] === ""
      );
    };
    let check = true;
    for (const key in dataAdmin) {
      if (isKeyEmpty(key)) {
        console.log(key);
        check = false;
        break;
      }
    }

    //Xử lý ngày tháng
    const date_get = dataAdmin.date_of_birth;
    const date_split = date_get.split("-");
    const date_new = `${date_split[2]}-${date_split[1]}-${date_split[0]}`;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("imgURL", imgURL);
    formData.append("img_old", imageOld);
    formData.append("username", dataAdmin.username);
    formData.append("profile_code", dataAdmin.profile_code);
    formData.append("gender", gender);
    formData.append("citizen_id", dataAdmin.citizen_id);
    formData.append("phonenumber", dataAdmin.phonenumber);
    formData.append("fullname", dataAdmin.fullname);
    formData.append("date_of_birth", date_new);
    formData.append("email", dataAdmin.email);
    formData.append("address", dataAdmin.address);
    if (check) {
      await axios
        .put(`/v1/admin/update_admin/${dataAdmin._id}`, formData)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sửa hồ sơ quản trị viên thành công!",
            showConfirmButton: false,
            timer: 1200,
          });
          navigate("/admin/administrator");
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Sửa hồ sơ quản trị viên thất bại!",
            showConfirmButton: false,
            timer: 1200,
          });
        });
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Dữ liệu còn thiếu",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  const get_data_admin = async () => {
    const id = params.id;

    await axios
      .get(`/v1/admin/view_detail_admin/${id}`)
      .then((data) => {
        const data_admin = data.data;

        //Xử lý hiển thị ngày
        const date_get = data_admin.date_of_birth;
        const date_split = date_get.split("-");
        const date_show = `${date_split[2]}-${date_split[1]}-${date_split[0]}`;

        data_admin.date_of_birth = date_show;

        setDataAdmin(data_admin);
        setGender(data_admin.gender);

        setImage(data_admin.avatar);
        setImageOld(data_admin.avatar);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    get_data_admin();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <LayoutAdmin>
        <div className="driver_edit_admin">
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
                  title: "Sửa hồ sơ quản trị viên",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Sửa hồ sơ quản trị viên</p>
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
                              value={dataAdmin.username}
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
                            marginTop: "120px",
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
                              value={dataAdmin.profile_code}
                              onChange={(e) =>
                                setDataAdmin({
                                  ...dataAdmin,
                                  profile_code: e.target.value,
                                })
                              }
                            />
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
                              value={dataAdmin.citizen_id}
                              onChange={(e) =>
                                setDataAdmin({
                                  ...dataAdmin,
                                  citizen_id: e.target.value,
                                })
                              }
                            />
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
                              value={dataAdmin.phonenumber}
                              onChange={(e) =>
                                setDataAdmin({
                                  ...dataAdmin,
                                  phonenumber: e.target.value,
                                })
                              }
                            />
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
                              value={gender}
                              defaultValue={gender}
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
                                src={
                                  typeof image === "object"
                                    ? URL.createObjectURL(image)
                                    : image
                                }
                                width={100}
                                height={100}
                                alt="mage"
                                style={{ objectFit: "contain" }}
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
                              placeholder="Nhập vào họ và tên tài xế"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              value={dataAdmin.fullname}
                              onChange={(e) =>
                                setDataAdmin({
                                  ...dataAdmin,
                                  fullname: e.target.value,
                                })
                              }
                            />
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
                              value={dataAdmin.date_of_birth}
                              onChange={(e) =>
                                setDataAdmin({
                                  ...dataAdmin,
                                  date_of_birth: e.target.value,
                                })
                              }
                            />
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
                              value={dataAdmin.email}
                              onChange={(e) =>
                                setDataAdmin({
                                  ...dataAdmin,
                                  email: e.target.value,
                                })
                              }
                            />
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
                              value={dataAdmin.address}
                              onChange={(e) =>
                                setDataAdmin({
                                  ...dataAdmin,
                                  address: e.target.value,
                                })
                              }
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

export default EditAdministrator;
