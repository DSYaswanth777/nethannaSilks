import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import CartStep from "../components/CheckoutCart/Steps/CartStep";

function CartPage() {
  return (
    <>
      <Header />
      <CartStep/>
      <Footer/>
    </>
  );
}

export default CartPage;
