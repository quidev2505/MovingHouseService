import React, { useState } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Transfer } from "antd";
import { mockDataProcess, mockDataBonus } from "./DataService";

import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function AddService() {
  const navigate = useNavigate();

  const oriTargetKeys = mockDataProcess
    .filter((item) => Number(item.key) % 3 > 1)
    .map((item) => item.key);

  const [targetKeys, setTargetKeys] = useState(oriTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleChange = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys);
    // console.log("targetKeys: ", newTargetKeys);
    // console.log("direction: ", direction);
    // console.log("moveKeys: ", moveKeys);
  };
  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    // console.log("sourceSelectedKeys: ", sourceSelectedKeys);
    // console.log("targetSelectedKeys: ", targetSelectedKeys);
  };
  const handleScroll = (direction, e) => {
    // console.log("direction:", direction);
    // console.log("target:", e.target);
  };

  const oriTargetKeysBonus = mockDataBonus
    .filter((item) => Number(item.key) % 3 > 1)
    .map((item) => item.key);

  const [targetKeysBonus, setTargetKeysBonus] = useState(oriTargetKeysBonus);
  const [selectedKeysBonus, setSelectedKeysBonus] = useState([]);

  const handleChangeBonus = (newTargetKeysBonus, direction, moveKeys) => {
    setTargetKeysBonus(newTargetKeysBonus);
  };
  const handleSelectChangeBonus = (
    sourceSelectedKeysBonus,
    targetSelectedKeysBonus
  ) => {
    setSelectedKeysBonus([
      ...sourceSelectedKeysBonus,
      ...targetSelectedKeysBonus,
    ]);
  };
  const handleScrollBonus = (direction, e) => {};

  //Validation form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const onSubmit = async (data) => {
    try {
      if (image && targetKeys && targetKeysBonus) {
        const dataService = {
          name: data.service_name,
          vehicle: data.vehicle_type,
          needPeople: data.need_people,
          distance: data.distance,
          price: data.service_price,
          process: targetKeys,
          bonus: targetKeysBonus,
          image: image,
          warranty_policy: data.warranty_policy,
          suitable_for: data.suitable_for,
        };

        console.log(dataService)

        await axios
          .post(`/v1/service/add_service`, dataService)
          .then((data) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Thêm dịch vụ thành công!",
              text: "Dữ liệu nhập chưa đủ !",
              showConfirmButton: false,
              timer: 1300,
            });

            navigate("/admin/service");
          })
          .catch((e) => {
            console.log(e);
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Thêm dịch vụ thất bại!",
              text: "Vui lòng thực hiện lại !",
              showConfirmButton: false,
              timer: 1000,
            });
          });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm dịch vụ thất bại!",
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
        title: "Thêm dịch vụ thất bại!",
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
                  title: <Link to="/admin/service">Dịch vụ</Link>,
                },
                {
                  title: "Thêm dịch vụ",
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
                <div className="row">
                  <div className="col-5">
                    <h4 style={{ color: "#e88b27" }}>Thông tin chính</h4>
                    <div style={{ marginBottom: "5px" }}>
                      <label
                        htmlFor="service_name"
                        className="label-color"
                        style={{ marginBottom: "5px" }}
                      >
                        Tên dịch vụ
                      </label>
                      <div className="form-outline mb-3 form_input_handle">
                        <input
                          type="text"
                          id="service_name"
                          className="form-control form-control-lg"
                          placeholder="Tên dịch vụ"
                          style={{ fontSize: "17px", borderRadius: "3px" }}
                          {...register("service_name", {
                            required: true,
                          })}
                        />
                        {errors?.service_name?.type === "required" && (
                          <p>Tên dịch vụ không được để trống !</p>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <label
                        htmlFor="vehicle_type"
                        className="label-color"
                        style={{ marginBottom: "5px" }}
                      >
                        Loại xe tải sử dụng
                      </label>
                      <div className="form-outline mb-3  form_input_handle">
                        <input
                          type="text"
                          id="vehicle_type"
                          className="form-control form-control-lg"
                          placeholder="Nhập vào loại xe tải..."
                          style={{ fontSize: "17px", borderRadius: "3px" }}
                          {...register("vehicle_type", {
                            required: true,
                          })}
                        />
                        {errors?.vehicle_type?.type === "required" && (
                          <p>Không được để trống</p>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <label
                        htmlFor="service_name"
                        className="label-color"
                        style={{ marginBottom: "5px" }}
                      >
                        Giá dịch vụ
                      </label>
                      <div className="form-outline mb-3  form_input_handle">
                        <input
                          type="number"
                          id="service_price"
                          className="form-control form-control-lg"
                          placeholder="Nhập vào giá dịch vụ"
                          style={{
                            fontSize: "17px",
                            borderRadius: "3px",
                            width: "fit-content",
                          }}
                          {...register("service_price", {
                            required: true,
                          })}
                        />
                        {errors?.service_price?.type === "required" && (
                          <p>Không được để trống !</p>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <label
                        htmlFor="need_people"
                        className="label-color"
                        style={{ marginBottom: "5px" }}
                      >
                        Số lượng người khuân vác
                      </label>
                      <div className="form-outline mb-3 form_input_handle">
                        <input
                          type="number"
                          id="need_people"
                          className="form-control form-control-lg"
                          placeholder="VD: 1..."
                          style={{
                            fontSize: "17px",
                            borderRadius: "3px",
                            width: "100px",
                          }}
                          {...register("need_people", {
                            required: true,
                          })}
                        />
                        {errors?.need_people?.type === "required" && (
                          <p>Không được để trống !</p>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <label
                        htmlFor="distance"
                        className="label-color"
                        style={{ marginBottom: "5px" }}
                      >
                        Quảng đường áp dụng (KM)
                      </label>
                      <div className="form-outline mb-3  form_input_handle">
                        <input
                          type="text"
                          id="distance"
                          className="form-control form-control-lg"
                          placeholder="Quảng đường áp dụng..."
                          style={{
                            fontSize: "17px",
                            borderRadius: "3px",
                            width: "fit-content",
                          }}
                          {...register("distance", {
                            required: true,
                          })}
                        />
                        {errors?.distance?.type === "required" && (
                          <p>Không được để trống !</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#344767",
                        color: "white",
                        float: "right",
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

                  {/* Thông tin khác */}
                  <div className="col">
                    <h4 style={{ color: "#e88b27" }}>Thông tin khác</h4>
                    {/* Image */}
                    <div>
                      <label
                        htmlFor="service_name"
                        className="label-color"
                        style={{ marginBottom: "5px" }}
                      >
                        Hình ảnh &nbsp;
                      </label>

                      <input
                        accept="image/"
                        type="file"
                        onChange={convertToBase64}
                      />
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

                    <div class="process_add_service">
                      <label
                        htmlFor="process"
                        className="label-color"
                        style={{ marginBottom: "10px", marginTop: "10px" }}
                      >
                        Các công việc trong quy trình
                        <Transfer
                          dataSource={mockDataProcess}
                          titles={["Danh sách", "Đã chọn"]}
                          targetKeys={targetKeys}
                          selectedKeys={selectedKeys}
                          onChange={handleChange}
                          onSelectChange={handleSelectChange}
                          onScroll={handleScroll}
                          render={(item) => item.title}
                          oneWay
                          style={{
                            marginBottom: 16,
                          }}
                        />
                      </label>
                    </div>
                    {/* Bonus */}
                    <div class="bonus_add_service">
                      <label
                        htmlFor="process"
                        className="label-color"
                        style={{ marginBottom: "10px", marginTop: "10px" }}
                      >
                        Các dịch vụ bổ sung
                        <Transfer
                          dataSource={mockDataBonus}
                          titles={["Danh sách", "Đã chọn"]}
                          targetKeys={targetKeysBonus}
                          selectedKeys={selectedKeysBonus}
                          onChange={handleChangeBonus}
                          onSelectChange={handleSelectChangeBonus}
                          onScroll={handleScrollBonus}
                          render={(item) => item.title}
                          oneWay
                          style={{
                            marginBottom: 16,
                          }}
                        />
                      </label>
                    </div>

                    {/* Chính sách bảo hành      */}
                    <div style={{ marginBottom: "5px" }}>
                      <label
                        htmlFor="warranty_policy"
                        className="label-color"
                        style={{ marginBottom: "5px" }}
                      >
                        Chính sách bảo hành
                      </label>
                      <div className="form-outline mb-3  form_input_handle">
                        <input
                          type="text"
                          id="warranty_policy"
                          className="form-control form-control-lg"
                          placeholder="Nhập vào chính sách..."
                          style={{
                            fontSize: "17px",
                            borderRadius: "3px",
                          }}
                          {...register("warranty_policy", {
                            required: true,
                          })}
                        />
                        {errors?.warranty_policy?.type === "required" && (
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
              </form>
            </div>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default AddService;
