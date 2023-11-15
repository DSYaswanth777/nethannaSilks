import React, { useState } from "react";
import Footer from "../Footer/Footer";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { formatCurrency } from "../../utilities/formatCurrency";
import { Button, Badge, Card, Spinner } from "reactstrap";
import { FaCartPlus } from "react-icons/fa";
import Poster from "../../components/Poster/Poster";
import "./Products.scss";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
  recentProductAsync,
  viewProductAsync,
} from "../../redux/slice/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { cartAddAsync, fetchUsercartAsync } from "../../redux/slice/cartSlice";
import {
  deleteWishlistAsync,
  fetchUserWishlistAsync,
  wishlistAddAsync,
} from "../../redux/slice/wishlistSlice";
import { BsFillHeartFill, BsSuitHeart } from "react-icons/bs";
import toast from "react-hot-toast";
import { Shimmer } from "react-shimmer";
import { ArrowLeft } from "react-feather";
import { v4 as uuidv4 } from "uuid";
import "./Products.scss";
function ViewProduct() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products?.product);
  const productStatus = useSelector((state) => state.products?.status);
  const recentproducts = useSelector((state) => state.products?.recentproducts);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const isLowStock = product?.productStock < 20;
  const [isLoaded, setIsLoaded] = useState(false);
  const wishlistStatus = useSelector((state) => state?.wishlist?.status);
  const wishlist = useSelector((state) => state?.wishlist?.wishlist);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      window.scrollTo(0, 0);
      dispatch(viewProductAsync(productId));
    }
  }, [isLoaded, dispatch, productId]);
  const isProductInWishlist = (productId) => {
    return wishlist.some((item) => item.product._id === productId);
  };
  useEffect(() => {
    if (isLoaded && productStatus === "idle") {
      dispatch(recentProductAsync());
    }
  }, [productStatus, isLoaded, dispatch]);

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

  const handleAddToWishlist = (product) => {
    const wishlistItem = wishlist.find((item) => item.product._id === product);
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

  return (
    <>
      <div className="container">
        <ArrowLeft
          size={30}
          className=" mt-3"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/products")}
        />
      </div>
      <div className="d-flex container flex-column flex-sm-column flex-lg-row gap-5 pt-3">
        <div className="img-carousel">
          {productStatus === "loading" || productStatus === "idle" ? (
            <Shimmer
              key={uuidv4()}
              visible={true}
              autoRun={true}
              width={400}
              height={400}
            >
              <Card
                className="slider-conte"
                style={{
                  width: "18rem",
                }}
              ></Card>
            </Shimmer>
          ) : (
            <Carousel
              autoPlay
              interval="5000"
              transitionTime="1000"
              infiniteLoop
              showThumbs={false}
            >
              {product?.productImages?.map((img) => (
                <img
                  alt={product?.name}
                  src={img}
                  width={400}
                  height={400}
                  key={uuidv4()} // Use uuid to generate a unique key
                />
              ))}
            </Carousel>
          )}
        </div>
        <div className="img-carousel">
          <div className="fs-3 text-start d-flex gap-5 ">
            <span className="me-5 pe-5">{product?.productName}</span>
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
          <p className="text-muted fs-5">{product?.subcategoryId?.name}</p>

          <p>{product?.productInfo}</p>

          {productStatus === "loading" || productStatus === "idle" ? (
            <Shimmer
              key={product?.productInfo}
              visible={true}
              autoRun={true}
              width={150}
              height={50}
            >
              <Card
                className=" "
                style={{
                  width: "18rem",
                }}
              ></Card>
            </Shimmer>
          ) : (
            <Badge
              className={`fs-6 ${isLowStock ? "bg-danger" : ""}`}
              color="success"
            >
              {" "}
              Instock ({product?.productStock})
            </Badge>
          )}
          {productStatus === "loading" || productStatus === "idle" ? (
            <Shimmer
              key={product?.productPrice}
              visible={true}
              autoRun={true}
              width={100}
              height={50}
            >
              <Card
                className=" "
                style={{
                  width: "18rem",
                }}
              ></Card>
            </Shimmer>
          ) : (
            <>
              <p className="fs-4">{formatCurrency(product?.productPrice)}</p>
              <div className="d-flex gap-3">
                <Button
                  className="text-uppercase"
                  style={{ backgroundColor: "#2A798B" }}
                  onClick={() => handleAddCartItem(product._id)}
                >
                  {" "}
                  <FaCartPlus className="me-2" />
                  Add To Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <Poster
        title="Recently Added"
        subtitle="Check Out these"
        products={recentproducts}
      />
    </>
  );
}

export default ViewProduct;
