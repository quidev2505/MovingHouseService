import React, { useState, useEffect, useRef } from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";
import { Tag } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { WechatOutlined, FieldTimeOutlined } from "@ant-design/icons";

function Blog() {
  const [isActive, setIsActive] = useState(true);
  const [datablog, setDataBlog] = useState([]);
  const nav = useNavigate();
  const [optionDropdown, setOptionDropdown] = useState([]);
  const choose = useRef("TẤT CẢ");

  const clickSelect = (item) => {
    if (item === "TẤT CẢ") {
      choose.current = "TẤT CẢ";
    } else {
      let selected = item.target.innerText;
      choose.current = selected;
    }

    get_blog();
  };

  const get_blog = async () => {
    try {
      await axios
        .get("/v1/blog/read_blog")
        .then((data) => {
          let arr_blog = data.data;

          let arr_category = arr_blog.map((item, index) => {
            return item.category;
          });

          // Loại bỏ các phần tử trùng lặp
          const uniqueArray = arr_category.reduce((uniqueArray, element) => {
            if (uniqueArray.indexOf(element) === -1) {
              uniqueArray.push(element);
            }
            return uniqueArray;
          }, []);

          let DOM_OPTION = uniqueArray.map((item, index) => {
            return (
              <button
                className="btn_filter_blog"
                onClick={(item) => clickSelect(item)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  background: "#66b4bf",
                  borderRadius: "5px",
                  color: "white",
                  outline: "none",
                  border: "none",
                  margin: " 5px 5px",
                }}
              >
                {item}
              </button>
            );
          });

          setOptionDropdown(DOM_OPTION);

          // eslint-disable-next-line
          let data_blog = arr_blog.map((item, index) => {
            if (
              (item.status && item.category === choose.current) ||
              (item.status && choose.current === "TẤT CẢ")
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
                      onClick={() => nav(`/blog-detail/?name=${item.title}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            }
          });
          setDataBlog(data_blog);
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    choose.current = "TẤT CẢ";
    setIsActive(false);
    get_blog();
  }, []);

  return (
    <>
      <Header />
      <LoadingOverlayComponent status={isActive}>
        <div className="topContact" style={{ marginBottom: "95px" }}>
          <div
            className="imgService container d-flex"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <h1
              className="col-lg-3"
              style={{ fontSize: "90px", fontWeight: "600" }}
            >
              Blog
            </h1>
            <img
              src="./img/blog.jpg"
              class="img-fluid col-lg"
              alt="..."
              style={{ height: "300px", width: "100%", objectFit: "cover" }}
            ></img>
          </div>
        </div>

        <div
          className="filter_blog"
          style={{ marginLeft: "100px", marginBottom: "20px" }}
        >
          <button
            className="btn_filter_blog"
            onClick={() => clickSelect("TẤT CẢ")}
            style={{
              cursor: "pointer",
              padding: "10px",
              background: "#66b4bf",
              borderRadius: "5px",
              color: "white",
              outline: "none",
              border: "none",
              margin: " 5px 5px",
            }}
          >
            #Tất cả
          </button>
          {optionDropdown}
        </div>
        <div
          className="bottom_blog container"
          style={{ marginBottom: "200px" }}
        >
          <div className="row" style={{ justifyContent: "flex-start" }}>
            {datablog}
          </div>
        </div>
      </LoadingOverlayComponent>
      <Footer />
    </>
  );
}

export default Blog;
