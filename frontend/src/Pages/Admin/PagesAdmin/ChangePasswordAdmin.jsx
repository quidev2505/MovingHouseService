import React from "react";
import LayoutAdmin from "../ComponentAdmin/LayoutAdmin";
import TopCssContent from "./TopCssContent";


function ChangePasswordAdmin() {
  return (
    <>
      <LayoutAdmin>
        <div className="blog_admin">
          <TopCssContent>
            <h2>Đổi mật khẩu</h2>
          </TopCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default ChangePasswordAdmin;
