import React, { useEffect, useState, useRef } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";

import { Space, Table, Tag, Image, Modal, Avatar, Input } from "antd";

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

function BlogAdmin() {
  const nav = useNavigate();
  const [dataSource, setDataSource] = useState([]);

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
      ...getColumnSearchProps("category"),
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
      filters: [
        {
          text: "Hoạt động",
          value: true,
        },
        {
          text: "Tạm ngưng",
          value: false,
        },
      ],
      onFilter: (value, record) => String(record.status).indexOf(value) == 0,
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
      render: (id) => (
        <Space size="middle" className="icon_hover">
          <div
            onClick={() => nav(`/admin/blog/edit/${id.id}`)}
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
              style={{
                color: "white",
                fontWeight: "bold",
              }}
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
            <DeleteOutlined
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

  //Search Realtime
  const [search, setSearch] = useState("");
  useEffect(() => {
    get_blog();
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
              status: item.status,
            };

            data_service.push(ob_service);
          });

        let new_arr = data_service.filter((item) => {
          // Chuyển đổi tất cả các chuỗi có dấu sang không dấu
          let word_Change_VN = removeVietnameseTones(item.title);
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
      title: "Bạn muốn xóa blog này ?",
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
              Modal.destroyAll();
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
                            style={{
                              color: "white",
                              fontWeight: "bold",
                            }}
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
                  title: "Blog",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Blog</p>
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
                  placeholder="Nhập vào tiêu đề blog..."
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
