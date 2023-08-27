export interface PurchaseOption {
  subtitle: string;
  options: {
    value: string;
    label: string;
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
