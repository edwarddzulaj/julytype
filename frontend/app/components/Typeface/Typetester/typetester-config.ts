export const staticOptions = {
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: "false",
};

export const languages = {
  latin: [
    { value: "en-GB", label: "English" },
    { value: "de", label: "German" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "it", label: "Italian" },
  ],
  cyrillic: [
    { value: "bg", label: "Bulgarian" },
    { value: "uk", label: "Ukrainian" },
  ],
};

export const opentypeFeatures = [
  { value: "liga", label: "Ligatures", checked: true },
  { value: "frac", label: "Fractions" },
  { value: "c2sc", label: "Small capitals from capitals" },
  { value: "smcp", label: "Small caps" },
  { value: "subs", label: "Subscript" },
  { value: "sups", label: "Superscript" },
  { value: "onum", label: "Old style figures", checked: true },
  { value: "lnum", label: "Lining figures" },
  { value: "tnum", label: "Tabular figures" },
  { value: "case", label: "Contextual alternates", checked: true },
  { value: "locl", label: "Localized forms", checked: true },
  { value: "ss01", label: "Stylistic set 1" },
  { value: "ss02", label: "Stylistic set 2" },
];

export const caseOptions = [
  { value: "uppercase", label: "UPPERCASE", checked: false },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "Title Case" },
];

export const alignmentOptions = [
  { value: "left", label: "alignLeft" },
  { value: "center", label: "alignCenter", checked: true },
  { value: "right", label: "alignRight" },
];

export const columnOptions = [
  { value: 1, label: "columnOne", checked: true },
  { value: 2, label: "columnTwo" },
];
