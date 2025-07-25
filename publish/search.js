let globalIsLastPage = false;

const createHit = (hit, { isHighlighted } ) => {
  const date = new Date(hit.created * 1000).toLocaleDateString();

  return `
    <li
      class="${`ais-InfiniteHits-item${
        isHighlighted ? ' infinite-hits-item--highlighted' : ''
      }`}"
    >
      <a class="card-link" target="_top" href="${BLOG_POST_URL}/p/${hit.slug}">
        <article class="card">
          <div class="card-image">
            <img src="${hit.thumbnail_url || DEFAULT_IMAGE_URL.replace("{{title}}", hit.title)}" alt="${hit.title}" />
          </div>

          <div class="card-content">
            <h2 class="card-title">${hit.title}</h2>
            <p class="card-description">${hit.preview_text}</p>
            <span>${hit.content_tags.join(" • ")}</span>
            <span class="card-timestamp">${date}</span>
            ${ SHOW_AUTHORS ? `<span class="card-author">${hit.authors.join(", ")}</span>` : ""}
          </div>
        </article>
      </a>
    </li>
  `;
};

const infiniteHits = instantsearch.connectors.connectInfiniteHits(
  (
    {
      results,
      items,
      showPrevious,
      showMore,
      isFirstPage,
      isLastPage,
      widgetParams,
    },
    isFirstRender
  ) => {
    const { container } = widgetParams;
    const containerNode = document.querySelector(container);

    if (!containerNode) {
      throw new Error(`Container not found`);
    }

    globalIsLastPage = isLastPage;

    if (isFirstRender) {
      const hitsWrapper = document.createElement('div');
      hitsWrapper.classList.add('ais-InfiniteHits');
      const loadMoreTrigger = document.createElement('div');

      containerNode.appendChild(hitsWrapper);
      containerNode.appendChild(loadMoreTrigger);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !globalIsLastPage) {
            showMore();
          }
        });
      });

      observer.observe(loadMoreTrigger);
      return;
    }

    // results is defined when not in `isFirstRender`
    results = results || null;

    if (results.nbHits === 0) {
      containerNode.querySelector('div').innerHTML = `
        <div class="infinite-hits-no-results-container">
          <p class="infinite-hits-no-results-paragraph">
            Sorry, we can't find any
            matches${results.query ? ` for "${results.query}"` : ''}.
          </p>
        </div>
      `;
      return;
    }

    const hitsOffset = items.findIndex(
      ({ objectID }) => results.hits[0].objectID === objectID
    );
    const hitsWindow = {
      start: results.hitsPerPage * results.page - hitsOffset + 1,
      end: results.hitsPerPage * results.page + items.length - hitsOffset,
    };

    const refinedCategory = ((facet) => {
      const category = facet && facet.data.find(({ isRefined }) => isRefined);
      return category ? category.name : undefined;
    })(results.hierarchicalFacets.find(({ name }) => name === 'categories'));

    containerNode.querySelector('div').innerHTML = `
      <div class="previous-hits">
        <p class="previous-hits-message">
          Showing ${hitsWindow.start} - ${hitsWindow.end} out of
          ${results.nbHits} articles
        </p>
        <button class="previous-hits-button">Show previous articles</button>
      </div>
      <ol class="ais-InfiniteHits-list">
        ${items.map((hit, index) =>
          createHit(hit, {
            isHighlighted:
              results.nbHits !== 3 && (index === 0 || results.nbHits === 2),
            refinedCategory,
          })
        ).join("")}
      </ol>

      ${results.nbHits > 0 && isLastPage
        ? `
            <div class="infinite-hits-end">
              <p>${results.nbHits} articles shown</p>
            </div>
          `
        : ''}
    `;

    containerNode
      .querySelector('.previous-hits')
      .classList.toggle('previous-hits--visible', !isFirstPage);

    containerNode
      .querySelector('.previous-hits-button')
      .addEventListener('click', () => showPrevious());
  }
);

const setUpSearch = () => {
  const { liteClient: algoliasearch } = window['algoliasearch/lite'];
  const searchClient = algoliasearch(
    ALGOLIA_APPLICATION_ID,
    ALGOLIA_SEARCH_API_KEY,
  );

  const search = instantsearch({
    searchClient,
    indexName: ALGOLIA_INDEX_NAME
  });

  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '[data-widget="searchbox"]',
      placeholder: 'Search through the archive',
      showSubmit: false
    }),
    infiniteHits({
      container: '[data-widget="hits"]',
      showPrevious: true
    })
  ]);

  search.start();
};


setUpSearch();
