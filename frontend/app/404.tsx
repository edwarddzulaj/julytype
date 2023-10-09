import Link from "next/link";
import Section from "./components/UI/Section";

export default function Custom404() {
  return (
    <section className="container page">
      <h2>Page not found</h2>
      <section className="sections">
        <Section>
          <h5>
            The page you are looking for is not found...{" "}
            <Link href="/">Return to the homepage.</Link>
          </h5>
        </Section>
      </section>
    </section>
  );
}
