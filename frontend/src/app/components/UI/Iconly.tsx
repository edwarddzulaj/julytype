import localFont from "next/font/local";

const iconlyFont = localFont({ src: "../../assets/fonts/july-type-icons/iconly.woff2" });

export const icons = {
  contrast: "theme",
  hamburger: "menu",
  info: "info",
  download: "download",
  "chevron-up": "checron-up",
  "chevron-down": "checron-down",
  check: "checkedtrue",
  checkbox: "checkedfalse",
  "arrow-left": "arrow-left",
  close: "close",
};

export default function Iconly({ icon = "" }: { icon: string }) {
  return <span className={iconlyFont.className}>{icon}</span>;
}
