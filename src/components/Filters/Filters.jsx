import React from "react";
import {
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Input,
  Label,
  Button,
} from "reactstrap";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

function Filters({
  isOpen,
  toggleMenu,
  categories,
  isButtonDisabled,
  applyFilters,
  resetFilters,
  selectedSubcategories,
  handleSubcategoryChange,
}) {
  const status = useSelector((state) => state?.categories?.status);

  return (
    <div>
      <Offcanvas
        isOpen={isOpen}
        toggle={toggleMenu}
        scrollable
        className="nav-menu"
      >
        <OffcanvasHeader
          toggle={toggleMenu}
          className="text-center bg-white border-bottom border-3 border-dark"
        >
          <h4 className="text-start">Categories</h4>
          <div className="d-flex justify-content-between gap-5 pt-2">
            <Button
              onClick={applyFilters}
              color="success"
              disabled={isButtonDisabled}
            >
              Apply Filters
            </Button>
            <Button color="danger" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </OffcanvasHeader>
        <OffcanvasBody className="nav-menu">
          <div>
            <hr />
            {status === "loading" || status === "idle" ? (
              <Spinner />
            ) : (
              categories?.map((category) => (
                <div key={category._id}>
                  <h5 className="bg-success text-white p-2 rounded">
                    {category.name}
                  </h5>
                  {category?.subcategories?.map((subcategory) => (
                    <div key={subcategory._id}>
                      <Label className="ms-2">
                        <Input
                          type="checkbox"
                          value={subcategory.name}
                          className="border-dark me-2"
                          checked={selectedSubcategories?.includes(
                            subcategory._id
                          )}
                          onChange={() => handleSubcategoryChange(subcategory)}
                        />
                        {subcategory.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
}

export default Filters;
