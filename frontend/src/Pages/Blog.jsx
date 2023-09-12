import React, { useState, useEffect } from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import LoadingOverlayComponent from "../Components/LoadingOverlayComponent";
import { Tag } from "antd";
import axios from "axios";

function Blog() {
  const [isActive, setIsActive] = useState(true);
  const [datablog, setDataBlog] = useState([]);

  const get_blog = async () => {
    try {
      await axios
        .get("/v1/blog/read_blog")
        .then((data) => {
          let arr_blog = data.data;

          // eslint-disable-next-line
          let data_blog = arr_blog.map((item, index) => {
            if (item.status) {
              return (
                <div
                  className="blog_item col"
                  style={{
                    borderRadius: "10px",
                    marginRight: "20px",
                    border: "1px solid #ccc",
                    padding: "0px",
                    boxShadow: "0.3px 0.3px #ccc",
                  }}
                >
                  <img
                    src={item.thumbnail}
                    className="img-fluid col-lg"
                    style={{
                      width: "371px",
                      height: "248px",
                      objectFit: "contain",
                    }}
                    alt=""
                  ></img>
                  <div
                    className="d-flex"
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "flex-start",
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
                      <Tag color="green">
                        {" "}
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
                      <Tag color="#2db7f5"> {item.post_date}</Tag>
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
          className="bottom_blog container"
          style={{ marginBottom: "200px" }}
        >
          <div className="row">{datablog}</div>
        </div>
      </LoadingOverlayComponent>
      <Footer />
    </>
  );
}

export default Blog;
