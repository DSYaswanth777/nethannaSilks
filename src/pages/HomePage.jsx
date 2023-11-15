import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  recentProductAsync,
  sortproductsAsync,
} from "../redux/slice/productSlice";
import { Shimmer } from "react-shimmer";
import { Card, Container } from "reactstrap";
import Header from "../components/Header/Header";
import HeroSection from "../components/HeroSection/HeroSection";
import Footer from "../components/Footer/Footer";
import Poster from "../components/Poster/Poster";

function Home() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.products.status);
  const recentProducts = useSelector((state) => state.products.recentproducts);
  const filteredProducts = useSelector(
    (state) => state.products.sortedproducts
  );
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (isLoaded && status === "idle") {
      dispatch(recentProductAsync());
      dispatch(sortproductsAsync("lowtohigh"));
    }
  }, [isLoaded,status]);

  const isLoading = status === "loading" || status === "idle";

  // Memoize the Poster components
  const memoizedRecentPoster = useMemo(
    () => (
      <Poster
        title="Just In"
        subtitle="New Arrivals for You"
        products={recentProducts}
      />
    ),
    [recentProducts]
  );

  const memoizedFilteredPoster = useMemo(
    () => (
      <Poster
        title="Best Deals Await"
        subtitle="Discover Affordable Finds: Prices Low to High"
        products={filteredProducts}
      />
    ),
    [filteredProducts]
  );

  return (
    <div>
      <Header />
      <HeroSection />
      <Container className="pt-5">
        {isLoading ? (
          <Shimmer width={400} height={400} autoRun>
            <Card className="slider-content" style={{ width: "18rem" }} />
          </Shimmer>
        ) : (
          <>
            {memoizedRecentPoster}
            {memoizedFilteredPoster}
          </>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default Home;
