import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";

import { Space, Table, Tag, Image, Modal } from "antd";

import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";

import { useNavigate } from "react-router-dom";

import htmlReactParser from "html-react-parser";


import {
  EditOutlined,
  FolderViewOutlined,
  DeleteOutlined,
  SwapOutlined,
} from "@ant-design/icons";

import axios from "axios";

function BlogAdmin() {
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
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => (
        <td>
          <Image width={80} src={thumbnail} />
        </td>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "brand",
    },
    {
      title: "Ngày đăng",
      dataIndex: "post_date",
      key: "post_date",
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
            onClick={() => nav(`/admin/vehicle/edit/${id.id}`)}
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
            onClick={() => view_detail_blog(id)}
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
            onClick={() => delete_blog(id)}
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

  const get_blog = async () => {
    await axios
      .get(`/v1/blog/read_blog`)
      .then((data) => {
        let data_solve = data.data;
        const data_service = [];
        data_solve &&
          data_solve.forEach((item, index) => {
            const ob_service = {
              id: item._id,
              STT: index + 1,
              title: item.title,
              category: item.category,
              thumbnail: item.thumbnail,
              post_date: item.post_date,
              status:item.status
            };

            data_service.push(ob_service);
          });

        setDataSource(data_service);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const changeStatus = (id, status) => {
    let id_blog = id.id;
    Swal.fire({
      title: "Bạn muốn thay đổi trạng thái blog này ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .patch(`/v1/blog/updateonefield_blog/${id_blog}`, {
              status: !status,
            })
            .then((data) => {
              get_blog();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi trạng thái blog thành công !",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Thay đổi trạng thái blog thất bại !",
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
          title: "Thay đổi trạng thái blog thất bại !",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  useEffect(() => {
    get_blog();
  }, []);

  const delete_blog = (id) => {
    let id_blog = id.id;
    Swal.fire({
      title: "Bạn muốn xóa dịch vụ này ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .delete(`/v1/blog/delete_blog/${id_blog}`)
            .then((data) => {
              get_blog();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Xóa Blog thành công!",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Xóa Blog thất bại!",
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
          title: "Xóa Blog thất bại!",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  const view_detail_blog = async (id) => {
    await axios
      .get(`/v1/blog/view_detail_blog/${id.id}`)
      .then((data) => {
        let data_result = data.data;
        // console.log(data_result);
        const objectBlog = {
            content: data_result.content,
            // comment_blog_id :Array Tạm thời để đây mốt hiện comment lên
        };


        Modal.success({
          title: "Thông tin chi tiết Blog",
          content: (
            <>
              <h3>Nội dung Blog: </h3>
              <div>{htmlReactParser(objectBlog.content)}</div>
            </>
          ),
          onOk() {},
        });
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
                  title: "Blog",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Blog</p>
              <Link to="/admin/blog/add">
                <Button
                  style={{
                    backgroundColor: "#344767",
                    color: "white",
                    float: "right",
                    marginBottom: "15px",
                  }}
                >
                  + THÊM BLOG
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

export default BlogAdmin;
