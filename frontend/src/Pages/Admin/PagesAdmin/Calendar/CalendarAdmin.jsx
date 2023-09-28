import React, { useEffect, useState } from "react";
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

import axios from "axios";

function CalendarAdmin() {
  const nav = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <td>
          <Image width={80} src={image} />
        </td>
      ),
    },
    {
      title: "Tên vật dụng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      filters: [
        {
          text: "Phòng khách",
          value: "Phòng khách",
        },
        {
          text: "Phòng ngủ",
          value: "Phòng ngủ",
        },
        {
          text: "Phòng bếp",
          value: "Phòng bếp",
        },
        {
          text: "Phòng tắm",
          value: "Phòng tắm",
        },
        {
          text: "Phòng làm việc",
          value: "Phòng làm việc",
        },
      ],
      onFilter: (value, record) => record.category.indexOf(value) === 0,
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, id) => (
        <div className="d-flex">
          <Tag color={status ? "green" : "volcano"} key={status}>
            {status ? "Hoạt động" : "Tạm ngưng"}
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
      render: (id) => (
        <Space size="middle" className="icon_hover">
          <div
            onClick={() => nav(`/admin/item/edit/${id.id}`)}
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

          <Link
            onClick={() => delete_item(id)}
            style={{
              backgroundColor: "red",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
            }}
          >
            <DeleteOutlined style={{ color: "white", fontWeight: "bold" }} />
          </Link>
        </Space>
      ),
    },
  ];

  //Search Realtime
  const [search, setSearch] = useState("");
  useEffect(() => {
    get_item();
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

  const get_item = async () => {
    await axios
      .get(`/v1/item/read_item`)
      .then((data) => {
        let data_solve = data.data;
        const data_item = [];
        data_solve &&
          data_solve.forEach((item, index) => {
            const ob_service = {
              id: item._id,
              STT: index + 1,
              name: item.name,
              category: item.category,
              image: item.image,
              size: item.size,
              status: item.status,
            };

            data_item.push(ob_service);
          });

        let new_arr = data_item.filter((item) => {
          // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
          let word_Change_VN = removeVietnameseTones(item.name);
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
  };

  const changeStatus = (id, status) => {
    let id_item = id.id;
    Swal.fire({
      title: "Bạn muốn thay đổi trạng thái vật dụng này ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .patch(`/v1/item/updateonefield_item/${id_item}`, {
              status: !status,
            })
            .then((data) => {
              get_item();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi trạng thái vật dụng thành công !",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Thay đổi trạng thái vật dụng thất bại !",
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
          title: "Thay đổi trạng thái vật dụng thất bại !",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  useEffect(() => {
    get_item();
  }, []);

  const delete_item = (id) => {
    let id_item = id.id;
    Swal.fire({
      title: "Bạn muốn xóa vật dụng này ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .delete(`/v1/item/delete_item/${id_item}`)
            .then((data) => {
              get_item();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Xóa vật dụng thành công!",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Xóa vật dụng thất bại!",
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
          title: "Xóa vật dụng thất bại!",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  const changeStatusComment = (id, status) => {
    let id_comment_blog = id;
    Swal.fire({
      title: "Bạn muốn thay đổi trạng thái comment này ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .patch(
              `/v1/commentBlog/updateonefield_comment_blog/${id_comment_blog}`,
              {
                status: !status,
              }
            )
            .then((data) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi trạng thái comment thành công !",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Thay đổi trạng thái comment thất bại !",
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
          title: "Thay đổi trạng thái comment thất bại !",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  const view_detail_blog = async (id) => {
    await axios
      .get(`/v1/blog/view_detail_blog/${id.id}`)
      .then(async (data) => {
        let data_result = data.data;

        const arr_commentBlogID = data_result.comment_blog_id;

        await axios
          .post(`/v1/commentBlog/read_comment_blog_id`, arr_commentBlogID)
          .then((data) => {
            const data_comment_blog = data.data;

            let DOM_LIST_COMMENT = data_comment_blog.map((item, index) => {
              return (
                <div
                  className="d-flex"
                  style={{
                    backgroundColor: "#edf2f8",
                    padding: "10px 10px 0 10px",
                    borderRadius: "5px",
                    height: "fit-content",
                    marginBottom: "10px",
                  }}
                >
                  <Avatar
                    src={item.avatar}
                    style={{
                      border: "1px solid #66b2f9",
                      backgroundColor: "black",
                    }}
                  />
                  <div
                    style={{
                      marginLeft: "15px",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                    className="d-flex"
                  >
                    <div>
                      <p
                        className="name_user"
                        style={{
                          color: "#66b2f9",
                          marginBottom: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.fullname}
                      </p>
                      <p className="comment_user" style={{ color: "#7b8082" }}>
                        {item.comment_content}
                      </p>
                    </div>

                    <div className="time_comment" style={{ color: "#b9babb" }}>
                      {item.comment_time}
                      <div className="d-flex">
                        <Tag
                          color={item.status ? "green" : "volcano"}
                          key={item.status}
                        >
                          {item.status ? "Hoạt động" : "Bị cấm"}
                        </Tag>
                        <div
                          onClick={() =>
                            changeStatusComment(item.id, item.status)
                          }
                          style={{
                            backgroundColor: "orange",
                            borderRadius: "50%",
                            padding: "5px",
                            display: "flex",
                            cursor: "pointer",
                          }}
                        >
                          <SwapOutlined
                            style={{ color: "white", fontWeight: "bold" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              );
            });

            const objectBlog = {
              content: data_result.content,
              comment_blog_id: data_result.comment_blog_id,
            };

            Modal.success({
              title: "Thông tin chi tiết Blog",
              content: (
                <>
                  <h5>Nội dung Blog: </h5>
                  <div className="content_blog_detail">
                    {htmlReactParser(objectBlog.content)}
                  </div>

                  <div>
                    <h5>Bình luận: </h5>
                    <p>
                      Số lượng :{" "}
                      <span className="fw-bold">
                        {objectBlog.comment_blog_id.length}
                      </span>
                    </p>
                    <div>{DOM_LIST_COMMENT}</div>
                  </div>
                </>
              ),
              onOk() {},
            });
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => {
        console.log(e);
      });
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
                  title: "Vật dụng",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Vật dụng</p>
              <div
                className="d-flex"
                style={{ width: "300px", borderRadius: "5px" }}
              >
                <input
                  type="text"
                  id="find_blog"
                  className="form-control form-control-lg"
                  placeholder="Nhập vào tên vật dụng..."
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

              <Link to="/admin/item/add">
                <Button
                  style={{
                    backgroundColor: "#344767",
                    color: "white",
                    float: "right",
                    marginBottom: "15px",
                  }}
                >
                  + THÊM VẬT DỤNG
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

export default CalendarAdmin;
