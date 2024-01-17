import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";

export default function Custom404() {
  return (
    <section className="container page not-found">
      <h2>Something went wrong</h2>
      <h5>Please try again.</h5>
      <Link className="back-home" href="/">
        Back home
      </Link>
      <Image
        className="globus-image"
        src={getStrapiMedia("/assets/images/404-globus.jpeg") as string}
        width={360}
        height={300}
        alt="Page not found globus"
      ></Image>
    </section>
  );
}
