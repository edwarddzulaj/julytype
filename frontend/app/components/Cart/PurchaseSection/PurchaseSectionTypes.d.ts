import { TypefaceWeight } from "@/@types/components";
export interface PurchaseOption<ValueType> {
  options: {
    value: ValueType;
    label: string;
    note?: string;
    checked?: boolean;
    discount?: {
      percent: number;
    };
  }[];
  subtitle?: string;
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
