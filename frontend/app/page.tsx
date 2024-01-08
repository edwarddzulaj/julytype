import Link from "next/link";
import Image from "next/image";

import { fetchAPI } from "@/app/utils/fetch-api";
import { getStrapiMedia } from "./utils/api-helpers";
import { Typeface } from "@/@types/contentTypes";
import { TypefaceWeight } from "@/@types/components";

import { allStylesAndWeights, pluralize } from "./utils/text-helpers";
import TypefaceSample from "./components/Typeface/TypefaceSample";

async function getTypefaces() {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      styles: {
        populate: {
          weights: {
            populate: {
              fontFile: { populate: "*" },
            },
          },
        },
      },
      mainFont: { populate: "*" },
      image: { populate: "*" },
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);

  return responseData.data || [];
}

export default async function Page() {
  const typefaces = await getTypefaces();

  return (
    <section className="container typeface-preview">
      {typefaces.map((typeface: Typeface) => {
        const { title, slug, styles, image } = typeface.attributes;
        const imageFile = image.data.attributes;

        let regular: TypefaceWeight | null = null;

        styles.data[0].attributes.weights.forEach((weight: TypefaceWeight) => {
          if (weight.title.toLowerCase() === "regular") regular = weight;
        });

        const { numStyles, numWeights } = allStylesAndWeights(styles.data);

        return (
          <Link href={`/typefaces/${slug}`} key={typeface.id}>
            <article>
              <TypefaceSample title={title} regularWeight={regular}/>
              <div className="typeface-details">
                <span>{pluralize(numStyles, "style")}</span>
                <span>{pluralize(numWeights, "weight")}</span>
              </div>
              <Image
                className="typeface-image"
                src={getStrapiMedia(imageFile.url) as string}
                width={imageFile.width}
                height={imageFile.height}
                alt={`${title} image`}
              />
            </article>
          </Link>
        );
      })}
    </section>
  );
}
