"use client";

import FontSelection from "./FontSelection";
import { Typeface } from "@/@types/contentTypes";
import PurchaseOption from "./PurchaseOption";
import { companySizeOptions, discountOptions, licenseOptions } from "./purchase-option-configs";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { CartItem, addToCart } from "@/app/redux/cartReducer";
import { calculateTotalPrices } from "@/app/utils/cart-helpers";
import { PurchaseDetails, SelectedItem } from "./PurchaseSectionTypes";

export default function PurchaseSection({ typeface }: { typeface: Typeface }) {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [prices, setPrices] = useState({ price: 0, finalPrice: 0 });
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>({
    licenseTypes: undefined,
    companySize: undefined,
    discount: ["no"],
  });

  useEffect(() => {
    const defaultLicenseType = licenseOptions.options.find((o) => o.checked)?.value;
    const defaultCompanySize = companySizeOptions.options.find((o) => o.checked)?.value;

    setPurchaseDetails({
      ...purchaseDetails,
      ...(defaultLicenseType ? { licenseTypes: [defaultLicenseType] } : {}),
      ...(defaultCompanySize ? { companySize: [defaultCompanySize] } : {}),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const addedProducts = cart.products.filter((p) => p.id === typeface.id);

    if (addedProducts) {
      addedProducts.forEach((p) => {
        setSelectedItems([...selectedItems, p.weight]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { totalPrice, discountPrice } = calculateTotalPrices(
      selectedItems,
      purchaseDetails.licenseTypes,
      purchaseDetails.companySize,
      purchaseDetails.discount
    );

    setPrices({ price: totalPrice, finalPrice: discountPrice });
  }, [
    selectedItems,
    purchaseDetails.licenseTypes,
    purchaseDetails.companySize,
    purchaseDetails.discount,
  ]);

  const addItemsToCart = () => {
    if (purchaseDetails.licenseTypes && purchaseDetails.companySize) {
      selectedItems.forEach((selectedItem: SelectedItem) => {
        if (cart.products.find((p) => p.weight.id === selectedItem.id)) return;

        const item: CartItem = {
          id: typeface.id,
          styleId: selectedItem.styleId!,
          name: typeface.attributes.title,
          weight: selectedItem,
          licenseTypes: purchaseDetails.licenseTypes!,
          companySize: +purchaseDetails.companySize![0],
          discount: purchaseDetails.discount![0] === "yes",
          wholePackage: false,
        };

        dispatch(addToCart(item));
      });

      window.location.href = "/cart";
    }
  };

  return (
    <section className="purchase-section">
      <div className="license-options">
        <div>
          <h5>License Type</h5>
          <PurchaseOption
            config={licenseOptions}
            optionType="checkbox"
            requireOneCheckbox={true}
            setCallback={(optionValues: string[]) => {
              setPurchaseDetails({ ...purchaseDetails, licenseTypes: optionValues });
            }}
          />
        </div>
        <div>
          <h5>Company Size</h5>
          <PurchaseOption
            config={companySizeOptions}
            setCallback={(optionValues: string[]) => {
              setPurchaseDetails({ ...purchaseDetails, companySize: optionValues });
            }}
          />
        </div>
        <div>
          <h5>Discount</h5>
          <PurchaseOption
            config={discountOptions}
            setCallback={(optionValues: string[]) => {
              setPurchaseDetails({
                ...purchaseDetails,
                discount: optionValues,
              });
            }}
          />
        </div>
      </div>
      <div className="font-selection-options">
        <h5>Choose weights and styles</h5>
        <FontSelection
          typeface={typeface}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          purchaseDetails={purchaseDetails}
        />
      </div>
      <div className="checkout-action">
        <div className="total-price">
          Total:{" "}
          {prices.price !== prices.finalPrice && <span className="price">{prices.price} EUR</span>}
          &nbsp;
          {prices.finalPrice} EUR
        </div>
        <button className="cart-link" disabled={selectedItems.length < 1} onClick={addItemsToCart}>
          Add to cart
        </button>
      </div>
    </section>
  );
}
