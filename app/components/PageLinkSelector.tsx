// You can save this file as: app/components/PageLinkSelector.tsx

"use client";

import { ChangeEvent, useState, useEffect } from 'react';

// =================================================================================
// NOTE ON DYNAMICALLY GETTING PAGES
// =================================================================================
// This is a "Client Component" (declared by "use client" at the top).
// Client Components are interactive and can use hooks like `useState`.
// However, they CANNOT access server-side resources like the file system.
//
// TO MAKE THIS COMPONENT DYNAMIC, you must do the following:
//
// 1. Generate the list of pages in a PARENT "Server Component".
//    (Your `app/layout.tsx` or `app/page.tsx` are Server Components by default).
//
// 2. Pass the generated list as the `pages` prop to this component.
//
// This version uses standard browser APIs (`window.location`) for navigation to avoid
// issues in environments where Next.js modules may not be resolved during bundling.
//
// HERE IS A COMPLETE EXAMPLE of how to get the routes and use this component.
// You can place this logic in your `app/layout.tsx`:
/*
// In app/layout.tsx (or another Server Component)

import PageLinkSelector from './components/PageLinkSelector'; // Adjust path
import fs from 'fs';
import path from 'path';

// Define the shape of the page link object
type PageLink = {
  name: string;
  path: string;
};

// This server-side function reads your `app` directory to find all pages.
const getPageRoutes = (): PageLink[] => {
  const appDir = path.join(process.cwd(), 'app');
  const routes: PageLink[] = [];

  function findPages(directory: string) {
    try {
      const items = fs.readdirSync(directory, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(directory, item.name);
        if (item.isDirectory()) {
          // Skip API folders and private folders (like those starting with '_')
          if (item.name.startsWith('api') || item.name.startsWith('_')) {
            continue;
          }

          // If a 'page.tsx' exists, it's a public route.
          if (fs.existsSync(path.join(fullPath, 'page.tsx'))) {
            // Create a clean URL path from the file path
            const routePath = fullPath
              .replace(appDir, '')
              .replace(/\\/g, '/') // Handle Windows paths
              .replace(/\/\(.*\)/g, ''); // Exclude route groups like `/(marketing)`

            // Create a user-friendly name from the folder name
            const routeName = item.name
              .replace(/-/g, ' ')
              .replace(/\b\w/g, char => char.toUpperCase());

            routes.push({ name: routeName, path: routePath || '/' });
          }
          findPages(fullPath); // Recurse into subdirectories
        }
      }
    } catch (error) {
        console.error("Error reading directory:", directory, error);
    }
  }

  // Handle the root page (`app/page.tsx`) separately
  if (fs.existsSync(path.join(appDir, 'page.tsx'))) {
    routes.push({ name: 'Home', path: '/' });
  }

  findPages(appDir);

  // Remove duplicates and sort for a clean, consistent list
  const uniqueRoutes = Array.from(new Map(routes.map(r => [r.path, r])).values());
  uniqueRoutes.sort((a, b) => a.name.localeCompare(b.name));

  return uniqueRoutes;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. Get the list of pages on the server
  const pageRoutes = getPageRoutes();

  return (
    <html>
      <body className="bg-gray-50">
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto p-4 flex justify-between items-center">
            <h1 className="font-bold text-xl">My App</h1>
            {/!* 2. Pass the list to the client component *!/}
            <PageLinkSelector pages={pageRoutes} placeholder="Navigate to..." />
          </nav>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
*/
// =================================================================================

/**
 * Type definition for a single page link.
 */
type PageLink = {
  name: string;
  path: string;
};

/**
 * Props for the PageLinkSelector component.
 */
interface PageLinkSelectorProps {
  /** The list of pages to display in the dropdown. */
  pages: PageLink[];
  /** Optional placeholder text for when no page is selected. */
  placeholder?: string;
}

/**
 * A client component that displays a <select> dropdown to navigate between pages.
 */
const PageLinkSelector = ({
  pages = [], // Default to an empty array to prevent errors if pages prop is not passed
  placeholder = "Select a page...",
}: PageLinkSelectorProps) => {
  // Use state to hold the current path.
  const [currentPath, setCurrentPath] = useState('');

  // On component mount, get the current path from the browser's window object.
  // This ensures the code only runs on the client-side.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const handleNavigation = (event: ChangeEvent<HTMLSelectElement>) => {
    const newPath = event.target.value;
    if (newPath && newPath !== currentPath) {
      // Use standard browser navigation.
      window.location.href = newPath;
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <select
        value={currentPath}
        onChange={handleNavigation}
        className="w-full px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        aria-label="Page Navigation"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {pages.map((page) => (
          <option key={page.path} value={page.path}>
            {page.name}
          </option>
        ))}
      </select>
      {/* Chevron icon for the dropdown */}
      <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 pointer-events-none">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
        </svg>
      </div>
    </div>
  );
};

export default PageLinkSelector;
