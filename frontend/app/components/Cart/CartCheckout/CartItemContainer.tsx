"use client";

import { TypefaceWeight } from "@/@types/components";
import { CartItem, updateCartItem } from "@/app/redux/cartReducer";
import Dropdown from "../../UI/Dropdown";
import { PurchaseDetails } from "../PurchaseSection/PurchaseSectionTypes";
import { useAppSelector } from "@/app/redux/hooks";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Iconly, { icons } from "../../UI/Iconly";

import { calculateTotalPrices } from "@/app/utils/cart-helpers";
import { licenseOptions, companySizeOptions } from "../PurchaseSection/purchase-option-configs";
import { pluralize } from "@/app/utils/text-helpers";

export default function CartItemContainer({ item, index }: { item: CartItem; index: number }) {
  const [allWeights, setAllWeights] = useState("");
  const [prices, setPrices] = useState({ price: 0, finalPrice: 0 });
  const dispatch = useDispatch();
  const cart = useAppSelector((state) => state.cart);

  const { licenseTypes, companySize, studentDiscount, wholePackageDiscount } = item.purchaseDetails;
  const companySizeOptionsList = companySizeOptions.options.map((option) => ({
    value: option.value.toString(),
    label: `Less than ${option.label.replace("<", "")}`,
  }));
  const initialCompanySize = companySizeOptionsList.find((o) => +o.value === companySize);

  const licenseOptionsList = licenseOptions.options.filter(
    (option) => !licenseTypes.includes(option.value)
  );

  const toggleCartItem = () => {
    dispatch(updateCartItem({ ...item, selected: !getCurrentCartItem(item.typefaceId)!.selected }));
  };

  const getCurrentCartItem = (id: number) => {
    return cart.items.find((item) => item.typefaceId === id);
  };

  const handleCompanySizeChange = (option: any) => {
    dispatch(
      updateCartItem({
        ...item,
        purchaseDetails: { ...item.purchaseDetails, companySize: +option.value },
      })
    );
  };

  const handleLicenseTypeChange = (option: any, remove = false) => {
    if (remove && licenseTypes.length > 1) {
      const filteredLicenseTypes = licenseTypes.filter(
        (licenseType) => licenseType !== option.value
      );
      dispatch(
        updateCartItem({
          ...item,
          purchaseDetails: { ...item.purchaseDetails, licenseTypes: filteredLicenseTypes },
        })
      );
    } else {
      dispatch(
        updateCartItem({
          ...item,
          purchaseDetails: {
            ...item.purchaseDetails,
            licenseTypes: [...item.purchaseDetails.licenseTypes, option.value],
          },
        })
      );
    }
  };

  useEffect(() => {
    setAllWeights(combineAllTitles(item.weights));
    const purchaseDetails: PurchaseDetails = {
      licenseTypes: licenseTypes,
      companySize: companySize,
      studentDiscount: !!studentDiscount,
      wholePackageDiscount: !!wholePackageDiscount,
    };

    const { totalPrice, discountPrice } = calculateTotalPrices(
      item.weights,
      purchaseDetails,
      item.wholePackagePrices
    );
    setPrices({ price: totalPrice, finalPrice: discountPrice });
  }, [
    companySize,
    studentDiscount,
    licenseTypes,
    wholePackageDiscount,
    item.weights,
    item.totalPrice,
    item.totalDiscountPrice,
    item.wholePackagePrices,
  ]);
  return (
    <section className="cart-item-container">
      <article className="checkbox-container">
        <label className="index" htmlFor={index.toString()}>
          {index + 1}
        </label>
        <input
          type="checkbox"
          name={index.toString()}
          id={index.toString()}
          checked={getCurrentCartItem(item.typefaceId)?.selected}
          onChange={toggleCartItem}
          title="Remove from cart"
        />
      </article>
      <article className="details-container">
        <div>
          <h6 className="title">Weights and styles</h6>
          {allWeights}
        </div>
        <div>
          <h6 className="title">License {pluralize(licenseTypes.length, "Type", false)}</h6>
          <ul className="licenses">
            {licenseTypes.map((license) => {
              const licenseOption = licenseOptions.options.find((o) => o.value === license);
              return (
                <li className="license" key={license}>
                  {licenseOption?.label || ""}
                  {licenseTypes.length > 1 && (
                    <span
                      className="remove-license"
                      onClick={() => {
                        handleLicenseTypeChange(licenseOption, true);
                      }}
                    >
                      <Iconly icon={icons.close}></Iconly>
                    </span>
                  )}
                </li>
              );
            })}
            <div className="add-license">
              <Dropdown
                options={licenseOptionsList}
                placeholder="Add license type"
                onChange={(e: React.ChangeEvent) => handleLicenseTypeChange(e)}
              />
            </div>
          </ul>
        </div>
        <div>
          <h6 className="title">Company Size</h6>
          <div className="company-sizes">
            <Dropdown
              options={companySizeOptionsList}
              defaultValue={initialCompanySize}
              onChange={(e: React.ChangeEvent) => handleCompanySizeChange(e)}
            />
          </div>
        </div>
      </article>
      <article className="price-container">
        <div>
          {prices.price !== prices.finalPrice && <span className="price">{prices.price} EUR</span>}
          <span className="discount-price">{prices.finalPrice} EUR</span>
        </div>
      </article>
    </section>
  );
}

function combineAllTitles(weights: Array<TypefaceWeight>) {
  let allWeights: Array<string> = [];
  weights.forEach((weight: TypefaceWeight) => {
    allWeights.push(weight.title);
  });

  return allWeights.join(", ");
}
