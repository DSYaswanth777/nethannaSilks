import React from "react";
import Logo from "../../assets/icons/Logo.svg";
import "./FallBackLoader.scss";
function FallBackLoader() {
  return (
    <div className="loader_container">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <img src={Logo} alt="" className="logo" />
        <p className="pt-3" style={{color:"#105E11"}}>Nethanna Silks</p>
      </div>
      <div className="loader"></div>
    </div>
  );
}

export default FallBackLoader;
