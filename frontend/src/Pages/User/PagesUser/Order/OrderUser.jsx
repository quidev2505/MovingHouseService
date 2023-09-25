import React, { useState, useEffect } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";
import axios from "axios";
import { useSelector } from "react-redux";

import {
  SearchOutlined,
  FolderViewOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import { Table, Tag, Drawer, Timeline } from "antd";

import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";

function OrderUser() {
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);
  const [DomOrderDetail, setDomOrderDetail] = useState();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [dataOrder, setDataOrder] = useState([]);

  const user = useSelector((state) => state.auth.login.currentUser); //Lấy User hiện tại ra
  const show_order_customer = async () => {
    setIsActive(false);
    await axios
      .get(`/v1/order/viewOrderWithCustomerId/${user._id}`)
      .then((data) => {
        let dataOrder = data.data;
        const data_order = [];
        dataOrder &&
          dataOrder.forEach((item, index) => {
            const ob_order = {
              id_order_detail: item.order_detail_id,
              STT: index + 1,
              order_id: item.order_id,
              service_name: item.service_name,
              status: item.status,
              time_get_item: `${item.time_start} - ${item.date_start}`,
              router: `${item.fromLocation} - ${item.toLocation}`,
              driver_id: item.driver_id,
              vehicle_name: item.vehicle_name,
              totalOrder: item.totalOrder,
            };

            data_order.push(ob_order);
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
  };

  const view_detail_order = async (id_order_detail) => {
    await axios
      .get(`/v1/order/viewOrderDetail/${id_order_detail}`)
      .then((data) => {
        let data_order_detail = data.data;
        let dom_result = data_order_detail.map((item, index) => (
          <>
            <p
              style={{ fontWeight: "700", fontSize: "13px", color: "#c1b8b2" }}
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
                        objectFit: "contain",
                      }}
                    />
                    <span style={{ marginLeft: "5px", fontSize: "13px" }}>
                      Chuyển khoản
                    </span>
                  </div>
                )}
              </p>
            </div>

            <div className="d-flex" style={{ justifyContent: "space-between" }}>
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
                <p className="fw-bold">{item.totalOrder.toLocaleString()} đ</p>
              </div>

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
                <p>{item.totalOrderNew.toLocaleString()} đ</p>
              </div>
            </div>
          </>
        ));

        setDomOrderDetail(dom_result);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // //Search Realtime
  const [search, setSearch] = useState("");
  useEffect(() => {
    show_order_customer();
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
      filters: [
        {
          text: "Đang tìm tài xế",
          value: "Đang tìm tài xế",
        },
        {
          text: "Đang thực hiện",
          value: "Đang thực hiện",
        },
        {
          text: "Xác nhận hóa đơn",
          value: "Xác nhận hóa đơn",
        },
        {
          text: "Thanh toán hóa đơn",
          value: "Thanh toán hóa đơn",
        },
        {
          text: "Hoàn thành",
          value: "Hoàn thành",
        },
        {
          text: "Đã hủy",
          value: "Đã hủy",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => (
        <div className="d-flex">
          <Tag
            color={
              status === "Đang tìm tài xế"
                ? "blue"
                : status === "Đã hủy"
                ? "volcano"
                : status === "Đang thực hiện"
                ? "gold"
                : status === "Xác nhận hóa đơn"
                ? "purple"
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
              : status === "Xác nhận hóa đơn"
              ? "Xác nhận hóa đơn"
              : status === "Thanh toán hóa đơn"
              ? "Thanh toán hóa đơn"
              : "Hoàn thành"}
          </Tag>
        </div>
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
            {time_get_item.split("-")[0]}
          </div>
          <div
            style={{ fontWeight: "400", fontSize: "13px", color: "#737373" }}
          >
            {time_get_item.split("-")[1]}
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
              <p>{router.split("-")[0]}</p>
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
              <p>{router.split("-")[1]}</p>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Tài xế",
      dataIndex: "driver_id",
      key: "driver_id",
      render: (driver_id) => (
        <div className="fw-bold">
          {driver_id === null ? (
            <span style={{ color: "#ccc" }}>Chưa xác định</span>
          ) : (
            ""
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
      render: (id_order_detail) => (
        <div
          onClick={() => {
            showDrawer();
            view_detail_order(id_order_detail);
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
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <HeaderUser />
      <div className="orderUser" style={{ padding: "30px" }}>
        <div
          className="d-flex"
          style={{
            width: "420px",
            borderRadius: "5px 0 0 5px",
            overflow: "hidden",
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

        <div className="content_order" style={{ marginTop: "30px" }}>
          <div className="top_content_order">
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              Đơn Hàng
            </h2>
          </div>
          <LoadingOverlayComponent status={isActive}>
            <div className="bottom_content_order">
              <Table
                columns={columns}
                dataSource={dataOrder}
                onChange={onChange}
              />
              <Drawer
                title="# Chi tiết đơn hàng"
                placement="right"
                onClose={onClose}
                open={open}
              >
                {DomOrderDetail}
              </Drawer>
            </div>
          </LoadingOverlayComponent>
        </div>
      </div>
    </>
  );
}

export default OrderUser;
