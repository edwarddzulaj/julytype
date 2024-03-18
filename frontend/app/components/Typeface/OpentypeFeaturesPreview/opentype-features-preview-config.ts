// In order to create a easy way to add options,
// I opted for marking the text with a 'markdown' style of custom html <ot> tag
// Anything that is inside this tag will get highlighted when the options is chosen.
// For example, "20<ot>FRESI</ot>21" will highlight FRESI and leave out 20 and 21.

export const BASE_TEXT = `
<span class="allcaps">«Gelato» •How? @Hodori (Muse)</span><br/>
Wolf<span class="ss01">g</span>an<span class="ss01">g</span> Moza<span class="ss01">r</span>t 1756 <span class="ss01">& Ж</span>емчуг<br/>
<span class="smallcaps">Let’s meet at 18<span class="calt">:</span>46.</span><br/>
<span class="oldstyle">Henrica Maria Paré 1896–1972</span><br/>
 Just add <span class="frac">1/2, 3/4</span> or <span class="frac">5/8</span> of Cocoa<br/>
<span class="subs">2H2 (g)+O2 (g)→2H2 O(l)</span><br/>
<span class="sups">F(x,y)2 + x32 × y47 = z2</span>
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
    id: "ss01",
    type: "opentype-feature",
    label: "Stylistic Set",
    text: BASE_TEXT,
  },
  {
    id: "smallcaps",
    type: "text-transformation",
    label: "Small caps",
    text: BASE_TEXT,
  },
  {
    id: "oldstyle",
    type: "opentype-feature",
    label: "Oldstyle figures",
    text: BASE_TEXT,
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
