import localFont from "next/font/local";

const iconlyFont = localFont({ src: "../../assets/fonts/july-type-icons/iconly.woff2" });

export const icons = {
  contrast: "theme",
  hamburger: "menu",
  info: "info",
  download: "download",
  chevronUp: "checron-up",
  chevronDown: "checron-down",
  check: "checkedtrue",
  checkbox: "checkedfalse",
  arrowLeft: "\uE008",
  close: "close",
};

export default function Iconly({ icon = "" }: { icon: string }) {
  return <span className={iconlyFont.className}>{icon}</span>;
}
