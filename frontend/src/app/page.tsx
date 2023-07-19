import Link from "next/link";
import { fetchAPI } from "@/src/app/utils/fetch-api";
import { Typeface } from "@/src/app/types/contentTypes";

async function getTypefaces() {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      styles: { populate: "*" },
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);

  return responseData.data;
}

export default async function Page() {
  const typefaces = await getTypefaces();
  return (
    <section className="typeface-preview">
      {typefaces.map((typeface: Typeface) => (
        <Link href={`/typefaces/${typeface.attributes.slug}`} key={typeface.id}>
          <article>
            {typeface.attributes.title}
            <div className="typeface-details">
              <span>{typeface.attributes.styles.data.length}</span>
              <span>{typeface.attributes.styles.data[0].attributes.weights.length}</span>
            </div>
          </article>
        </Link>
      ))}
    </section>
  );
}
