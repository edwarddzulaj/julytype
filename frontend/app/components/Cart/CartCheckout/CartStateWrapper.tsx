"use client";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/app/redux/store";
import { useEffect } from "react";
import { emptyCart } from "@/app/redux/cartReducer";

// This is a really hacky way to empty the cart but
// having in mind the nature of NextJS and redux need
// for client components this will do for now...
export default function CartStateWrapper() {
  return (
    <Provider store={store}>
      <EmptyCartComponent />
    </Provider>
  );
}

function EmptyCartComponent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(emptyCart());
  }, [dispatch]);

  return <></>;
}
