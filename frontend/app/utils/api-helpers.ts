export function getStrapiURL(path = "") {
  const strapiURL =
    process.env.NEXT_PUBLIC_STRAPI_ENV === "production"
      ? process.env.NEXT_PUBLIC_STRAPI_API_URL
      : process.env.NEXT_PUBLIC_STRAPI_API_URL_DEV;

  return `${strapiURL || "http://localhost:1337"}${path}`;
}

export function getStrapiMedia(url: string): URL | string {
  if (url == null) {
    return "";
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }

  // Otherwise prepend the URL path with the Strapi URL
  return `${getStrapiURL()}${url}`;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
