// In order to create a easy way to add options,
// I opted for marking the text with a 'markdown' style of custom html <ot> tag
// Anything that is inside this tag will get highlighted when the options is chosen.
// For example, "20<ot>FRESI</ot>21" will highlight FRESI and leave out 20 and 21.

export const BASE_TEXT = `
    ¿<span class="allcaps">Fish & «Chips» </span>(<span class="allcaps">FRESI</span>) <span class="allcaps">@ £24.65?</span> 
    These new citations from 2013* 21/03/10 and 2<span class="frac">1/8 460/920</span>
    x<span class="subs sups">158</span> + y<span class="subs sups">23</span> × z<span class="subs sups">18</span> - a<span class="subs sups">4260</span>
`;

export const options = [
  {
    id: "allcaps",
    type: "text-transformation",
    label: "All cap punctuation",
    text: BASE_TEXT,
    checked: true,
  },
  {
    id: "frac",
    type: "opentype-feature",
    label: "Fractions",
    text: BASE_TEXT,
  },
  {
    id: "subs",
    type: "opentype-feature",
    label: "Subscript",
    text: BASE_TEXT,
  },
  {
    id: "sups",
    type: "opentype-feature",
    label: "Superscript",
    text: BASE_TEXT,
  },
];
