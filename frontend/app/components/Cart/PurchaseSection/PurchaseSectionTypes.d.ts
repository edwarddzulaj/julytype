export interface PurchaseOption {
  title: string;
  subtitle: string;
  options: string[];
  info?: {
    text: string;
    url: string | URL;
  };
}
