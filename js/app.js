if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('../sw.js')
        .then((reg) => {
            //console.log('Service Worker Registered', reg)
        }).catch((err) => {
            console.log("Service Worker registration failed: ", err);
        })
}

//getData


function makeTemplate({title, imgUrl}) {
    const tpl = `
        <section>
            <div class="container">
                <div class="row align-items-center">
                <div class="col-lg-6 order-lg-2">
                    <div class="p-5">
                    <img class="img-fluid rounded-circle" src="${imgUrl}" alt="">
                    </div>
                </div>
                <div class="col-lg-6 order-lg-1">
                    <div class="p-5">
                    <h2 class="display-4">${title}</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod aliquid, mollitia odio 
                    veniam sit iste esse assumenda amet aperiam exercitationem </p>
                    </div>
                </div>
                </div>
            </div>
            </section>
    `;
    return tpl;
}

function getAdditionalData(url) {

    //append from Cache
    if('caches' in window) {
        caches.match(url).then((response) => {
            if (response) {
                response.json().then((data) => {
                    console.log("Cache Updated");
                    const tplResult = makeTemplate({title:data.title, imgUrl: 'http://crong.codesquad.kr:8080/img/'+data.img})
                    const lastSection = document.querySelector("body > section:last-of-type");
                    lastSection.insertAdjacentHTML("afterend", tplResult);
                    document.querySelector(".moreBtn").style.display = "none";
                });
            }
        })
    }

    fetch(url).then((res) => {
        return res.json();
    }).then((data) => {
        if(data) {
            console.log("Ajax Updated");
            const lastSection = document.querySelector("body > section:last-of-type");
            const img = lastSection.querySelector("img");
            const title = lastSection.querySelector("h2");
            img.src = 'http://crong.codesquad.kr:8080/img/' + data.img;
            title.textContent = data.title;
        }
    });
}


document.addEventListener("DOMContentLoaded", (e) => {
    document.querySelector(".moreBtn").addEventListener("click", (e) => {
        const apiurl = "http://crong.codesquad.kr:8080/wonder/rocker";
        getAdditionalData(apiurl)
    });
});

//PUSH NOTIFICATION
  
(function() {
    function urlB64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');
   
        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);
    
        for (var i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    //Notification feature detection
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications!');
        return;
    }

    Notification.requestPermission(function (status) {
        console.log('Notification permission status:', status);
    });

    function displayNotification() {
        if (Notification.permission !== 'granted') return;
        navigator.serviceWorker.getRegistration().then(function (reg) {
            var options = {
                body: 'First notification!',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                },
            };
            reg.showNotification('Hello world!', options);
        });
    }

    function subscribeUser(swRegistration) {
        //UInt8Array로 변환
        const applicationServerKey = urlB64ToUint8Array("BEZMmtd6T_CIxUQqUGW9zOGPb2uLYE2QPAB8qtdpHWipv4HaB0hEp0ydOyGDlT6m3AGlQgTTuXNI_8Z8GiPUv3Y");
  
        swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey : applicationServerKey
        })

        .then(function(subscription) {
          console.log('User is subscribed:', JSON.stringify(subscription));
        }).catch(function(err) {
          if (Notification.permission === 'denied') {
            console.warn('Permission for notifications was denied');
          } else {
            console.error('Failed to subscribe the user: ', err);
          }
        });
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');
    
        navigator.serviceWorker.register('sw.js')
        .then(function(swRegistration) {

            document.querySelector(".pushBtn").addEventListener("click", (e) => {
                subscribeUser(swRegistration);
            });

            swRegistration.pushManager.getSubscription()
            .then(function(subscription) {
              if (subscription !== null) {
                console.log('User IS subscribed.');
              } else {
                console.log('User is NOT subscribed.');
              }
            });
        })
        .catch(function(error) {
          console.error('Service Worker Error', error);
        });
    } else {
        console.warn('Push messaging is not supported');
    }

    //displayNotification();
})();

