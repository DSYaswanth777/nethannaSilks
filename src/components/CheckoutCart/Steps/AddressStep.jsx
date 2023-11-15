import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Input, InputGroup, Label } from "reactstrap";
import { useRef } from "react";
import { useNavigate } from "react-router";
import {
  placeOrder,
  updatePaymentStatus,
} from "../../../redux/slice/orderSlice";
import toast from "react-hot-toast";
const THIRD_PARTY_API_ENDPOINT = import.meta.env
  .VITE_REACT_THIRD_PARTY_API_ENDPOINT;
const RAZORPAY_KEY = import.meta.env.VITE_YOUR_RAZORPAY_KEY_ID;
function AddressStep() {
  const [address, setAddress] = useState({
    fullName: "",
    mobileNumber: "",
    streetAddress: "",
    landmark: "",
    pincode: "",
    state: "",
    townCity: "",
  });
  const dispatch = useDispatch();
  const addressRef = useRef(address);
  addressRef.current = address;
  const navigate = useNavigate();
  const [pincodeDetails, setPincodeDetails] = useState(null);
  const [availableOptions, setAvailableOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });

    if (name === "pincode") {
      // Fetch address details when pincode is entered or changed
      fetchAddressDetails(value);
    }
  };

  const fetchAddressDetails = async (pincode) => {
    try {
      const response = await fetch(`${THIRD_PARTY_API_ENDPOINT}${pincode}`);

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const postOfficeOptions = data[0].PostOffice.map(
            (office) => office.Name
          );
          setAvailableOptions(postOfficeOptions);

          setPincodeDetails(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    // Extract state from the pincodeDetails object
    const selectedOptionDetails = pincodeDetails?.PostOffice.find(
      (office) => office.Name === option
    );
    if (selectedOptionDetails) {
      const selectedState = selectedOptionDetails.State;

      setAddress({
        ...address,
        townCity: option,
        state: selectedState, // Update the state field
      });
    } else {
      setAddress({
        ...address,
        townCity: option,
      });
    }

    // Clear the availableOptions and selectedOption
    setAvailableOptions([]);
    setSelectedOption("");
  };
  const handleProceedToPayment = async () => {
    try {
      const order = await dispatch(placeOrder(address));
      if (order.payload) {
        const orderData = order.payload.order; // This should contain the necessary data for Razorpay
        const options = {
          // Create options for Razorpay payment
          key: RAZORPAY_KEY,
          amount: orderData.totalAmount * 100, // Amount in paise
          currency: "INR",
          name: "Nethanna Silks",
          description: "Payment for your order",
          order_id: orderData.razorpayOrderID,
          modal: {
            ondismiss: function () {
              toast.error("Payment was failed");
              navigate("/orders");
            },
          },
          handler: async (response) => {
            try {
              const updatedStatus = await dispatch(
                updatePaymentStatus({
                  orderID: orderData.orderID,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                })
              );
              if (updatedStatus.meta.requestStatus === "fulfilled") {
                // Payment successful, you can navigate to a success page
                navigate("/");
              } else {
                // Payment status update failed, handle it as needed
                console.error("Payment status update failed");
                navigate("/orders");
              }
            } catch (error) {
              console.error("Error updating payment status:", error);
              navigate("/orders");
            }
          },
        };

        // Create a new Razorpay instance and open the payment modal
        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        // Handle the error in placing the order
        navigate("/orders");
        console.error("Error placing the order");
        // You can display an error message to the user
      }
    } catch (error) {
      console.error("Error placing the order:", error);
      navigate("/orders");
    }
  };
  return (
    <div className="container py-5 d-flex flex-column flex-sm-row justify-content-between gap-5">
      <Card className="p-5 w-100">
        <h3>Add New Address</h3>
        <p className="text-muted">
          Be sure to check "Deliver to this address" when you have finished
        </p>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex flex-column flex-sm-row gap-5 justify-content-center align-items-center">
            <InputGroup className="d-flex flex-column">
              <Label className="me-3">Full name</Label>
              <Input
                type="text"
                name="fullName"
                className="w-100"
                required
                value={address.fullName}
                onChange={handleInputChange}
              />
            </InputGroup>
            <InputGroup className="d-flex flex-column">
              <Label className="me-3">Mobile Number</Label>
              <Input
                type="number"
                name="mobileNumber"
                className="w-100"
                min={10}
                required
                value={address.mobileNumber}
                onChange={handleInputChange}
              />
            </InputGroup>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-5 justify-content-center align-items-center">
            <InputGroup className="d-flex flex-column">
              <Label className="me-3">Flat/ House No & Street:</Label>
              <Input
                type="text"
                name="streetAddress"
                className="w-100"
                value={address.streetAddress}
                onChange={handleInputChange}
              />
            </InputGroup>
            <InputGroup className="d-flex flex-column">
              <Label className="me-3">Landmark:</Label>
              <Input
                type="text"
                name="landmark"
                className="w-100"
                min={10}
                required
                value={address.landmark}
                onChange={handleInputChange}
              />
            </InputGroup>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-5 justify-content-center align-items-center">
            <InputGroup className="d-flex flex-column">
              <Label className="me-3">Pincode:</Label>
              <Input
                type="number"
                name="pincode"
                className="w-100"
                min={6}
                value={address.pincode}
                onChange={handleInputChange}
              />
              {availableOptions.length > 0 && (
                <div className="d-flex flex-column pt-2 pincodeDetails bg-light w-100 border">
                  {availableOptions.map((option) => (
                    <p
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className=" bg-light border-bottom"
                    >
                      {option}
                    </p>
                  ))}
                </div>
              )}
            </InputGroup>
            <InputGroup className="d-flex flex-column">
              <Label className="me-3">Town/City:</Label>
              <Input
                type="text"
                name="townCity"
                className="w-100"
                min={6}
                value={address.townCity}
                onChange={handleInputChange}
              />
            </InputGroup>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-5 justify-content-center align-items-center">
            <InputGroup className="d-flex flex-column">
              <Label className="me-3">State:</Label>
              <Input
                type="text"
                name="state"
                className="w-100"
                min={6}
                value={address.state}
                onChange={handleInputChange}
              />
            </InputGroup>
          </div>
          <div className=" pt-3 d-flex flex-column ">
            <Button onClick={handleProceedToPayment}>
              {" "}
              Proceed to Payment
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AddressStep;
