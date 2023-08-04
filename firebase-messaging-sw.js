importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
const firebaseConfig = {
    apiKey: "AIzaSyD6eh7OWW9XNR1kjacuPQU-rXxWuDm1Hgo",
    authDomain: "pwa-final-5d5bb.firebaseapp.com",
    projectId: "pwa-final-5d5bb",
    storageBucket: "pwa-final-5d5bb.appspot.com",
    messagingSenderId: "264816785264",
    appId: "1:264816785264:web:fbf901d7d960f09b2f01b5"
  };

  firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    }
    self.registration.showNotification(payload.notification.title, notificationOptions);
});

const nombreCache = 'pwa-gxgames-archivos-cache';
const archivos = ['/',
                'js/main.js',
                'index.html',
                'vender.html',
                'css/styles.css',
                'css/bootstrap.css',
                'js/CarritoClass.js',
                'js/ProductoClass.js',
                'js/index.js',
                'login.html',
                'login.php',
                'img/logo.png',
                'checkout.html',
                'js/checkout.js',
                'img/pagos.jpg',
                'img/pago-visa.jpg',
                'img/pago-transfer.jpg',
                'img/pago-rapi.jpg',
                'img/pago-mp.jpg',
                'img/pago-facil.jpg',
                'img/pago-master.jpg',
                'img/envio.jpg',
                'img/envio-priv.jpg',
                'img/envio-arg.jpg',
                'img/envio-acordar.jpg'
];



self.addEventListener('install', precatching =>{
    self.skipWaiting();
    precatching.waitUntil(
        caches
            .open(nombreCache)
            .then(cache => {
                cache.addAll(archivos);
            })
    );
})
self.addEventListener('activate', precatching => {
    console.log('Service Worker se activo correctamente');
})
self.addEventListener("fetch", function(precatching){
   
})
self.addEventListener('push', precatching => {
    let title = precatching.data.text();
    let options = {
        body: 'Nuevo producto en la tienda -- GxGames',
        icon:   'img/icon/icon-192x192.png',
        vibrate: [500,300,500,300,300,100],
        actions: [
                    {action:1, icon:'img/icon/icon-192x192.png', title:'Ver producto'},
                    {action:2, icon:'img/icon/icon-192x192.png', title:'Recordar mas tarde'}]
    }
    precatching.waitUntil(self.registration.showNotification(title, options));
})

self.addEventListener('notificationclick', precatching => {
    if(precatching.action == 1) {
        console.log('El usuario quiere ver el producto ahora')
        clients.openWindow('http://localhost/pwa-parcial-2-dwn3bv-sanguine-federico/')
    } else if(precatching.action == 2){
        console.log('El usuario quiere ver el producto luego')
    }

    precatching.notification.close();

})

self.addEventListener('fetch', (cargarCache) => {
    cargarCache.respondWith(
      caches.match(cargarCache.request).then((RespuestaCache) => {
        if (RespuestaCache) {
          return RespuestaCache;
        }
        let RespuestaCache2 = cargarCache.request.clone();

        return fetch(RespuestaCache2)
            .then(RespuestaCache => {
                if(!RespuestaCache || RespuestaCache.status !== 200){
                    console.log('ERROR:', RespuestaCache, RespuestaCache2);
                }

                let RespuestaCache3 = RespuestaCache.clone();
                caches.open(nombreCache)
                    .then(cache => {
                        cache.put(RespuestaCache2, RespuestaCache3);
                    })
                console.log('Server:', RespuestaCache2);
                return RespuestaCache;
            })
      }),
    );
  });
