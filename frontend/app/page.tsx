import Link from "next/link";
import { fetchAPI } from "@/app/utils/fetch-api";
import { Typeface } from "@/@types/contentTypes";

async function getTypefaces() {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      styles: { populate: "*" },
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
        const numStyles = typeface.attributes.styles.data.length;
        const numWeights = typeface.attributes.styles.data[0].attributes.weights.length;
        return (
          <Link href={`/typefaces/${typeface.attributes.slug}`} key={typeface.id}>
            <article>
              <h2>{typeface.attributes.title}</h2>
              <div className="typeface-details">
                <span>
                  {numStyles} {numStyles > 1 ? "styles" : "style"}
                </span>
                <br />
                <span>
                  {numWeights} {numWeights > 1 ? "weights" : "weight"}
                </span>
              </div>
            </article>
          </Link>
        );
      })}
    </section>
  );
}
