import localFont from "next/font/local";

const iconlyFont = localFont({ src: "../../assets/fonts/july-type-icons/iconly.woff2" });

export const icons: Record<string, string> = {
  contrast: "theme",
  basket: "basket",
  hamburger: "menu",
  info: "info",
  download: "download",
  chevronUp: "chevronup",
  chevronDown: "chevrondown",
  check: "checkedtrue",
  checkbox: "checkedfalse",
  arrowLeft: "arrowleft",
  arrowRight: "arrowright",
  close: "close",
  columnOne: "columnone",
  columnTwo: "columntwo",
  alignLeft: "alignleft",
  alignCenter: "aligncenter",
  alignRight: "alignright",
};

export default function Iconly({ icon = "" }: { icon: string }) {
  return <span className={`iconly ${iconlyFont.className}`}>{icon}</span>;
}
