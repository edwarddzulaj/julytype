'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// interface FooterLink {
//   id: number;
//   url: string;
//   newTab: boolean;
//   text: string;
//   social?: string;
// }

// interface CategoryLink {
//   id: string;
//   attributes: {
//     name: string;
//     slug: string;
//   };
// }

// function FooterLink({ url, text }: FooterLink) {
//   const path = usePathname();
//   return (
//     <li className="flex">
//       <Link
//         href={url}
//         className={`hover:dark:text-violet-400 ${
//           path === url && 'dark:text-violet-400 dark:border-violet-400'
//         }}`}
//       >
//         {text}
//       </Link>
//     </li>
//   );
// }

// function CategoryLink({ attributes }: CategoryLink) {
//   return (
//     <li className="flex">
//       <Link href={`/${attributes.slug}`} className="hover:dark:text-violet-400">
//         {attributes.name}
//       </Link>
//     </li>
//   );
// }

// function RenderSocialIcon({ social }: { social: string | undefined }) {
//   switch (social) {
//     case 'WEBSITE':
//       return <CgWebsite />;
//     case 'TWITTER':
//       return <AiFillTwitterCircle />;
//     case 'YOUTUBE':
//       return <AiFillYoutube />;
//     case 'DISCORD':
//       return <FaDiscord />;
//     default:
//       return null;
//   }
// }

export default function Footer({
  footerDetails,
}: {
  footerDetails: {
    copyright: string | null;
  };
}) {
  return (
    <footer>
      {footerDetails.copyright}
    </footer>
  );
}
