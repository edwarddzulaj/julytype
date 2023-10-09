import { fetchAPI } from "@/app/utils/fetch-api";
import { SimplePage } from "@/@types/contentTypes";
import { PageSection } from "../../@types/components";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

import Custom404 from "../404";
import Section from "../components/UI/Section";

async function getPage(slug: string) {
  const path = `/simple-pages`;
  const urlParamsObject = {
    populate: "*",
    filters: {
      slug: slug,
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);

  return responseData.data[0];
}

export default async function SimplePage({ params }: { params: { simplePageSlug: string } }) {
  const page: SimplePage = await getPage(params.simplePageSlug);
  console.log("page", page);
  if (!page) return Custom404();

  const { title, sections } = page.attributes;

  return (
    <section className="container page">
      <h2>{title}</h2>
      <section className="sections">
        {sections.map((section: PageSection) => (
          <>
            <h4>{section.title}</h4>
            <Section title={""} key={section.id}>
              {/* eslint-disable-next-line react/no-children-prop */}
              <ReactMarkdown children={section.content} />
            </Section>
          </>
        ))}
      </section>
    </section>
  );
}
