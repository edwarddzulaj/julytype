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

export interface BuyingPrice {
  price: number;
  discount?: number;
}
