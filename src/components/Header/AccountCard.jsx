import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { CgProfile } from "react-icons/cg";
import OrdersIcon from "../../assets/icons/orders-icon.svg";
import { BsFillSuitHeartFill } from "react-icons/bs";

import "./Header.scss";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut } from "react-feather";
const AccountCard = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");
  };
  return (
    <div>
      {" "}
      <Card className="p-2 card-hover pt-3">
        <CardTitle>
          <div className="d-flex  bg-white fw-bold justify-content-center  ">
            {user.user?.name}
          </div>
        </CardTitle>
        <CardBody>
          <div className="d-flex flex-column justify-content-start align-items-start  ">
            <div
              className="  d-flex  bg-white pe-5 pt-1 ps-2 w-100"
              style={{ cursor: "pointer" }}
            >
              {" "}
              <span className="me-2">
                <CgProfile size={20} />
              </span>
              <p className="" onClick={() => navigate("/profile")}>
                My Profile
              </p>
            </div>
            <div
              className=" d-flex bg-white pe-5 pt-2 w-100 ps-2"
              style={{ cursor: "pointer" }}
            >
              {" "}
              <span className="me-2">
                <img src={OrdersIcon} width={20} height={20} />
              </span>
              <p onClick={() => navigate("/orders")}>Orders</p>
            </div>
            <div
              className="d-flex bg-white pe-5 pt-1 ps-2 w-100"
              style={{ cursor: "pointer" }}
            >
              {" "}
              <span className="me-2">
                {" "}
                <BsFillSuitHeartFill />
              </span>
              <p onClick={() => navigate("/wishlist")}>Wishlist</p>
            </div>
            <div
              className=" text-danger bg-white pe-5 pt-1 py-3 w-100 ps-2 "
              style={{ cursor: "pointer" }}
              onClick={handleLogout}
            >
              {" "}
              <span className="me-2">
                {" "}
                <LogOut />
              </span>
              Logout
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AccountCard;
