export const licenseOptions = {
  title: "License Type",
  subtitle: "How and where is the font going to be used?",
  options: [
    { label: "Desktop/Print", value: "desktop-print" },
    { label: "Web", value: "web" },
    { label: "App/Game", value: "app-game" },
    { label: "Social Media", value: "social-media" },
    { label: "Video", value: "video" },
    { label: "Logo/Wordmark", value: "logo-wordmark" },
  ],
  info: {
    text: "More about license types",
    url: "/licensing",
  },
};

export const companySizeOptions = {
  title: "Company Size Type",
  subtitle: "How many employees are there in a company that is using the license?",
  options: [
    { label: "1", value: "1" },
    { label: "<10", value: "10" },
    { label: "<20", value: "20" },
    { label: "<100", value: "100" },
    { label: "<1000", value: "1000" },
    { label: "<10000", value: "10000" },
  ],
  info: {
    text: "More about company size",
    url: "/about",
  },
};

export const discountOptions = {
  title: "Discount",
  subtitle: "Are you a student?",
  options: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],
};
