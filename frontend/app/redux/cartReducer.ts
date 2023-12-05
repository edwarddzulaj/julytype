import { TypefaceWeight } from "@/@types/components";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  styleId: number;
  name: string;
  weight: TypefaceWeight;
  licenseTypes: string[];
  companySize: number;
  discount?: boolean;
  wholePackage?: boolean;
}

export interface ProductItem {
  id: number;
  name: string;
  totalPrice: number;
  weights: Array<TypefaceWeight & { styleId: number }>;
  licenseTypes: string[];
  companySize: number;
  discount?: boolean;
  wholePackage?: boolean;
}

const initialState = {
  products: [],
} as { products: Array<CartItem> };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.products.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (item: CartItem) => item.weight?.id !== action.payload.weight.id
      );
    },
    emptyCart: (state) => {
      state.products = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;
