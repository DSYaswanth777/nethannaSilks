import React, { useState } from "react";
import { Badge, Button, Card, CardBody, CardTitle, Input } from "reactstrap";
import { formatCurrency } from "../../../utilities/formatCurrency";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  cartQuantityDecreaseAsync,
  cartQuantityIncreaseAsync,
  deletecartAsync,
  fetchUsercartAsync,
} from "../../../redux/slice/cartSlice";
import { Shimmer } from "react-shimmer";
import { useNavigate } from "react-router";
import "../CheckOutCard.scss";
import FallBackLoader from "../../FallBackLoader/FallBackLoader";
import { BsCartX } from "react-icons/bs";

function CartStep() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.cart?.status);
  const [isLoaded, setIsLoaded] = useState(false);
  const cartData = useSelector((state) => state.cart?.cart?.cartItems);
  const totalfee = useSelector((state) => state.cart?.cart?.totalFee);
  const deliveryCharge = useSelector(
    (state) => state.cart?.cart?.deliveryCharge
  );
 
  const handleQuantityIncrease = async (productId) => {
    await dispatch(cartQuantityIncreaseAsync(productId));
    dispatch(fetchUsercartAsync());
  };
  const handleDecrease = async (productId) => {
    await dispatch(cartQuantityDecreaseAsync(productId));
    dispatch(fetchUsercartAsync());
  };
  const handleDelete = async (productId) => {
    await dispatch(deletecartAsync(productId));
    dispatch(fetchUsercartAsync());
  };
  useEffect(() => {
    // if (isLoaded) {
      window.scrollTo(0, 0);

      dispatch(fetchUsercartAsync());
    // }
  }, []);
  return (
    <>
      {status === "loading" || status === "idle" ? (
        <FallBackLoader />
      ) : cartData?.length === 0 ? (
        <div className="d-flex justify-content-center flex-column gap-3 align-items-center pt-5 pb-5">
          <BsCartX size={100} />
          <p className="text-center text-secondary">
            Your Cart is Currently empty
          </p>
          <p className="text-center">
            Must add items before you proceed to checkout
          </p>
          <Button className="bg-sucess" onClick={() => navigate("/products")}>
            Return to Shop
          </Button>
        </div>
      ) : (
        <div className="d-flex cart container justify-content-between pt-5 flex-column flex-lg-row flex-md-column flex gap-5   pb-5">
          <div className="d-flex flex-column gap-3 h-100 w-100 pb-5 pe-3">
            {status === "loading" || status === "idle"
              ? cartData?.map((cart) => (
                  <Shimmer
                    key={cart._id}
                    visible={true}
                    autoRun={true}
                    width={900}
                    height={300}
                  >
                    <Card></Card>
                  </Shimmer>
                ))
              : cartData?.map((product) => (
                  <Card
                    className=" border shadow-sm p-3  w-100"
                    key={product._id}
                  >
                    <CardBody>
                      <div className="d-flex justify-content-between flex-column flex-sm-row gap-5 align-items-center">
                        <img
                          src={product?.product?.productImages[0]}
                          alt=""
                          width={150}
                          height={150}
                        />
                        <div className="d-flex flex-column justify-content-center align-items-center gap-4">
                          <div className="productName text-center">
                            {product.product.productName}
                          </div>
                          <p>{product.product.subcategoryId}</p>
                          <h5>
                            <Badge color="success">
                              InStock {product.product.productStock}
                            </Badge>
                          </h5>
                          <div className="d-flex justify-content-around align-items-center gap-3">
                            <Button
                              className="btn-sm bg-danger border-0"
                              onClick={() => handleDecrease(product._id)}
                            >
                              -
                            </Button>
                            <Input
                              className=""
                              disabled
                              value={product?.quantity}
                              style={{ width: "40px", height: "30px" }}
                            ></Input>
                            <Button
                              className="btn-sm border-0 bg-success"
                              onClick={() =>
                                handleQuantityIncrease(product._id)
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-3 justify-content-center ">
                          <h5 className="productPrice">
                            {" "}
                            <span className="me-2">Total :</span>
                            {formatCurrency(product.product.productPrice)}
                          </h5>

                          <Button
                            className="bg-danger border-0"
                            onClick={() => handleDelete(product._id)}
                          >
                            Remove
                          </Button>
                          <Button className="border-0 bg-success ">
                            Add to Wishlist
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
          </div>
          <div className="d-flex justify-content-center align-items-center shadow-sm">
            <Card className="bg-light py-4 w-100 ">
              <CardTitle className="px-3 text-center fs-4 fw-bold">
                Cart Total
              </CardTitle>
              <CardBody className="totalCard">
                <div className="d-flex flex-column gap-2">
                  <h6 className="fw-bold pt-2">Price Details</h6>
                  <div className="d-flex justify-content-between gap-5  align-items-center">
                    <div>Total </div>
                    <div className="">
                      {formatCurrency(totalfee - deliveryCharge)}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between gap-5 align-items-center">
                    <div>Delivery Charges</div>
                    <div className="">{formatCurrency(deliveryCharge)}</div>
                  </div>
                  <hr />
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        Total <br />
                        (*Includes Delivery fee)
                      </div>
                      <div className="">{formatCurrency(totalfee)}</div>
                    </div>
                    <Button
                      onClick={() => navigate("/checkout")}
                      color="success"
                    >
                      Add Your address to place order
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

export default CartStep;
