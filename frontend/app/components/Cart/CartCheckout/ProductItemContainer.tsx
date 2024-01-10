"use client";
import Dropdown from "react-dropdown";
import Link from "next/link";

import { TypefaceWeight } from "@/@types/components";
import { removeFromCart, ProductItem, updateProduct } from "@/app/redux/cartReducer";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import Iconly, { icons } from "../../UI/Iconly";

import { calculateTotalPrices } from "@/app/utils/cart-helpers";
import { licenseOptions, companySizeOptions } from "../PurchaseSection/purchase-option-configs";
import { pluralize } from "@/app/utils/text-helpers";

export default function ProductItemContainer({ item }: { item: ProductItem }) {
  const [licenseTypeDefault, setLicenseTypeDefault] = useState("Add license type");
  const [allWeights, setAllWeights] = useState("");
  const [prices, setPrices] = useState({ price: 0, finalPrice: 0 });

  const dispatch = useDispatch();

  const companySizeOptionsList = companySizeOptions.options.map((option) => ({
    value: option.value,
    label: `Less than ${option.label.replace("<", "")}`,
  }));
  const initialCompanySize = companySizeOptionsList.find((o) => +o.value === item.companySize);

  const licenseOptionsList = licenseOptions.options.filter(
    (option) => !item.licenseTypes.includes(option.value)
  );

  const removeProductItem = () => {
    item.weights.forEach((weight) => {
      dispatch(removeFromCart({ weight: { id: weight.id } }));
    });
  };

  const handleCompanySizeChange = (option: any) => {
    dispatch(updateProduct({ ...item, companySize: +option.value }));
  };

  const handleLicenseTypeChange = (option: any, remove = false) => {
    if (remove && item.licenseTypes.length > 1) {
      const filteredLicenseTypes = item.licenseTypes.filter(
        (licenseType) => licenseType !== option.value
      );
      dispatch(updateProduct({ ...item, licenseTypes: filteredLicenseTypes }));
    } else {
      dispatch(updateProduct({ ...item, licenseTypes: [...item.licenseTypes, option.value] }));
      setLicenseTypeDefault("Add license type");
    }
  };

  useEffect(() => {
    setAllWeights(combineAllTitles(item.weights));

    const { totalPrice, discountPrice } = calculateTotalPrices(
      item.weights,
      item.licenseTypes,
      [item.companySize?.toString()],
      item.discount
    );
    setPrices({ price: totalPrice, finalPrice: discountPrice });
  }, [item.companySize, item.discount, item.licenseTypes, item.weights]);
  return (
    <section className="cart-item-container">
      <article className="details">
        <div>
          <h6 className="title">Weights and styles</h6>
          {allWeights}
        </div>
        <div>
          <h6 className="title">License {pluralize(item.licenseTypes.length, "Type", false)}</h6>
          <ul className="licenses">
            {item.licenseTypes.map((license) => {
              const licenseOption = licenseOptions.options.find((o) => o.value === license);
              return (
                <li className="license" key={license}>
                  {licenseOption!.label}{" "}
                  <span
                    className="remove-license"
                    onClick={() => {
                      handleLicenseTypeChange(licenseOption, true);
                    }}
                  >
                    <Iconly icon={icons.close}></Iconly>
                  </span>
                </li>
              );
            })}
            <div className="add-license">
              <Dropdown
                className="dropdown"
                options={licenseOptionsList}
                onChange={handleLicenseTypeChange}
                value={licenseTypeDefault}
                arrowClosed={<Iconly icon={icons.chevronDown} />}
                arrowOpen={<Iconly icon={icons.chevronUp} />}
              />
            </div>
          </ul>
        </div>
        <div>
          <h6 className="title">Company Size</h6>
          <div className="company-sizes">
            <Dropdown
              className="dropdown"
              options={companySizeOptionsList}
              onChange={handleCompanySizeChange}
              value={initialCompanySize}
              arrowClosed={<Iconly icon={icons.chevronDown} />}
              arrowOpen={<Iconly icon={icons.chevronUp} />}
            />
          </div>
        </div>
        <div>
          <h6 className="title">Price</h6>
          <div>
            {prices.price !== prices.finalPrice && (
              <>
                <span className="price">{prices.price} EUR</span>&nbsp;
              </>
            )}
            <span className="discount-price">{prices.finalPrice} EUR</span>
          </div>
        </div>
      </article>
      <article className="actions">
        <div className="remove-action" onClick={removeProductItem}>
          Remove from cart <Iconly icon={icons.close}></Iconly>
        </div>
        <Link
          className="edit-action"
          href={`/typefaces/${item.name.toLowerCase()}#font-selection-options`}
        >
          Edit buying options
        </Link>
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
