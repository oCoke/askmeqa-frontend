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

if (!username) {
    const username = localStorage.getItem("username");
}

function qa_del(qid) {
    var login_token = localStorage.getItem("login-token");
    document.getElementById("del"+qid).innerHTML = `<div class="mdui-spinner mdui-spinner-colorful"></div>`;
    mdui.mutation();
    fetch("https://ask-bkend.yfun.top/delete?username="+username+"&token="+login_token+"&qid="+qid).then(res => res.text()).then((res) => {
        var res = JSON.parse(res);
        document.getElementById("del"+qid).innerHTML = "删除";
        if (res.code == "ok_003") {
            mdui.snackbar({
                message: '删除成功！'
            });
        } else {
            mdui.snackbar({
                message: '删除失败！'
            });
        }
    });
}

function answer(qid) {
    const question = document.getElementById("input-"+qid).value;
    const token = document.getElementById("token").innerText;
    
    if (!question || question == null || question == undefined || question.match(/^[ ]*$/)) {
        mdui.snackbar({
            message: '文本不能为空！'
        });
    }
    document.getElementById("btn"+qid).innerHTML = `<div class="mdui-spinner mdui-spinner-colorful"></div>`;
    mdui.mutation();
    fetch("https://ask-bkend.yfun.top/answer", {mode: "cors", method: "POST", body: JSON.stringify({
        answer: question,
        username: username,
        login_token: localStorage.getItem("login-token"),
        qid: qid,
        token: token,
    })}).then(res => res.text()).then((res) => {
        var res = JSON.parse(res);
        document.getElementById("btn"+qid).innerHTML = "回答";
        if (res.code == "captcha_error_002") {
            mdui.snackbar({
                message: '未能通过 reCAPTCHA 认证。'
            });
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
        } else if (res.code == "too_fast") {
            mdui.snackbar({
                message: '发送速度太快啦！先休息一下吧！'
            });
            setTimeout(() => {
                grecaptcha.execute('6Lez3tMeAAAAAMkhcx4sMoeW8O0of6Gc-MwaGuw8', {action: 'send'}).then(function(token) {
                    document.getElementById("token").innerText = token;
                });
            }, 8000);
        } else if (res.code == "ok_002") {
            mdui.snackbar({
                message: '发送成功。'
            });
            grecaptcha.execute('6Lez3tMeAAAAAMkhcx4sMoeW8O0of6Gc-MwaGuw8', {action: 'send'}).then(function(token) {
                document.getElementById("token").innerText = token;
            });
        } else if (res.code == "question_already_have") {
            mdui.snackbar({
                message: '问题已经存在啦！'
            });
        } else {
            mdui.snackbar({
                message: '未知的错误。'
            });
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
        }
    })
}