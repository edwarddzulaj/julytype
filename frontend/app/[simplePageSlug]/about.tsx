import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";
import { PageSection } from "@/@types/components";
import Section from "../components/UI/Section";
import Markdown from "react-markdown";

export default function About(title: string, sections: any) {
  return (
    <section className="container page about">
      <h2>{title}</h2>
      <section className="sections">
        {sections.map((section: PageSection) => {
          return (
            <>
              <Section title={section.title} key={section.id}>
                {/* eslint-disable-next-line react/no-children-prop */}
                <Markdown>{section.content}</Markdown>
              </Section>
            </>
          );
        })}
      </section>
      <Section>
        <Image
          className="globus-image"
          src={getStrapiMedia("/assets/images/about-globus.jpeg") as string}
          width={250}
          height={200}
          alt="About the website globus"
        ></Image>
      </Section>
    </section>
  );
}
