import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  Card,
  CardTitle,
  CardSubtitle,
  CardText,
  CardBody,
  Button,
} from "reactstrap";
import { formatCurrency } from "../../utilities/formatCurrency";
import { FaCartPlus } from "react-icons/fa";
import { BsSuitHeart } from "react-icons/bs";
import { useNavigate } from "react-router";
import "./Poster.scss";
import { wishlistAddAsync } from "../../redux/slice/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { Shimmer } from "react-shimmer";
import { cartAddAsync } from "../../redux/slice/cartSlice";
import { responsive } from "../../utilities/carouselSettings";

const Poster = ({ title, subtitle, products }) => {
  const status = useSelector((state) => state?.products?.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="container mt-5  mb-5 pb-5">
      <h4 className="text-center title">{title}</h4>
      <h2 className="text-center mb-5 subtitle">{subtitle}</h2>
      {products && products.length > 0 && (
        <Carousel responsive={responsive} autoPlay className="pb-3">
          {status === "loading"
            ? products?.map((product) => (
                <Shimmer
                  key={product?._id}
                  visible={true}
                  autoRun={true}
                  width={300}
                  height={300}
                >
                  <Card
                    className="slider-content"
                    
                  ></Card>
                </Shimmer>
              ))
            : products.map((product) => (
                <Card
                  className="slider-content"
                  
                  key={product?._id}
                >
                  <img
                    alt={product?.name}
                    src={product?.productImages[0]}
                   className="poster_img"
                    onClick={() =>
                      navigate(`/products/viewproduct/${product?._id}`)
                    }
                  />
                  <CardBody>
                    <CardTitle tag="h5">{product?.productName}</CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                      <div className="d-flex justify-content-between">
                        {product?.subcategoryId?.name}
                        <BsSuitHeart
                          size={25}
                          onClick={() =>
                            dispatch(wishlistAddAsync(product?._id))
                          }
                        />
                      </div>
                    </CardSubtitle>
                    <CardText className="fw-medium fs-5">
                      Price: {formatCurrency(product?.productPrice)}
                    </CardText>
                    <Button
                      className="addToCartBtn d-flex justify-content-center align-items-center"
                      onClick={() => dispatch(cartAddAsync(product?._id))}
                    >
                      <FaCartPlus className="me-2" /> Add To Cart
                    </Button>
                  </CardBody>
                </Card>
              ))}
        </Carousel>
      )}
    </div>
  );
};

export default Poster;
