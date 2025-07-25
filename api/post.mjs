import { algoliasearch } from 'algoliasearch';
import { parse } from 'node-html-parser';
import { v4 as uuidv4 } from 'uuid';

export default async (req, context) => {
  const client = algoliasearch(
    process.env.ALGOLIA_APPLICATION_ID, 
    process.env.ALGOLIA_WRITE_API_KEY
  );

  if (!process.env.AUTO_UPDATE_ALGOLIA_SETTINGS || process.env.AUTO_UPDATE_ALGOLIA_SETTINGS !== "false") {
    // This connector manages the settings of your Algolia index unless you explicitly disable it.
    const response = await client.setSettings({
      indexName: process.env.ALGOLIA_INDEX_NAME,
      indexSettings: {
        distinct: true,
        attributeForDistinct: "articleID"
      }
    });
  }

  let input = (await req.json()).data;
  if (!Array.isArray(input)) input = [ input ];

  const BLOG_POST_URL = (new URL(process.env.BLOG_POST_URL)).origin;
  let objects = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i].status != "confirmed") continue; // if not live, skip
    
    if (!input[i].slug && !!input[i].web_url) {
      input[i].slug = input[i].web_url.split("/").filter(x => !!x).at(-1);
    } else if (!!input[i].slug && !input[i].web_url) {
      input[i].web_url = BLOG_POST_URL + "/p/" + input[i].slug;
    }

    const postFetchResponse = await fetch(
      BLOG_POST_URL + "/p/" + input[i].slug
    );
    if (postFetchResponse.status == 404) {
      console.error("Post does not exist or is not yet live." + input[i].slug);
      continue;
    } else if (!postFetchResponse.ok) {
      console.error("Something went wrong - post lookup responded with a " + postFetchResponse.status);
      continue;
    }

    const postRoot = parse(
      await postFetchResponse.text()
    );
    objects.push(
      [...postRoot.querySelector("#content-blocks").children]
        .flatMap((child) => {
          const contents = [...child.querySelectorAll("span")].map(span => span.text).join("\n");
          if (!contents) return [];

          const heading = child.querySelector("h3")?.text;
          if (!heading) return [];

          return {
            objectID: uuidv4(),
            heading,
            contents,
            articleID: input[i].id,
            created: input[i].created,
            title: input[i].title,
            preview_text: input[i].preview_text,
            slug: input[i].slug,
            thumbnail_url: input[i].thumbnail_url,
            subtitle: input[i].subtitle,
            status: input[i].status,
            content_tags: input[i].content_tags || [],
            audience: input[i].audience,
            authors: input[i].authors,
            displayed_date: input[i].displayed_date
          }
        })
    )
  }
  objects = objects.flat();

  if (objects.length) {
    const delResp = await client.deleteBy({
      indexName: process.env.ALGOLIA_INDEX_NAME, 
      deleteByParams: {
        filters: input.filter(x => !!x.id).map(record => `articleID:${record.id}`).join(" OR ")
      }
    });

    const updResp = await client.batch({
      indexName: process.env.ALGOLIA_INDEX_NAME,
      batchWriteParams: {
        requests: objects.map(body => ({
          action: 'partialUpdateObject',
          body
        }))
      }
    });

    return new Response(
      JSON.stringify({
        status: "successful",
        objects: objects.map(obj => obj.objectID)
      }, null, '\t')
    );
  } else {
    return new Response(
      JSON.stringify({
        status: "empty",
        message: "Nothing was changed, none of the imported posts are live"
      }, null, '\t')
    );
  }
};

export const config = {
  path: "/post"
};