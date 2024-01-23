import { PurchaseOption } from "./PurchaseSectionTypes";

export const licenseOptions: PurchaseOption<string> = {
  subtitle: "How and where is the font going to be used?",
  options: [
    {
      label: "Desktop/Print",
      value: "desktop-print",
      note: "To create printed and digital assets such as documents, books, objects, merchandise, signage and other similar things.",
      checked: true,
    },
    { label: "Web", value: "web", note: "To create websites using the typeface." },
    {
      label: "App",
      value: "app",
      note: "Embed the typeface into an app such as mobile app, web app, game and digital POS system.",
    },
    {
      label: "Video/Social Media",
      value: "video-social-media",
      note: "To create video content using the typeface such as YouTube, Netflix, movies, commercials, broadcasts and video billboards and design assets for a single brand's presence on social media platforms like Instagram, Snapchat, Facebook and TikTok.",
    },
    { label: "Logo/Wordmark", value: "logo-wordmark", note: "Make a logo/wordmark for one brand." },
  ],
  info: {
    text: "More about licenses",
    url: "/licensing",
  },
};

export const companySizeOptions: PurchaseOption<number> = {
  subtitle: "How many employees are there in a company that is using the license?",
  options: [
    { label: "<1", value: 1, checked: true },
    { label: "<3", value: 3 },
    { label: "<10", value: 10 },
    { label: "<25", value: 25 },
    { label: "<50", value: 50 },
    { label: "<100", value: 100 },
    { label: "<150", value: 150 },
    { label: "<250", value: 250 },
    { label: "<500", value: 500 },
    { label: "<750", value: 750 },
    { label: "<1000", value: 1000 },
    { label: "<2500", value: 2500 },
    { label: "<5000", value: 5000 },
  ],
  info: {
    text: "More about company size",
    url: "/about",
  },
};

export const discountOptions: PurchaseOption<number> = {
  subtitle: "Are you a student?",
  options: [
    { label: "Yes", value: 1 },
    { label: "No", value: 0, checked: true },
  ],
};
