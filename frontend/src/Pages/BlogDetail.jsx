import React, { useState, useEffect } from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

import { useSelector } from "react-redux";

import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";
import { Alert, Input, Button, Avatar } from "antd";
import axios from "axios";

import { useSearchParams, useNavigate } from "react-router-dom";

import htmlReactParser from "html-react-parser";

import { SendOutlined } from "@ant-design/icons";

import { Toast_comment, Toast } from "../Components/ToastColor";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Tag } from "antd";
import { WechatOutlined, FieldTimeOutlined } from "@ant-design/icons";

import * as moment from "moment";
import "moment/locale/vi";

function BlogDetail() {
  const nav = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  const [isActive, setIsActive] = useState(true);
  const [ava, setAva] = useState();

  const [datablogDetail, setDataBlogDetail] = useState({});
  const [content, setContent] = useState("");
  const [searchParams] = useSearchParams();

  const [customer, setCustomer] = useState();

  const getInfoCustomer = async () => {
    if (user) {
      let id = user._id;

      await axios
        .get(`/v1/customer/get_customer_info/${id}`)
        .then((data) => {
          let data_customer = data.data;
          setCustomer(data_customer);
          setAva(data_customer.avatar);
        })
        .catch((e) => console.log(e));
    }
  };

  const get_blog = async () => {
    try {
      await axios
        .get(`/v1/blog/view_detail_blog_title/${searchParams.get("name")}`)
        .then((data) => {
          const dataBlog = data.data;

          setContent(dataBlog.content);
          setDataBlogDetail(dataBlog);
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  const [comment, setComment] = useState("");

  const [commentList, setCommentList] = useState([]);

  const [blogRelate, setBlogRelate] = useState([]);

  const getBlogRelate = async () => {
    try {
      const ApidataBlog = await axios.get("/v1/blog/read_blog");
      const arr_blog = ApidataBlog.data;

      let data_blog_relate = arr_blog.map((item, index) => {
        if (
          item.status &&
          item.category === searchParams.get("category") &&
          item.title !== searchParams.get("name")
        ) {
          return (
            <div
              className="blog_item"
              style={{
                borderRadius: "10px",
                marginRight: "20px",
                border: "1px solid #ccc",
                padding: "0px",
                width: "400px",
                boxShadow: "0.3px 0.3px #ccc",
                marginBottom: "20px",
                overflow: "hidden",
              }}
            >
              <img
                src={item.thumbnail}
                className="img-fluid col-lg"
                style={{
                  width: "400px",
                  height: "248px",
                  objectFit: "cover",
                }}
                alt=""
              ></img>
              <div
                className="d-flex"
                style={{
                  width: "fit-content",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <div className="date_img">
                  <Tag color="#ff914d ">#{item.category}</Tag>
                </div>
                <FontAwesomeIcon
                  icon={faCircle}
                  style={{
                    color: "#383839",
                    fontSize: "5px",
                    opacity: "0.6",
                    margin: "0 10px",
                  }}
                />
                <div className="date_img">
                  <Tag
                    color="green"
                    className="d-flex"
                    style={{ alignItems: "center" }}
                  >
                    <WechatOutlined style={{ marginRight: "5px" }} />{" "}
                    {item.comment_blog_id.length} bình luận
                  </Tag>
                </div>
                <FontAwesomeIcon
                  icon={faCircle}
                  style={{
                    color: "#383839",
                    fontSize: "5px",
                    opacity: "0.6",
                    margin: "0 10px",
                  }}
                />
                <div className="date_img">
                  <Tag
                    color="#2db7f5"
                    className="d-flex"
                    style={{ alignItems: "center" }}
                  >
                    <FieldTimeOutlined style={{ marginRight: "5px" }} />
                    {item.post_date}
                  </Tag>
                </div>
              </div>

              <div>
                <h5
                  style={{
                    fontWeight: "700",
                    fontSize: "21px",
                    margin: "10px 0",
                    padding: "5px",
                  }}
                >
                  {item.title}
                </h5>

                <button
                  type="submit"
                  style={{
                    backgroundColor: "#ff914d",
                    color: "white",
                    float: "right",
                    width: "fit-content",
                    height: "50px",
                    padding: "5px",
                    borderRadius: "5px",
                    border: "none",
                    margin: "5px",
                  }}
                  onClick={() => {
                    nav(
                      `/blog-detail/?name=${item.title}&category=${item.category}`
                    );
                    window.location.reload();
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          );
        }
      });

      //Xử lý arr
      const arrFinal = data_blog_relate.filter((item) => item != undefined)
      setBlogRelate(arrFinal);
    } catch (e) {
      console.log(e);
    }
  };

  const getDataComment = async () => {
    try {
      let id_blog = "";
      await axios
        .get(`/v1/blog/view_detail_blog_title/${searchParams.get("name")}`)
        .then((data) => {
          const dataBlog = data.data;
          id_blog = dataBlog._id;
        })
        .catch((e) => {
          console.log(e);
        });

      await axios
        .get(`/v1/commentBlog/read_comment_blog/${id_blog}`)
        .then((data) => {
          let data_comment = data.data;
          console.log(data_comment);
          let DOM_LIST_COMMENT = data_comment.map((item, index) => {
            if (item.status) {
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
                      {moment(item.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
              );
            } else {
              return [];
            }
          });
          setCommentList(DOM_LIST_COMMENT);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const sendComment = async () => {
    try {
      if (comment) {
        const data_comment_blog = {
          comment_content: comment,
          blog_id: datablogDetail._id,
          fullname: customer.fullname,
          avatar: ava,
        };

        await axios
          .post(`/v1/commentBlog/create_comment_blog`, data_comment_blog)
          .then(async (data) => {
            getDataComment();
            await Toast_comment.fire({
              icon: "success",
              title: "Bình luận thành công",
            });
            setComment("");
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        await Toast.fire({
          icon: "warning",
          title: "Bạn cần nhập vào bình luận",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsActive(false);
    //  Lấy ra blog liên quan
    getBlogRelate();
    get_blog();
    getInfoCustomer();
    getDataComment();

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header />
      <LoadingOverlayComponent status={isActive}>
        <div
          className="content_blog_detal container"
          style={{ maxWidth: "1020px", marginTop: "30px" }}
        >
          <div className="header_blog_detail d-flex">
            <h4>{datablogDetail.post_date}</h4>
            <span
              style={{
                display: "block",
                border: "1px solid #ff914d",
                margin: "0 10px",
              }}
            ></span>{" "}
            <h4>Nền tảng dịch vụ dọn nhà FastMove</h4>
          </div>
          <div className="content_blog">
            <h2
              style={{
                fontSize: "48px",
                fontWeight: "700",
                marginTop: "10px",
                marginBottom: "15px",
              }}
            >
              {datablogDetail.title}
            </h2>
            <div>
              <img
                alt="anh"
                src={datablogDetail.thumbnail}
                style={{ width: "100%" }}
              />
            </div>
            {/* <div>{htmlReactParser(datablogDetail.content)}</div> */}
            <div>{htmlReactParser(content)}</div>
          </div>
          <hr style={{ marginTop: "30px" }}></hr>
          <div className="comment_area">
            <div className="comment_input">
              {user ? (
                <div className="d-flex">
                  <Avatar
                    src={ava}
                    style={{
                      width: "40px",
                      height: "35px",
                      backgroundColor: "black",
                      border: "1px solid #66b2f9",
                    }}
                  />

                  <Input
                    placeholder="Nhập vào bình luận..."
                    style={{ margin: "0 10px" }}
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <Button type="primary" onClick={sendComment}>
                    Gửi <SendOutlined />
                  </Button>
                </div>
              ) : (
                <Alert
                  message="Bạn cần đăng nhập để bình luận vào bài viết !"
                  type="warning"
                />
              )}
            </div>
            <hr></hr>
            {commentList.length > 0 ? (
              <div className="list_comment" style={{ marginBottom: "20px" }}>
                {commentList}
              </div>
            ) : (
              <Alert
                style={{ marginBottom: "20px" }}
                message="Vẫn chưa có bình luận nào ! Hãy là người bình luận đầu tiên"
                type="warning"
              />
            )}
          </div>
        </div>

        <div className="container" style={{ marginTop: "70px" }}>
          <h2
            className="text-center"
            style={{
              backgroundColor: "orange",
              color: "white",
              borderRadius: "10px",
              padding: "7px",
            }}
          >
            Bài viết liên quan
          </h2>
          <div
            className="bottom_blog container"
            style={{ marginBottom: "150px", overflowX: "scroll " }}
          >
            <div className="row" style={{ justifyContent: "space-between" }}>
              {blogRelate.length > 0 ? (
                blogRelate
              ) : (
                <Alert
                  style={{ marginBottom: "20px", fontWeight:"bold", textAlign:"center" }}
                  message="Không có bài viết liên quan"
                  type="success"
                />
              )}
            </div>
          </div>
        </div>
      </LoadingOverlayComponent>
      <Footer />
    </>
  );
}

export default BlogDetail;
