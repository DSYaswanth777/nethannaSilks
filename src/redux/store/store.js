//**Store import */
import { configureStore } from '@reduxjs/toolkit';
//**Thunk Middleware Import */
import thunk from "redux-thunk";
//**Reducer Imports */ 
import authReducer from '../slice/authSlice';
import categoriesReducer from '../slice/categoriesSlice';
import productSlice from '../slice/productSlice';
import couponSlice from '../slice/couponSlice';
import customerSlice from '../slice/customerSlice';
import wishlistSlice from '../slice/wishlistSlice';
import cartSlice from '../slice/cartSlice';
import ProfileSlice from '../slice/profileSlice';
import orderSlice from '../slice/orderSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    products:productSlice,
    coupons:couponSlice,
    customers:customerSlice,
    wishlist:wishlistSlice,
    cart:cartSlice,
    profile:ProfileSlice,
    orders:orderSlice
  },
  middleware: [thunk],
});

export default store;
