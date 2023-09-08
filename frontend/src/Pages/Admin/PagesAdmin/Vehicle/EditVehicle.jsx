import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function EditVehicle() {
  const navigate = useNavigate();
  const [dataVehicle, setDataVehicle] = useState([]);
  const params = useParams();

  //Validation form
  const { handleSubmit } = useForm();

  const [image, setImage] = useState("");

  //Upload Img
  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      // console.log(reader.result); //base64encoded string
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error", error);
    };
  }

  const onSubmit = async () => {
    dataVehicle.image = image;
    const isKeyEmpty = (key) => {
      return (
        dataVehicle[key] === undefined ||
        dataVehicle[key] === null ||
        dataVehicle[key] === ""
      );
    };

    let check = true;

    for (const key in dataVehicle) {
      if (isKeyEmpty(key)) {
        check = false;
        break;
      }
    }
     if (check) {
       await axios
         .put(`/v1/vehicle/update_vehicle/${params.id}`, dataVehicle)
         .then((data) => {
           Swal.fire({
             position: "center",
             icon: "success",
             title: "Sửa phương tiện thành công!",
             showConfirmButton: false,
             timer: 1200,
           });

           console.log(data.data);

           navigate("/admin/vehicle");
         })
         .catch((e) => {
           console.log(e);
           Swal.fire({
             position: "center",
             icon: "error",
             title: "Sửa phương tiện thất bại!",
             text: "Vui lòng thực hiện lại - Dung lượng ảnh quá lớn !",
             showConfirmButton: false,
             timer: 1000,
           });
         });
     } else {
       Swal.fire({
         position: "center",
         icon: "error",
         title: "Sửa phương tiện thất bại!",
         text: "Dữ liệu nhập chưa đủ !",
         showConfirmButton: false,
         timer: 1000,
       });
     }
  };

  const getDataVehicle = async () => {
    const id = params.id;
    await axios.get(`/v1/vehicle/moving_fee/${id}`).then((data) => {
      const dataVehicle = data.data;

      const objectData = {
        name: dataVehicle.vehicle_name,
        brand: dataVehicle.brand,
        capacity: dataVehicle.capacity,
        cago_size: dataVehicle.cago_size,
        suitable_for: dataVehicle.suitable_for,
        image: dataVehicle.image,
        priceFirst10km: dataVehicle.movingFee_id.priceFirst10km,
        priceFrom11to45: dataVehicle.movingFee_id.priceFrom11to45,
        pricePer45km: dataVehicle.movingFee_id.pricePer45km,
        waiting_fee: dataVehicle.movingFee_id.waiting_fee,
        OnewayFloor_loadingFee: dataVehicle.movingFee_id.OnewayFloor_loadingFee,
        Oneway_loadingFee: dataVehicle.movingFee_id.Oneway_loadingFee,
        TwowayFloor_loadingFee: dataVehicle.movingFee_id.TwowayFloor_loadingFee,
        Twoway_loadingFee: dataVehicle.movingFee_id.Twoway_loadingFee,
      };

      setImage(objectData.image);
      setDataVehicle(objectData);
      console.log(dataVehicle);
    });
  };

  useEffect(() => {
    getDataVehicle();
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
                  title: <Link to="/admin/vehicle">Phương tiện</Link>,
                },
                {
                  title: "Sửa phương tiện",
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
                              value={dataVehicle.name}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  name: e.target.value,
                                })
                              }
                              type="text"
                              id="name"
                              className="form-control form-control-lg"
                              placeholder="Tên phương tiện"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                            />
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
                              value={dataVehicle.brand}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  brand: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.capacity}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  capacity: e.target.value,
                                })
                              }
                            />
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
                            accept="image/"
                            type="file"
                            onChange={convertToBase64}
                          />
                          <br />
                          {image === "" || image === null ? (
                            ""
                          ) : (
                            <img
                              width={100}
                              height={100}
                              src={image}
                              alt=""
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
                              value={dataVehicle.cago_size}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  cago_size: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.suitable_for}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  suitable_for: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.priceFirst10km}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  priceFirst10km: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.priceFrom11to45}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  priceFrom11to45: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.pricePer45km}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  pricePer45km: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.waiting_fee}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  waiting_fee: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.TwowayFloor_loadingFee}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  TwowayFloor_loadingFee: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.OnewayFloor_loadingFee}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  OnewayFloor_loadingFee: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.Twoway_loadingFee}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  Twoway_loadingFee: e.target.value,
                                })
                              }
                            />
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
                              value={dataVehicle.Oneway_loadingFee}
                              onChange={(e) =>
                                setDataVehicle({
                                  ...dataVehicle,
                                  Oneway_loadingFee: e.target.value,
                                })
                              }
                            />
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

export default EditVehicle;
