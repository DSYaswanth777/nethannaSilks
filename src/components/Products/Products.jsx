import React, { useEffect, useState } from "react";
import { formatCurrency } from "../../utilities/formatCurrency";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Badge,
  Spinner,
} from "reactstrap";
import { BsFillHeartFill, BsSuitHeart } from "react-icons/bs";
import { FaCartPlus } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router";
import "./Products.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWishlistAsync,
  fetchUserWishlistAsync,
  wishlistAddAsync,
} from "../../redux/slice/wishlistSlice";
import { cartAddAsync, fetchUsercartAsync } from "../../redux/slice/cartSlice";
import { Shimmer } from "react-shimmer";
function Products({ productData }) {
  const status = useSelector((state) => state?.products?.status);
  const wishlistStatus = useSelector((state) => state?.wishlist?.status);
  const wishlist = useSelector((state) => state?.wishlist?.wishlist);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (isLoaded && wishlistStatus === "idle") {
      dispatch(fetchUserWishlistAsync());
    }
  }, [wishlistStatus, isLoaded, dispatch]);

  const handleAddCartItem = (productId) => {
    // Dispatch the delete action
    dispatch(cartAddAsync(productId))
      .then(() => {
        // After successfully deleting, fetch the updated wishlist
        dispatch(fetchUsercartAsync());
      })
      .catch((error) => {
        // Handle any errors, if needed
        console.log(error);
      });
  };
  const isProductInWishlist = (productId) => {
    return wishlist.some((item) => item.product._id === productId);
  };
  const handleAddToWishlist = (product) => {
    const wishlistItem = wishlist.find(
      (item) => item.product._id === product
    );
    if (wishlistItem) {
      // Product is already in the wishlist, remove it using the wishlist's _id
      dispatch(deleteWishlistAsync(wishlistItem._id))
        .then(() => {
          setWishlistAdded(false);
          dispatch(fetchUserWishlistAsync());
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // Product is not in the wishlist, add it using the product's _id
      dispatch(wishlistAddAsync(product))
        .then(() => {
          setWishlistAdded(true);
          dispatch(fetchUserWishlistAsync());
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const navigate = useNavigate();
  return (
    <div>
      <div className="productsGri  pt-4">
        {status === "loading"
          ? productData?.map((product) => (
              <Shimmer
                key={product._id}
                visible={true}
                autoRun={true}
                width={300}
                height={300}
              >
                <Card
                  className="slider-content"
                  style={{
                    width: "18rem",
                  }}
                ></Card>
              </Shimmer>
            ))
          : productData?.map((product) => (
              <Card
                key={product?._id}
                className="  "
                style={{
                  width: "18rem",
                }}
              >
                <div
                  onClick={() =>
                    navigate(`/products/viewproduct/${product?._id}`)
                  }
                >
                  <Carousel
                    showThumbs={false}
                    autoPlay
                    interval="3000"
                    transitionTime="1000"
                  >
                    {product?.productImages?.map((img) => (
                      <img
                        alt="Sample"
                        src={img}
                        width={300}
                        height={300}
                        key={img}
                      />
                    ))}
                  </Carousel>
                </div>
                <CardBody>
                  <CardTitle tag="h5">{product?.productName}</CardTitle>
                  <CardSubtitle className="mb-2 text-muted" tag="h6">
                    <div className="d-flex justify-content-between ">
                      {product?.subcategoryId?.name}

                      {wishlistStatus === "loading" || wishlistStatus === "idle" ? (
                        <Spinner />
                      ) : (
                        <span style={{ cursor: "pointer" }}>
                          {isProductInWishlist(product?._id) ? (
                            <BsFillHeartFill
                              size={25}
                              className="text-danger"
                              onClick={() => handleAddToWishlist(product?._id)}
                            />
                          ) : (
                            <BsSuitHeart
                              size={25}
                              onClick={() => handleAddToWishlist(product?._id)}
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </CardSubtitle>
                  {status === "loading" || status === "idle" ? (
                    <Shimmer
                      key={product?.productStock}
                      visible={true}
                      autoRun={true}
                      width={150}
                      height={50}
                    >
                      <Card
                        className="slider-content"
                        style={{
                          width: "18rem",
                        }}
                      ></Card>
                    </Shimmer>
                  ) : (
                    <Badge
                      className={`fs-6 ${
                        product.productStock < 20 ? "bg-danger" : "bg-success"
                      }`}
                      color="success"
                    >
                      {" "}
                      Instock ({product?.productStock})
                    </Badge>
                  )}
                  <CardText className="fw-medium fs-5">
                    Price :{formatCurrency(product?.productPrice)}
                  </CardText>
                  <Button className="addToCartBtn d-flex justify-content-center align-items-center"
                      onClick={() => handleAddCartItem(product._id)}
                      >
                    <FaCartPlus
                      className="me-2"
                    />{" "}
                    Add To Cart
                  </Button>
                </CardBody>
              </Card>
            ))}
      </div>
    </div>
  );
}

export default Products;
