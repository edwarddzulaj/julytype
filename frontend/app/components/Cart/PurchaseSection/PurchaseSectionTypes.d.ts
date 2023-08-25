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
