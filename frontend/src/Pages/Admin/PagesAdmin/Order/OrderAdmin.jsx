import React, { useEffect, useState, useRef } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";

import {
  Space,
  Table,
  Tag,
  Image,
  Modal,
  Avatar,
  Tabs,
  Timeline,
  Drawer,
  ConfigProvider,
} from "antd";

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
  EnvironmentOutlined,
  ditOutlined,
} from "@ant-design/icons";

import axios from "axios";

function OrderAdmin() {
  const nav = useNavigate();
  const [dataOrder, setDataOrder] = useState([]);
  const [open, setOpen] = useState(false);
  const [DomOrderDetail, setDomOrderDetail] = useState();

  //Lí do hủy đơn hàng
  const [cancelReason, setCancelReason] = useState("");

  // const [statusOrder, setStatusOrder] = useState();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  //Thanh Tab
  const items = [
    {
      key: "1",
      label: "ĐÃ HỦY",
    },
    {
      key: "2",
      label: "ĐANG TÌM TÀI XẾ",
    },
    {
      key: "3",
      label: "ĐANG THỰC HIỆN",
    },

    {
      key: "4",
      label: "THANH TOÁN HÓA ĐƠN",
    },
    {
      key: "5",
      label: "ĐÃ HOÀN THÀNH",
    },
  ];

  const [activeKeyTab, setActiveKeyTab] = useState("2");

  const check_active = (input_activeKey) => {
    let result = "";
    if (input_activeKey === "1") {
      result = "Đã hủy";
    } else if (input_activeKey === "2") {
      result = "Đang tìm tài xế";
    }
    if (input_activeKey === "3") {
      result = "Đang thực hiện";
    }
    if (input_activeKey === "4") {
      result = "Thanh toán hóa đơn";
    }
    if (input_activeKey === "5") {
      result = "Đã hoàn thành";
    }

    return result;
  };

  const onChange = (key) => {
    switch (key) {
      case "1":
        setActiveKeyTab("1");
        show_order_customer("Đã hủy");
        break;
      case "2":
        setActiveKeyTab("2");
        show_order_customer("Đang tìm tài xế");
        break;
      case "3":
        setActiveKeyTab("3");
        show_order_customer("Đang thực hiện");
        break;
      case "4":
        setActiveKeyTab("4");

        show_order_customer("Thanh toán hóa đơn");
        break;
      case "5":
        setActiveKeyTab("5");
        show_order_customer("Đã hoàn thành");
        break;
      default:
        break;
    }
  };

  const statusOrder = useRef("Đang tìm tài xế");
  const statusDriver = useRef("Chưa xác định");
  const reason_cancel_order = useRef("Chưa xác định");

  // //Thay đổi trạng thái của tài xế sang đang bận sau khi đã đưa tài xế vào ca làm
  const change_status_driver = async (driver_name, status_driver) => {
    console.log(driver_name);
    await axios
      .patch(`/v1/driver/updateonefield_driver_withname/${driver_name}`, {
        status: status_driver,
      })
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Update One Field Order
  const updateOrder = async (order_id) => {
    let ob = {};

    //Kiểm tra xem đã có tài xế thứ nhất chưa
    if (order_id.driver_name.length > 0) {
      //Nếu chọn chưa xác định sẽ xóa hết nhé !
      if (statusDriver.current === "Chưa xác định") {
        ob = {
          driver_name: [],
          status: "Đang tìm tài xế",
          reason_cancel: null,
        };
      } else {
        let arr_driver = order_id.driver_name.push(statusDriver.current);

        ob = {
          driver_name: order_id.driver_name,
          status: "Đang thực hiện",
          reason_cancel: null,
        };
      }
    } else {
      ob = {
        driver_name: statusDriver.current,
        status: "Đang thực hiện",
        reason_cancel: null,
      };
    }

    console.log(ob);
    await axios
      .patch(`/v1/order/updateonefield_order/${order_id.order_id}`, ob)
      .then((data) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cập nhật đơn hàng thành công !",
          showConfirmButton: false,
          timer: 1500,
        });

        if (statusDriver.current === "Chưa xác định") {
          //Trả lại trạng thái rảnh cho tài xế
          order_id.driver_name.forEach((item, index) => {
            console.log(item);
            change_status_driver(item, "Sẵn sàng");
          });

          setTimeout(() => {
            setActiveKeyTab("2");
            show_order_customer("Đang tìm tài xế");
            list_driver();
          }, 1500);
          Modal.destroyAll();
        } else {
          change_status_driver(statusDriver.current, "Đang bận");

          setTimeout(() => {
            setActiveKeyTab("3");
            show_order_customer("Đang thực hiện");
          }, 1100);
          Modal.destroyAll();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Get List Driver Can Choose
  const list_driver = async () => {
    let data_arr_list_driver = await axios.get("/v1/driver/show_all_driver");
    let arr_result = [];
    data_arr_list_driver &&
      data_arr_list_driver.data.forEach((item, index) => {
        if (item.status === "Sẵn sàng") {
          arr_result.push(item.fullname);
        }
      });

    setListDriver(arr_result);
  };

  const [listDriver, setListDriver] = useState("");

  //Hủy đơn hàng
  const cancelOrder = async (order_id, driver_name) => {
    if (reason_cancel_order.current === "Chưa xác định") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Vui lòng cập nhất lý do hủy đơn",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      let ob = {
        driver_name: [],
        status: "Đã hủy",
        reason_cancel: reason_cancel_order.current,
      };

      await axios
        .patch(`/v1/order/updateonefield_order/${order_id.order_id}`, ob)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Cập nhật đơn hàng thành công !",
            showConfirmButton: false,
            timer: 1500,
          });

          //Trả lại trạng thái rảnh cho tài xế
          order_id.driver_name.forEach((item, index) => {
            console.log(item);
            change_status_driver(item, "Sẵn sàng");
          });

          setTimeout(() => {
            setActiveKeyTab("1");
            show_order_customer("Đã hủy");
          }, 1100);
          Modal.destroyAll();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  //Update order
  const handle_update_order = (order_id, driver_name) => {
    Modal.success({
      title: "Cập nhật đơn hàng",
      content: (
        <>
          <div className="d-flex" style={{ justifyContent: "flex-start" }}>
            {/* Cột đơn hàng */}
            <div
              style={{
                border: "1px solid #eb9570",
                padding: "10px",
                borderRadius: "5px",
                width: "400px",
              }}
            >
              <p>
                Trạng thái đơn hàng hiện tại:{" "}
                <span className="fw-bold">{order_id.status}</span>
              </p>
              <select
                style={{
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  width: "100%",
                  height: "37px",
                }}
                onChange={(e) => (reason_cancel_order.current = e.target.value)}
              >
                <option value="Chưa xác định">Chưa xác định</option>
                <option value="1.Người mua thay đổi ý định mua hàng">
                  1.Người mua thay đổi ý định mua hàng
                </option>
                <option value="2.Không thể liên hệ khách hàng">
                  2.Không thể liên hệ khách hàng
                </option>
                <option value="3.Khách hàng đổi thời gian vận chuyển">
                  3.Khách hàng đổi thời gian vận chuyển
                </option>
              </select>
              <div className="d-flex" style={{ marginTop: "20px" }}>
                <p>Cập nhật trạng thái mới:</p>
                <button
                  className="btn btn-danger"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginLeft: "20px",
                  }}
                  onClick={() => cancelOrder(order_id, driver_name)}
                >
                  Hủy đơn hàng
                </button>
              </div>
            </div>

            {/* Cột tài xế */}
            <div
              style={{
                border: "1px solid #eb9570",
                padding: "10px",
                borderRadius: "5px",
                marginLeft: "20px",
              }}
            >
              <p>
                Trạng thái tài xế hiện tại:{" "}
                <span className="fw-bold">
                  {order_id.driver_name.length !== 0 ? (
                    <>
                      <span style={{ color: "red" }}>Đã có tài xế</span>
                      <ol>
                        {order_id.driver_name.map((item, index) => {
                          return <li>{item}</li>;
                        })}
                      </ol>
                    </>
                  ) : (
                    "Chưa xác định"
                  )}
                </span>
              </p>
              <div className="d-flex">
                <p>Danh sách tài xế khả dụng:</p>
                <select
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    marginLeft: "10px",
                  }}
                  onChange={(e) => (statusDriver.current = e.target.value)}
                >
                  {listDriver.map((item, index) => (
                    <option value={item}>{item}</option>
                  ))}
                  <option value="Chưa xác định">Chưa xác định</option>
                </select>
              </div>
              <div
                style={{
                  marginBottom: "50px",
                  marginTop: "20px",
                  display: "inline-block",
                }}
                onClick={() => updateOrder(order_id)}
              >
                <button className="btn btn-success">Cập nhật</button>
              </div>
            </div>
          </div>
        </>
      ),
      onOk() {},
    });
  };

  const show_order_customer = async (status_input) => {
    let arr_customer_id = await axios.get("/v1/order/viewAllOrder");
    let arr_CI = [];
    arr_customer_id.data.forEach((item, index) => {
      arr_CI.push(item.customer_id);
    });

    if (arr_CI) {
      let arr_customer_name = [];
      for (let i = 0; i < arr_CI.length; i++) {
        let fullname_data = await axios.get(
          `/v1/customer/get_customer_with_id/${arr_CI[i]}`
        );
        arr_customer_name.push(fullname_data.data.fullname);
      }

      await axios
        .get(`/v1/order/viewAllOrder`)
        .then((data) => {
          let dataOrder = data.data;
          const data_order = [];
          dataOrder &&
            dataOrder.forEach((item, index) => {
              if (item.status === status_input) {
                const ob_order = {
                  id_order_detail: item.order_detail_id,
                  STT: index + 1,
                  order_id: item.order_id,
                  service_name: item.service_name,
                  reason_cancel: item.reason_cancel,
                  status: item.status,
                  time_get_item: `${item.time_start} - ${item.date_start}`,
                  router: `${item.fromLocation} - ${item.toLocation}`,
                  driver_name: item.driver_name,
                  vehicle_name: item.vehicle_name,
                  totalOrder: item.totalOrder,
                  customer_name: arr_customer_name[index],
                };
                data_order.push(ob_order);
              }
            });

          let new_arr = data_order.filter((item) => {
            // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
            let word_Change_VN = removeVietnameseTones(item.order_id);
            let word_search = removeVietnameseTones(search);

            // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
            return search.toLowerCase() === ""
              ? item
              : word_Change_VN.toLowerCase().includes(word_search);
          });

          if (new_arr.length === 0) {
            let new_arr_service = data_order.filter((item) => {
              // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
              let word_Change_VN = removeVietnameseTones(item.service_name);
              let word_search = removeVietnameseTones(search);

              // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
              return search.toLowerCase() === ""
                ? item
                : word_Change_VN.toLowerCase().includes(word_search);
            });
            setDataOrder(new_arr_service);
          } else {
            setDataOrder(new_arr);
          }
        })

        .catch((e) => {
          console.log(e);
        });
    }
  };

  //Table Area
  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
    },
    {
      title: "ID",
      dataIndex: "order_id",
      key: "order_id",
      render: (order_id) => <div className="fw-bold">{order_id}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",

      render: (status, reason_cancel) => (
        <>
          <div className="d-flex">
            <Tag
              color={
                status === "Đang tìm tài xế"
                  ? "blue"
                  : status === "Đã hủy"
                  ? "volcano"
                  : status === "Đang thực hiện"
                  ? "gold"
                  : status === "Thanh toán hóa đơn"
                  ? "magenta"
                  : "#87d068"
              }
              key={status}
            >
              {status === "Đang tìm tài xế"
                ? "Đang tìm tài xế"
                : status === "Đã hủy"
                ? "Đã hủy"
                : status === "Đang thực hiện"
                ? "Đang thực hiện"
                : status === "Thanh toán hóa đơn"
                ? "Thanh toán hóa đơn"
                : "Đã hoàn thành"}
            </Tag>
          </div>
          {reason_cancel.reason_cancel !== null ? (
            <>
              <p style={{ marginTop: "10px" }}>
                <span className="fw-bold">Lý do:</span>{" "}
                {reason_cancel.reason_cancel}
              </p>
            </>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "service_name",
      key: "service_name",
    },
    {
      title: "Thời gian lấy hàng",
      dataIndex: "time_get_item",
      key: "time_get_item",
      render: (time_get_item) => (
        <>
          <div style={{ fontWeight: "400", fontSize: "14px" }}>
            {time_get_item?.split("-")[0]}
          </div>
          <div
            style={{ fontWeight: "400", fontSize: "13px", color: "#737373" }}
          >
            {time_get_item?.split("-")[1]}
          </div>
        </>
      ),
    },
    {
      title: "Lộ trình",
      dataIndex: "router",
      key: "router",
      render: (router) => (
        <>
          <div className="col" style={{ fontSize: "12px" }}>
            <div className="d-flex">
              <span
                style={{
                  width: "25px",
                  height: "25px",
                  backgroundColor: "red",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  color: "white",
                  fontWeight: "bold",
                  marginRight: "5px",
                }}
              >
                1
              </span>
              <p>{router?.split("-")[0]}</p>
            </div>

            <div className="d-flex">
              <span
                style={{
                  width: "25px",
                  height: "25px",
                  backgroundColor: "#00bab3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  color: "white",
                  fontWeight: "bold",
                  marginRight: "5px",
                }}
              >
                2
              </span>
              <p>{router?.split("-")[1]}</p>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Tài xế",
      dataIndex: "driver_name",
      key: "driver_name",
      render: (driver_name) => (
        <div className="fw-bold">
          {driver_name && driver_name.length === 0 ? (
            <span style={{ color: "#ccc" }}>Chưa xác định</span>
          ) : (
            driver_name &&
            driver_name.map((item, index) => {
              return (
                <tr>
                  <td className="fw-bold">
                    {index + 1}. {item}
                  </td>
                </tr>
              );
            })
          )}
        </div>
      ),
    },

    {
      title: "Loại xe",
      dataIndex: "vehicle_name",
      key: "vehicle_name",
    },
    {
      title: "Giá",
      dataIndex: "totalOrder",
      key: "totalOrder",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.totalOrder - b.totalOrder,
      render: (totalOrder) => (
        <div className="fw-bold" style={{ color: "red" }}>
          {totalOrder.toLocaleString()} đ
        </div>
      ),
    },
    {
      title: "Xem chi tiết",
      dataIndex: "id_order_detail",
      key: "id_order_detail",
      render: (id_order_detail, customer_name) => (
        <div
          onClick={() => {
            showDrawer();
            view_detail_order(id_order_detail, customer_name);
          }}
          style={{
            backgroundColor: "#29251b",
            borderRadius: "50%",
            padding: "5px",
            display: "flex",
            cursor: "pointer",
            width: "30px",
            height: "30px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FolderViewOutlined style={{ color: "white", fontWeight: "bold" }} />
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (order_id, driver_name) => (
        <Space size="middle" className="icon_hover">
          <div
            onClick={() => handle_update_order(order_id, driver_name)}
            style={{
              backgroundColor: "red",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              cursor: "pointer",
              width: "30px",
              height: "30px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditOutlined style={{ color: "white", fontWeight: "bold" }} />
          </div>
        </Space>
      ),
    },
  ];

  const view_detail_order = async (id_order_detail, customer_name) => {
    let user_customer = await axios.get(
      `/v1/customer/get_info_user_with_customer_name/${customer_name.customer_name}`
    );

    const ob_customer_info = {
      fullname: user_customer.data.fullname,
      email: user_customer.data.email,
      phonenumber: user_customer.data.phonenumber,
    };

    if (ob_customer_info) {
      await axios
        .get(`/v1/order/viewOrderDetail/${id_order_detail}`)
        .then((data) => {
          let data_order_detail = data.data;
          let dom_result = data_order_detail.map((item, index) => (
            <>
              <div>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#c1b8b2",
                  }}
                >
                  THÔNG TIN KHÁCH HÀNG
                  <br></br>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "13px",
                    }}
                  >
                    Họ và tên: &nbsp;{" "}
                    <span className="fw-bold">{ob_customer_info.fullname}</span>
                  </span>
                  <br></br>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "13px",
                    }}
                  >
                    Email: &nbsp;{" "}
                    <span className="fw-bold">{ob_customer_info.email}</span>
                  </span>
                  <br></br>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "13px",
                    }}
                  >
                    Số điện thoại: &nbsp;{" "}
                    <span className="fw-bold">
                      {ob_customer_info.phonenumber}
                    </span>
                  </span>
                </p>
              </div>

              <p
                style={{
                  fontWeight: "700",
                  fontSize: "13px",
                  color: "#c1b8b2",
                }}
              >
                LỘ TRÌNH (<span>{item.distance.toUpperCase()}</span>)
              </p>
              <div>
                <Timeline
                  items={[
                    {
                      children: (
                        <div>
                          <p>{item.fromLocation_detail}</p>
                        </div>
                      ),
                      color: "red",
                    },
                    {
                      dot: (
                        <EnvironmentOutlined
                          style={{
                            fontSize: "16px",
                            color: "#00bab3",
                          }}
                        />
                      ),
                      children: (
                        <div>
                          <p>{item.toLocation_detail}</p>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>

              <div>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#c1b8b2",
                  }}
                >
                  THỜI GIAN DI CHUYỂN
                  <br></br>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "13px",
                    }}
                  >
                    {item.duration}
                  </span>
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#c1b8b2",
                  }}
                >
                  DỊCH VỤ BỔ SUNG
                  <br></br>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "15px",
                    }}
                  >
                    {item.moving_fee.map((item, index) => (
                      <>• {item.name} </>
                    ))}
                  </span>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "15px",
                    }}
                  >
                    {item.service_fee.map((item, index) => (
                      <>• {item.name} </>
                    ))}
                  </span>
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#c1b8b2",
                  }}
                >
                  CHI TIẾT HÀNG HÓA VẬN CHUYỂN
                  <br></br>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "15px",
                    }}
                  >
                    {item.item_detail.map((item, index) => (
                      <>+{item} </>
                    ))}
                  </span>
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#c1b8b2",
                  }}
                >
                  GHI CHÚ CHO TÀI XẾ
                  <br></br>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "15px",
                    }}
                  >
                    {item.note_driver}
                  </span>
                </p>
              </div>

              <div
                className="d-flex"
                style={{ justifyContent: "space-between", marginTop: "30px" }}
              >
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#c1b8b2",
                  }}
                >
                  GIÁ
                </p>
                <p>
                  {item.payment_method === "Thanh toán cho tài xế" ? (
                    <div>
                      <img
                        src="./img/ondelivery.png"
                        alt="hinh tien mat"
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "contain",
                        }}
                      />
                      <span style={{ marginLeft: "5px", fontSize: "13px" }}>
                        Tiền mặt
                      </span>
                    </div>
                  ) : (
                    <div>
                      <img
                        src="./img/vnpay.webp"
                        alt="hinh chuyen khoan"
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "co ntain",
                        }}
                      />
                      <span style={{ marginLeft: "5px", fontSize: "13px" }}>
                        Chuyển khoản
                      </span>
                    </div>
                  )}
                </p>
              </div>

              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                <p>Phí thuê xe</p>
                <p>{item.vehicle_price.toLocaleString()} đ</p>
              </div>

              <div>
                {item.moving_fee.map((item, index) => (
                  <div
                    className="d-flex"
                    style={{ justifyContent: "space-between" }}
                  >
                    <p>{item.name.split("(")[0]}</p>
                    <p>{item.price.toLocaleString()} đ</p>
                  </div>
                ))}

                {item.service_fee.map((item, index) => (
                  <div
                    className="d-flex"
                    style={{ justifyContent: "space-between" }}
                  >
                    <p>{item.name.split("(")[0]}</p>
                    <p>{item.price.toLocaleString()} đ</p>
                  </div>
                ))}

                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <p>Tổng thanh toán cũ</p>
                  <p className="fw-bold">
                    {item.totalOrder.toLocaleString()} đ
                  </p>
                </div>

                {item.more_fee_name !== null ? (
                  <>
                    <div
                      className="d-flex"
                      style={{ justifyContent: "space-between" }}
                    >
                      <p className="fw-bold">* Chi phí phát sinh: </p>
                      <p className="fw-bold"></p>
                    </div>

                    <div
                      className="d-flex"
                      style={{ justifyContent: "space-between" }}
                    >
                      <p>{item.more_fee_name}</p>
                      <p className="fw-bold" style={{ color: "green" }}>
                        {item.more_fee_price.toLocaleString()} đ
                      </p>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <p>Trạng thái thanh toán</p>
                  <p style={{ color: "orange" }}>{item.payment_status}</p>
                </div>

                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between", marginTop: "25px" }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      fontSize: "13px",
                      color: "#c1b8b2",
                    }}
                  >
                    TỔNG THANH TOÁN MỚI
                  </p>
                  <p className="fw-bold" style={{ color: "red" }}>
                    {item.totalOrderNew.toLocaleString()} đ
                  </p>
                </div>
              </div>
            </>
          ));

          setDomOrderDetail(dom_result);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  // //Search Realtime
  const [search, setSearch] = useState("");
  useEffect(() => {
    list_driver();
    show_order_customer(check_active(activeKeyTab));
  }, [search]);

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

  return (
    <>
      <LayoutAdmin>
        <div className="order_admin">
          <div>
            <Breadcrumb
              routes={[
                {
                  title: "Admin",
                },
                {
                  title: "Đơn hàng",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <ConfigProvider
              theme={{
                token: {
                  // Seed Token
                  colorPrimary: "black",
                  borderRadius: 2,

                  // Alias Token
                  colorBgContainer: "black",
                },
              }}
            >
              <Tabs
                activeKey={activeKeyTab}
                items={items}
                onChange={onChange}
                itemSelectedColor={""}
              />
            </ConfigProvider>

            <TopCssContent>
              <div
                className="d-flex"
                style={{
                  width: "420px",
                  borderRadius: "5px 0 0 5px",
                  overflow: "hidden",
                  marginBottom: "20px",
                }}
              >
                <SearchOutlined
                  style={{
                    backgroundColor: "#ed883b",
                    padding: "13px",
                    color: "white",
                    cursor: "pointer",
                  }}
                />
                <input
                  type="text"
                  id="find_service"
                  className="form-control form-control-lg"
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên dịch vụ"
                  style={{ fontSize: "17px", borderRadius: "3px" }}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </TopCssContent>
            <div>
              <Table columns={columns} dataSource={dataOrder} />

              <Drawer
                title="# Chi tiết đơn hàng"
                placement="right"
                onClose={onClose}
                open={open}
              >
                {DomOrderDetail}
              </Drawer>
            </div>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default OrderAdmin;
