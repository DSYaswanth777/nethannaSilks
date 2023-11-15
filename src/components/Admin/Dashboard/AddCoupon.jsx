import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Form, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useDispatch } from "react-redux";
import {
  addCouponAsync,
  editCouponAsync,
  fetchCoupons,
} from "../../../redux/slice/couponSlice";
import { formatDateForInput } from "../../../utilities/FormatInputDate";

function AddCoupon({ isOpen, toggle, isEditing, couponData }) {
  const [formData, setFormData] = useState({
    code: "",
    discountedAmount: "",
    maxUses: "",
    expirationDate: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchCoupons());
    if (isEditing && couponData) {
      // Initialize the form data with the product information when in edit mode
      setFormData({
        code: couponData.code,
        discountedAmount: couponData.discountedAmount,
        maxUses: couponData.maxUses,
        expirationDate: couponData.expirationDate,
      });
    }
    // setselectedCouponId(couponData.id)
  }, [dispatch, isEditing, couponData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const addCouponData = {
        code: formData.code,
        discountedAmount: formData.discountedAmount,
        maxUses: formData.maxUses,
        expirationDate: formData.expirationDate,
      };
   
    try {
      if (isEditing) {
        const editCouponData = {
          code: formData.code,
          discountedAmount: formData.discountedAmount,
          maxUses: formData.maxUses,
          expirationDate: formData.expirationDate,
        };
     
        const couponId = couponData._id;

        await dispatch(editCouponAsync({ id: couponId, ...editCouponData }));
        dispatch(fetchCoupons());
        toggle();

        if (!response.ok) {
          throw new Error("Failed to edit the coupon");
        }
      } else {
        // Use AddCouponAsync action for adding
        await dispatch(addCouponAsync(addCouponData));
      }
      toggle();
      dispatch(fetchCoupons());
    } catch (error) {
      // Handle the error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {isEditing ? "Edit Coupon" : "Add New Coupon"}
        </ModalHeader>
        <ModalBody>
          {isUploading ? (
            <div className="text-center">
              <Spinner color="primary" />
              {isEditing ? (
                <p> Please Wait...</p>
              ) : (
                <p>Please while adding your Coupon..</p>
              )}
            </div>
          ) : (
            <Form className="d-flex flex-column gap-2" onSubmit={handleSubmit}>
              <Label>Coupon Code</Label>
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
              />

              <Label>Coupon Discounted Amount</Label>
              <Input
                type="number"
                name="discountedAmount"
                value={formData.discountedAmount}
                onChange={handleInputChange}
                required
              />
              <Label>Max Usage</Label>
              <Input
                type="number"
                name="maxUses"
                value={formData.maxUses}
                onChange={handleInputChange}
              />
              <Label>Product Stock</Label>
              <Input
                type="date"
                name="expirationDate"
                value={formatDateForInput(formData.expirationDate)}
                onChange={handleInputChange}
                required
              />
              <div className="d-flex justify-content-end gap-3">
                <Button type="submit" variant="success">
                  Save
                </Button>
                <Button variant="danger" onClick={toggle}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AddCoupon;
