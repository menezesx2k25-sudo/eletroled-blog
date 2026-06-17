export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'blog.consertoeletroled.com';

    return new Response(null, {
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Location': url.toString(),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
      }
    });
  }
};
