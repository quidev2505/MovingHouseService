import * as React from "react";
import { useState } from "react";
// import { render } from "react-dom";
import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "@goongmaps/goong-map-react";

import ControlPanel from "./control-panel";
// import Pins from "./Pins";
import CityInfo from "./city-info";

// import CITIES from "../../.data/cities.json";

const TOKEN = "QbSjJLOWqwYyP44BaOurBqBeLCYhLdWEJIBYqWAA"; // Set your goong maptiles key here

const geolocateStyle = {
  top: 0,
  left: 0,
  padding: "10px",
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: "10px",
};

const navStyle = {
  top: 72,
  left: 0,
  padding: "10px",
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: "10px",
};

function MapBox() {
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });
  const [popupInfo, setPopupInfo] = useState(null);
  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="https://tiles.goong.io/assets/goong_map_dark.json"
        onViewportChange={setViewport}
        goongApiAccessToken={TOKEN}
      >
        {/* <Pins data={CITIES} onClick={setPopupInfo} /> */}

        {popupInfo && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            closeOnClick={false}
            onClose={setPopupInfo}
          >
            <CityInfo info={popupInfo} />
          </Popup>
        )}

        <GeolocateControl style={geolocateStyle} />
        <FullscreenControl style={fullscreenControlStyle} />
        <NavigationControl style={navStyle} />
        <ScaleControl style={scaleControlStyle} />
      </MapGL>

      <ControlPanel />
    </>
  );
}

export default MapBox;
