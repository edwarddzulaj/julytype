import { TypefaceWeight } from "@/@types/components";
export interface PurchaseOption {
  subtitle?: string;
  options: {
    value: string;
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
  licenseTypes: string[] | undefined;
  companySize: string[] | undefined;
  discount: string[] | undefined;
  wholePackage: boolean | undefined;
}

export interface BuyingPrice {
  price: number;
  discount?: number;
  purchaseDetails?: PurchaseDetails;
}
