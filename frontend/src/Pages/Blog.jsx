import React from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons";

function Blog() {
  return (
    <>
      <Header />
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

      <div className="bottom_blog container" style={{ marginBottom: "200px" }}>
        <div className="row">
          <div className="blog_item col">
            <img
              src="https://moversco-demo.pbminfotech.com/demo6/wp-content/uploads/sites/9/2021/01/blog-01-new.jpg"
              className="img-fluid col-lg"
              style={{ width: "371px", height: "248px" }}
              alt=""
            ></img>
            <div
              className="d-flex"
              style={{
                width: "371px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="date_img">Tên danh mục</div>
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  color: "#383839",
                  fontSize: "5px",
                  opacity: "0.6",
                  margin: "0 10px",
                }}
              />
              <div className="date_img">3 bình luận</div>
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  color: "#383839",
                  fontSize: "5px",
                  opacity: "0.6",
                  margin: "0 10px",
                }}
              />
              <div className="date_img">27/08/2023</div>
            </div>

            <h2
              style={{ fontWeight: "700", fontSize: "25px", margin: "15px 0" }}
            >
              Dọn nhà thật đơn giản
            </h2>
            <h6>
              Đọc Tiếp&nbsp; <FontAwesomeIcon icon={faArrowRight} />
            </h6>
          </div>

          <div className="blog_item col">
            <img
              src="https://moversco-demo.pbminfotech.com/demo6/wp-content/uploads/sites/9/2021/01/blog-01-new.jpg"
              className="img-fluid col-lg"
              style={{ width: "371px", height: "248px" }}
              alt=""
            ></img>
            <div
              className="d-flex"
              style={{
                width: "371px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="date_img">Tên danh mục</div>
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  color: "#383839",
                  fontSize: "5px",
                  opacity: "0.6",
                  margin: "0 10px",
                }}
              />
              <div className="date_img">3 bình luận</div>
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  color: "#383839",
                  fontSize: "5px",
                  opacity: "0.6",
                  margin: "0 10px",
                }}
              />
              <div className="date_img">27/08/2023</div>
            </div>

            <h2
              style={{ fontWeight: "700", fontSize: "25px", margin: "15px 0" }}
            >
              Dọn nhà thật đơn giản
            </h2>
            <h6>
              Đọc Tiếp&nbsp; <FontAwesomeIcon icon={faArrowRight} />
            </h6>
          </div>

          <div className="blog_item col">
            <img
              src="https://moversco-demo.pbminfotech.com/demo6/wp-content/uploads/sites/9/2021/01/blog-01-new.jpg"
              className="img-fluid col-lg"
              style={{ width: "371px", height: "248px" }}
              alt=""
            ></img>
            <div
              className="d-flex"
              style={{
                width: "371px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="date_img">Tên danh mục</div>
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  color: "#383839",
                  fontSize: "5px",
                  opacity: "0.6",
                  margin: "0 10px",
                }}
              />
              <div className="date_img">3 bình luận</div>
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  color: "#383839",
                  fontSize: "5px",
                  opacity: "0.6",
                  margin: "0 10px",
                }}
              />
              <div className="date_img">27/08/2023</div>
            </div>

            <h2
              style={{ fontWeight: "700", fontSize: "25px", margin: "15px 0" }}
            >
              Dọn nhà thật đơn giản
            </h2>
            <h6>
              Đọc Tiếp&nbsp; <FontAwesomeIcon icon={faArrowRight} />
            </h6>
          </div>
          <div className="blog_item col">
            <img
              src="https://moversco-demo.pbminfotech.com/demo6/wp-content/uploads/sites/9/2021/01/blog-01-new.jpg"
              className="img-fluid col-lg"
              style={{ width: "371px", height: "248px" }}
              alt=""
            ></img>
            <div
              className="d-flex"
              style={{
                width: "371px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="date_img">Tên danh mục</div>
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  color: "#383839",
                  fontSize: "5px",
                  opacity: "0.6",
                  margin: "0 10px",
                }}
              />
              <div className="date_img">3 bình luận</div>
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  color: "#383839",
                  fontSize: "5px",
                  opacity: "0.6",
                  margin: "0 10px",
                }}
              />
              <div className="date_img">27/08/2023</div>
            </div>

            <h2
              style={{ fontWeight: "700", fontSize: "25px", margin: "15px 0" }}
            >
              Dọn nhà thật đơn giản
            </h2>
            <h6>
              Đọc Tiếp&nbsp; <FontAwesomeIcon icon={faArrowRight} />
            </h6>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Blog;
