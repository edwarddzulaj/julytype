import type { Schema, Attribute } from "@strapi/strapi";

export interface SettingsFooterDetails extends Schema.Component {
  collectionName: "components_footer_details_footer_details";
  info: {
    displayName: "Footer Details";
    description: "";
  };
  attributes: {
    copyright: Attribute.String;
    socialMediaLinks: Attribute.Component<"settings.social-media-link", true>;
    footerPages: Attribute.Relation<
      "settings.footer-details",
      "oneToMany",
      "api::simple-page.simple-page"
    >;
  };
}

export interface SettingsSocialMediaLink extends Schema.Component {
  collectionName: "components_settings_social_media_links";
  info: {
    displayName: "Social Media Link";
    description: "";
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

export interface SettingsWebsiteTitle extends Schema.Component {
  collectionName: "components_website_title_website_titles";
  info: {
    displayName: "Website Details";
    description: "";
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    navigationPages: Attribute.Relation<
      "settings.website-title",
      "oneToMany",
      "api::simple-page.simple-page"
    >;
  };
}

export interface SimplePagePageSection extends Schema.Component {
  collectionName: "components_simple_page_page_sections";
  info: {
    displayName: "Page Section";
    description: "";
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    content: Attribute.RichText & Attribute.Required;
  };
}

export interface TypefaceTypetesterTexts extends Schema.Component {
  collectionName: "components_typeface_typetester_texts";
  info: {
    displayName: "Typetester Texts";
    description: "";
  };
  attributes: {
    text: Attribute.Text & Attribute.Required;
    title: Attribute.String;
  };
}

export interface TypefaceWeight extends Schema.Component {
  collectionName: "components_typeface_weights";
  info: {
    displayName: "Weight";
    description: "";
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    typetesterText: Attribute.Component<"typeface.typetester-texts", true>;
    price: Attribute.Float & Attribute.Required;
    discount: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
        max: 100;
      }>;
  };
}

declare module "@strapi/strapi" {
  export module Shared {
    export interface Components {
      "settings.footer-details": SettingsFooterDetails;
      "settings.social-media-link": SettingsSocialMediaLink;
      "settings.website-title": SettingsWebsiteTitle;
      "simple-page.page-section": SimplePagePageSection;
      "typeface.typetester-texts": TypefaceTypetesterTexts;
      "typeface.weight": TypefaceWeight;
    }
  }
}
