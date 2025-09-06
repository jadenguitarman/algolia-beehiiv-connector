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
  {
  "heading": "1. Problem/Opportunity❓",
  "contents": "BUSINESS IDEA | STARTUP\nLoom for Pitch Decks \n \n [REST OF SECTION, CUT FOR BREVITY]",
  "articleID": "877f2e90-f7e4-4591-baed-7cea617823c1",
  "created": 1745369760,
  "title": "Business Ideas #340: Loom for X, Natural Light...",
  "preview_text": "Plus 🐕 💡 ⌨️",
  "slug": "business-ideas-340-loom-for-x",
  "thumbnail_url": "",
  "subtitle": "Plus How a Pub Conversation Birthed a $250m Business",
  "status": "confirmed",
  "content_tags": [],
  "audience": [
    "free"
  ],
  "authors": [
    "The Half Baked crew"
  ],
  "objectID": "fff46e60-1466-4fb5-a97c-4b8a08eaf6b5"
}
```

---

## Getting started

### 1. Deploy to Netlify

Click to deploy:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jadenguitarman/algolia-beehiiv-connector)

During deployment, Netlify will ask for:

- `ALGOLIA_APPLICATION_ID` - Application ID from the 'API Keys' page.
- `ALGOLIA_INDEX_NAME` - The name of the index you created.
- `ALGOLIA_SEARCH_API_KEY` - Search API Key from the 'API Keys' page on the Algolia site.
- `ALGOLIA_WRITE_API_KEY` - Write API Key from the 'API Keys' page on the Algolia site.
- `BLOG_POST_URL` - The domain of your Beehiiv website with the protocol, à la `https://gethalfbaked.com`.
- `SHOW_AUTHORS` - Optional - default is false. Type true here to display author names in the search UI.
- `DEFAULT_IMAGE_URL` - Optional - default is from placeholder.co. The default image that will display alongside search results that don't have a header image.
- `AUTO_UPDATE_ALGOLIA_SETTINGS` - Optional - default is true. Type false here if you don't want this connector to manage the settings of your Algolia index.

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

- `attributeForDistinct`: article_id    
- `attributesForFaceting`: article_id

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

## Related links

- [Blog post: How I built the Algolia—Beehiiv connector](https://www.algolia.com/blog/product/how-i-built-the-algolia-beehiiv-connector)

- [Algolia deduplication guide](https://www.algolia.com/doc/guides/algolia-recommend/how-to/deduplication/)

- [Beehiiv webhook docs](https://developers.beehiiv.com/webhooks/post/sent)
