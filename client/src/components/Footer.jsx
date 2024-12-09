import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 hidden md:block">
      <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <h1 className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            <span className="text-gray-900 dark:text-white">RealEstate</span>
            <span className="text-blue-400">Ventures</span>
          </h1>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          © Copyright 2024. All Rights Reserved.
        </p>
        <div className="flex -mx-2">
          <a
            href="#"
            className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            aria-label="Facebook"
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.00195 12.002C2.00312 16.9214 5.58036 21.1101 10.439 21.881V14.892H7.90195V12.002H10.442V9.80204C10.3284 8.75958 10.6845 7.72064 11.4136 6.96698C12.1427 6.21332 13.1693 5.82306 14.215 5.90204C14.9655 5.91417 15.7141 5.98101 16.455 6.10205V8.56104H15.191C14.7558 8.50405 14.3183 8.64777 14.0017 8.95171C13.6851 9.25566 13.5237 9.68693 13.563 10.124V12.002H16.334L15.891 14.893H13.561V21.882C18.4184 21.1136 21.9942 16.9251 21.996 12.006C21.996 6.48099 17.524 2.00195 12 2.00195C6.47595 2.00195 2.00195 6.47399 2.00195 12.002Z"></path>
            </svg>
          </a>
          <a
            href="https://github.com/vonzekiel/comp231-project1-estate.git"
            className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            aria-label="Github"
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.026 2C6.50595 1.99997 2.02813 6.47688 2.026 11.9979C2.02406 16.4218 4.86806 20.1884 8.873 21.484C9.373 21.564 9.552 21.276 9.552 21.028V19.507C6.766 20.107 6.18 18.493 6.18 18.493C5.9244 17.7334 5.48796 17.1182 4.924 16.644C4.223 16.084 5.006 16.095 5.006 16.095C5.416 16.136 5.807 16.329 6.106 16.644C6.36612 16.9357 6.56195 17.2782 6.678 17.652C6.76994 17.9692 6.97792 18.2404 7.263 18.408C7.54805 18.5755 7.89066 18.6265 8.216 18.549C8.26579 18.0424 8.48195 17.5695 8.826 17.204C6.466 16.942 4.005 16.059 4.005 12.449C3.99837 11.3698 4.40184 10.3307 5.126 9.55205C4.82243 8.69644 4.85151 7.75597 5.21 6.92205C5.71 6.76105 7.555 7.88605 7.555 7.88605C8.46185 7.63144 9.42615 7.63144 10.333 7.88605C10.333 7.88605 12.177 6.76105 12.677 6.92205C13.0365 7.756 13.0656 8.69644 12.762 9.55205C13.489 10.331 13.894 11.373 13.883 12.456C13.883 16.074 11.418 16.938 9.05 17.193C9.5037 17.6562 9.753 18.3082 9.731 18.978V21.548C9.731 21.714 9.901 21.954 10.376 21.86C14.3268 20.1581 17.0004 16.181 17.003 11.482C17.003 6.46797 13.03 2 12.03 2H12.026Z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
