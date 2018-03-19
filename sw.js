//static file cache
var cacheName = 'pwa-test-8';
var dataCacheName = 'pwa-data-1';

var filesToCache = [
    '/',
    '/index.html',
    '/js/app.js',
    '/css/one-page-wonder.min.css',
    '/vendor/bootstrap/css/bootstrap.min.css',
    '/vendor/bootstrap/js/bootstrap.bundle.min.js',
    '/vendor/jquery/jquery.min.js',
    '/img/01.jpg',
    '/img/02.jpg',
    '/img/03.jpg'
];


//event리스너는 한번만 발생한다. 설치가 일어날 때만 발생하기 때문.
self.addEventListener( 'install', (e) => {
    //console.log('[ServieWorker] install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[ServiceWorker] caching app shell');
            return cache.addAll(filesToCache);
        })
    )
})


self.addEventListener('activate', function(e) {
    //console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        console.log(caches);
        //cache 리스트를 이렇게 계속 내가 컨트롤해줘야 한다.
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName && key!== dataCacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
});


//http 요청이 있을때마다 발생.
self.addEventListener('fetch', (e) => {
    //fetch 이벤트 핸들러에는 respondWith 메서드가 있음.

    var dataUrl = 'http://crong.codesquad.kr:8080/wonder';

    if(e.request.url.includes(dataUrl)) {
        e.respondWith(
            caches.open(dataCacheName).then((cache) => {
                //가로채서 대신 request보내기. fetch를 사용한다.
                return fetch(e.request).then((response) => {
                    //response객체는 한번만 사용되게 되어 있음으로, 여기서 복사복은 만들어서 저장한다.
                    cache.put(e.request.url, response.clone())
                    return response;
                })
            })
        )
    //image 
    } else if(e.request.url.includes('http://crong.codesquad.kr:8080/img')){
        e.respondWith(
            caches.open(dataCacheName).then((cache) => {
                return cache.match(e.request).then((response) => {
                  return response || fetch(e.request).then((response) => {
                    cache.put(e.request, response.clone());
                    return response;
                  });
                });
            })
        )
    } else {
        e.respondWith(
            caches.match(e.request).then((response) => {
                //cache에서 HTTP Response객체를 반환.  
                return response || fetch(e.request);
                //return fetch(e.request);
            })
        )
    }
});

self.addEventListener("push", (e) => {

    var body = e.data ? e.data.text() : 'Default Body~';

    var options = {
        body: body,
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {action: 'explore', title: 'Explore this new world'},
            {action: 'close', title: 'Close notification'}
        ]
    };

    e.waitUntil(
        self.registration.showNotification('Hello world!', options)
    );
});

