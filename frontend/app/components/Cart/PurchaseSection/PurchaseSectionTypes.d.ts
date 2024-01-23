import { TypefaceWeight } from "@/@types/components";
export interface PurchaseOption<ValueType> {
  subtitle?: string;
  options: {
    value: ValueType;
    label: string;
    note?: string;
    checked?: boolean;
  }[];
  info?: {
    text: string;
    url: string | URL;
  };
}

export interface PurchaseDetails {
  licenseTypes: string[];
  companySize: int;
  studentDiscount: boolean;
  wholePackageDiscount: boolean;
}

export interface BuyingPrice {
  price: number;
  discount?: number;
  purchaseDetails: PurchaseDetails;
}
