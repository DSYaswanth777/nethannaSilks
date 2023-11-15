import React, { useState } from "react";
import Header from "../../Header/Header";
import { Button } from "reactstrap";
import Products from "./Products";
import Categories from "./Categories"
import Orders from "./Orders"
import Customers from "./Customers"
import Coupons from "./Coupons";

// Separate components for each section
function ProductsSection() {
  return <Products/>
}

function CategoriesSection() {
  return <Categories/>
}

function OrdersSection() {
  return <Orders/>
}

function CustomersSection() {
  return <Customers/>
}

function CouponsSection() {
  return <Coupons/>
}
function Dashboard() {
  const [activeSection, setActiveSection] = useState("Products");

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Helper function to render the active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case "Products":
        return <ProductsSection />;
      case "Categories":
        return <CategoriesSection />;
      case "Orders":
        return <OrdersSection />;
      case "Customers":
        return <CustomersSection />;
        case "Coupons":
          return <CouponsSection/>
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <h1 className="text-center py-4">Admin Panel</h1>
      <div className="  h-100 d-flex flex-column container">
        <div className="  h-100  d-flex justify-content-center gap-3 pb-4">
          <Button
            onClick={() => handleSectionChange("Products")}
            color={activeSection === "Products" ? "success" : "light"}
          >
            Products
          </Button>
          <Button
            onClick={() => handleSectionChange("Categories")}
            color={activeSection === "Categories" ? "success" : "light"}
          >
            Categories
          </Button>
          <Button
            onClick={() => handleSectionChange("Orders")}
            color={activeSection === "Orders" ? "success" : "light"}
          >
            Orders
          </Button>
          <Button
            onClick={() => handleSectionChange("Customers")}
            color={activeSection === "Customers" ? "success" : "light"}
          >
            Customers
          </Button>
          <Button
            onClick={() => handleSectionChange("Coupons")}
            color={activeSection === "Coupons" ? "success" : "light"}
          >
            Coupons
          </Button>
        </div>
        <div >
        {renderActiveSection()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
