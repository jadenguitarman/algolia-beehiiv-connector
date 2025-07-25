export default async (req, context) => new Response(
  `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test iframe page</title>

        <style>
          body {
            padding: 0;
            margin: 0;
            height: 100vh;
          }
        </style>
      </head>

      <body>
        <iframe 
          src="${context.site.url}/search"
          style="width: 100%; height: 100%; border: 0; outline: 0; margin: 0; padding: 0; flex: 1;"
        ></iframe>
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
  path: "/test-iframe"
};