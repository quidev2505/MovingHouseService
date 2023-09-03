import React from "react";
import LayoutAdmin from "../ComponentAdmin/LayoutAdmin";
import TopCssContent from "./TopCssContent";


function VehicleAdmin() {
  return (
    <>
      <LayoutAdmin>
        <div className="vehicle_admin">
            <TopCssContent>
              <h2>Vehicles</h2>
            </TopCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default VehicleAdmin;
