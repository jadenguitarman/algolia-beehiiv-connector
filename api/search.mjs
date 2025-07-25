const head = `
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Montserrat:400,600&font-display=swap"
    />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@8.5.1/themes/reset.css">
    <link rel="stylesheet" href="./search.css" />

    <title>Post Search</title>
  </head>
`;

const searchBox = `
  <div class="searchbox-container">
    <label for="search-input">
      <svg
        data-layout="mobile"
        class="magnifier-icon"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="22"
        height="22"
        viewBox="0 0 22 22"
      >
        <defs>
          <path
            id="a"
            d="M20.981 19.094l-4.2-4.199c2.733-3.656 2.473-8.84-.848-12.161a9.333 9.333 0 0 0-13.2 13.199c3.323 3.322 8.507 3.581 12.163.848l4.198 4.2c.522.52 1.366.52 1.887 0 .52-.522.52-1.366 0-1.887zm-6.933-5.047a6.668 6.668 0 0 1-9.428 0 6.666 6.666 0 0 1 0-9.428 6.666 6.666 0 0 1 9.428 0 6.668 6.668 0 0 1 0 9.428z"
          />
          <linearGradient
            id="b"
            x1="100%"
            x2="0%"
            y1="85.172%"
            y2="14.828%"
          >
            <stop offset="0%" stop-color="#764BA2" />
            <stop offset="100%" stop-color="#667EEA" />
          </linearGradient>
        </defs>
        <g fill="none" fill-rule="evenodd">
          <mask id="c" fill="#fff">
            <use xlink:href="#a" />
          </mask>
          <use fill="#4BC0D9" xlink:href="#a" />
          <path fill="url(#b)" d="M-3-3h31v26H-3z" mask="url(#c)" />
        </g>
      </svg>
      <svg
        data-layout="desktop"
        class="magnifier-icon"
        viewBox="0 0 17 17"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M16.69 15.189l-3.341-3.34c2.174-2.908 1.967-7.032-.675-9.674a7.424 7.424 0 1 0-10.5 10.5c2.643 2.642 6.767 2.848 9.675.674l3.34 3.34a1.063 1.063 0 0 0 1.5 0 1.063 1.063 0 0 0 0-1.5zm-5.288-3.787A5.37 5.37 0 0 1 3.81 3.81a5.368 5.368 0 1 1 7.592 7.592z"
        />
      </svg>
    </label>
    <div data-widget="searchbox" class="searchbox-container-input"></div>
  </div>
`;

const scripts = `
  <script
    src="https://cdn.jsdelivr.net/npm/algoliasearch@5.34.1/dist/lite/builds/browser.umd.js"
    integrity="sha256-PwDce3Wzwi9zHPn8hTJDDs6rmWsV/Qv/SwKTQDttA4A="
    crossorigin="anonymous"
  ></script>
  <script 
    src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.79.2/dist/instantsearch.production.min.js" 
    integrity="sha256-xzEobMl7YU4X8/v8b+Ax4tXJtrs9DVhKOzKDSnZgj1Q="
    crossorigin="anonymous"
  ></script>
  <script>
    const ALGOLIA_APPLICATION_ID = "${process.env.ALGOLIA_APPLICATION_ID}";
    const ALGOLIA_SEARCH_API_KEY = "${process.env.ALGOLIA_SEARCH_API_KEY}";
    const ALGOLIA_INDEX_NAME = "${process.env.ALGOLIA_INDEX_NAME}";
    const BLOG_POST_URL = "${process.env.BLOG_POST_URL}";
    const SHOW_AUTHORS = ${(!!process.env.SHOW_AUTHORS && process.env.SHOW_AUTHORS != "false") ? "true" : "false"};
    const DEFAULT_IMAGE_URL = "${process.env.DEFAULT_IMAGE_URL || "https://placehold.co/800x450?text={{title}}"}";
  </script>
  <script src="/search.js"></script>
`;

export default async (req, context) => new Response(
  `
    <!DOCTYPE html>
    <html lang="en">
      ${head}

      <body>
        <header class="header">
          <div class="header-content">
            ${searchBox}
          </div>
        </header>

        <main class="container">
          <section class="container-results">
            <div data-widget="hits"></div>
          </section>
        </main>

        ${scripts}
      </body>
    </html>
  `,
  {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  }
);

export const config = {
  path: "/search"
};