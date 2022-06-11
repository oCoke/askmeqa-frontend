/**
 * 动态注入 Appbar & Toolbar + 设置 Service Worker 注册
 */
const appbar = `
<div class="mdui-appbar mdui-appbar-fixed">
    <div class="mdui-toolbar mdui-color-theme">
        <a href="javascript:;" mdui-drawer="{target: '#left-drawer', overlay: true}" class="mdui-btn mdui-btn-icon">
        <i class="mdui-icon material-icons">menu</i>
        </a>
        <a href="/" class="mdui-typo-headline">AskMeQA</a>
        <div class="mdui-toolbar-spacer"></div>
        <!-- <a href="javascript:;" class="mdui-btn mdui-btn-icon">
        <i class="mdui-icon material-icons">search</i>
        </a>
        <a href="javascript:;" class="mdui-btn mdui-btn-icon">
        <i class="mdui-icon material-icons">more_vert</i>
        </a> -->
    </div>
</div>`;

var loginStatus = localStorage.getItem("login-token") && localStorage.getItem("username");
var loginUser = '';
if (loginStatus) {
    loginUser = `
        <li class="mdui-subheader">用户操作</li>
        <li class="mdui-list-item mdui-ripple" onclick="window.location.href='/logout/'">
        <i class="mdui-list-item-icon mdui-icon material-icons">account_circle</i>
        <div class="mdui-list-item-content">退出登录</div>
        </li>
        <li class="mdui-list-item mdui-ripple" onclick="window.location.href='/u/?id=${localStorage.getItem("username")}'"> <i class="mdui-list-item-icon mdui-icon material-icons">library_books</i>
        <div class="mdui-list-item-content">用户主页</div>
        <li class="mdui-list-item mdui-ripple" onclick="window.location.href='/home/'"> <i class="mdui-list-item-icon mdui-icon material-icons">library_books</i>
        <div class="mdui-list-item-content">管理内容</div>
        <li class="mdui-list-item mdui-ripple" onclick="window.location.href='/status/'"> <i class="mdui-list-item-icon mdui-icon material-icons">adjust</i>
        <div class="mdui-list-item-content">用户状态</div>
        <li class="mdui-list-item mdui-ripple" onclick="window.location.href='/settings/'"> <i class="mdui-list-item-icon mdui-icon material-icons">settings</i>
        <div class="mdui-list-item-content">用户设置</div>
        </li>
    `
} else {
    loginUser = `
        <li class="mdui-subheader">用户操作</li>
        <li class="mdui-list-item mdui-ripple" onclick="window.location.href='/login/'">
        <i class="mdui-list-item-icon mdui-icon material-icons">account_circle</i>
        <div class="mdui-list-item-content">登录</div>
        </li>
        <li class="mdui-list-item mdui-ripple" onclick="window.location.href='/register/'"> <i class="mdui-list-item-icon mdui-icon material-icons">account_circle</i>
        <div class="mdui-list-item-content">注册</div>
        </li>
    `
}
const toolbar = `
<div class="mdui-drawer mdui-color-white mdui-drawer-full-height mdui-drawer-close" id="left-drawer">
    <ul class="mdui-list">
    <li class="mdui-subheader">相关链接</li>
    <li class="mdui-list-item mdui-ripple" onclick="window.location.href='/'">
    <i class="mdui-list-item-icon mdui-icon material-icons">center_focus_weak</i>
    <div class="mdui-list-item-content">AskMeQA</div>
    </li>
    <li class="mdui-list-item mdui-ripple" onclick="window.location.href='/u/go/'"> <i class="mdui-list-item-icon mdui-icon material-icons">account_circle</i>
    <div class="mdui-list-item-content">查询内容</div>
    </li>
    ${loginUser}
</div>`;

const foot = `
<div class="page-copyright">
    &copy; 2022 AskMeQA by <a href="https://imcky.top">CKY</a>
</div>`;

mdui.$(document.body).prepend(appbar);
mdui.$(document.body).prepend(toolbar);
if (mdui.$(".form").length > 0) {
    mdui.$(".form").append(foot);
} else {
    mdui.$(document.body).append(foot);
}
mdui.mutation();

if (navigator.serviceWorker) {
    window.addEventListener('load', async () => {
        navigator.serviceWorker.register(`/sw.js?time=${new Date().getTime()}`)
            .then(async reg => {
                // 安装成功，建议此处强刷新以立刻执行SW
                if (window.localStorage.getItem('install-sw') != 'true') {
                    // 没有安装 Service Worker

                    var ele = document.createElement("div");
                    ele.id = "regsw";
                    ele.innerHTML = `
                    <div style="text-align: center;padding-bottom: 35px;">
                    <h2>Service Worker</h2>
                    <p>Service Worker 正在注册中</p>
                    <p>注册成功后将会自动刷新页面</p><svg width="45px" height="60px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <animateTransform attributeName="transform" type="rotate" values="0 33 33;270 33 33" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"></animateTransform>
                        <circle fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30" stroke-dasharray="187" stroke-dashoffset="610">
                        <animate attributeName="stroke" values="#4285F4;#DE3E35;#F7C223;#1B9A59;#4285F4" begin="0s" dur="5.6s" fill="freeze" repeatCount="indefinite"></animate>
                        <animateTransform attributeName="transform" type="rotate" values="0 33 33;135 33 33;450 33 33" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"></animateTransform>
                        <animate attributeName="stroke-dashoffset" values="187;46.75;187" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"></animate>
                        </circle>
                    </g>
                    </svg>
                    <p style="opacity: 0.4;/* margin-top: 20px; */">此项设置有利于提升页面访问体验</p>
                    </div>
                    `;
                    ele.style = "z-index: 9999; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%;display: flex;justify-content: center;align-items: center;background-color: white;"
                    document.body.appendChild(ele);
                    window.localStorage.setItem('install-sw', 'true');
                    setTimeout(() => {
                        if (window.location.search) {
                            window.location.search = window.location.search+`&dt=${new Date().getTime()}`
                        } else {
                            window.location.search = `?dt=${new Date().getTime()}`;
                        }
                    }, 1500)
                }
            }).catch(err => {
                // 安装失败
            })
    });
}