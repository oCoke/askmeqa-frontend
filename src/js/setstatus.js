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
    const status = document.getElementById("status").value;
    document.getElementById("ask-btn").innerHTML = `<div class="mdui-spinner mdui-spinner-colorful"></div>`;
    mdui.mutation();
    fetch("https://ask-bkend.yfun.top/setstatus", {mode: "cors", method: "POST", body: JSON.stringify({
        status: status,
        username: localStorage.getItem("username"),
        login_token: localStorage.getItem("login-token"),
        token: document.getElementById("token").innerText,
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
        document.getElementById("ask-btn").innerHTML = "提交";
    })
}