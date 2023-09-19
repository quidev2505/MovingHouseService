import React, { useState } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function AddVehicle() {
  const navigate = useNavigate();

  //Validation form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [image, setImage] = useState("");

  // Upload Img
  function uploadImg(e) {
    setImage(e.target.files[0]);
  }

  const onSubmit = async (data) => {
    try {
      if (image) {
        const dataVehicle = {
          name: data.name,
          brand: data.brand,
          capacity: data.capacity,
          moving_ban_time: data.moving_ban_time,
          cago_size: data.cago_size,
          suitable_for: data.suitable_for,
          image: image,
          priceFirst10km: data.priceFirst10km,
          priceFrom11to45: data.priceFrom11to45,
          pricePer45km: data.pricePer45km,
          waiting_fee: data.waiting_fee,
          OnewayFloor_loadingFee: data.OnewayFloor_loadingFee,
          Oneway_loadingFee: data.Oneway_loadingFee,
          TwowayFloor_loadingFee: data.TwowayFloor_loadingFee,
          Twoway_loadingFee: data.Twoway_loadingFee,
        };

        const formData = new FormData();
        formData.append("file", image);
        formData.append("name", data.name);
        formData.append("brand", data.brand);
        formData.append("capacity", data.capacity);
        formData.append("moving_ban_time", data.moving_ban_time);
        formData.append("cago_size", data.cago_size);
        formData.append("suitable_for", data.suitable_for);
        formData.append("priceFirst10km", data.priceFirst10km);
        formData.append("priceFrom11to45", data.priceFrom11to45);
        formData.append("pricePer45km", data.pricePer45km);
        formData.append("waiting_fee", data.waiting_fee);
        formData.append("OnewayFloor_loadingFee", data.OnewayFloor_loadingFee);
        formData.append("Oneway_loadingFee", data.Oneway_loadingFee);
        formData.append("TwowayFloor_loadingFee", data.TwowayFloor_loadingFee);
        formData.append("Twoway_loadingFee", data.OnewayFloor_loadingFee);

        await axios
          .post(`/v1/vehicle/add_vehicle`, formData)
          .then((data) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Thêm phương tiện thành công!",
              showConfirmButton: false,
              timer: 1200,
            });
            navigate("/admin/vehicle");
          })
          .catch((e) => {
            console.log(e);
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Thêm  phương tiện thất bại!",
              text: "Vui lòng thực hiện lại !",
              showConfirmButton: false,
              timer: 1000,
            });
          });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm phương tiện thất bại!",
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
        title: "Thêm phương tiện thất bại!",
        text: "Vui lòng thực hiện lại ! - Có thể dung lượng ảnh quá lớn !",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return (
    <>
      <LayoutAdmin>
        <div className="service_add_admin">
          <div>
            <Breadcrumb
              routes={[
                {
                  title: "Admin",
                },
                {
                  title: <Link to="/admin/vehicle">Phương tiện</Link>,
                },
                {
                  title: "Thêm phương tiện",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Thêm dịch vụ</p>
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
                      Thông tin chính
                    </h4>
                    <div className="row">
                      <div className="col">
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="name"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Tên phương tiện
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              type="text"
                              id="name"
                              className="form-control form-control-lg"
                              placeholder="Tên phương tiện"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("name", {
                                required: true,
                              })}
                            />
                            {errors?.name?.type === "required" && (
                              <p>Tên phương tiện không được để trống !</p>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="brand"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Thương hiệu xe
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="brand"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào thương hiệu xe"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("brand", {
                                required: true,
                              })}
                            />
                            {errors?.brand?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="capacity"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Trọng lượng tối đa
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="capacity"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào giá dịch vụ"
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                                width: "fit-content",
                              }}
                              {...register("capacity", {
                                required: true,
                              })}
                            />
                            {errors?.capacity?.type === "required" && (
                              <p>Không được để trống !</p>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="moving_ban_time"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Giờ cấm tải
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="moving_ban_time"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào giá giờ cấm tải"
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                                width: "fit-content",
                              }}
                              {...register("moving_ban_time", {
                                required: true,
                              })}
                            />
                            {errors?.moving_ban_time?.type === "required" && (
                              <p>Không được để trống !</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        {/* Image */}
                        <div style={{ marginBottom: "28px" }}>
                          <label
                            htmlFor="service_name"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Hình ảnh phương tiện&nbsp;
                          </label>
                          <br />
                          <input
                            accept="image/*"
                            type="file"
                            onChange={uploadImg}
                          />
                          <br />
                          {image && (
                            <img
                              src={URL.createObjectURL(image)}
                              width={100}
                              height={100}
                              alt="Image"
                              style={{ objectFit: "contain" }}
                            />
                          )}
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="cago_size"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Kích cỡ hàng hóa tối đa
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              type="text"
                              id="cago_size"
                              className="form-control form-control-lg"
                              placeholder="VD: 1.2m x 1m x 1.2m..."
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                                width: "fit-content",
                              }}
                              {...register("cago_size", {
                                required: true,
                              })}
                            />
                            {errors?.cago_size?.type === "required" && (
                              <p>Không được để trống !</p>
                            )}
                          </div>
                        </div>

                        {/* Phù hợp cho */}
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="suitable_for"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Phù hợp
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="suitable_for"
                              className="form-control form-control-lg"
                              placeholder="Phù hợp với loại nào..."
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                              }}
                              {...register("suitable_for", {
                                required: true,
                              })}
                            />
                            {errors?.suitable_for?.type === "required" && (
                              <p>Không được để trống !</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phí di chuyển phương tiện*/}
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
                      Phí di chuyển phương tiện
                    </h4>

                    <div className="row">
                      <div className="col">
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="priceFirst10km"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Giá cước 10 km ban đầu
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              type="number"
                              id="priceFirst10km"
                              className="form-control form-control-lg"
                              placeholder="  Giá cước 10 km ban đầu"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("priceFirst10km", {
                                required: true,
                              })}
                            />
                            {errors?.priceFirst10km?.type === "required" && (
                              <p>Tên phương tiện không được để trống !</p>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="priceFrom11to45"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Từ 11km đến 45km
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="number"
                              id="priceFrom11to45"
                              className="form-control form-control-lg"
                              placeholder="Từ 11km đến 45km"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("priceFrom11to45", {
                                required: true,
                              })}
                            />
                            {errors?.priceFrom11to45?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="pricePer45km"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Từ 45km trở lên
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="Number"
                              id="pricePer45km"
                              className="form-control form-control-lg"
                              placeholder=" Từ 45km trở lên"
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                                width: "fit-content",
                              }}
                              {...register("pricePer45km", {
                                required: true,
                              })}
                            />
                            {errors?.pricePer45km?.type === "required" && (
                              <p>Không được để trống !</p>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="waiting_fee"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Phí chờ / 30 phút
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="Number"
                              id="waiting_fee"
                              className="form-control form-control-lg"
                              placeholder="
                            Phí chờ"
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                                width: "fit-content",
                              }}
                              {...register("waiting_fee", {
                                required: true,
                              })}
                            />
                            {errors?.waiting_fee?.type === "required" && (
                              <p>Không được để trống !</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="TwowayFloor_loadingFee"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Phí bốc xếp tầng lầu 2 chiều
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              type="Number"
                              id="TwowayFloor_loadingFee"
                              className="form-control form-control-lg"
                              placeholder=" Phí bốc xếp tầng lầu 2 chiều"
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                                width: "100%",
                              }}
                              {...register("TwowayFloor_loadingFee", {
                                required: true,
                              })}
                            />
                            {errors?.TwowayFloor_loadingFee?.type ===
                              "required" && <p>Không được để trống !</p>}
                          </div>
                        </div>

                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="OnewayFloor_loadingFee"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Phí bốc xếp tầng lầu 1 chiều
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              type="Number"
                              id="OnewayFloor_loadingFee"
                              className="form-control form-control-lg"
                              placeholder="Phí bốc xếp tầng lầu 1 chiều"
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                                width: "100%",
                              }}
                              {...register("OnewayFloor_loadingFee", {
                                required: true,
                              })}
                            />
                            {errors?.OnewayFloor_loadingFee?.type ===
                              "required" && <p>Không được để trống !</p>}
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="Twoway_loadingFee"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Phí bốc xếp tầng trệt 2 chiều
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              type="number"
                              id="Twoway_loadingFee"
                              className="form-control form-control-lg"
                              placeholder=" Phí bốc xếp tầng trệt 2 chiều"
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                                width: "100%",
                              }}
                              {...register("Twoway_loadingFee", {
                                required: true,
                              })}
                            />
                            {errors?.Twoway_loadingFee?.type === "required" && (
                              <p>Không được để trống !</p>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="Oneway_loadingFee"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Phí bốc xếp tầng trệt 1 chiều
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              type="number"
                              id="Oneway_loadingFee"
                              className="form-control form-control-lg"
                              placeholder=" Phí bốc xếp tầng trệt 1 chiều"
                              style={{
                                fontSize: "17px",
                                borderRadius: "3px",
                                width: "100%",
                              }}
                              {...register("Oneway_loadingFee", {
                                required: true,
                              })}
                            />
                            {errors?.Oneway_loadingFee?.type === "required" && (
                              <p>Không được để trống !</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#344767",
                        color: "white",
                        float: "left",
                        marginBottom: "12px",
                        width: "fit-content",
                        height: "50px",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                    >
                      Xác nhận
                    </button>
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

export default AddVehicle;
