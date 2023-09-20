import React, { useState, useRef } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function AddBlog() {
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
    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("size", data.size);

    try {
      if (data) {
        await axios
          .post(`/v1/item/create_item`, formData)
          .then((data) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Thêm vật dụng thành công!",
              showConfirmButton: false,
              timer: 1000,
            });

            navigate("/admin/item");
          })
          .catch((e) => {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Thêm vật dụng thất bại!",
              text: "Vui lòng thực hiện lại ! Dữ liệu nhập chưa đủ !",
              showConfirmButton: false,
              timer: 1000,
            });
          });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm vật dụng thất bại!",
          text: "Vui lòng thực hiện lại ! Dữ liệu nhập chưa đủ !",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Thêm vật dụng thất bại!",
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
                  title: <Link to="/admin/item">Vật dụng</Link>,
                },
                {
                  title: "Thêm vật dụng",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Thêm vật dụng</p>
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
                      Thông tin chính vật dụng
                    </h4>
                    <div className="row">
                      <div className="col">
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="name"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Tên vật dụng
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              type="text"
                              id="name"
                              className="form-control form-control-lg"
                              placeholder="Tên vật dụng..."
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("name", {
                                required: true,
                              })}
                            />
                            {errors?.name?.type === "required" && (
                              <p>Không được để trống !</p>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="category"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Danh mục
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="category"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào danh mục vật dụng"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("category", {
                                required: true,
                              })}
                            />
                            {errors?.category?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
                          </div>
                        </div>

                        {/* Kích thước vật dụng */}
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="size"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Kích thước
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              type="text"
                              id="size"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào kích thước vật dụng"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                              {...register("size", {
                                required: true,
                              })}
                            />
                            {errors?.size?.type === "required" && (
                              <p>Không được để trống</p>
                            )}
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
                            htmlFor="service_name"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Hình ảnh vật dụng&nbsp;
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

export default AddBlog;
