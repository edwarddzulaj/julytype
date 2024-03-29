"use client";

import FontSelection from "./FontSelection";
import { Typeface } from "@/@types/contentTypes";
import PurchaseOption from "./PurchaseOption";
import { companySizeOptions, discountOptions, licenseOptions } from "./purchase-option-configs";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { addToCart, CartItem, updateCartItem } from "@/app/redux/cartReducer";
import { calculateTotalPrices } from "@/app/utils/cart-helpers";
import { PurchaseDetails } from "./PurchaseSectionTypes";
import { SelectedItem } from "@/app/redux/cartReducer";
import StudentEmailVerificationForm from "./StudentEmailVerificationForm";

export default function PurchaseSection({ typeface }: { typeface: Typeface }) {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [prices, setPrices] = useState({ price: 0, finalPrice: 0 });
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [studentDiscountToggle, setStudentDiscountToggle] = useState(false);
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
    const wholePackagePrices = {
      price: typeface.attributes.price,
      discount: typeface.attributes.wholePackageDiscount,
    };

    const { totalPrice, discountPrice } = calculateTotalPrices(
      selectedItems,
      purchaseDetails,
      wholePackagePrices
    );

    setPrices({ price: totalPrice, finalPrice: discountPrice });
  }, [
    selectedItems,
    purchaseDetails.licenseTypes,
    purchaseDetails.companySize,
    purchaseDetails.studentDiscount,
    purchaseDetails.wholePackageDiscount,
    typeface.attributes.price,
    typeface.attributes.wholePackageDiscount,
    purchaseDetails,
    typeface,
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
        wholePackagePrices: {
          price: typeface.attributes.price,
          discount: typeface.attributes.wholePackageDiscount,
        },
      };

      const { totalPrice, discountPrice } = calculateTotalPrices(
        selectedItems,
        purchaseDetails,
        item.wholePackagePrices
      );
      item.totalPrice = totalPrice;
      item.totalDiscountPrice = discountPrice;

      if (addedItem) {
        dispatch(updateCartItem(item));
      } else {
        dispatch(addToCart(item));
      }
      window.location.href = "/cart";
    }
  };

  const allowStudentDiscount = (emailObj: { email: string; isVerified: boolean }) => {
    if (emailObj.email && emailObj.isVerified) {
      setPurchaseDetails({ ...purchaseDetails, studentDiscount: true });
    } else {
      setPurchaseDetails({ ...purchaseDetails, studentDiscount: false });
    }
  };

  return (
    <section className="purchase-section">
      <div className="license-options">
        <div>
          <h4>License Type</h4>
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
          <h4>Company Size</h4>
          <PurchaseOption
            config={companySizeOptions}
            selectedOption={purchaseDetails.companySize}
            setCallback={(companySizeString: string[]) => {
              setPurchaseDetails({ ...purchaseDetails, companySize: +companySizeString[0] });
            }}
          />
        </div>
        <div>
          <h4>Discount</h4>
          <div>
            <PurchaseOption
              config={discountOptions}
              selectedOption={studentDiscountToggle ? 1 : 0}
              setCallback={(studentDiscountString: string[]) => {
                setStudentDiscountToggle(+studentDiscountString[0] > 0);
              }}
            />
            {studentDiscountToggle && (
              <StudentEmailVerificationForm
                setStudentEmailValid={(email: any) => allowStudentDiscount(email)}
              />
            )}
          </div>
        </div>
      </div>
      <div id="font-selection-options" className="font-selection-options">
        <h4>Choose weights and styles</h4>
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
          <h6 className="vat-disclaimer">excl. BTW</h6>
        </div>
        <button className="cart-link" disabled={selectedItems.length < 1} onClick={addItemsToCart}>
          Add to cart
        </button>
      </div>
    </section>
  );
}
