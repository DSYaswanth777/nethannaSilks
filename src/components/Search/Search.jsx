import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import Filters from "../Filters/Filters";
import Products from "../Products/Products";
import { useDispatch, useSelector } from "react-redux";
import {
  filterProductsAsync,
  sortproductsAsync,
} from "../../redux/slice/productSlice";
import Select from "react-dropdown-select";
import { useSearchParams } from "react-router-dom";
import { Filter } from "react-feather";
import { fetchCategoriesAsync } from "../../redux/slice/categoriesSlice";

function Search() {
  const [menuOpen, setMenuOpen] = useState(false);
  const productData = useSelector((state) => state.products?.sortedproducts);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const totalProducts = useSelector(
    (state) => state.products?.sortedproducts?.length
  );
  const dispatch = useDispatch();
  const categories = useSelector((state) => state?.categories?.categories);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSortValue = searchParams.get("sort");
  const initialSubcategories = searchParams.get("subcategories")
    ? searchParams.get("subcategories").split(",")
    : [];
  const [selectedSortOption, setSelectedSortOption] = useState(
    initialSortValue
      ? { value: initialSortValue, label: initialSortValue }
      : null
  );
  const [selectedSubcategories, setSelectedSubcategories] =
    useState(initialSubcategories);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Initial data fetch based on URL
    if (isLoaded) {
      if (!selectedSortOption && !selectedSubcategories.length) {
        dispatch(sortproductsAsync());
      } else {
        if (selectedSortOption) {
          dispatch(sortproductsAsync(selectedSortOption.value));
        }
        if (selectedSubcategories.length) {
          dispatch(filterProductsAsync(selectedSubcategories));
        }
      }
    }
  }, [isLoaded, selectedSortOption, selectedSubcategories, dispatch]);

  useEffect(() => {
    if (isLoaded && menuOpen === true) {
      dispatch(fetchCategoriesAsync());
    }
  }, [menuOpen, dispatch, isLoaded]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "lowtohigh", label: "Low to High" },
    { value: "hightolow", label: "High to Low" },
    { value: "hightolow&maxPrice=500", label: "Under 500" },
    { value: "hightolow&maxPrice=1000", label: "Under 1000" },
    { value: "hightolow&maxPrice=1500", label: "Under 1500" },
    { value: "hightolow&maxPrice=2000", label: "Under 2000" },
  ];

  const handleSubcategoryChange = (subcategory) => {
    let updatedSubcategories;
    if (selectedSubcategories.includes(subcategory._id)) {
      updatedSubcategories = selectedSubcategories.filter(
        (id) => id !== subcategory._id
      );
    } else {
      updatedSubcategories = [...selectedSubcategories, subcategory._id];
    }
    setSelectedSubcategories(updatedSubcategories);

    // Update URL with subcategories parameter
    setSearchParams(
      new URLSearchParams({
        ...searchParams,
        subcategories: updatedSubcategories.join(","),
      })
    );
  };

  const applyFilters = () => {
    setSearchParams(
      new URLSearchParams({
        ...searchParams,
        subcategories: selectedSubcategories.join(","),
      })
    );
    toggleMenu();
  };

  const resetFilters = () => {
    setSelectedSubcategories([]);
    setSearchParams(new URLSearchParams());
    dispatch(sortproductsAsync());
    toggleMenu();
  };

  useEffect(() => {
    // When the component mounts or URL params change, update the state and fetch results
    const currentSubcategories = searchParams.get("subcategories")
      ? searchParams.get("subcategories").split(",")
      : [];

    const currentSortOption = searchParams.get("sort");

    setSelectedSubcategories(currentSubcategories);
    setSelectedSortOption(
      currentSortOption
        ? { value: currentSortOption, label: currentSortOption }
        : null
    );

    if (isLoaded && currentSubcategories.length) {
      dispatch(filterProductsAsync(currentSubcategories));
    } else {
      dispatch(sortproductsAsync(currentSortOption));
    }
  }, [dispatch, searchParams, isLoaded]);

  return (
    <div>
      <div className="container pt-3">
        <div className="d-flex justify-content-between pt-3">
          <Button onClick={toggleMenu}>
            <Filter />
            <span>Filters</span>
          </Button>
          <Select
            value={selectedSortOption}
            options={sortOptions}
            onChange={(selectedOption) => {
              setSelectedSortOption(selectedOption ? selectedOption[0] : null);
            }}
            placeholder="Sort By"
            className="text-dark"
          />
        </div>
        <Products productData={productData} />
        <h5 className="pt-5 text-center">
          Showing total of {totalProducts} items
        </h5>
      </div>
      <Filters
        isOpen={menuOpen}
        toggleMenu={toggleMenu}
        categories={categories}
        handleSubcategoryChange={handleSubcategoryChange}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />
    </div>
  );
}

export default Search;
