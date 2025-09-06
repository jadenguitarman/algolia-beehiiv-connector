# Algolia—Beehiiv Connector

Search your Beehiiv newsletter archive like a knowledge base.

This project indexes Beehiiv posts into Algolia at the **section level**, then groups them so each issue appears as a single result. It’s designed to run on **Netlify Functions** with a deploy button for easy setup.

---

## Features

- **Section-level indexing**: search results drop readers directly into the right part of a newsletter.
- **Grouped results**: Algolia’s deduplication collapses multiple sections into one card per issue.
- **Bulk import**: upload your Beehiiv CSV export to backfill past issues.
- **Webhooks**: new posts and updates sync automatically.
- **Embed-ready UI**: hosted search page at `/search` can be embedded into Beehiiv with an `<iframe>`.

---

## Data model

Each section of a newsletter is indexed as one record:

```json
{
  "objectID": "article123::section2",
  "article_id": "article123",
  "issue_date": "2024-08-15",
  "title": "Web Components are back",
  "section_title": "A new hope for components",
  "section_text": "Web Components solve...",
  "position": 2,
  "url": "https://newsletterdomain.com/p/web-components"
}
```

---

## Getting started

### 1. Deploy to Netlify

Click to deploy:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jadenguitarman/algolia-beehiiv-connector)

During deployment, Netlify will ask for:

- `ALGOLIA_APP_ID`  
- `ALGOLIA_WRITE_KEY`  
- `ALGOLIA_SEARCH_KEY`  
- `ALGOLIA_INDEX_NAME`  
- `BEEHIIV_DOMAIN`  

---

### 2. Configure Beehiiv webhooks

In the Beehiiv dashboard:

- Create a **New Post** webhook pointing to  
  `https://<project>.netlify.app/post`  

- Create a **Post Updated** webhook pointing to the same URL.

---

### 3. Import past issues

Export your Beehiiv posts as CSV, then upload at `https://<project>.netlify.app/import-csv`.


This parses, transforms, and pushes data to Algolia in batches.

---

### 4. Verify settings

The connector manages index settings automatically (`/settings`). It configures:

- `searchableAttributes`: title, section text  
- `attributeForDistinct`: article_id  
- `customRanking`: by issue_date desc  
- `attributesForFaceting`: tags, authors, date  

You can override manually in the Algolia dashboard if needed.

---

### 5. Embed search in Beehiiv

Paste this snippet into your Beehiiv site:

```html
<iframe
  src="https://<project>.netlify.app/search"
  width="100%"
  height="800"
  style="border:none">
</iframe>
```

---

## Maintenance

- Re-import: re-upload CSV to /import-csv if data gets out of sync.

- Deletions: Beehiiv doesn’t notify on deletes; re-import to remove missing issues.

- Security: add request validation to /post to ensure only Beehiiv can call it.

- Logs: check Netlify function logs for errors.

- Schema changes: bump a version field in records and re-import to rebuild index.

---

## Related links

- [Blog post: How I built the Algolia—Beehiiv connector](https://www.algolia.com/blog/product/how-i-built-the-algolia-beehiiv-connector)

- [Algolia deduplication guide](https://www.algolia.com/doc/guides/algolia-recommend/how-to/deduplication/)

- [Beehiiv webhook docs](https://developers.beehiiv.com/webhooks/post/sent)
