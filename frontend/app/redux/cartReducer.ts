import { TypefaceWeight } from "@/@types/components";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PurchaseDetails } from "../components/Cart/PurchaseSection/PurchaseSectionTypes";

export interface SelectedItem extends TypefaceWeight {
  styleId?: number;
  isVariableFont?: boolean;
}

export interface ProductItem {
  id: number;
  name: string;
  weight: SelectedItem;
}

export interface CartItem {
  typefaceId: number;
  name: string;
  weights: Array<SelectedItem>;
  purchaseDetails: PurchaseDetails;
  selected: boolean;
  totalPrice: number;
  totalDiscountPrice: number;
}

const initialState = {
  items: [],
} as { items: Array<CartItem> };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item: CartItem) =>
        item.weights.filter((product: SelectedItem) => product?.id !== action.payload.weight.id)
      );
    },
    emptyCart: (state) => {
      state.items = [];
    },
    updateCartItem: (state, action: PayloadAction<CartItem>) => {
      const itemIndex = state.items.findIndex(
        (item: CartItem) => item.typefaceId === action.payload.typefaceId
      );

      state.items[itemIndex] = { ...state.items[itemIndex], ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, emptyCart, updateCartItem } = cartSlice.actions;

export default cartSlice.reducer;
