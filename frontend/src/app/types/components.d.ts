import type { Attribute } from "@strapi/strapi";
export interface TypefaceWeight {
  id: number;
  title: string;
  typetesterText: TypetesterText[];
  price: number;
  discount: number;
}

export interface TypetesterText {
  id: number;
  title: string;
  text: string;
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
