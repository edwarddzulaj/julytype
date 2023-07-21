import { fetchAPI } from "@/app/utils/fetch-api";
import { SimplePage } from "@/app/types/contentTypes";
import { PageSection } from "../types/components";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
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
  if (!page) return;

  const { title, sections } = page.attributes;

  return (
    <section className="page">
      <h1>{title}</h1>
      <section className="sections">
        {sections.map((section: PageSection) => (
          <Section title={section.title} key={section.id}>
            {/* eslint-disable-next-line react/no-children-prop */}
            <ReactMarkdown children={section.content} />
          </Section>
        ))}
      </section>
    </section>
  );
}
