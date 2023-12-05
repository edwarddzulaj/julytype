"use client";

import FontSelection from "./FontSelection";
import { Typeface } from "@/@types/contentTypes";
import PurchaseOption from "./PurchaseOption";
import { companySizeOptions, discountOptions, licenseOptions } from "./purchase-option-configs";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { CartItem, addToCart } from "@/app/redux/cartReducer";
import { TypefaceWeight } from "@/@types/components";

export default function PurchaseSection({ typeface }: { typeface: Typeface }) {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const [selectedItems, setSelectedItems] = useState<TypefaceWeight[]>([]);
  const [purchaseDetails, setPurchaseDetails] = useState<{
    licenseType: string[] | undefined;
    companySize: string[] | undefined;
    discount: string[] | undefined;
  }>({
    licenseType: undefined,
    companySize: undefined,
    discount: ["no"],
  });

  useEffect(() => {
    const defaultLicenseType = licenseOptions.options.find((o) => o.checked)?.value;
    const defaultCompanySize = companySizeOptions.options.find((o) => o.checked)?.value;

    setPurchaseDetails({
      ...purchaseDetails,
      ...(defaultLicenseType ? { licenseType: [defaultLicenseType] } : {}),
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
  }, [cart.products]);

  const addItemsToCart = () => {
    if (purchaseDetails.licenseType && purchaseDetails.companySize) {
      selectedItems.forEach((selectedItem) => {
        const item: CartItem = {
          id: typeface.id,
          styleId: 1,
          name: typeface.attributes.title,
          weight: selectedItem,
          licenseType: purchaseDetails.licenseType!,
          companySize: +purchaseDetails.companySize![0],
          discount: purchaseDetails.discount![0] === "yes",
          wholePackage: false,
        };

        dispatch(addToCart(item));
      });
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
            setCallback={(optionValues: string[]) => {
              setPurchaseDetails({ ...purchaseDetails, licenseType: optionValues });
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
        />
      </div>
      <div className="checkout-action">
        <div className="total-price">
          Total: <span className="price">80 EUR</span> 64 EUR
        </div>
        <button className="cart-link" disabled={selectedItems.length < 1} onClick={addItemsToCart}>
          Add to cart
        </button>
      </div>
    </section>
  );
}
