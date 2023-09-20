import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Select } from "antd";

import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function EditServiceFee() {
  const navigate = useNavigate();

  const [dataService, setDataService] = useState({});

  //Validation form
  const { handleSubmit } = useForm();

  const [unit, setUnit] = useState("");

  const handleChange = (value) => {
    setUnit(value);
  };

  const params = useParams();

  const onSubmit = async () => {
    try {
      dataService.unit = unit;
      await axios
        .put(`/v1/service_fee/update_service_fee/${params.id}`, dataService)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sửa chi phí thành công!",
            showConfirmButton: false,
            timer: 1200,
          });

          console.log(data.data);

          navigate("/admin/service_fee");
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Sửa chi phí thất bại!",
            text: "Vui lòng thực hiện lại",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    } catch (e) {
      console.log(e);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Sửa chi phí thất bại!",
        text: "Vui lòng thực hiện lại",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  const getDetail_service = async () => {
    const id = params.id;
    await axios
      .get(`/v1/service_fee/list_service_fee/${id}`)
      .then((data) => {
        const data_detail_service = data.data;

        const object_data = {
          fee_name: data_detail_service.fee_name,
          price: data_detail_service.price,
          unit: data_detail_service.unit,
        };

        setDataService(object_data);
        setUnit(object_data.unit);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getDetail_service();
  }, []);

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
                  title: "Sửa chi phí",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Sửa chi phí</p>
            </TopCssContent>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div>
                    <h4 style={{ color: "#e88b27" }}>Thông tin chính</h4>
                    <div style={{ marginBottom: "5px" }}>
                      <label
                        htmlFor="fee_name"
                        className="label-color"
                        style={{ marginBottom: "5px" }}
                      >
                        Tên chi phí
                      </label>
                      <div className="form-outline mb-3 form_input_handle">
                        <input
                          type="text"
                          id="fee_name"
                          className="form-control form-control-lg"
                          placeholder="Tên chi phí"
                          style={{ fontSize: "17px", borderRadius: "3px" }}
                          value={dataService.fee_name}
                          onChange={(e) =>
                            setDataService({
                              ...dataService,
                              fee_name: e.target.value,
                            })
                          }
                        />
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
                            id="price"
                            className="form-control form-control-lg"
                            placeholder="Nhập vào giá tiền"
                            style={{
                              fontSize: "17px",
                              borderRadius: "3px",
                              width: "fit-content",
                            }}
                            value={dataService.price}
                            onChange={(e) =>
                              setDataService({
                                ...dataService,
                                price: e.target.value,
                              })
                            }
                          />
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
                            value={unit}
                            defaultValue={dataService.unit}
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

export default EditServiceFee;
