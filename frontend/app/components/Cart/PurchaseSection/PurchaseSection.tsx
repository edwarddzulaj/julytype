"use client";

import FontSelection from "./FontSelection";
import { Typeface } from "@/@types/contentTypes";
import PurchaseOption from "./PurchaseOption";
import { companySizeOptions, discountOptions, licenseOptions } from "./purchase-option-configs";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { addToCart, CartItem, updateCartItem } from "@/app/redux/cartReducer";
import { calculatePrices, calculateTotalPrices } from "@/app/utils/cart-helpers";
import { PurchaseDetails } from "./PurchaseSectionTypes";
import { SelectedItem } from "@/app/redux/cartReducer";

export default function PurchaseSection({ typeface }: { typeface: Typeface }) {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [prices, setPrices] = useState({ price: 0, finalPrice: 0 });
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>({
    licenseTypes: [],
    companySize: 1,
    studentDiscount: false,
    wholePackageDiscount: false,
  });

  // Set up purchase details and selected weights
  useEffect(() => {
    initialisePurchaseDetails();
    initialiseCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (purchaseDetails.wholePackageDiscount) {
      const [price, discountPrice] = calculatePrices(
        { price: typeface.attributes.price, discount: typeface.attributes.wholePackageDiscount },
        purchaseDetails
      );

      setPrices({ price: price, finalPrice: discountPrice });
    } else {
      const { totalPrice, discountPrice } = calculateTotalPrices(selectedItems, purchaseDetails);

      setPrices({ price: totalPrice, finalPrice: discountPrice });
    }
  }, [
    selectedItems,
    purchaseDetails.licenseTypes,
    purchaseDetails.companySize,
    purchaseDetails.studentDiscount,
    purchaseDetails.wholePackageDiscount,
    typeface.attributes.price,
    typeface.attributes.wholePackageDiscount,
    purchaseDetails,
  ]);

  const initialisePurchaseDetails = () => {
    let initialPurchaseDetails: PurchaseDetails = {
      licenseTypes: [],
      companySize: 1,
      studentDiscount: false,
      wholePackageDiscount: false,
    };

    const existingCartItem: CartItem | undefined = cart.items.find(
      (item) => item.typefaceId === typeface.id
    );
    if (existingCartItem) {
      initialPurchaseDetails = {
        licenseTypes: existingCartItem.purchaseDetails.licenseTypes,
        companySize: existingCartItem.purchaseDetails.companySize,
        studentDiscount: !!existingCartItem.purchaseDetails.studentDiscount,
        wholePackageDiscount: !!existingCartItem.purchaseDetails.wholePackageDiscount,
      };
    } else {
      const defaultLicenseType = licenseOptions.options.find((o) => o.checked);
      const defaultCompanySize = companySizeOptions.options.find((o) => o.checked);

      initialPurchaseDetails.licenseTypes = defaultLicenseType ? [defaultLicenseType.value] : [];
      initialPurchaseDetails.companySize = defaultCompanySize ? defaultCompanySize.value : 1;
    }

    setPurchaseDetails({
      ...purchaseDetails,
      ...initialPurchaseDetails,
    });
  };

  const initialiseCartItems = () => {
    const addedItem = cart.items.find((item: CartItem) => item.typefaceId === typeface.id);

    if (addedItem) {
      setSelectedItems([...selectedItems, ...addedItem.weights]);
    }
  };

  const addItemsToCart = () => {
    if (purchaseDetails.licenseTypes && purchaseDetails.companySize) {
      let finalItems: SelectedItem[] = [];
      const addedItem = cart.items.find((item: CartItem) => item.typefaceId === typeface.id);

      selectedItems.forEach((selectedItem: SelectedItem) => {
        finalItems.push(selectedItem);
      });

      const item: CartItem = {
        typefaceId: typeface.id,
        name: typeface.attributes.title,
        weights: finalItems,
        selected: true,
        purchaseDetails,
        totalPrice: 0,
        totalDiscountPrice: 0,
      };

      if (purchaseDetails.wholePackageDiscount) {
        const [price, priceWithDiscount] = calculatePrices(
          { price: typeface.attributes.price, discount: typeface.attributes.wholePackageDiscount },
          purchaseDetails
        );

        item.totalPrice = price;
        item.totalDiscountPrice = priceWithDiscount;
      } else {
        const { totalPrice, discountPrice } = calculateTotalPrices(selectedItems, purchaseDetails);
        item.totalPrice = totalPrice;
        item.totalDiscountPrice = discountPrice;
      }

      if (addedItem) {
        dispatch(updateCartItem(item));
      } else {
        dispatch(addToCart(item));
      }
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
            selectedOption={purchaseDetails.licenseTypes}
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
            selectedOption={purchaseDetails.companySize}
            setCallback={(companySizeString: string[]) => {
              setPurchaseDetails({ ...purchaseDetails, companySize: +companySizeString[0] });
            }}
          />
        </div>
        <div>
          <h5>Discount</h5>
          <PurchaseOption
            config={discountOptions}
            selectedOption={purchaseDetails.studentDiscount ? 1 : 0}
            setCallback={(studentDiscountString: string[]) => {
              setPurchaseDetails({
                ...purchaseDetails,
                studentDiscount: +studentDiscountString[0] > 0,
              });
            }}
          />
        </div>
      </div>
      <div id="font-selection-options" className="font-selection-options">
        <h5>Choose weights and styles</h5>
        <FontSelection
          typeface={typeface}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          purchaseDetails={purchaseDetails}
          setPurchaseDetails={setPurchaseDetails}
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
