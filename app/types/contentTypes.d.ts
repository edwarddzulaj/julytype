import { PageSection, TypefaceWeight } from "./components";
import type { Attribute } from "@strapi/strapi";
export interface Style {
  id: number;
  attributes: {
    title: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    weights: TypefaceWeight[];
  };
}

export interface Typeface {
  id: number;
  attributes: {
    title: string;
    aboutText: string;
    specimen: Attribute.Media;
    price: number;
    wholePackageDiscount: number;
    trialFonts: {}[];
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    styles: {
      data: Style[];
    };
  };
}

export interface SimplePage {
  id: number;
  attributes: {
    title: string;
    sections: PageSection[];
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
  };
}
