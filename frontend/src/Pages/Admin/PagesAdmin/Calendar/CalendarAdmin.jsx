import React, { useEffect, useState, useRef } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";

import { Space, Table, Tag, Image, Modal, Avatar } from "antd";

import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";

import { useNavigate } from "react-router-dom";

import htmlReactParser from "html-react-parser";

import {
  EditOutlined,
  FolderViewOutlined,
  DeleteOutlined,
  SwapOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { Collapse } from "antd";

import axios from "axios";

function CalendarAdmin() {
  const nav = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  //Search Realtime
  const [search, setSearch] = useState("");
  const [dataFilter, setDateFilter] = useState("");
  useEffect(() => {
    get_item();
    dataDOM.current = "";
  }, [search, dataFilter]);

  function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    return str;
  }

  const dataDOM = useRef("");

  function convertDate(dateString) {
    // Tách chuỗi thành 3 phần: năm, tháng, ngày
    const [year, month, day] = dateString.split("-");

    // Trả về chuỗi ngày theo định dạng dd/MM/yyyy
    return `${day}/${month}/${year}`;
  }

  const get_item = async () => {
    let date = "";
    if (dataFilter !== "") {
      date = convertDate(dataFilter).toString();
    }

    await axios
      .get(`/v1/order/viewAllOrder`)
      .then((data) => {
        let data_solve = data.data;
        const data_item = [];
        data_solve &&
          data_solve.forEach(async (item, index) => {
            let avatar_driver = "";
            let arr_avatar_driver = [];
            if (item.status === "Đang thực hiện") {
              if (item.driver_name.length > 1) {
                for (let i = 0; i < item.driver_name.length; i++) {
                  let data_get = await axios.get(
                    `/v1/driver/getdriver_with_fullname/${item.driver_name[i]}`
                  );

                  arr_avatar_driver.push(data_get.data);
                }
              } else if (item.driver_name.length === 1) {
                avatar_driver = await axios.get(
                  `/v1/driver/getdriver_with_fullname/${item.driver_name}`
                );

                avatar_driver = avatar_driver.data;
              }
            }

            let ob_service = {};
            console.log(item.date_start)
            if (date === item.date_start) {
              if (item.driver_name.length > 1) {
                ob_service = {
                  id: item._id,
                  STT: index + 1,
                  order_id: item.order_id,
                  date_start: item.date_start,
                  time_start: item.time_start,
                  driver_name: item.driver_name,
                  fromLocation: item.fromLocation,
                  toLocation: item.toLocation,
                  service_name: item.service_name,
                  vehicle_name: item.vehicle_name,
                  avatar: arr_avatar_driver,
                };
              } else if (item.driver_name.length === 1) {
                ob_service = {
                  id: item._id,
                  STT: index + 1,
                  order_id: item.order_id,
                  date_start: item.date_start,
                  time_start: item.time_start,
                  driver_name: item.driver_name,
                  fromLocation: item.fromLocation,
                  toLocation: item.toLocation,
                  service_name: item.service_name,
                  vehicle_name: item.vehicle_name,
                  avatar: avatar_driver,
                };
              }

              console.log(ob_service)
            }

            if (date === "") {
              if (item.driver_name.length > 1) {
                ob_service = {
                  id: item._id,
                  STT: index + 1,
                  order_id: item.order_id,
                  date_start: item.date_start,
                  time_start: item.time_start,
                  driver_name: item.driver_name,
                  fromLocation: item.fromLocation,
                  toLocation: item.toLocation,
                  service_name: item.service_name,
                  vehicle_name: item.vehicle_name,
                  avatar: arr_avatar_driver,
                };
              } else if (item.driver_name.length === 1) {
                ob_service = {
                  id: item._id,
                  STT: index + 1,
                  order_id: item.order_id,
                  date_start: item.date_start,
                  time_start: item.time_start,
                  driver_name: item.driver_name,
                  fromLocation: item.fromLocation,
                  toLocation: item.toLocation,
                  service_name: item.service_name,
                  vehicle_name: item.vehicle_name,
                  avatar: avatar_driver,
                };
              }
            }

            data_item.push(ob_service);

            dataDOM.current = data_item;
          });

        setTimeout(() => {
          const currentArray = Array.from(dataDOM.current);
          let new_arr = currentArray.filter((item) => {
            // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
            if (item.order_id !== undefined) {
              let word_Change_VN = removeVietnameseTones(item.order_id);
              let word_search = removeVietnameseTones(search);

              // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
              return search.toLowerCase() === ""
                ? item
                : word_Change_VN.toLowerCase().includes(word_search);
            }
          });

          console.log(new_arr);
          setDataSource(new_arr);
        }, 1100);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    get_item();
  }, []);

  return (
    <>
      <LayoutAdmin>
        <div className="service_admin">
          <div>
            <Breadcrumb
              routes={[
                {
                  title: "Admin",
                },
                {
                  title: "Lịch vận chuyển",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Lịch vận chuyển</p>
              <div className="d-flex" style={{ width: "700px" }}>
                <div
                  className="d-flex"
                  style={{ width: "350px", borderRadius: "5px" }}
                >
                  <input
                    type="text"
                    id="find_blog"
                    className="form-control form-control-lg"
                    placeholder="Nhập vào ID đơn hàng để tìm kiếm..."
                    style={{ fontSize: "17px", borderRadius: "3px" }}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <SearchOutlined
                    style={{
                      backgroundColor: "#7bd6e5",
                      padding: "13px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                </div>

                <div className="d-flex" style={{ marginLeft: "50px" }}>
                  <input
                    type="date"
                    name="dob"
                    pattern="dd/mm/yyyy"
                    placeholder="dd/mm/yyyy"
                    id="date_of_birth"
                    className="form-control form-control-lg"
                    style={{ fontSize: "17px", borderRadius: "3px" }}
                    value={dataFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                  <SearchOutlined
                    style={{
                      backgroundColor: "#7bd6e5",
                      padding: "13px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </TopCssContent>

            <div style={{ marginTop: "20px" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {dataSource.length === 0 ? (
                  <h5 style={{ color: "red", fontStyle: "italic" }}>
                    Không có lịch vận chuyển nào !
                  </h5>
                ) : (
                  ""
                )}
                {dataSource &&
                  dataSource.map((item, index) => {
                    return (
                      <Collapse
                        collapsible="header"
                        defaultActiveKey={["1"]}
                        items={[
                          {
                            key: "1",
                            label: (
                              <>
                                <p style={{ color: "red" }}>
                                  ID: {item.order_id}
                                </p>{" "}
                                <span style={{ color: "#ed883b" }}>
                                  {item.service_name}
                                </span>
                                <span style={{ marginLeft: "20px" }}>
                                  Xuất phát:
                                </span>{" "}
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  {item.time_start} - {item.date_start}
                                </span>
                              </>
                            ),
                            children: (
                              <>
                                <div className="row">
                                  <div className="col">
                                    <p className="fw-bold">
                                      <span
                                        className="fw-bold"
                                        style={{ color: "red" }}
                                      >
                                        Từ địa điểm:
                                      </span>{" "}
                                      {item.fromLocation}
                                    </p>
                                    <p className="fw-bold">
                                      {" "}
                                      <span
                                        className="fw-bold"
                                        style={{ color: "#00bab3" }}
                                      >
                                        Đến địa điểm:
                                      </span>{" "}
                                      {item.toLocation}
                                    </p>
                                  </div>
                                  <div className="col">
                                    <p
                                      style={{
                                        color: "green",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Tài xế:{" "}
                                    </p>

                                    {/* Nếu chỉ có 1 tài xế */}
                                    {item.driver_name.length === 1 ? (
                                      <div>
                                        <span style={{ fontWeight: "bold" }}>
                                          1. {item.driver_name[0]}
                                        </span>{" "}
                                        &nbsp;
                                        <Avatar
                                          src={
                                            <img
                                              src={item.avatar}
                                              alt="avatar"
                                            />
                                          }
                                        />
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {/* Nếu có từ 2 tài xế trở lên */}
                                    {item.driver_name.length > 1 &&
                                      item.driver_name.map((item1, index) => {
                                        return (
                                          <div>
                                            <span
                                              style={{ fontWeight: "bold" }}
                                            >
                                              {index+1}. {item1}
                                            </span>{" "}
                                            &nbsp;
                                            <Avatar
                                              src={
                                                <img
                                                  src={item.avatar[index]}
                                                  alt="avatar"
                                                />
                                              }
                                            />
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              </>
                            ),
                          },
                        ]}
                      />
                    );
                  })}
              </Space>
            </div>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default CalendarAdmin;
