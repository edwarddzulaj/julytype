import { fetchAPI } from "@/app/utils/fetch-api";
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
    <section className="container page cart">
      <h3>Your cart</h3>
      <hr />
      <section className="cart-items">
        {cartItems.length > 0 &&
          cartItems.map((cartItem: any) => <div key={cartItem.id}>{cartItem.title}</div>)}
        {cartItems.length === 0 && (
          <div className="no-cart-items">
            <h5>You have no items in your cart yet</h5>
            <Link href="/" className="browse-more">
              Browse more typefaces
            </Link>
          </div>
        )}
      </section>
    </section>
  );
}
