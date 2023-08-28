"use client";

import Link from "next/link";
import { Document, Page } from "react-pdf";
import Iconly, { icons } from "../UI/Iconly";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function PDFPreview({ url }: { url: string | URL }) {
  return (
    <>
      <Document file={url as string}>
        <Page pageIndex={0} width={2000} renderAnnotationLayer={false} renderTextLayer={false} />
      </Document>
      <div>
        <Link href={url}>
          Download PDF Specimen <Iconly icon={icons.download} />
        </Link>
      </div>
    </>
  );
}
