import React, { useState, useEffect } from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

import { useSelector } from "react-redux";

import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";
import { Alert, Input, Button, Avatar } from "antd";
import axios from "axios";

import { useSearchParams } from "react-router-dom";

import htmlReactParser from "html-react-parser";

import { SendOutlined } from "@ant-design/icons";

import { Toast_comment, Toast } from "../Components/ToastColor";

function BlogDetail() {
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
                      {item.comment_time}
                    </div>
                  </div>
                </div>
              );
            }else{
              return []
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
      </LoadingOverlayComponent>
      <Footer />
    </>
  );
}

export default BlogDetail;
