// Stealth Service Worker for Header Stripping
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Intercept requests with the /service/ prefix
    if (url.includes('/service/')) {
        const targetUrl = atob(url.split('/service/')[1]);
        
        event.respondWith(
            fetch(targetUrl).then(response => {
                // Strip security headers that block iframes
                const newHeaders = new Headers(response.headers);
                newHeaders.delete('X-Frame-Options');
                newHeaders.delete('Content-Security-Policy');
                
                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            }).catch(() => fetch(event.request))
        );
    }
});
