import React, { useEffect, useState, useRef } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button, Input } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";

import {
  Space,
  Table,
  Tag,
  Image,
  Modal,
  Avatar,
  Badge,
  Rate,
  Select,
} from "antd";

import Swal from "sweetalert2/dist/sweetalert2.js";

import { StarFilled } from "@ant-design/icons";

import "sweetalert2/src/sweetalert2.scss";

import { useNavigate } from "react-router-dom";

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
  RetweetOutlined,
  AimOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";

import axios from "axios";

import { useSelector } from "react-redux";
import { genStatusStyle } from "antd/es/input/style";

function Administrator() {
  const nav = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [dataSource2, setDataSource2] = useState([]);
  const [statusProfile, setStatusProfile] = useState("Đang hoạt động");
  const [statusProfile2, setStatusProfile2] = useState("Đang hoạt động");
  const department = useRef("Bộ phận mới");

  //Dùng cái này để check xem khi người dùng là quản lý chỉ có thể thay đổi bộ phận quản lý hoặc nhân
  const check_admin_login = useSelector(
    (state) => state.admin.login?.currentAdmin
  );

  const [checkLockAccount, setCheckLockAccount] = useState(false);
  const [checkLockAccount2, setCheckLockAccount2] = useState(false);

  //Set bộ phận phòng ban
  const handleChangeDepartment = (value) => {
    department.current = value;
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
      title: "Tài khoản",
      dataIndex: "username",
      key: "username",
      ...getColumnSearchProps("username"),
    },
    {
      title: "Quản trị viên",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Bộ phận",
      dataIndex: "department",
      key: "department",
      filters: [
        {
          text: "Nhân sự",
          value: "Nhân sự",
        },
        {
          text: "Quản lý",
          value: "Quản lý",
        },
        {
          text: "Nhân viên",
          value: "Nhân viên",
        },
      ],
      onFilter: (value, record) => record.department.indexOf(value) === 0,
      render: (department, id) => (
        <div className="d-flex">
          <Tag
            color={
              department === "Nhân viên"
                ? "#cccccc"
                : department === "Nhân sự"
                ? "#f50"
                : "#108ee9"
            }
            key={department}
          >
            {department}
          </Tag>
          <div
            onClick={() => changeDepartment(department, id)}
            style={{
              backgroundColor: "purple",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <RetweetOutlined
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
            onClick={() => nav(`/admin/administrator/edit/${id.id}`)}
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
            onClick={() => view_detail_admin(id)}
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
            onClick={() => lock_account_admin(username)}
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

  const columns2 = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <td>
          <Badge
            dot
            style={{
              backgroundColor: "green",
              width: "8px",
              height: "8px",
              position: "absolute",
              border: "1px solid white",
              top: "5px",
              right: "4px",
            }}
          >
            <Avatar
              src={<img src={avatar} alt="avatar" />}
              style={{ border: "1px solid #ccc" }}
            />
          </Badge>
        </td>
      ),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phonenumber",
      key: "phonenumber",
      ...getColumnSearchProps("phonenumber"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (
        id //Khóa hồ sơ tài khoản
      ) => (
        <Space size="middle" className="icon_hover">
          <Link
            onClick={() => lock_account_customer(id)}
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

  //Thay đổi bộ phận quản trị viên
  const changeDepartment = (department_input, id) => {
    if (
      check_admin_login.department === "Quản lý" &&
      department_input === "Nhân sự"
    ) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Chỉ có thể thay đổi bộ phận nhân viên !",
        showConfirmButton: false,
        timer: 1200,
      });
    } else {
      Modal.success({
        title: "",
        content: (
          <>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                width: "500px",
                margin: "0 auto",
                height: "fit-content",
              }}
            >
              <h6
                style={{
                  backgroundColor: "#f1a062",
                  textAlign: "center",
                  color: "white",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Thay đổi bộ phận quản trị viên
              </h6>
              <div className="row" style={{ padding: "10px" }}>
                <div className="col">
                  <Avatar
                    src={<img src={id.avatar} alt="avatar" />}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginLeft: "20px",
                    }}
                  />
                </div>
                <div className="col">
                  <div className="row" style={{ color: "#f1a062" }}>
                    Tài khoản
                  </div>
                  <div className="row" style={{ color: "#f1a062" }}>
                    Quản trị viên
                  </div>
                </div>
                <div className="col">
                  <div className="row">{id.username}</div>
                  <div className="row">{id.fullname}</div>
                </div>
              </div>
              <div
                className="row"
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexWrap: "nowrap",
                }}
              >
                <div style={{ width: "160px" }}>
                  <input
                    value={id.department}
                    className="form form-control"
                    style={{
                      marginLeft: "20px",
                      fontWeight: "bold",
                    }}
                    disabled
                  />
                </div>

                <div
                  style={{
                    width: "50px",
                    color: "red",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DoubleRightOutlined />
                </div>
                <div style={{ width: "fit-content" }} className="dropdownadmin">
                  <Select
                    defaultValue="Bộ phận mới"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "20px",
                    }}
                    onChange={handleChangeDepartment}
                    options={[
                      {
                        value: "Bộ phận mới",
                        label: "Bộ phận mới",
                      },
                      {
                        value: "Nhân sự",
                        label: "Nhân sự",
                      },
                      {
                        value: "Quản lý",
                        label: "Quản lý",
                      },
                      {
                        value: "Nhân viên",
                        label: "Nhân viên",
                      },
                    ]}
                  />
                </div>
              </div>
              <div>
                <button
                  className="btn btn-success"
                  style={{
                    marginLeft: "20px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                  onClick={() => changeDepartmentAccess(id)}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </>
        ),
        onOk() {},
      });
    }
  };

  //Hàm thực hiện thay đổi bộ phận quản trị viên
  const changeDepartmentAccess = async (id) => {
    //Cập nhật trong admin Account
    let username_admin = id.username;
    const id_admin_account = await axios.get(
      `/v1/admin/get_admin_account_with_username/${username_admin}`
    );

    if (id_admin_account) {
      await axios
        .patch(
          `/v1/admin/updateonefield_admin_account/${id_admin_account.data._id}`,
          {
            department: department.current,
          }
        )
        .then(async (data) => {
          //Cập nhật trong Admin
          await axios
            .patch(`/v1/admin/updateonefield_admin/${id.id}`, {
              department: department.current,
            })
            .then((data) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi bộ phận quản trị viên thành công !",
                showConfirmButton: false,
                timer: 1200,
              });
              get_admin();
              Modal.destroyAll();
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Thay đổi bộ phận quản trị viên thất bại !",
                showConfirmButton: false,
                timer: 1200,
              });
            });
        });
    }
  };

  //Khóa tài khoản quản trị viên
  const lock_account_admin = async (username) => {
    let username_admin = username.username;
    let data_account_admin = await axios.get(
      `/v1/admin/getadmin_account/${username_admin}`
    );

    let status_account_admin = data_account_admin.data.status_account;
    Swal.fire({
      title: "Bạn muốn thay đổi trạng thái tài khoản ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .patch(`/v1/admin/lockadmin_account/${username_admin}`, {
              status_account: !status_account_admin,
            })
            .then((data) => {
              get_admin();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi trạng thái tài khoản thành công !",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Thay đổi trạng thái tài khoản thất bại !",
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
          title: "Thay đổi trạng thái tài khoản thất bại !",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  //Khóa tài khoản quản khàng
  const lock_account_customer = async (id) => {
    await axios
      .patch(`/v1/user/lock_account_customer/${id.id}`, { status: !id.status })
      .then((data) => {
        get_customer();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thay đổi trạng thái tài khoản thành công !",
          showConfirmButton: false,
          timer: 1200,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Thay đổi trạng thái tài khoản thất bại !",
          showConfirmButton: false,
          timer: 1200,
        });
      });
  };

  //Search Realtime
  const [search, setSearch] = useState("");
  useEffect(() => {
    get_admin();
  }, [search]);

  //Search Realtime Khách hàng
  const [search2, setSearch2] = useState("");
  useEffect(() => {
    get_customer();
  }, [search2]);

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
    get_admin("Bị khóa");
    setStatusProfile("Bị khóa");
  };

  //Tài khoản khách hàng bị khóa
  const showAccountLock2 = () => {
    setCheckLockAccount2(!checkLockAccount2);
    get_customer("Bị khóa");
    setStatusProfile2("Bị khóa");
  };

  const get_admin = async (status_account) => {
    try {
      let data_account_admin = await axios.get(`/v1/admin/getalladmin_account`);

      let arr_data_account_status = data_account_admin.data.map(
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
          .get(`/v1/admin/show_all_admin`)
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
                    email: item.email,
                    fullname: item.fullname,
                    department: item.department,
                    status: item.status,
                    status_account: arr_data_account_status[index],
                    username: item.username,
                  };
                  data_item.push(ob_service);
                }
              });

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

  //Lấy tài khoản khách hàng
  const get_customer = async (status_account) => {
    try {
      let data_account_customer = await axios.get(`/v1/user/get_all_user`);

      let arr_data_account_status = data_account_customer.data.map(
        (item, index) => {
          return item.status;
        }
      );

      if (status_account === "Bị khóa") {
        status_account = false;
      } else {
        status_account = true;
      }

      var dataCustomerApi = await axios.get("v1/customer/get_all_customer");
      var arrAvatar = dataCustomerApi.data.map((item, index) => {
        return item.avatar;
      });

      if (arr_data_account_status) {
        await axios
          .get(`/v1/user/get_all_user`)
          .then((data) => {
            let data_solve = data.data;
            const data_item = [];
            data_solve &&
              data_solve.forEach((item, index) => {
                if (arr_data_account_status[index] === status_account) {
                  const ob_service = {
                    id: item._id,
                    STT: index + 1,
                    email: item.email,
                    fullname: item.fullname,
                    phonenumber: item.phonenumber,
                    status: item.status,
                    status_account: arr_data_account_status[index],
                    avatar: arrAvatar[index],
                  };
                  data_item.push(ob_service);
                }
              });

            let new_arr = data_item.filter((item) => {
              // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
              let word_Change_VN = removeVietnameseTones(item.fullname);
              let word_search = removeVietnameseTones(search2);
              // Kiểm tra xem chuỗi đã được chuyển đổi có chứa từ khóa tìm kiếm hay không
              return search2.toLowerCase() === ""
                ? item
                : word_Change_VN.toLowerCase().includes(word_search);
            });
            setDataSource2(new_arr);
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
    let id_admin = id.id;
    Swal.fire({
      title: "Bạn muốn thay đổi trạng thái tài khoản quản trị viên ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .patch(`/v1/admin/updateonefield_admin/${id_admin}`, {
              status: status === "Sẵn sàng" ? "Đang bận" : "Sẵn sàng",
            })
            .then((data) => {
              get_admin();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi trạng thái quản trị viên thành công !",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Thay đổi trạng thái quản tị viên thất bại !",
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
          title: "Thay đổi trạng thái quản trị viên thất bại !",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  const view_detail_admin = async (id) => {
    await axios
      .get(`/v1/admin/view_detail_admin/${id.id}`)
      .then(async (data) => {
        let data_result = data.data;
        console.log(data_result);
        Modal.success({
          title: "Thông tin chi tiết hồ sơ quản trị viên",
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
                      objectFit: "fill",
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
                    <div className="col"></div>
                    <div
                      className="col"
                      style={{
                        borderRadius: "5px",
                        backgroundColor:
                          data_result.department == "Nhân sự"
                            ? "#FF5500"
                            : data_result.department == "Quản lý"
                            ? "#108EE9"
                            : "#CCCCCC",
                        color: "white",
                        fontWeight: "bold",
                        marginTop: "5px",
                      }}
                    >
                      Bộ phận: &nbsp;&nbsp;
                      {data_result.department}
                    </div>
                    <div className="col"></div>
                  </div>
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
                  title: "Quản trị viên",
                },
              ]}
            />
          </div>

          {/* Tài khoản quản trị viên */}
          <BottomCssContent>
            <TopCssContent>
              <p>Tài khoản quản trị viên</p>
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
                    placeholder="Nhập vào tên quản trị viên..."
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
                    <LockOutlined /> &nbsp; TÀI KHOẢN BỊ KHÓA
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
                      get_admin();
                      setStatusProfile("Đang hoạt động");
                      setCheckLockAccount(!checkLockAccount);
                    }}
                  >
                    <UnlockOutlined />
                    &nbsp; TÀI KHOẢN HOẠT ĐỘNG
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
                Trạng thái tài khoản: &nbsp;
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

              <Link to="/admin/administrator/add">
                <Button
                  style={{
                    backgroundColor: "#344767",
                    color: "white",
                    float: "right",
                    marginBottom: "15px",
                  }}
                >
                  + THÊM TÀI KHOẢN
                </Button>
              </Link>
            </TopCssContent>

            <div>
              <Table columns={columns} dataSource={dataSource} />
            </div>
          </BottomCssContent>
          <br></br>

          {/* Tài khoản khách hàng */}
          <BottomCssContent>
            <TopCssContent>
              <p>Tài khoản khách hàng</p>
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
                    placeholder="Nhập vào tên khách hàng..."
                    style={{
                      fontSize: "17px",
                      borderRadius: "3px",
                    }}
                    onChange={(e) => setSearch2(e.target.value)}
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

                {!checkLockAccount2 ? (
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
                    onClick={() => showAccountLock2()}
                  >
                    <LockOutlined /> &nbsp; TÀI KHOẢN BỊ KHÓA
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
                      get_customer();
                      setStatusProfile2("Đang hoạt động");
                      setCheckLockAccount2(!checkLockAccount2);
                    }}
                  >
                    <UnlockOutlined />
                    &nbsp; TÀI KHOẢN HOẠT ĐỘNG
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
                Trạng thái tài khoản: &nbsp;
                <span>
                  <Tag
                    color={
                      statusProfile2 === "Đang hoạt động" ? "#87d068" : "#f50"
                    }
                  >
                    {statusProfile2}
                  </Tag>
                </span>
              </p>
            </TopCssContent>

            <div>
              <Table columns={columns2} dataSource={dataSource2} />
            </div>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default Administrator;
