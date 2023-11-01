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

function EditDriver() {
  const params = useParams();
  const navigate = useNavigate();
  const [gender, setGender] = useState("Nam");
  const [vehicle_type, setVehicleType] = useState("Xe bán tải");
  const [dataVehicle, setDataVehicle] = useState([]);
  const [location_delivery, setLocationDelivery] = useState(
    "TPHCM và tỉnh lân cận"
  );

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

  //Set loại phương tiện
  const handleChangeVehicleType = (value) => {
    setVehicleType(value);
  };

  //Set khu vực giao hang
  const handleChangeLocationDelivery = (value) => {
    setLocationDelivery(value);
  };

  //Get Vehicle Dropdown
  const get_vehicle_dropdown = async () => {
    let data_vehicle = await axios.get(`/v1/vehicle/list_vehicle`);
    let data_list = data_vehicle.data;
    let arr = data_list.map((item, index) => {
      return {
        value: item.vehicle_name,
        label: item.vehicle_name,
      };
    });

    setDataVehicle(arr);
  };

  const [dataDriver, setDataDriver] = useState({});

  const onSubmit = async () => {
    dataDriver.avatar = image;
    const isKeyEmpty = (key) => {
      return (
        dataDriver[key] === undefined ||
        dataDriver[key] === null ||
        dataDriver[key] === ""
      );
    };

    let check = true;
    for (const key in dataDriver) {
      if (isKeyEmpty(key)) {
        console.log(key);
        check = false;
        break;
      }
    }

    //Xử lý ngày tháng
    const date_get = dataDriver.date_of_birth;
    const date_split = date_get.split("-");
    const date_new = `${date_split[2]}-${date_split[1]}-${date_split[0]}`;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("imgURL", imgURL);
    formData.append("img_old", imageOld);
    formData.append("username", dataDriver.username);
    formData.append("profile_code", dataDriver.profile_code);
    formData.append("gender", gender);
    formData.append("citizen_id", dataDriver.citizen_id);
    formData.append("phonenumber", dataDriver.phonenumber);
    formData.append("fullname", dataDriver.fullname);
    formData.append("date_of_birth", date_new);
    formData.append("email", dataDriver.email);
    formData.append("address", dataDriver.address);
    formData.append("license_plate", dataDriver.license_plate);
    formData.append("vehicle_type", vehicle_type);
    formData.append("location_delivery", location_delivery);

    if (check) {
      await axios
        .put(`/v1/driver/update_driver/${dataDriver._id}`, formData)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sửa hồ sơ tài xế thành công!",
            showConfirmButton: false,
            timer: 1200,
          });
          navigate("/admin/driver");
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Sửa hồ sơ tài xế thất bại!",
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

  const get_data_driver = async () => {
    const id = params.id;
    console.log(id);
    await axios
      .get(`/v1/driver/view_detail_driver/${id}`)
      .then((data) => {
        const data_driver = data.data;
        //Xử lý hiển thị ngày
        console.log(data_driver);
        const date_get = data_driver.date_of_birth;
        const date_split = date_get.split("-");
        const date_show = `${date_split[2]}-${date_split[1]}-${date_split[0]}`;

        data_driver.date_of_birth = date_show;

        setDataDriver(data_driver);
        setGender(data_driver.gender);
        setVehicleType(data_driver.vehicle_type);
        setLocationDelivery(data_driver.location_delivery);
        setImage(data_driver.avatar);
        setImageOld(data_driver.avatar);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    get_data_driver();
    get_vehicle_dropdown();
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
                  title: <Link to="/admin/driver">Tài xế</Link>,
                },
                {
                  title: "Sửa hồ sơ tài xế",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Sửa hồ sơ tài xế</p>
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
                              value={dataDriver.username}
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
                              value={dataDriver.profile_code}
                              onChange={(e) =>
                                setDataDriver({
                                  ...dataDriver,
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
                              value={dataDriver.citizen_id}
                              onChange={(e) =>
                                setDataDriver({
                                  ...dataDriver,
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
                              value={dataDriver.phonenumber}
                              onChange={(e) =>
                                setDataDriver({
                                  ...dataDriver,
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
                              value={dataDriver.fullname}
                              onChange={(e) =>
                                setDataDriver({
                                  ...dataDriver,
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
                              value={dataDriver.date_of_birth}
                              onChange={(e) =>
                                setDataDriver({
                                  ...dataDriver,
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
                              value={dataDriver.email}
                              onChange={(e) =>
                                setDataDriver({
                                  ...dataDriver,
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
                              value={dataDriver.address}
                              onChange={(e) =>
                                setDataDriver({
                                  ...dataDriver,
                                  address: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="vehicle_type"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Loại phương tiện
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <Select
                              value={vehicle_type}
                              defaultValue={vehicle_type}
                              style={{
                                width: 200,
                                display: "flex",
                                alignItems: "center",
                              }}
                              onChange={handleChangeVehicleType}
                              options={dataVehicle}
                            />
                          </div>

                          <div style={{ marginBottom: "5px" }}>
                            <label
                              htmlFor="license_plate"
                              className="label-color"
                              style={{ marginBottom: "5px" }}
                            >
                              Biển số xe
                            </label>
                            <div className="form-outline mb-3  form_input_handle">
                              <input
                                type="text"
                                id="license_plate"
                                className="form-control form-control-lg"
                                placeholder="Nhập vào biển số"
                                style={{
                                  fontSize: "17px",
                                  borderRadius: "3px",
                                }}
                                value={dataDriver.license_plate}
                                onChange={(e) =>
                                  setDataDriver({
                                    ...dataDriver,
                                    license_plate: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="location_delivery"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Khu vực giao hàng
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <Select
                              value={location_delivery}
                              defaultValue={location_delivery}
                              style={{
                                width: 200,
                                display: "flex",
                                alignItems: "center",
                              }}
                              onChange={handleChangeLocationDelivery}
                              options={[
                                {
                                  value: "TPHCM và tỉnh lân cận",
                                  label: "TPHCM và tỉnh lân cận",
                                },
                                {
                                  value: "Hà Nội và tỉnh lân cận",
                                  label: "Hà Nội và tỉnh lân cận",
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

export default EditDriver;
