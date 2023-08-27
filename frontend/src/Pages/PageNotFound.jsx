import { useNavigate } from "react-router-dom";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

function PageNotFound() {
  const nav = useNavigate();
  return (
    <>
      <Header />

      <div
        class="mars container text-center"
        style={{ marginTop: "90px", marginBottom: "90px" }}
      >
        <img
          src="https://assets.codepen.io/1538474/404.svg"
          class="logo-404"
          alt="not-found"
          style={{width: "250px",
    height: "250px"}}
        />
        <img
          src="https://assets.codepen.io/1538474/meteor.svg"
          class="meteor"
          alt="not-found"
        />
        <div style={{ color: "black" }}>
          <p class="subtitle" style={{ color: "black" }}>
            <p class="title" style={{ color: "black" }}>
              Ôi không!!
            </p>
            Có vẻ như bạn đã nhập sai địa chỉ
            <span className="fw-bold" style={{ color: "#e37533" }}>
              {" "}
              FastMove{" "}
            </span>{" "}
            rồi !
          </p>
          <div align="center" style={{ color: "black" }}>
            <button
              type="button"
              class="btn btn-warning mb-5 fw-bold"
              onClick={() => nav("/")}

            >
              Nhấn để về trang chủ
            </button>
          </div>
          {/* <img src="https://img.freepik.com/premium-vector/truck-transportation-goods_441769-278.jpg" /> */}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default PageNotFound;
