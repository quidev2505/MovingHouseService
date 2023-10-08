import React, { useState, useEffect, useRef } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";
import axios from "axios";
import { useSelector } from "react-redux";
import Highlighter from "react-highlight-words";

import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";

import { useNavigate } from "react-router-dom";

import {
  SearchOutlined,
  FolderViewOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  DeleteOutlined,
  StarOutlined,
} from "@ant-design/icons";

import {
  Table,
  Tag,
  Drawer,
  Timeline,
  Space,
  Modal,
  Rate,
  Avatar,
  Input,
  Button,
  DatePicker,
  Slider,
} from "antd";

import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

function OrderUser() {
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);
  const [DomOrderDetail, setDomOrderDetail] = useState();

  const nav = useNavigate();

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

    let id_customer = await axios.get(
      `/v1/customer/get_customer_with_fullname/${user.fullname}`
    );

    if (id_customer) {
      await axios
        .get(`/v1/order/viewOrderWithCustomerId/${id_customer.data._id}`)
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
                driver_name: item.driver_name,
                vehicle_name: item.vehicle_name,
                totalOrder: item.totalOrder,
                reason_cancel: item.reason_cancel,
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
    }
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

  //Tính năng lọc theo Search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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
          text: "Thanh toán hóa đơn",
          value: "Thanh toán hóa đơn",
        },
        {
          text: "Đã hoàn thành",
          value: "Đã hoàn thành",
        },
        {
          text: "Đã hủy",
          value: "Đã hủy",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
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
      ...getColumnSearchProps("service_name"),
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
      dataIndex: "driver_name",
      key: "driver_name",
      ...getColumnSearchProps("driver_name"),
      render: (driver_name) => (
        <div>
          {driver_name && driver_name.length === 0 ? (
            <span style={{ color: "#ccc" }}>Chưa xác định</span>
          ) : (
            driver_name &&
            driver_name.map((item, index) => {
              return (
                <tr>
                  <td>
                    <span className="fw-bold">{index + 1}.</span> {item}
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
    {
      title: "Hủy đơn hàng",
      key: "action",
      render: (order_id, driver_name) => (
        <Space size="middle" className="icon_hover">
          {driver_name.driver_name.length === 0 ? (
            <>
              <div
                onClick={() => modal_cancel_order(order_id)}
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
                <DeleteOutlined
                  style={{ color: "white", fontWeight: "bold" }}
                />
              </div>
            </>
          ) : (
            ""
          )}
        </Space>
      ),
    },
    {
      title: "Đánh giá",
      key: "rating",
      render: (order_id) => (
        <Space size="middle" className="icon_hover">
          {order_id.status === "Đã hoàn thành" ? (
            <>
              <div
                onClick={() => {
                  nav(`/user/order/rating/${order_id.order_id}`);
                }}
                style={{
                  backgroundColor: "blue",
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
                <StarOutlined style={{ color: "white", fontWeight: "bold" }} />
              </div>
            </>
          ) : (
            ""
          )}
        </Space>
      ),
    },
  ];

  const reason_cancel_order = useRef("Chưa xác định");

  //Mở modal hủy đơn hàng
  const modal_cancel_order = (order_id) => {
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
                <option value="1.Tôi muốn đổi thời gian giao hàng">
                  1.Tôi muốn đổi thời gian giao hàng
                </option>
                <option value="2.Tôi muốn đổi địa chỉ khác">
                  2.Tôi muốn đổi địa chỉ khác
                </option>
                <option value="3.Tôi không muốn sử dụng dịch vụ này">
                  3.Tôi không muốn sử dụng dịch vụ này
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
                  onClick={() => cancelOrder(order_id)}
                >
                  Hủy đơn hàng
                </button>
              </div>
            </div>
          </div>
        </>
      ),
      onOk() {},
    });
  };

  //Hủy đơn hàng
  const cancelOrder = async (order_id) => {
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
        status: "Đã hủy",
        reason_cancel: reason_cancel_order.current,
      };

      await axios
        .patch(`/v1/order/updateonefield_order/${order_id.order_id}`, ob)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Hủy đơn hàng thành công !",
            showConfirmButton: false,
            timer: 1500,
          });

          show_order_customer();
          Modal.destroyAll();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const onChange = (pagination, filters, sorter, extra) => {};

  // const [commentRating, setCommentRating] = useState("");
  // const [arrDriver, setArrayDriver] = useState([]);

  // const [dom_RatingDriver, setDOMRatingDriver] = useState();

  // const openRating = async (order_id) => {
  //   // Lấy mảng tên tài xế
  //   let arr_driver_name = order_id.driver_name;

  //   // Lặp qua mảng tên tài xế và thực hiện truy vấn API
  //   arr_driver_name.forEach(async (item, index) => {
  //     // Thực hiện truy vấn API
  //     let result = await axios.get(
  //       `/v1/driver/getdriver_with_fullname/${item}`
  //     );

  //     // Tạo đối tượng `ob` chứa thông tin về tài xế
  //     let ob = {
  //       fullname: result.data.fullname,
  //       avatar: result.data.avatar,
  //     };

  //     arrDriver.push(ob);

  //     setArrayDriver(arrDriver);
  //   });

  //   //Tạo DOM gắn vào tài xế
  //   if (arrDriver.length > 0) {
  //     let DOM_DRIVER = arrDriver.map((item, index) => {
  //       return (
  //         <>
  //           <div className="d-flex">
  //             <Avatar src={<img src={item.avatar} alt="avatar" />} />
  //             <h5>{item.fullname}</h5>
  //           </div>
  //           <div style={{ padding: "10px" }}>
  //             <div
  //               className="d-flex"
  //               style={{
  //                 justifyContent: "space-between",
  //                 alignItems: "center",
  //                 paddingLeft: "15px",
  //                 width: "300px",
  //               }}
  //             >
  //               <p style={{ marginBottom: "0px" }}>Đánh giá</p>
  //               <span>
  //                 <Rate
  //                   tooltips={desc}
  //                   onChange={setValueStar}
  //                   value={valueStar}
  //                 />
  //                 {valueStar ? (
  //                   <span className="ant-rate-text">{desc[valueStar - 1]}</span>
  //                 ) : (
  //                   ""
  //                 )}
  //               </span>
  //             </div>
  //             <div
  //               className="d-flex"
  //               style={{
  //                 justifyContent: "space-between",
  //                 alignItems: "center",
  //                 paddingLeft: "15px",
  //                 marginTop: "40px",
  //               }}
  //             >
  //               <p>Nhận xét</p>
  //               <textarea
  //                 placeholder="Nhập vào đánh giá"
  //                 value={commentRating}
  //                 onChange={(e) => setCommentRating(e.target.value)}
  //                 style={{
  //                   height: "100px",
  //                   width: "100%",
  //                   padding: "10px",
  //                   border: "1px solid #ccc",
  //                 }}
  //               ></textarea>
  //             </div>
  //           </div>
  //         </>
  //       );
  //     });

  //     setDOMRatingDriver(DOM_DRIVER);
  //   }
  // };

  // //Đánh giá đơn hàng
  // const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"];
  // const [valueStar, setValueStar] = useState(3); //đánh giá sao
  // const create_rating = () => {
  //   console.log(commentRating);
  // };

  return (
    <>
      <HeaderUser />
      <div className="orderUser" style={{ padding: "30px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "20px",
          }}
        >
          Đơn Hàng
        </h2>

        <div className="content_order" style={{ marginTop: "30px" }}>
          <div
            className="top_content_order d-flex"
            style={{ justifyContent: "space-between" }}
          >
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

            <div>
              <RangePicker
                defaultValue={[
                  dayjs("09/10/2023", dateFormat),
                  dayjs("10/10/2023", dateFormat),
                ]}
                format={dateFormat}
              />
            </div>

            <div
              onClick={() => show_order_customer()}
              style={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
                backgroundColor: "#ed883b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            >
              <ReloadOutlined />
            </div>
          </div>
          <LoadingOverlayComponent status={isActive}>
            <div>
              <Slider
                defaultValue={30}
                tooltip={{
                  open: true,
                }}
              />
            </div>
            <div className="bottom_content_order" style={{ marginTop: "20px" }}>
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
