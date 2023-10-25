import React, { useEffect, useState, useRef } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button, Input } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";

import { Space, Table, Tag, Image, Modal, Avatar, Badge, Rate } from "antd";

import Swal from "sweetalert2/dist/sweetalert2.js";

import { StarFilled } from "@ant-design/icons";

import "sweetalert2/src/sweetalert2.scss";

import { useNavigate } from "react-router-dom";
import Highlighter from "react-highlight-words";

import {
  EditOutlined,
  FolderViewOutlined,
  LockOutlined,
  SwapOutlined,
  SearchOutlined,
  BarcodeOutlined,
  ManOutlined,
  WomanOutlined,
  MailOutlined,
  CalendarOutlined,
  PhoneOutlined,
  HomeOutlined,
  TrophyOutlined,
  UnlockOutlined,
  AimOutlined,
  CarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import axios from "axios";

function DriverAdmin() {
  const nav = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [statusProfile, setStatusProfile] = useState("Đang hoạt động");

  const [checkLockAccount, setCheckLockAccount] = useState(false);

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

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar, status) => (
        <td>
          <Badge
            dot
            style={{
              backgroundColor: status.status == "Sẵn sàng" ? "green" : "red",
              width: "8px",
              height: "8px",
              position: "absolute",
              border: "1px solid white",
              top: "5px",
              right: "4px",
            }}
          >
            <Avatar src={<img src={avatar} alt="avatar" />} />
          </Badge>
        </td>
      ),
    },
    {
      title: "Tài xế",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phonenumber",
      key: "phonenumber",
      ...getColumnSearchProps("phonenumber"),
    },
    {
      title: "Lượt giao hàng",
      dataIndex: "id_delivery",
      key: "id_delivery",
      // defaultSortOrder: "ascend",
      sorter: (a, b) => a.id_delivery - b.id_delivery,
    },
    {
      title: "Lượt đánh giá",
      dataIndex: "id_rating",
      key: "id_rating",
      // defaultSortOrder: "ascend",
      sorter: (a, b) => a.id_rating - b.id_rating,
    },
    {
      title: "Sao trung bình",
      dataIndex: "star_average",
      key: "star_average",
      // defaultSortOrder: "ascend",
      sorter: (a, b) => a.star_average - b.star_average,
      render: (star_average) => (
        <td>
          {star_average} &nbsp;
          <StarFilled style={{ color: "#f1a062" }} />
        </td>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Sẵn sàng",
          value: "Sẵn sàng",
        },
        {
          text: "Đang bận",
          value: "Đang bận",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status, id) => (
        <div className="d-flex">
          <Tag color={status === "Sẵn sàng" ? "green" : "volcano"} key={status}>
            {status === "Sẵn sàng" ? "Sẵn sàng" : "Đang bận"}
          </Tag>
          <div
            onClick={() => changeStatus(id, status)}
            style={{
              backgroundColor: "orange",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <SwapOutlined
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (
        id, //Khóa hồ sơ tài khoản, xem chi tiết, chỉnh sửa,
        username
      ) => (
        <Space size="middle" className="icon_hover">
          <div
            onClick={() => nav(`/admin/driver/edit/${id.id}`)}
            style={{
              backgroundColor: "green",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <EditOutlined
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            />
          </div>

          <div
            onClick={() => view_detail_driver(id)}
            style={{
              backgroundColor: "blue",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <FolderViewOutlined
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            />
          </div>
          <Link
            onClick={() => lock_account_driver(username)}
            style={{
              backgroundColor: "red",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
            }}
          >
            <LockOutlined
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Link>
        </Space>
      ),
    },
  ];

  //Khóa hồ sơ tài xế
  const lock_account_driver = async (username) => {
    let username_driver = username.username;
    let data_account_driver = await axios.get(
      `/v1/driver/getdriver_account/${username_driver}`
    );

    let status_account_driver = data_account_driver.data.status_account;
    Swal.fire({
      title: "Bạn muốn thay đổi trạng thái hồ sơ ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .patch(`/v1/driver/lockdriver_account/${username_driver}`, {
              status_account: !status_account_driver,
            })
            .then((data) => {
              get_driver();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi trạng thái hồ sơ thành công !",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Thay đổi trạng thái hồ sơ thất bại !",
                showConfirmButton: false,
                timer: 1200,
              });
              console.log(e);
            });
        }
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Thay đổi trạng thái hồ sơ thất bại !",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  //Search Realtime
  const [search, setSearch] = useState("");
  useEffect(() => {
    get_driver();
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

  //Tài khoản bị khóa
  const showAccountLock = () => {
    setCheckLockAccount(!checkLockAccount);
    get_driver("Bị khóa");
    setStatusProfile("Bị khóa");
  };

  const get_driver = async (status_account) => {
    try {
      let data_account_driver = await axios.get(
        `/v1/driver/getalldriver_account`
      );

      let arr_data_account_status = data_account_driver.data.map(
        (item, index) => {
          return item.status_account;
        }
      );

      if (status_account === "Bị khóa") {
        status_account = false;
      } else {
        status_account = true;
      }

      if (arr_data_account_status) {
        await axios
          .get(`/v1/driver/show_all_driver`)
          .then((data) => {
            let data_solve = data.data;
            const data_item = [];
            data_solve &&
              data_solve.forEach((item, index) => {
                if (arr_data_account_status[index] === status_account) {
                  const ob_service = {
                    id: item._id,
                    STT: index + 1,
                    avatar: item.avatar,
                    fullname: item.fullname,
                    phonenumber: item.phonenumber,
                    id_rating: item.id_rating.length,
                    id_delivery: item.id_delivery.length,
                    star_average: item.star_average,
                    status: item.status,
                    status_account: arr_data_account_status[index],
                    username: item.username,
                  };
                  data_item.push(ob_service);
                }
              });

            console.log(data_item);
            let new_arr = data_item.filter((item) => {
              // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
              let word_Change_VN = removeVietnameseTones(item.fullname);
              let word_search = removeVietnameseTones(search);
              // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
              return search.toLowerCase() === ""
                ? item
                : word_Change_VN.toLowerCase().includes(word_search);
            });
            setDataSource(new_arr);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //Thay đổi trạng thái tài xế
  const changeStatus = (id, status) => {
    let id_driver = id.id;
    Swal.fire({
      title: "Bạn muốn thay đổi trạng thái tài xế ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .patch(`/v1/driver/updateonefield_driver/${id_driver}`, {
              status: status === "Sẵn sàng" ? "Đang bận" : "Sẵn sàng",
            })
            .then((data) => {
              get_driver();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi trạng thái tài xế thành công !",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Thay đổi trạng thái tài xế thất bại !",
                showConfirmButton: false,
                timer: 1200,
              });
              console.log(e);
            });
        }
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Thay đổi trạng thái tài xế thất bại !",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  const view_detail_driver = async (id) => {
    let data_rating_driver = await axios.get(
      `/v1/ratingDriver/get_rating_driver/${id.fullname}`
    );

    let arr_rating_driver = data_rating_driver.data.map((item, index) => {
      const ob = {
        star: item.star,
        comment: item.comment,
        customer_name: item.customer_name,
        rating_date: item.rating_date,
      };
      return ob;
    });

    let data_delivery_driver = await axios.get(`/v1/order/viewAllOrder`);
    let arr_delivery_driver = data_delivery_driver.data.map((item, index) => {
      if (
        item.status === "Đã hoàn thành" &&
        item.driver_name.includes(id.fullname)
      ) {
        const ob = {
          fromLocation: item.fromLocation,
          toLocation: item.toLocation,
          service_name: item.service_name,
          date_start: item.date_start,
          date_end: item.date_end,
        };

        return ob;
      }
    });

    await axios
      .get(`/v1/driver/view_detail_driver/${id.id}`)
      .then(async (data) => {
        let data_result = data.data;

        Modal.success({
          title: "Thông tin chi tiết hồ sơ tài xế",
          content: (
            <>
              <div
                className="info_driver text-center"
                style={{
                  border: "1px solid #ea9868",
                  borderRadius: "5px",
                  padding: "5px",
                }}
              >
                <h4 style={{ color: "#ea9868" }}>THÔNG TIN CÁ NHÂN</h4>
                <div>
                  <img
                    src={data_result.avatar}
                    style={{
                      borderRadius: "50%",
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      marginBottom: "5px",
                    }}
                    alt="anh"
                  />
                  <p
                    style={{
                      color: "#ea9868",
                      fontWeight: "500",
                      fontSize: "16px",
                    }}
                  >
                    {data_result.fullname}
                  </p>
                  <p style={{ marginTop: "-10px" }}>
                    <Rate
                      disabled
                      allowHalf
                      defaultValue={data_result.star_average}
                    />
                  </p>
                </div>
                <div>
                  <div className="row">
                    <div className="col">
                      <BarcodeOutlined /> &nbsp;&nbsp;
                      {data_result.profile_code}
                    </div>
                    <div className="col">
                      {data_result.gender === "Nam" ? (
                        <ManOutlined />
                      ) : (
                        <WomanOutlined />
                      )}{" "}
                      &nbsp;&nbsp;
                      {data_result.gender}
                    </div>
                    <div className="col">
                      <CalendarOutlined />
                      &nbsp;&nbsp;
                      {data_result.date_of_birth}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <PhoneOutlined />
                      &nbsp;&nbsp;
                      {data_result.phonenumber}
                    </div>
                    <div className="col">
                      <MailOutlined />
                      &nbsp;&nbsp;{data_result.email}
                    </div>
                    <div className="col">
                      <HomeOutlined />
                      &nbsp;&nbsp;{data_result.address}
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col"
                      style={{
                        color: "#ea9868",
                        fontWeight: "bold",
                      }}
                    >
                      <AimOutlined /> {data_result.location_delivery}
                    </div>
                    <div className="col"></div>
                    <div className="col"></div>
                  </div>
                </div>
              </div>

              <div
                className="thanhtich"
                style={{
                  border: "1px solid #ea9868",
                  padding: "5px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <h5
                  style={{
                    color: "#ea9868",
                    marginBottom: "10px",
                  }}
                >
                  <TrophyOutlined />
                  &nbsp;&nbsp; Thành tích
                </h5>
                <div className="row">
                  <div className="col">
                    Sao trung bình:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {" "}
                      {data_result.star_average}&nbsp;
                      <StarFilled style={{ color: "#f1a062" }} />
                    </span>
                  </div>

                  <div className="col">
                    Số lượt vận chuyển:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {data_result.id_delivery.length}
                    </span>
                  </div>
                  <div className="col">
                    Số lượt đánh giá:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {data_result.id_rating.length}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="lichsuvanchuyen"
                style={{
                  border: "1px solid #ea9868",
                  padding: "5px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <h4
                  style={{
                    color: "#ea9868",
                    fontWeight: "600",
                  }}
                >
                  LỊCH SỬ VẬN CHUYỂN
                </h4>
                <div>
                  {arr_delivery_driver &&
                    arr_delivery_driver.map((item, index) => (
                      <>
                        <div
                          className="d-flex"
                          style={{
                            justifyContent: "space-between",
                            border: "1px solid #ccc",
                            padding: "7px",
                            borderRadius: "5px",
                            margin: "5px",
                          }}
                        >
                          <div>
                            <CarOutlined />
                          </div>
                          <div>
                            <span style={{ color: "red" }}>
                              1. {item?.fromLocation}
                            </span>
                            <ArrowRightOutlined
                              style={{
                                color: "orange",
                              }}
                            />
                            <span
                              style={{
                                color: "#7bd6e5",
                              }}
                            >
                              2. {item?.toLocation}
                            </span>
                          </div>
                          <div>
                            {item?.date_start} - {item?.date_end}
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </div>

              <div
                className="lichsudanhgia"
                style={{
                  border: "1px solid #ea9868",
                  padding: "5px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <h4
                  style={{
                    color: "#ea9868",
                    fontWeight: "600",
                  }}
                >
                  LỊCH SỬ ĐÁNH GIÁ
                </h4>
                <div>
                  {arr_rating_driver &&
                    arr_rating_driver.map((item, index) => (
                      <>
                        <div
                          className="d-flex"
                          style={{
                            justifyContent: "space-between",
                            border: "1px solid #ccc",
                            padding: "7px",
                            borderRadius: "5px",
                            margin: "5px",
                          }}
                        >
                          <div>
                            <Rate disabled defaultValue={item.star} />
                          </div>
                          <div>
                            {item.comment} - (Khách hàng đánh giá :
                            <span className="fw-bold">
                              {item.customer_name}
                            </span>
                            )
                          </div>
                          <div style={{ color: "#ccc" }}>
                            {item.rating_date}
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </div>
            </>
          ),
          onOk() {},
        });
      })
      .catch((e) => console.log(e));
  };

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
                  title: "Tài xế",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Tài xế</p>
              <div className="d-flex">
                <div
                  className="d-flex"
                  style={{
                    width: "300px",
                    borderRadius: "5px",
                  }}
                >
                  <input
                    type="text"
                    id="find_blog"
                    className="form-control form-control-lg"
                    placeholder="Nhập vào tên tài xế..."
                    style={{
                      fontSize: "17px",
                      borderRadius: "3px",
                    }}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <SearchOutlined
                    style={{
                      backgroundColor: "#ed883b",
                      padding: "13px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                </div>

                {!checkLockAccount ? (
                  <div
                    className="d-flex"
                    style={{
                      width: "fit-content",
                      borderRadius: "5px",
                      marginLeft: "50px",
                      backgroundColor: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => showAccountLock()}
                  >
                    <LockOutlined /> &nbsp; HỒ SƠ BỊ KHÓA
                  </div>
                ) : (
                  <div
                    className="d-flex"
                    style={{
                      width: "fit-content",
                      borderRadius: "5px",
                      marginLeft: "50px",
                      backgroundColor: "#7bd6e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      get_driver();
                      setStatusProfile("Đang hoạt động");
                      setCheckLockAccount(!checkLockAccount);
                    }}
                  >
                    <UnlockOutlined />
                    &nbsp; HỒ SƠ HOẠT ĐỘNG
                  </div>
                )}
              </div>

              <p
                style={{
                  marginTop: "20px",
                  display: "inline-block",
                  border: "1px solid #f1a062",
                  backgroundColor: "#f1a062",
                  color: "white",
                  borderRadius: "5px",
                  padding: "7px",
                }}
              >
                Trạng thái hồ sơ: &nbsp;
                <span>
                  <Tag
                    color={
                      statusProfile === "Đang hoạt động" ? "#87d068" : "#f50"
                    }
                  >
                    {statusProfile}
                  </Tag>
                </span>
              </p>

              <Link to="/admin/driver/add">
                <Button
                  style={{
                    backgroundColor: "#344767",
                    color: "white",
                    float: "right",
                    marginBottom: "15px",
                  }}
                >
                  + THÊM HỒ SƠ TÀI XẾ
                </Button>
              </Link>
            </TopCssContent>

            <div>
              <Table columns={columns} dataSource={dataSource} />
            </div>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default DriverAdmin;
