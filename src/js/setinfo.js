function getParam(reqParam) {
    reqParam = reqParam.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const paraReg = new RegExp('[\\?&]' + reqParam + '=([^&#]*)');
    const results = paraReg.exec(window.location);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

grecaptcha.ready(function() {
    grecaptcha.execute('6Lez3tMeAAAAAMkhcx4sMoeW8O0of6Gc-MwaGuw8', {action: 'send'}).then(function(token) {
        document.getElementById("token").innerText = token;
    });
});

const username = localStorage.getItem("username");
const login_token = localStorage.getItem("login_token");

function send() {
    const nickname = document.getElementById("nickname").value;
    const intro = document.getElementById("intro").value;
    const sub = document.getElementById("sub").value;
    const pushdeer = document.getElementById("pushdeer").value;
    const token = document.getElementById("token").innerText;
    if (!nickname || nickname == null || nickname == undefined || nickname.match(/^[ ]*$/)) {
        mdui.snackbar({
            message: '昵称不能为空！'
        });
        return false;
    }
    if (!intro || intro == null || intro == undefined || intro.match(/^[ ]*$/)) {
        mdui.snackbar({
            message: '信息不能为空！'
        });
        return false;
    }
    if (!sub || sub == null || sub == undefined || sub.match(/^[ ]*$/)) {
        mdui.snackbar({
            message: '简介不能为空！'
        });
        return false;
    }
    document.getElementById("ask-btn").innerHTML = `<div class="mdui-spinner mdui-spinner-colorful"></div>`;
    mdui.mutation();
    fetch("https://ask-bkend.yfun.top/setinfo", {mode: "cors", method: "POST", body: JSON.stringify({
        nickname: nickname,
        intro: intro,
        token: token,
        pushdeer: pushdeer,
        sub: sub,
        username: localStorage.getItem("username"),
        login_token: localStorage.getItem("login-token"),
    })}).then(res => res.text()).then((res) => {
        var res = JSON.parse(res);
        if (res.code == "email_error") {
            mdui.snackbar({
                message: res.text || "未知的错误。"
            });
            setTimeout(() => {
                window.location.href = "/register/code/?from=setting"
            }, 3000);
            return false;
        }
        mdui.snackbar({
            message: res.text || "未知的错误。"
        });
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    })
}