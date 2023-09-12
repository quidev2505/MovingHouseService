import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Transfer } from "antd";
import { mockDataProcess, mockDataBonus } from "./DataService";

import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function EditService() {
  const navigate = useNavigate();

  // const oriTargetKeys = mockDataProcess
  //   .filter((item) => Number(item.key) % 3 > 1)
  //   .map((item) => item.key);

  const [targetKeys, setTargetKeys] = useState([]);
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

  // const oriTargetKeysBonus = mockDataBonus
  //   .filter((item) => Number(item.key) % 3 > 1)
  //   .map((item) => item.key);

  const [targetKeysBonus, setTargetKeysBonus] = useState([]);
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

  const [dataService, setDataService] = useState({});

  //Validation form
  const { handleSubmit } = useForm();

  const [image, setImage] = useState("");

  // Upload Img
  function uploadImg(e) {
    setImage(e.target.files[0]);
  }

  const params = useParams();

  const onSubmit = async () => {
    const arrProcess = [];
    const arrBonus = [];

    targetKeys.forEach((item, index) => {
      mockDataProcess.forEach((item1, index) => {
        if (item === item1.key) {
          arrProcess.push(item1.title);
        }
      });
    });

    dataService.process = arrProcess;

    targetKeysBonus.forEach((item, index) => {
      mockDataBonus.forEach((item1, index) => {
        if (item === item1.key) {
          arrBonus.push(item1.title);
        }
      });
    });

    dataService.bonus = arrBonus;
    dataService.image = image;
    // setDataService({
    //   ...dataService,
    //   image: image,
    // });

    const isKeyEmpty = (key) => {
      return (
        dataService[key] === undefined ||
        dataService[key] === null ||
        dataService[key] === ""
      );
    };

    let check = true;

    for (const key in dataService) {
      if (isKeyEmpty(key)) {
        check = false;
        break;
      }
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", dataService.name);
    formData.append("vehicle", dataService.vehicle);
    formData.append("needPeople", dataService.needPeople);
    formData.append("distance", dataService.distance);
    formData.append("price", dataService.price);
    formData.append("process", arrProcess);
    formData.append("bonus", arrBonus);
    formData.append("warranty_policy", dataService.warranty_policy);
    formData.append("suitable_for", dataService.suitable_for);

    if (check) {
      await axios
        .put(`/v1/service/update_service/${params.id}`, formData)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sửa dịch vụ thành công!",
            showConfirmButton: false,
            timer: 1200,
          });

          console.log(data.data);

          navigate("/admin/service");
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Sửa dịch vụ thất bại!",
            text: "Vui lòng thực hiện lại - Dung lượng ảnh quá lớn !",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Sửa dịch vụ thất bại!",
        text: "Dữ liệu nhập chưa đủ !",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  const getDetail_service = async () => {
    const id = params.id;
    await axios
      .get(`/v1/service/list_service/${id}`)
      .then((data) => {
        const data_detail_service = data.data;
        const object_data = {
          name: data_detail_service.name,
          image: data_detail_service.image,
          vehicle: data_detail_service.vehicle,
          needPeople: data_detail_service.needPeople,
          distance: data_detail_service.distance,
          price: data_detail_service.price,
          status: data_detail_service.status,
          process: data_detail_service.process,
          bonus: data_detail_service.bonus,
          warranty_policy: data_detail_service.warranty_policy,
          suitable_for: data_detail_service.suitable_for,
        };

        // setTargetKeys(1)

        //  targetKeys.forEach((item, index) => {
        //    mockDataProcess.forEach((item1, index) => {
        //      if (item === item1.key) {
        //        arrProcess.push(item1.title);
        //      }
        //    });
        //  });

        const arrProcessKey = [];
        const arrBonusKey = [];

        object_data.process.forEach((item, index) => {
          mockDataProcess.forEach((item1, index) => {
            if (item === item1.title) {
              arrProcessKey.push(item1.key);
            }
          });
        });

        object_data.bonus.forEach((item, index) => {
          mockDataBonus.forEach((item1, index) => {
            if (item === item1.title) {
              arrBonusKey.push(item1.key);
            }
          });
        });

        setTargetKeys(arrProcessKey);
        setTargetKeysBonus(arrBonusKey);

        setImage(object_data.image);
        setDataService(object_data);
        // console.log(dataService);
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
                  title: <Link to="/admin/service">Dịch vụ</Link>,
                },
                {
                  title: "Sửa dịch vụ",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Sửa dịch vụ</p>
            </TopCssContent>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-4">
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
                          value={dataService.name}
                          onChange={(e) =>
                            setDataService({
                              ...dataService,
                              name: e.target.value,
                            })
                          }
                          type="text"
                          id="service_name"
                          className="form-control form-control-lg"
                          placeholder="Tên dịch vụ"
                          style={{ fontSize: "17px", borderRadius: "3px" }}
                        />
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
                          value={dataService.vehicle}
                          onChange={(e) =>
                            setDataService({
                              ...dataService,
                              vehicle: e.target.value,
                            })
                          }
                          type="text"
                          id="vehicle_type"
                          className="form-control form-control-lg"
                          placeholder="Nhập vào loại xe tải..."
                          style={{ fontSize: "17px", borderRadius: "3px" }}
                        />
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
                          value={dataService.price}
                          onChange={(e) =>
                            setDataService({
                              ...dataService,
                              price: e.target.value,
                            })
                          }
                          type="number"
                          id="service_price"
                          className="form-control form-control-lg"
                          placeholder="Nhập vào giá dịch vụ"
                          style={{
                            fontSize: "17px",
                            borderRadius: "3px",
                            width: "fit-content",
                          }}
                        />
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
                          value={dataService.needPeople}
                          onChange={(e) =>
                            setDataService({
                              ...dataService,
                              needPeople: e.target.value,
                            })
                          }
                          type="number"
                          id="need_people"
                          className="form-control form-control-lg"
                          placeholder="VD: 1..."
                          style={{
                            fontSize: "17px",
                            borderRadius: "3px",
                            width: "100px",
                          }}
                        />
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
                          value={dataService.distance}
                          onChange={(e) =>
                            setDataService({
                              ...dataService,
                              distance: e.target.value,
                            })
                          }
                          type="text"
                          id="distance"
                          className="form-control form-control-lg"
                          placeholder="Quảng đường áp dụng..."
                          style={{
                            fontSize: "17px",
                            borderRadius: "3px",
                            width: "fit-content",
                          }}
                        />
                      </div>
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
                          value={dataService.warranty_policy}
                          onChange={(e) =>
                            setDataService({
                              ...dataService,
                              warranty_policy: e.target.value,
                            })
                          }
                          type="text"
                          id="warranty_policy"
                          className="form-control form-control-lg"
                          placeholder="Nhập vào chính sách..."
                          style={{
                            fontSize: "17px",
                            borderRadius: "3px",
                          }}
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
                          value={dataService.suitable_for}
                          onChange={(e) =>
                            setDataService({
                              ...dataService,
                              suitable_for: e.target.value,
                            })
                          }
                          type="text"
                          id="suitable_for"
                          className="form-control form-control-lg"
                          placeholder="Phù hợp với loại nào..."
                          style={{
                            fontSize: "17px",
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Thông tin khác */}
                  <div className="col-8">
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
                      <br />
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
                          alt="Image"
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

export default EditService;
