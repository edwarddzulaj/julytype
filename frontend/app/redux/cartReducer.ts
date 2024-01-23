import { TypefaceWeight } from "@/@types/components";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SelectedItem extends TypefaceWeight {
  styleId?: number;
}

export interface CartItem {
  id: number;
  styleId: number;
  name: string;
  weight: TypefaceWeight;
  licenseTypes: string[];
  selected: boolean;
  companySize: number;
  studentDiscount?: boolean;
  wholePackageDiscount?: boolean;
}

export interface ProductItem {
  id: number;
  name: string;
  totalPrice: number;
  totalDiscountPrice: number;
  weights: Array<SelectedItem>;
  licenseTypes: string[];
  companySize: number;
  selected: boolean;
  studentDiscount?: boolean;
  wholePackageDiscount?: boolean;
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
    updateProduct: (state, action: PayloadAction<ProductItem>) => {
      const productIndex = state.products.findIndex(
        (item: CartItem) => item.id === action.payload.id
      );

      state.products[productIndex] = { ...state.products[productIndex], ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, emptyCart, updateProduct } = cartSlice.actions;

export default cartSlice.reducer;
