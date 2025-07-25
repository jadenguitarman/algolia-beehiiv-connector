
export default async (req, context) => {
  const input = {
    "data": {
      "audience": "free",
      "authors": [ "Clark Kent" ],
      "content_tags": [ "news" ],
      "created": 1666800076,
      "id": "post_00000000-0000-0000-0000-000000000000",
      "preview_text": "More news on the horizon",
      "slug": "startup-ideas-407-superhuman-for-x",
      "split_tested": true,
      "status": "confirmed",
      "subject_line": "",
      "subtitle": "Plus Raising $3.1M While Still in College",
      "thumbnail_url": "https://media.beehiiv.com/cdn-cgi/image/format=auto,fit=scale-down,onerror=redirect/uploads/publication/thumbnail/55fc33a8-994d-443c-89d7-5e22859b180c/landscape_New_banner_2.png",
      "title": "Startup Ideas #406: Startup Syndicates, Tea...",
      "displayed_date": 1666800076,
      "web_url": ""
    },
    // "event_timestamp": 1666800076,
    // "event_type": "post.sent",
    // "uid": "evt_00000000-0000-0000-0000-000000000000"
  };

  const response = await fetch(context.site.url + "/post", {
    method: "POST",
    body: JSON.stringify(input)
  });

  return new Response(
    JSON.stringify(response, null, '\t')
  );
};

export const config = {
  path: "/test-post"
};