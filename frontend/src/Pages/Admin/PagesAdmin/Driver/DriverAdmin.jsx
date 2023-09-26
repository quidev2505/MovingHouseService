import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";

import { Space, Table, Tag, Image, Modal, Avatar, Badge } from "antd";

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
} from "@ant-design/icons";

import axios from "axios";

function DriverAdmin() {
  const nav = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [statusProfile, setStatusProfile] = useState("Đang hoạt động");

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
    },
    {
      title: "Lượt giao hàng",
      dataIndex: "id_delivery",
      key: "id_delivery",
    },
    {
      title: "Lượt đánh giá",
      dataIndex: "id_rating",
      key: "id_rating",
    },
    {
      title: "Sao trung bình",
      dataIndex: "star_average",
      key: "star_average",
      defaultSortOrder: "ascend",
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
            <SwapOutlined style={{ color: "white", fontWeight: "bold" }} />
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
            <EditOutlined style={{ color: "white", fontWeight: "bold" }} />
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
              style={{ color: "white", fontWeight: "bold" }}
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
            <LockOutlined style={{ color: "white", fontWeight: "bold" }} />
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
    await axios
      .get(`/v1/driver/view_detail_driver/${id.id}`)
      .then(async (data) => {
        let data_result = data.data;

        Modal.success({
          title: "Thông tin chi tiết hồ sơ tài xế",
          content: (
            <>
              <div className="info_driver text-center">
                <h4>THÔNG TIN CÁ NHÂN</h4>
                <div>
                  <img src={data_result.avatar} />
                  <p>{data_result.fullname}</p>
                  <p>{data_result.star_average}</p>
                </div>
                <div>
                  <div className="row">
                    <div className="col">{data_result.profile_code}</div>
                    <div className="col">{data_result.gender}</div>
                  </div>
                  <div className="row">
                    <div className="col">{data_result.date_of_birth}</div>
                    <div className="col">{data_result.phonenumber}</div>
                  </div>
                  <div className="row">
                    <div className="col">{data_result.email}</div>
                    <div className="col">{data_result.address}</div>
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
                  style={{ width: "300px", borderRadius: "5px" }}
                >
                  <input
                    type="text"
                    id="find_blog"
                    className="form-control form-control-lg"
                    placeholder="Nhập vào tên tài xế..."
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
              </div>

              <p
                style={{
                  marginLeft: "10px",
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
                <span
                  style={{
                    color: statusProfile === "Đang hoạt động" ? "green" : "red",
                  }}
                >
                  {statusProfile}
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
