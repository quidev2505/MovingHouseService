import React, { useState, useRef, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function EditItem() {
  const params = useParams();
  const navigate = useNavigate();

  //Validation form
  const { handleSubmit } = useForm();

  const [imgURL, setImgURL] = useState(""); //Link hình ảnh
  const [image, setImage] = useState("");
  const [imageOld, setImageOld] = useState("");

  // Upload Img
  function uploadImg(e) {
    setImage(e.target.files[0]);
  }

  const [dataItem, setDataItem] = useState({});

  const onSubmit = async () => {
    dataItem.image = image;

    const isKeyEmpty = (key) => {
      return (
        dataItem[key] === undefined ||
        dataItem[key] === null ||
        dataItem[key] === ""
      );
    };

    let check = true;

    for (const key in dataItem) {
      if (isKeyEmpty(key)) {
        check = false;
        break;
      }
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", dataItem.name);
    formData.append("imgURL", imgURL);
    formData.append("image_old", imageOld);
    formData.append("size", dataItem.size);
    formData.append("category", dataItem.category);

    if (check) {
      await axios
        .put(`/v1/item/update_item/${dataItem._id}`, formData)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sửa vật dụng thành công!",
            showConfirmButton: false,
            timer: 1200,
          });
          navigate("/admin/item");
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Sửa vật dụng thất bại!",
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

  const get_data_item = async () => {
    const id = params.id;
    await axios
      .get(`/v1/item/view_detail_item/${id}`)
      .then((data) => {
        const data_item = data.data;
        setDataItem(data_item);
        setImage(data_item.image);
        setImageOld(data_item.image);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    get_data_item();
    // eslint-disable-next-line
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
                  title: <Link to="/admin/item">Vật dụng</Link>,
                },
                {
                  title: "Sửa vật dụng",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Sửa vật dụng</p>
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
                              value={dataItem.name}
                              onChange={(e) =>
                                setDataItem({
                                  ...dataItem,
                                  name: e.target.value,
                                })
                              }
                              type="text"
                              id="name"
                              className="form-control form-control-lg"
                              placeholder="Tên vật dụng..."
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                            />
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
                              value={dataItem.category}
                              onChange={(e) =>
                                setDataItem({
                                  ...dataItem,
                                  category: e.target.value,
                                })
                              }
                              type="text"
                              id="category"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào danh mục vật dụng"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                            />
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
                              value={dataItem.size}
                              onChange={(e) =>
                                setDataItem({
                                  ...dataItem,
                                  size: e.target.value,
                                })
                              }
                              type="text"
                              id="size"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào kích thước vật dụng"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
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

export default EditItem;
