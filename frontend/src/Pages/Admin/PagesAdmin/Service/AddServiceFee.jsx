import React, { useState } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Select } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function AddServiceFee() {
  const navigate = useNavigate();
  const [unit, setUnit] = useState("Không có");

  const handleChange = (value) => {
    setUnit(value);
  };

  //Validation form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const dataService = {
        fee_name: data.service_fee_name,
        price: data.service_fee_price,
        unit: unit,
      };

      await axios
        .post(`/v1/service_fee/add_service_fee`, dataService)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Thêm chi phí thành công!",
            showConfirmButton: false,
            timer: 1200,
          });
          navigate("/admin/service_fee");
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Thêm chi phí thất bại!",
            text: "Vui lòng thực hiện lại !",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    } catch (e) {
      console.log(e);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Thêm chi phí thất bại!",
        text: "Vui lòng thực hiện lại !",
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
                  title: <Link to="/admin/service_fee">Chi phí</Link>,
                },
                {
                  title: "Thêm chi phí",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Thêm chi phí</p>
            </TopCssContent>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div>
                    <h4 style={{ color: "#e88b27" }}>Thông tin chính</h4>
                    <div style={{ marginBottom: "5px" }}>
                      <label
                        htmlFor="service_fee_name"
                        className="label-color"
                        style={{ marginBottom: "5px" }}
                      >
                        Tên chi phí
                      </label>
                      <div className="form-outline mb-3 form_input_handle">
                        <input
                          type="text"
                          id="service_fee_name"
                          className="form-control form-control-lg"
                          placeholder="Tên chi phí"
                          style={{ fontSize: "17px", borderRadius: "3px" }}
                          {...register("service_fee_name", {
                            required: true,
                          })}
                        />
                        {errors?.service_fee_name?.type === "required" && (
                          <p>Tên chi phí không được để trống !</p>
                        )}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div
                        style={{ marginBottom: "5px", marginRight: "100px" }}
                      >
                        <label
                          htmlFor="service_fee_price"
                          className="label-color"
                          style={{ marginBottom: "5px" }}
                        >
                          Giá tiền
                        </label>
                        <div className="form-outline mb-3  form_input_handle">
                          <input
                            type="number"
                            id="service_fee_price"
                            className="form-control form-control-lg"
                            placeholder="Nhập vào giá tiền"
                            style={{
                              fontSize: "17px",
                              borderRadius: "3px",
                              width: "fit-content",
                            }}
                            {...register("service_fee_price", {
                              required: true,
                            })}
                          />
                          {errors?.service_fee_price?.type === "required" && (
                            <p>Không được để trống !</p>
                          )}
                        </div>
                      </div>
                      <div style={{ marginBottom: "5px" }}>
                        <label
                          htmlFor="unit"
                          className="label-color"
                          style={{ marginBottom: "5px" }}
                        >
                          Đơn vị
                        </label>
                        <div className="form-outline mb-3 form_input_handle">
                          <Select
                            defaultValue="Không có"
                            style={{
                              width: 200,
                            }}
                            onChange={handleChange}
                            options={[
                              {
                                value: "Thùng",
                                label: "Thùng",
                              },
                              {
                                value: "Hộp",
                                label: "Hộp",
                              },
                              {
                                value: "Lon",
                                label: "Lon",
                              },
                              {
                                value: "Miếng",
                                label: "Miếng",
                              },
                              {
                                value: "Cuộn",
                                label: "Cuộn",
                              },
                              {
                                value: "Giờ",
                                label: "Giờ",
                              },
                              {
                                value: "Tủ",
                                label: "Tủ",
                              },
                              {
                                value: "Km",
                                label: "Km",
                              },
                              {
                                value: "Ca",
                                label: "Ca",
                              },
                              {
                                value: "Lượt",
                                label: "Lượt",
                              },
                              {
                                value: "Người",
                                label: "Người",
                              },
                              {
                                value: "Món",
                                label: "Món",
                              },
                              {
                                value: "Không có",
                                label: "Không có",
                              },
                            ]}
                          />
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

export default AddServiceFee;
