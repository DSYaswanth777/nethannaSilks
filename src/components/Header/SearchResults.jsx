import React from "react";
import "./Header.scss";
import { Input, InputGroup, InputGroupText } from "reactstrap";
import { BsSearch } from "react-icons/bs";
function SearchResults({
  searchQuery,
  setSearchQuery,
  setDebouncedSearchQuery,
  handleSearch,
  suggestedProducts
}) {
  return (
    <div className="container pb-3 d-flex justify-content-center search-container">
      <InputGroup className="d-flex justify-content-center align-items-center input">
        <Input
          type="search"
          name=""
          id=""
          placeholder="Search your product..."
          className="border border-end-0 input-search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setDebouncedSearchQuery(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <InputGroupText className="p-2 input-text">
          <BsSearch size={20} className="" />
        </InputGroupText>
      </InputGroup>
      <ul className="search-results bg-white py-2 px-2">
        {suggestedProducts?.slice(0, 5)?.map((suggestion, index) => (
          <p
            key={index}
            className="border-bottom border-2 text-left "
            onClick={handleSearch}
          >
            {suggestion?.productName}
          </p>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
