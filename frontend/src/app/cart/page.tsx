import { fetchAPI } from "@/src/app/utils/fetch-api";
import Link from "next/link";

async function getCartItems() {
  //   const path = `/simple-pages`;
  //   const urlParamsObject = {
  //     populate: "*",
  //     filters: {
  //       slug: slug,
  //     },
  //   };
  //   const responseData = await fetchAPI(path, urlParamsObject);
  //   return responseData.data[0];
}

export default async function CartPage() {
  const cartItems: any[] = [];

  return (
    <section className="page">
      <h1>Your cart</h1>
      <hr />
      <section className="cart-items">
        {cartItems.length > 0 &&
          cartItems.map((cartItem: any) => <div key={cartItem.id}>{cartItem.title}</div>)}
        {cartItems.length == 0 && (
          <div className="no-cart-items">
            <h5>You have no items in your cart</h5>
            <Link href="/">Browse more typefaces</Link>
          </div>
        )}
      </section>
    </section>
  );
}
