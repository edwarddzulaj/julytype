import type { Attribute } from "@strapi/strapi";
export interface TypefaceWeight {
  id: number;
  title: string;
  typetesterLanguageGroup: TypetesterTextGroup[];
  price: number;
  discount: number;
  fontFile: Attribute.File;
}

export interface TypetesterTextGroup {
  id: number;
  language: string;
  sample: [TypetesterText];
}

export interface TypetesterText {
  id: number;
  text: string;
  defaultFontSize?: number;
}

export interface SocialMediaLink {
  id: number;
  name: string;
  url: URL | string;
}

export interface PageSection {
  id: number;
  title: Attribute.String;
  content: Attribute.RichText;
}
