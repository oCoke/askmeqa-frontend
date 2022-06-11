const CACHE_NAME = 'BLOGCACHE';

var cachelist = [
    "/src/mdui/css/mdui.min.css",
    "/src/mdui/fonts/roboto/Roboto-Medium.woff2",
    "/src/mdui/fonts/roboto/Roboto-Regular.woff2",
    "/src/mdui/icons/material-icons/MaterialIcons-Regular.woff2",
    "/src/mdui/js/mdui.min.js",
];


const cachetime = 604800000;
const white_list = /^([a-zA-Z\d-_\*@]+\.|)+(yfun\.top|imcky\.top|stackoverflow\.com|github\.com)$/g

const proxy_endpoint = [
    'blog-endpoint.yfun.workers.dev',
    'yfun-blog-endpoint.deno.dev'
]


self.CACHE_NAME = 'SWHelperCache';
self.db = {
    read: (key) => {
        return new Promise((resolve, reject) => {
            caches.match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)).then(function (res) {
                res.text().then(text => resolve(text))
            }).catch(() => {
                resolve(null)
            })
        })
    },
    read_arrayBuffer: (key) => {
        return new Promise((resolve, reject) => {
            caches.match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)).then(function (res) {
                res.arrayBuffer().then(aB => resolve(aB))
            }).catch(() => {
                resolve(null)
            })
        })
    },
    write: (key, value) => {
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), new Response(value));
                resolve()
            }).catch(() => {
                reject()
            })
        })
    }
}

self.addEventListener('install', async function (installEvent) {
    self.skipWaiting();
    installEvent.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(cachelist);
            })
    );
});

