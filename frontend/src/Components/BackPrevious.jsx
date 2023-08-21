import React from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";

function BackPrevious(props) {
  const usenav = useNavigate();
  return (
    <>
      <GoArrowLeft class="btn_back" onClick={() => usenav(`${props.path}`)}></GoArrowLeft>
    </>
  );
}

export default BackPrevious;
