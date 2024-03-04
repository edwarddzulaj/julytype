export type licenseRates = {
  [key: string]: {
    [key: number]: number;
  };
};

export type specialRules = {
  [key: string]: {
    licenseTypesCombination: string[];
    companySizeCombination: number[];
  };
};

export const licenseRates: licenseRates = Object.freeze({
  "desktop-print": {
    1: 1.0,
    3: 1.05,
    10: 1.25,
    25: 1.67,
    50: 1.99,
    100: 3.43,
    150: 4.87,
    250: 6.2,
    500: 7.55,
    750: 8.9,
    1000: 10.25,
    2500: 18.44,
    5000: 32.0,
  },
  web: {
    1: 1.4,
    3: 1.47,
    10: 1.67,
    25: 2.07,
    50: 2.47,
    100: 3.27,
    150: 4.07,
    250: 8.0,
    500: 9.19,
    750: 10.37,
    1000: 11.57,
    2500: 22.36,
    5000: 36.0,
  },
  app: {
    1: 2.8,
    3: 2.94,
    10: 3.14,
    25: 3.54,
    50: 3.94,
    100: 4.74,
    150: 5.54,
    250: 16.0,
    500: 18.37,
    750: 20.76,
    1000: 23.15,
    2500: 31.94,
    5000: 64.0,
  },
  "video-social-media": {
    1: 1.0,
    3: 1.8,
    10: 3.0,
    25: 5.4,
    50: 7.8,
    100: 12.6,
    150: 17.4,
    250: 7.8,
    500: 8.99,
    750: 10.18,
    1000: 11.38,
    2500: 20.16,
    5000: 38.0,
  },
  "logo-wordmark": {
    1: 4.0,
    3: 4.29,
    10: 4.49,
    25: 4.89,
    50: 5.29,
    100: 6.09,
    150: 6.89,
    250: 24.0,
    500: 27.57,
    750: 31.14,
    1000: 34.71,
    2500: 43.51,
    5000: 76.0,
  },
});

export const specialRules: specialRules = Object.freeze({
  "video-social-media": {
    licenseTypesCombination: ["video-social-media", "web"],
    companySizeCombination: [1, 3],
  },
});
