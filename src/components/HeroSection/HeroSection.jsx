import React, { lazy, Suspense } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSection.scss";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router";
import heroSliderImg from "../../assets/images/1.png";
import heroSliderImg2 from "../../assets/images/2.png";
import heroSliderImg3 from "../../assets/images/3.png";

const LazyImage = lazy(() => import("./LazyImage"))

const images = [
  {
    src: heroSliderImg,
    alt: "Image 1",
  },
  // {
  //   src: heroSliderImg2,
  //   alt: "Image 2",
  // },
  {
    src: heroSliderImg3,
    alt: "Image 3",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate("/products");
  };

  return (
    <div className="pt-1">
      <Carousel
        autoPlay
        interval={5000}
        transitionTime={1000}
        showThumbs={false}
        infiniteLoop
        className="px-2"
      >
        {images.map((image, index) => (
          <div className="d-flex" onClick={handleImageClick} key={index}>
            <Suspense fallback={<div>Loading...</div>}>
              <LazyImage src={image.src} alt={image.alt} />
            </Suspense>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSection;
