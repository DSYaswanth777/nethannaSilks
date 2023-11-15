import React from "react";
import Footer from "../Footer/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatCurrency } from "../../utilities/formatCurrency";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewOrderAsync } from "../../redux/slice/orderSlice";
import { Shimmer } from "react-shimmer";
import { Card } from "reactstrap";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft } from "react-feather";
import { formatDateForInput } from "../../utilities/FormatInputDate";

function ViewOrder() {
  const { orderID } = useParams();
  const dispatch = useDispatch();
  const orderData = useSelector((state) => state?.orders?.order?.order); 
  const orderStatus = useSelector((state) => state?.orders?.status);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(viewOrderAsync(orderID));
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, [dispatch, orderID]);

  

  return (
    <>
      <div className="d-flex container flex-column gap-5 pt-3">
        <div className="bg-light shadow-sm border w-100 text-center">
          <div className="d-flex justify-content-start align-items-center gap-2 p-3">
            <ArrowLeft onClick={() => navigate("/orders")} />
            <h5 className=" fs-4 "> Order Details</h5>
          </div>
          {orderStatus === "loading" || orderStatus === "idle" ? (
            <Shimmer visible={true} autoRun={true} width={1300} height={160}>
              <Card
                className="slider-content"
                style={{
                  width: "18rem",
                }}
              ></Card>
            </Shimmer>
          ) : (
            orderData?.cartItems?.map((prod) => (
              <img
                alt={prod?.product?.productName}
                src={prod.product.productImages[0]}
                width={150}
                height={150}
                className="me-3"
                key={uuidv4()}
              />
            ))
          )}
          {orderStatus === "loading" || orderStatus === "idle"
            ? orderData?.cartItems?.map(() => (
                <Shimmer
                  key={uuidv4()}
                  visible={true}
                  autoRun={true}
                  width={1300}
                  height={160}
                >
                  <>
                    <div className="fs-3 text-start fw-bold text-center">
                      <Card width={80} height={20}></Card>
                    </div>
                    <p className="text-muted fs-5 text-center">
                      <Card width={80} height={20}></Card>
                    </p>
                    <p className="text-start fs-5 text-center">
                      <Card width={80} height={20}></Card>
                    </p>
                  </>
                </Shimmer>
              ))
            : orderData?.cartItems?.map((prod) => (
                <div key={uuidv4()}>
                  <div
                    className="fs-3 text-start fw-bold text-center"
                    key={uuidv4()}
                  >
                    {prod?.product?.productName}
                  </div>
                  <p className="text-muted fs-5 text-center">
                    {prod?.product?.subcategoryId?.name}
                  </p>
                  <p className="text-start fs-5 text-center border-bottom">
                    Price: &nbsp;{prod?.quantity} X
                    {formatCurrency(prod?.product?.productPrice)}/-
                  </p>
                </div>
              ))}
          <div>
            {orderStatus === "loading" || orderStatus === "idle" ? (
              <Shimmer visible={true} autoRun={true} width={1300} height={160}>
                <Card width={80} height={60}></Card>
              </Shimmer>
            ) : (
              <h5>Total: &nbsp;{formatCurrency(orderData?.totalAmount)}/-</h5>
            )}
            <p className="text-mark text-danger text-sm">
              * Includes Standard Delivery Charges ₹50/-
            </p>
          </div>
        </div>
        <div className="bg-light p-3 border h-50  shadow-sm">
          <p>
            {" "}
            <span className="fw-bold me-2">Order Date:</span>
            {formatDateForInput(orderData?.orderDate)}
          </p>
          <p className="text-muted">
            {" "}
            <span className="fw-bold me-2 text-muted">Order ID:</span>
            {orderData?.orderID}
          </p>
          <div className="w-100">
            {" "}
            <span className="fw-bold me-2">Order Status: </span>
            {orderData?.paymentStatus === "Successful" ? (
              <p className="text-success fw-bold">
                {" "}
                You have placed your order {orderData?.paymentStatus}ly. You
                order will be shipped with 2-3 business days.Soon You will get
                details from courier partner !
              </p>
            ) : (
              `Your Payment was ${orderData?.paymentStatus} place try again after Some time!`
            )}
          </div>

          <div className="">
            <h6>Shipping Address:</h6>
            <div className="d-flex flex-column bg-light p-4 rounded shadow-sm border">
              <span>{orderData?.shippingAddress?.fullName}</span>
              <span>{orderData?.shippingAddress?.landmark}</span>
              <span>{orderData?.shippingAddress?.streetAddress}</span>
              <span>{orderData?.shippingAddress?.townCity}</span>
              {orderData?.shippingAddress?.pincode}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ViewOrder;
