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
})