self.addEventListener('fetch', async event => {
    try {
        event.respondWith(handle(event.request))
    } catch (msg) {
        event.respondWith(handleerr(event.request, msg))
    }
});
const handleerr = async (req, msg) => {
    return new Response(`Service Worker 遇到致命错误, ${msg}`, { headers: { "content-type": "text/html; charset=utf-8" } })
}
let cdn = {
    "gh": {
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/gh"
        },
        jsdelivr_fastly: {
            "url": "https://fastly.jsdelivr.net/gh"
        },
        jsdelivr_gcore: {
            "url": "https://gcore.jsdelivr.net/gh"
        },
        // tianli: {
        //     "url": "https://cdn1.tianli0.top/gh"
        // }
    },
    "combine": {
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/combine"
        },
        jsdelivr_fastly: {
            "url": "https://fastly.jsdelivr.net/combine"
        },
        jsdelivr_gcore: {
            "url": "https://gcore.jsdelivr.net/combine"
        },
        // tianli: {
        //     "url": "https://cdn1.tianli0.top/combine"
        // }
    },
    "npm": {
        eleme: {
            "url": "https://npm.elemecdn.com"
        },
        jsdelivr: {
            "url": "https://cdn.jsdelivr.net/npm"
        },
        zhimg: {
            "url": "https://unpkg.zhimg.com"
        },
        unpkg: {
            "url": "https://unpkg.com"
        },
        bdstatic: {
            "url": "https://code.bdstatic.com/npm"
        },
        // tianli: {
        //     "url": "https://cdn1.tianli0.top/npm"
        // }

    }
}
const lfetch = async (urls, url, init) => {
    let controller = new AbortController();
    const PauseProgress = async (res) => {
        return new Response(await (res).arrayBuffer(), { status: res.status, headers: res.headers });
    };
    if (!Promise.any) {
        Promise.any = function (promises) {
            return new Promise((resolve, reject) => {
                promises = Array.isArray(promises) ? promises : []
                let len = promises.length
                let errs = []
                if (len === 0) return reject(new AggregateError('All promises were rejected'))
                promises.forEach((promise) => {
                    promise.then(value => {
                        resolve(value)
                    }, err => {
                        len--
                        errs.push(err)
                        if (len === 0) {
                            reject(new AggregateError(errs))
                        }
                    })
                })
            })
        }
    }
    return Promise.any(urls.map(urls => {
        init = init || {}
        init.signal = controller.signal
        return new Promise((resolve, reject) => {
            fetch(urls, init)
                .then(PauseProgress)
                .then(res => {
                    if (res.status == 200) {
                        controller.abort();
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
        })
    }))
}

// var askBackend = ["https://askmeqa.yfun.workers.dev/", "https://"]
const handle = async function (req) {
    const urlStr = req.url
    const domain = (urlStr.split('/'))[2]
    const urlObj = new URL(urlStr)
    const port = urlObj.port
    let urls = []
    /* 是 Cache List 里的 URL */
    for (i of cachelist) {
        if (new URL(req.url).pathname == i) {
            console.log("OK: "+i)
            /* 很好，直接从缓存里拿 */
            return caches.match(req).then(function (resp) {
                if (!resp) {
                    return fetch(req.url);
                }
                return resp;
            })
        }
    }
    if (req.method != "GET") {
        // console.log("ADD: "+req.url+ req.body + req.method + req.mode)
        // return fetch(req.url, { mode: req.mode,  credential: req.credential, body: await req.text(), method: req.method });
        return fetch(req);
    }
    console.log(req.url + req.url.match("recaptcha/api.js"))
    if (req.url.match("recaptcha/api.js")) {
        console.log("Using Proxy:" + req.url)
        let proxy_url = []
        for (let i in proxy_endpoint) {
            proxy_url.push(urlStr.replace(domain, proxy_endpoint[i]))
        }
        const proxy_header = new Headers()

        for (let [key, value] of req.headers) {
            proxy_header.set(key, value)
        }
        proxy_header.set('c-origin', domain)
        //在header中指定实际域名
        proxy_header.set('c-type', 'CORS')
        //还原整个fetch
        return caches.match(req).then(function (resp) {
            return resp || lfetch(proxy_url, urlStr, {
            method: req.method,
            headers: proxy_header,
            body: req.body
        }).then(function (res) {
            if (!res) { throw 'error' }
            return caches.open(CACHE_NAME).then(function (cache) {
                cache.delete(req);
                cache.put(req, res.clone());
                return res;
            });
        }).catch(function (err) {
            return caches.match(req).then(function (resp) {
                return resp || caches.match(new Request('/offline/')) //2
            })
        })});
    }

    if (req.url.match(/(workers.dev|deno.dev|recaptcha)/g)) {
        // return fetch(req.url, { mode: req.mode, credential: req.credential, method: req.method });
        return fetch(req);
    }
    
    
    for (let i in cdn) {
        for (let j in cdn[i]) {
            if (domain == cdn[i][j].url.split('https://')[1].split('/')[0] && urlStr.match(cdn[i][j].url)) {
                urls = []
                for (let k in cdn[i]) {
                    urls.push(urlStr.replace(cdn[i][j].url, cdn[i][k].url))
                }
                if (urlStr.indexOf('@latest/') > -1) {
                    return lfetch(urls, urlStr);
                } else if (urlStr.indexOf("%7BLATEST_VERSION%7D") > -1) {
                    // 请求链接中还有 {LATEST_VERSION}
                    // 那就说明是开发环境或 CI 出了问题
                    // 直接返回本地内容

                    return fetch("/src/" + urlStr.split("%7BLATEST_VERSION%7D/")[1])
                } else {
                    return caches.match(req).then(function (resp) {
                        return resp || lfetch(urls, urlStr).then(function (res) {
                            return caches.open(CACHE_NAME).then(function (cache) {
                                cache.put(req, res.clone());
                                return res;
                            });
                        });
                    })
                }
            }
        }
    }
    return fetch(req).then(function (res) {
        if (!res) { throw 'error' } //1
        return caches.open(CACHE_NAME).then(function (cache) {
            cache.delete(req);
            cache.put(req, res.clone());
            return res;
        });
    }).catch(function (err) {
        return caches.match(req).then(function (resp) {
            return resp || caches.match(new Request('/offline/')) //2
        })
    })
}