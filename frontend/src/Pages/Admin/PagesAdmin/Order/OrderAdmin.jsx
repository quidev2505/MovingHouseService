import React, { useEffect, useState, useRef } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";
import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";
import Highlighter from "react-highlight-words";

import ContractDeliveryAdmin from "../ContractDeliveryAdmin";

import * as XLSX from "xlsx"; //Xử lý file Excel
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

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
  DatePicker,
  Slider,
  Input,
} from "antd";

import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";

import htmlReactParser from "html-react-parser";

import {
  EditOutlined,
  FolderViewOutlined,
  DeleteOutlined,
  SwapOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  ColumnWidthOutlined,
  ditOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  FilterOutlined,
  FormOutlined,
} from "@ant-design/icons";

import axios from "axios";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

function OrderAdmin() {
  const params = useParams();
  const nav = useNavigate();
  const [dataOrder, setDataOrder] = useState([]);
  const [open, setOpen] = useState(false);
  const [DomOrderDetail, setDomOrderDetail] = useState();

  const [orderCount, setOrderCount] = useState(0);

  const [isActive, setIsActive] = useState(true);
  //Lí do hủy đơn hàng
  const [cancelReason, setCancelReason] = useState("");

  //Khoảng thời gian
  const [startRange, setStartRange] = useState("01/01/2021"); //Thời gian bắt đầu
  const [endRange, setEndRange] = useState("31/12/2023"); //Thời gian cuối

  //Khoảng tổng giá đơn hàng
  const [startRangePrice, setStartRangePrice] = useState(1); //Giá bắt đầu
  const [endRangePrice, setEndRangePrice] = useState(90); //Giá kết thúc

  // const [statusOrder, setStatusOrder] = useState();

  const check_admin_login = useSelector(
    (state) => state.admin.login?.currentAdmin
  );

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  //Thiết lập lọc theo khoảng thời gian
  const changeRangeTime = (a, b, c) => {
    //b là range thời gian
    setStartRange(b[0]);
    setEndRange(b[1]);
  };

  //Thiết lập lọc theo tổng giá đơn hàng
  const changeRangePrice = (a, b) => {
    //a là range thời gian
    setStartRangePrice(a[0]);
    setEndRangePrice(a[1]);
  };

  //Thanh Tab
  const items = [
    {
      key: "1",
      label: "ĐÃ HỦY",
    },
    {
      key: "2",
      label: "ĐANG XỬ LÝ",
    },
    {
      key: "3",
      label: "ĐANG TÌM TÀI XẾ",
    },
    {
      key: "4",
      label: "ĐANG THỰC HIỆN",
    },
    {
      key: "5",
      label: "THANH TOÁN HÓA ĐƠN",
    },
    {
      key: "6",
      label: "ĐÃ HOÀN THÀNH",
    },
  ];

  const [activeKeyTab, setActiveKeyTab] = useState("2");

  const check_active = (input_activeKey) => {
    let result = "";
    if (input_activeKey === "1") {
      result = "Đã hủy";
    }
    if (input_activeKey === "2") {
      result = "Đang xử lý";
    }
    if (input_activeKey === "3") {
      result = "Đang tìm tài xế";
    }
    if (input_activeKey === "4") {
      result = "Đang thực hiện";
    }
    if (input_activeKey === "5") {
      result = "Thanh toán hóa đơn";
    }
    if (input_activeKey === "6") {
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
        show_order_customer("Đang xử lý");
        break;
      case "3":
        setActiveKeyTab("3");
        show_order_customer("Đang tìm tài xế");
        break;
      case "4":
        setActiveKeyTab("4");
        show_order_customer("Đang thực hiện");
        break;
      case "5":
        setActiveKeyTab("5");
        show_order_customer("Thanh toán hóa đơn");
        break;
      case "6":
        setActiveKeyTab("6");
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
          change_status_driver(statusDriver.current, "Sẵn sàng");

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
  const cancelOrder = async (order_id, driver_name, customer_id) => {
    if (reason_cancel_order.current === "Chưa xác định") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Vui lòng cập nhật lý do hủy đơn",
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
        .then(async (data) => {
          await axios.post(`/v1/notification/createNotification`, {
            customer_id: order_id.customer_id,
            order_id: order_id.order_id,
            status_order: `(QTV) - Có đơn hàng vừa bị hủy !`,
          });

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
  const handle_update_order = (order_id, driver_name, customer_id) => {
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

              {order_id.status !== "Đã hoàn thành" ? (
                <>
                  <select
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      width: "100%",
                      height: "37px",
                    }}
                    onChange={(e) =>
                      (reason_cancel_order.current = e.target.value)
                    }
                  >
                    <option value="Chưa xác định">Chưa xác định</option>
                    <option
                      value="(Hủy bởi QTV) - 1.Người mua thay đổi ý định mua
                      hàng"
                    >
                      (Hủy bởi QTV) - 1.Người mua thay đổi ý định mua hàng
                    </option>
                    <option value="(Hủy bởi QTV) - 2.Không thể liên hệ khách hàng">
                      (Hủy bởi QTV) - 2.Không thể liên hệ khách hàng
                    </option>
                    <option value="(Hủy bởi QTV) - 3.Khách hàng đổi thời gian vận chuyển">
                      (Hủy bởi QTV) - 3.Khách hàng đổi thời gian vận chuyển
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
                      onClick={() =>
                        cancelOrder(order_id, driver_name, customer_id)
                      }
                    >
                      Hủy đơn hàng
                    </button>
                  </div>
                </>
              ) : (
                ""
              )}
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
    setIsActive(true);
    //Lấy thông tin tài xế
    list_driver();
    //Lấy thông tin đơn hàng

    let arr_customer_id = await axios.get("/v1/order/viewAllOrder");
    let arr_CI = [];
    arr_customer_id.data.forEach((item, index) => {
      arr_CI.push(item.customer_id);
    });

    if (arr_CI) {
      let arr_data_get = await axios.post(
        `/v1/customer/getArrFullName`,
        arr_CI
      );

      const arr_customer_name = arr_data_get.data;

      await axios
        .get(`/v1/order/viewAllOrder`)
        .then(async (data) => {
          let dataOrder = data.data;

          let arr_index = [];
          const data_filter_new = dataOrder.filter((item, index) => {
            if (item.status !== undefined && item.status === status_input) {
              arr_index.push(index);
              return item;
            }
          });

          console.log(arr_index);

          const ob_fiter = {
            dataOrder: data_filter_new,
            startRange: startRange,
            endRange: endRange,
            startRangePrice: Number(startRangePrice * 1000000),
            endRangePrice: Number(endRangePrice * 1000000),
          };

          let data_filter = await axios.post(`/v1/order/findOrder`, ob_fiter);

          const data_order = [];
          let ob_order = {};

          data_filter &&
            data_filter.data.forEach((item, index) => {
              ob_order = {
                id_order_detail: item.order_detail_id,
                STT: index + 1,
                order_id: item.order_id,
                service_name: item.service_name,
                reason_cancel: item.reason_cancel,
                status: item.status,
                date_end: item.date_end,
                date_created: item.date_created,
                time_get_item: `${item.time_start} - ${item.date_start}`,
                router: `${item.fromLocation} - ${item.toLocation}`,
                driver_name: item.driver_name,
                vehicle_name: item.vehicle_name,
                totalOrder: item.totalOrder,
                customer_id: item.customer_id,
                customer_name: arr_customer_name[arr_index[index]],
                electronic_signature: item.electronic_signature,
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
            setOrderCount(new_arr_service.length);
            setDataOrder(new_arr_service);
          } else {
            setOrderCount(new_arr.length);
            setDataOrder(new_arr);
          }

          setIsActive(false);
        })

        .catch((e) => {
          console.log(e);
        });
    }
  };

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

  const [checkModalContract, setCheckModalContract] = useState(true);

  useEffect(() => {
    Modal.destroyAll();
  }, [checkModalContract]);

  //Mở modal hợp đồng vận chuyển
  const modal_contract_delivery = async (id_order_detail, order_id) => {
    try {
      const data_new = await axios.get(
        `/v1/order/viewOrderDetail/${id_order_detail}`
      );

      const data_customer = await axios.get(`
      /v1/customer/get_customer_with_id/${order_id.customer_id}`);

      //Lấy tên khách hàng
      let user_customer = await axios.get(
        `/v1/customer/get_info_user_with_customer_name/${order_id.customer_name}`
      );

      order_id.address_customer = data_customer.data.address;
      order_id.customer_full_name = data_customer.data.fullname;
      order_id.phonenumber_customer = user_customer.data.phonenumber;
      order_id.gender_customer = data_customer.data.gender;

      Modal.success({
        title: "Hợp đồng vận chuyển",
        content: (
          <>
            <ContractDeliveryAdmin
              orderData={order_id}
              orderDataDetail={data_new}
              checkModalContract={checkModalContract}
              setCheckModalContract={setCheckModalContract}
              departmentAdmin={check_admin_login.department}
            />
          </>
        ),
        onOk() {},
      });
    } catch (e) {
      console.log(e);
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
                  : status === "Đã hoàn thành"
                  ? "#87d068"
                  : "purple"
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
                : status === "Đang xử lý"
                ? "Đang xử lý"
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
          <div
            style={{
              fontWeight: "400",
              fontSize: "14px",
            }}
          >
            {time_get_item?.split("-")[0]}
          </div>
          <div
            style={{
              fontWeight: "400",
              fontSize: "13px",
              color: "#737373",
            }}
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
      ...getColumnSearchProps("router"),
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
      ...getColumnSearchProps("customer_name"),
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
      ...getColumnSearchProps("vehicle_name"),
    },
    {
      title: "Giá",
      dataIndex: "totalOrder",
      key: "totalOrder",
      // defaultSortOrder: "ascend",
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
      render: (id_order_detail, customer_name, order_id) => (
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
      title: "Hợp đồng vận chuyển",
      dataIndex: "id_order_detail",
      key: "id_order_detail",
      render: (id_order_detail, order_id) => (
        <Space size="middle" className="icon_hover">
          <div
            onClick={() => modal_contract_delivery(id_order_detail, order_id)}
            style={{
              backgroundColor: "purple",
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
            <FormOutlined
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            />
          </div>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (order_id, driver_name, customer_id) => (
        <Space size="middle" className="icon_hover">
          <div
            onClick={() =>
              handle_update_order(order_id, driver_name, customer_id)
            }
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
            <EditOutlined
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            />
          </div>
        </Space>
      ),
    },
  ];

  const view_detail_order = async (id_order_detail, customer_name) => {
    //Lấy tên khách hàng
    let user_customer = await axios.get(
      `/v1/customer/get_info_user_with_customer_name/${customer_name.customer_name}`
    );

    const ob_customer_info = {
      fullname: user_customer.data.fullname,
      email: user_customer.data.email,
      phonenumber: user_customer.data.phonenumber,
    };

    //Lấy danh sách tên tài xế
    if (customer_name.driver_name.length > 0) {
      let arr_driver_name = customer_name.driver_name;
      var arrDriverName = await axios.post(
        `/v1/driver/get_arr_driver_info`,
        arr_driver_name
      );
    }

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

              {/* Thông tin tài xế */}
              <div>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#c1b8b2",
                  }}
                >
                  THÔNG TIN TÀI XẾ
                  <br></br>
                  {arrDriverName ? (
                    arrDriverName?.data.map((item, index) => {
                      return (
                        <div
                          className="row"
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <div
                            className="d-flex col-4"
                            style={{
                              alignItems: "center",
                              justifyContent: "flex-start",
                            }}
                          >
                            <p>Tài xế {index + 1}</p>
                            &nbsp;
                            <Avatar
                              src={<img src={item.avatar} alt="avatar" />}
                            />
                          </div>

                          <div className="col">
                            <span
                              style={{
                                color: "black",
                                fontWeight: "500",
                                fontSize: "13px",
                              }}
                            >
                              Họ và tên: &nbsp;{" "}
                              <span className="fw-bold">{item.fullname}</span>
                            </span>
                            <br></br>
                            <span
                              style={{
                                color: "black",
                                fontWeight: "500",
                                fontSize: "13px",
                              }}
                            >
                              Số điện thoại liên hệ: &nbsp;{" "}
                              <span className="fw-bold">
                                {item.phonenumber}
                              </span>
                            </span>
                            <br></br>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: "red" }}>Chưa xác định</p>
                  )}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "red",
                  }}
                >
                  NGÀY TẠO ĐƠN
                  <br></br>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "13px",
                    }}
                  >
                    {customer_name.date_created}
                  </span>
                </p>
              </div>

              {customer_name.date_end !== null ? (
                <>
                  <div>
                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "13px",
                        color: "#c1b8b2",
                      }}
                    >
                      <span style={{ color: "blue" }}>THỜI GIAN NHẬN HÀNG</span>
                      <br></br>
                      <span
                        style={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                        }}
                      >
                        {customer_name.date_end}
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                ""
              )}

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
                style={{
                  justifyContent: "space-between",
                  marginTop: "30px",
                }}
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
                      <span
                        style={{
                          marginLeft: "5px",
                          fontSize: "13px",
                        }}
                      >
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
                      <span
                        style={{
                          marginLeft: "5px",
                          fontSize: "13px",
                        }}
                      >
                        Chuyển khoản
                      </span>
                    </div>
                  )}
                </p>
              </div>

              <div
                className="d-flex"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <p>Phí thuê xe vận chuyển ({item.distance})</p>
                <p>{item.vehicle_price.toLocaleString()} đ</p>
              </div>
              <div
                className="d-flex"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <p>
                  Nhân công bốc vác (x
                  {item.man_power_quantity})
                </p>
                <p>{item.man_power_price.toLocaleString()} đ</p>
              </div>

              <div>
                {item.moving_fee.map((item, index) => (
                  <div
                    className="d-flex"
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <p>{item.name.split("(")[0]}</p>
                    <p>{item.price.toLocaleString()} đ</p>
                  </div>
                ))}

                {item.service_fee.map((item, index) => (
                  <div
                    className="d-flex"
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <p>{item.name.split("(")[0]}</p>
                    <p>{item.price.toLocaleString()} đ</p>
                  </div>
                ))}

                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                  }}
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
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <p className="fw-bold">* Chi phí phát sinh: </p>
                      <p className="fw-bold"></p>
                    </div>

                    <div
                      className="d-flex"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <p>{item.more_fee_name}</p>
                      <p className="fw-bold" style={{ color: "green" }}>
                        +{item.more_fee_price.toLocaleString()} đ
                      </p>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {/* Phí đền bù */}
                {item.offset_fee_name !== null ? (
                  <>
                    <div
                      className="d-flex"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <p className="fw-bold">* Chi phí đền bù: </p>
                      <p className="fw-bold"></p>
                    </div>

                    <div
                      className="d-flex"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <p>{item.offset_fee_name}</p>
                      <p className="fw-bold" style={{ color: "red" }}>
                        -{item.offset_fee_price.toLocaleString()} đ
                      </p>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    marginTop: "25px",
                  }}
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

                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    marginTop: "25px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      fontSize: "13px",
                      color: "#c1b8b2",
                    }}
                  >
                    TRẠNG THÁI THANH TOÁN
                  </p>
                  <p style={{ color: "orange" }}>{item.payment_status}</p>
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

  const [searchAllOrder, setSearchAllOrder] = useState("");

  useEffect(() => {
    show_order_customer(check_active(activeKeyTab));

    //Kiểm tra xem có id_order không?
    if (params.id_order != "") {
      console.log(params.id_order);

      setSearchAllOrder(params.id_order);
      setTimeout(() => {
        search_all_order();
      }, 1100);
    }
  }, [search, searchAllOrder]);

  //Tìm tất cả đơn hàng
  const search_all_order = async () => {
    setIsActive(true);
    let arr_customer_id = await axios.get("/v1/order/viewAllOrder");
    let arr_CI = [];
    arr_customer_id.data.forEach((item, index) => {
      arr_CI.push(item.customer_id);
    });

    if (arr_CI) {
      let arr_data_get = await axios.post(
        `/v1/customer/getArrFullName`,
        arr_CI
      );

      const arr_customer_name = arr_data_get.data;

      await axios
        .get(`/v1/order/viewAllOrder`)
        .then(async (data) => {
          let dataOrder = data.data;

          const data_order = [];
          dataOrder &&
            dataOrder.forEach((item, index) => {
              const ob_order = {
                id_order_detail: item.order_detail_id,
                STT: index + 1,
                order_id: item.order_id,
                service_name: item.service_name,
                reason_cancel: item.reason_cancel,
                status: item.status,
                date_end: item.date_end,
                date_created: item.date_created,
                time_get_item: `${item.time_start} - ${item.date_start}`,
                router: `${item.fromLocation} - ${item.toLocation}`,
                driver_name: item.driver_name,
                vehicle_name: item.vehicle_name,
                totalOrder: item.totalOrder,
                customer_id: item.customer_id,
                customer_name: arr_customer_name[index],
                electronic_signature: item.electronic_signature,
              };
              data_order.push(ob_order);
            });

          console.log(searchAllOrder);

          let new_arr = data_order.filter((item) => {
            // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
            let word_Change_VN = removeVietnameseTones(item.order_id); //Tìm theo mã đơn hàng
            let word_search = removeVietnameseTones(searchAllOrder);

            // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
            return searchAllOrder.toLowerCase() === ""
              ? item
              : word_Change_VN.toLowerCase().includes(word_search);
          });

          if (new_arr.length === 0) {
            let new_arr_service = data_order.filter((item) => {
              // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
              let word_Change_VN = removeVietnameseTones(item.customer_name); //Tìm theo tên khách hàng
              let word_search = removeVietnameseTones(searchAllOrder);

              // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
              return searchAllOrder.toLowerCase() === ""
                ? item
                : word_Change_VN.toLowerCase().includes(word_search);
            });

            if (new_arr_service.length === 0) {
              let new_arr_service_driver = data_order.filter((item) => {
                //Tìm theo tên của tài xế
                let driverNameInDB = item.driver_name;

                //Tên tài xế nhập vào
                let driverNameInput = searchAllOrder;

                let count = 0;
                driverNameInDB.forEach((item1, index) => {
                  let word_Change_VN = removeVietnameseTones(item1);
                  let word_search = removeVietnameseTones(driverNameInput);
                  if (word_Change_VN.toLowerCase().includes(word_search)) {
                    count++;
                  }
                });

                if (count > 0) {
                  return item;
                }
              });

              console.log(new_arr_service_driver);

              setOrderCount(new_arr_service_driver.length);
              setDataOrder(new_arr_service_driver);
            } else {
              setOrderCount(new_arr_service.length);
              setDataOrder(new_arr_service);
            }
          } else {
            setOrderCount(new_arr.length);
            setDataOrder(new_arr);
          }

          setIsActive(false);
        })

        .catch((e) => {
          console.log(e);
        });
    }
  };

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

  //Xử lý xuất ra file Excel
  //Download Excel
  const download_data_xslx = () => {
    Swal.fire({
      title: "Bạn muốn tải xuống thông tin các đơn hàng ?",
      text: "Hãy nhấn vào xác nhận để tải xuống !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          //Create file xsls Excel
          // flatten object like this {id: 1, title:'', category: ''};
          const rows =
            dataOrder &&
            dataOrder.map((item, index) => ({
              STT: index + 1,
              order_id: item.order_id,
              status: item.status,
              service_name: item.service_name,
              reason_cancel: item.reason_cancel,
              time_get_item: item.time_get_item,
              router: item.router,
              date_end: item.date_end,
              customer_name: item.customer_name,
              driver_name: item.driver_name.join("-"),
              date_created: item.date_created,
              vehicle_name: item.vehicle_name,
              totalOrder: item.totalOrder,
            }));

          // create workbook and worksheet
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(rows);

          XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

          // customize header names
          XLSX.utils.sheet_add_aoa(worksheet, [
            [
              "Số thứ tự",
              "ID đơn hàng",
              "Trạng thái đơn hàng",
              "Tên dịch vụ",
              "Lý do hủy đơn",
              "Thời gian lấy hàng",
              "Lộ trình",
              "Thời gian nhận hàng",
              "Tên khách hàng",
              "Tài xế",
              "Ngày tạo đơn hàng",
              "Loại xe vận chuyển (Số lượng)",
              "Tổng đơn hàng",
            ],
          ]);

          XLSX.writeFile(workbook, "DonHangDichVu.xlsx", {
            compression: true,
          });
          Swal.fire({
            title: "Tải xuống thành công !",
            text: "Hoàn thành !",
            icon: "success",
            confirmButtonText: "Xác nhận",
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          title: "Tải xuống thất bại!",
          text: "Đơn hàng !",
          icon: "fail",
          confirmButtonText: "Xác nhận",
        });
        console.log(e);
      });
  };

  const onChangeTable = (pagination, filters, sorter, extra) => {
    setOrderCount(extra.currentDataSource.length);
    setDataOrder(extra.currentDataSource);
  };

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
                  colorPrimary: "white",
                  borderRadius: 5,
                  fontWeight: 700,
                  // Alias Token
                  colorBgContainer: "orange",
                },
              }}
            >
              <div
                className="d-flex"
                style={{
                  justifyContent: "flex-end",
                  overflow: "hidden",
                }}
              >
                <div
                  className="d-flex"
                  style={{
                    width: "570px",
                    height: "70px",
                    alignItems: "center",
                    textAlign: "right",
                    borderRadius: "10px",
                  }}
                >
                  <input
                    type="text"
                    id="find_service"
                    className="form-control form-control-lg"
                    placeholder="(Lọc theo Mã đơn hàng, Tên khách hàng, Tên tài xế)"
                    style={{
                      fontSize: "17px",
                      borderRadius: "3px",
                    }}
                    value={searchAllOrder}
                    onChange={(e) => setSearchAllOrder(e.target.value)}
                  />
                  <SearchOutlined
                    style={{
                      backgroundColor: "#559aff",
                      padding: "13px",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => search_all_order()}
                  />
                </div>
              </div>

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
                  justifyContent: "space-between",
                  borderRadius: "5px 0 0 5px",
                  overflow: "hidden",
                  marginBottom: "20px",
                  alignContent: "flex-end",
                }}
              >
                <div className="d-flex" style={{ flexDirection: "column" }}>
                  <div
                    className="d-flex"
                    style={{
                      width: "420px",
                      height: "100px",
                      alignItems: "flex-start",
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
                      style={{
                        fontSize: "17px",
                        borderRadius: "3px",
                      }}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="d-flex">
                    {/* Nút xuất ra file excel */}
                    <div
                      onClick={() => download_data_xslx()}
                      style={{
                        cursor: "pointer",
                        width: "40px",
                        height: "40px",
                        backgroundColor: "green",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        marginRight: "20px",
                      }}
                    >
                      <FileExcelOutlined />
                    </div>

                    {/* Nút reload lại dữ liệu */}
                    <div
                      onClick={() =>
                        show_order_customer(check_active(activeKeyTab))
                      }
                      style={{
                        cursor: "pointer",
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#ed883b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        marginRight: "20px",
                      }}
                    >
                      <ReloadOutlined />
                    </div>

                    {/* Nút lọc dữ liệu*/}
                    <div
                      onClick={() =>
                        show_order_customer(check_active(activeKeyTab))
                      }
                      style={{
                        cursor: "pointer",
                        width: "40px",
                        height: "40px",
                        backgroundColor: "red",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        marginRight: "20px",
                      }}
                    >
                      <FilterOutlined />
                    </div>

                    <div className="d-flex" style={{ alignItems: "center" }}>
                      <Tag color="#2db7f5">({orderCount} đơn hàng)</Tag>
                    </div>
                  </div>
                </div>

                {/* Chọn thời gian */}
                <div
                  style={{
                    padding: "5px",
                    border: "1px solid #ccc",
                    boxShadow: "1px 1px 2px #ccc",
                    borderRadius: "5px",
                    display: "flex",
                    height: "fit-content",
                    display: "200px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h6 className="text-center fw-bold">Thời gian lấy hàng</h6>
                    <div className="d-flex">
                      <RangePicker
                        defaultValue={[
                          dayjs("01/01/2021", dateFormat),
                          dayjs("31/12/2023", dateFormat),
                        ]}
                        format={dateFormat}
                        onCalendarChange={(a, b, c) => changeRangeTime(a, b, c)}
                      />
                    </div>
                  </div>
                </div>
                {/* Chọn khoảng giá */}
                <div
                  style={{
                    width: "36.5%",
                    flexDirection: "column",
                    border: "1px solid #ccc",
                    boxShadow: "1px 1px 2px #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                    textAlign: "center",
                  }}
                  className="d-flex"
                >
                  <div className="d-flex">
                    <div className="d-flex" style={{ flexDirection: "column" }}>
                      <h6 className="text-center fw-bold">Tổng giá đơn hàng</h6>
                      <Slider
                        style={{ width: "100%" }}
                        range={{
                          draggableTrack: true,
                        }}
                        defaultValue={[1, 10]}
                        onChange={(a, b) => changeRangePrice(a, b)}
                      />
                      <div
                        className="d-flex"
                        style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "5px",
                            width: "fit-content",
                          }}
                          value={
                            (startRangePrice * 1000000).toLocaleString() + " đ"
                          }
                        />{" "}
                        <ColumnWidthOutlined
                          style={{
                            color: "orange",
                            margin: "10px",
                          }}
                        />
                        <input
                          type="text"
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "5px",
                            width: "fit-content",
                          }}
                          value={
                            (endRangePrice * 1000000).toLocaleString() + " đ"
                          }
                        />{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TopCssContent>
            <div>
              <LoadingOverlayComponent status={isActive}>
                <Table
                  columns={columns}
                  dataSource={dataOrder}
                  onChange={onChangeTable}
                />
              </LoadingOverlayComponent>
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
