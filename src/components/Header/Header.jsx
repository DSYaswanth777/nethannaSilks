import React, { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsSearch } from "react-icons/bs";
import "./Header.scss";
import NavbarMenu from "../NavbarMenu/NavbarMenu";
import AccountCard from "./AccountCard";
import { useDispatch, useSelector } from "react-redux";
import { User } from "react-feather";
import { fetchUsercartAsync } from "../../redux/slice/cartSlice";
import {
  fetchProducts,
  searchProductsAsync,
} from "../../redux/slice/productSlice";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import SearchResults from "./SearchResults";

const Header = () => {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchContainerVisible, setSearchContainerVisible] = useState(false);
  const [isAccountVisible, setAccountVisible] = useState(false);
  const [isCartVisible, setCartVisible] = useState(false);
  const searchIcon = document.getElementById("searchBox");
  const profileBox = document.getElementById("profileBox");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const status = useSelector((state) => state.cart?.status);
  const cartData = useSelector((state) => state?.cart?.cart?.cartItems);
  const suggestedProducts = useSelector((state) => state?.products?.products);
  useEffect(() => {
    if (isCartVisible && status === "idle") {
      dispatch(fetchUsercartAsync());
    }
  }, [isCartVisible, status, dispatch]);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleSearchContainer = () => {
    setSearchContainerVisible(!isSearchContainerVisible);
  };
  const toggleAccount = (e) => {
    setAccountVisible(!isAccountVisible);
    e.stopPropagation();
  };

  document.addEventListener("click", (e) => {
    if (e.target !== searchIcon) {
      setSearchContainerVisible(false);
    }
    if (e.target != profileBox) {
      setAccountVisible(false);
    }
  });

  const debouncedHandleSearch = debounce(() => {
    if (debouncedSearchQuery) {
      dispatch(searchProductsAsync(debouncedSearchQuery));
    }
  }, 300);

  useEffect(() => {
    // Only perform the search when debouncedSearchQuery changes and isSearchContainerVisible is true
    if (debouncedSearchQuery && isSearchContainerVisible) {
      debouncedHandleSearch();
    } else if (isSearchContainerVisible) {
      dispatch(fetchProducts());
    }
  }, [debouncedSearchQuery, searchQuery]);

  const handleSearch = () => {
    navigate(`/products?search=${debouncedSearchQuery}`);
  };

  return (
    <div className="header  bg-white sticky-top border-bottom ">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="d-flex gap-3 justify-content-center align-items-center">
            <div className="mobile-menu-icon" onClick={toggleMenu}>
              <RxHamburgerMenu />
            </div>
            <div onClick={() => navigate("/")} style={{cursor:"pointer"}} className="d-flex justify-content-center align-items-center">

                <p className="pt-3" style={{color:"#105E11"}}>Nethanna Silks</p>
            </div>
          </h2>
          <div className="d-flex gap-3 justify-content-center align-items-center">
            <div
              className="  "
              id="searchBox"
              onClick={(e) => (toggleSearchContainer(), e.stopPropagation())}
            >
              <BsSearch size={22} />
            </div>
            <div className=" profile ">
              {user.isAuthenticated ? (
                <User onClick={toggleAccount} id="profileBox" />
              ) : (
                <Button
                  className="text-white text-center underline-none login-btn"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              )}
              {isAccountVisible && (
                <div
                  className="card-hover"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AccountCard />
                </div>
              )}
            </div>

            <div
              className="d-flex justify-content-center align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/cart"), setCartVisible(true);
              }}
            >
              <div>
                <FiShoppingCart size={22} />

                <span className=" rounded-circle  cartCount ">
                  {cartData?.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isSearchContainerVisible && (
        <SearchResults
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          suggestedProducts={suggestedProducts}
          setSearchQuery={setSearchQuery}
          setDebouncedSearchQuery={setDebouncedSearchQuery}
        />
      )}
      <NavbarMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default Header;
