"use client";

import { pdfjs } from "react-pdf";
import Link from "next/link";
import { Document, Page } from "react-pdf";
import Iconly, { icons } from "../UI/Iconly";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PDFPreview({ url }: { url: string | URL }) {
  return (
    <>
      <Document file={url as string}>
        <Page
          pageIndex={0}
          width={2000}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          devicePixelRatio={1}
        />
      </Document>
      <div>
        <Link href={url} target="_blank" rel="noopener">
          Download PDF Specimen <Iconly icon={icons.download} />
        </Link>
      </div>
    </>
  );
}
