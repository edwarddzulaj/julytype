'use client';

// interface NavLink {
//   id: number;
//   url: string;
//   newTab: boolean;
//   text: string;
// }

// function NavLink({ url, text }: NavLink) {
//   const path = usePathname();

//   return (
//     <li className="flex">
//       <Link
//         href={url}
//         className={`flex items-center mx-4 -mb-1 border-b-2 dark:border-transparent ${
//           path === url && 'dark:text-violet-400 dark:border-violet-400'
//         }}`}
//       >
//         {text}
//       </Link>
//     </li>
//   );
// }

export default function Navbar({
  websiteDetails,
}: {
  websiteDetails: {title: string, description: string};
}) {
  return (
    
   <nav>
    <div className="website-name">{websiteDetails.title}</div>
    Some navigation</nav>
  );
}
