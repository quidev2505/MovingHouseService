import React, { useState, useEffect, useRef } from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";
import { Tag } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  WechatOutlined,
  FieldTimeOutlined,
  SearchOutlined,
} from "@ant-design/icons";

//Import Component Chatbot
import ChatBotIcon from "../Components/ChatBotIcon";

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

  //Search Realtime
  const [search, setSearch] = useState("");
  useEffect(() => {
    get_blog();
  }, [search]);

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
              if (
                search != "" &&
                removeVietnameseTones(item.title)
                  .toLowerCase()
                  .includes(removeVietnameseTones(search))
              ) {
                console.log(item);
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
                        onClick={() =>
                          nav(
                            `/blog-detail/?name=${item.title}&category=${item.category}`
                          )
                        }
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                );
              } else if (search == "") {
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
                        onClick={() =>
                          nav(
                            `/blog-detail/?name=${item.title}&category=${item.category}`
                          )
                        }
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                );
              }
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
          <ChatBotIcon />
          <div
            className="imgService container d-flex"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
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
              style={{
                height: "300px",
                width: "100%",
                objectFit: "cover",
              }}
            ></img>
          </div>
        </div>

        <div
          className="filter_blog d-flex"
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
            TẤT CẢ
          </button>
          {optionDropdown}
          <div
            className="d-flex"
            style={{
              width: "338px",
              borderRadius: "5px",
              marginLeft:"10px"
            }}
          >
            <input
              type="text"
              id="find_blog"
              className="form-control form-control-lg"
              placeholder="Nhập vào tên Blog hoặc danh mục..."
              style={{
                fontSize: "17px",
                borderRadius: "3px",
                width: "400px",
              }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchOutlined
              style={{
                backgroundColor: "#ed883b",
                padding: "13px",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                borderRadius:"0px 5px 5px 0px"
              }}
            />
          </div>
        </div>
        <div
          className="bottom_blog container"
          style={{ marginBottom: "200px" }}
        >
          <div className="row" style={{ justifyContent: "space-between" }}>
            {datablog}
          </div>
        </div>
      </LoadingOverlayComponent>
      <Footer />
    </>
  );
}

export default Blog;
