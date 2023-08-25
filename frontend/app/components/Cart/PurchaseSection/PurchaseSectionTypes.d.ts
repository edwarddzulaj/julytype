export interface PurchaseOption {
  title: string;
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
