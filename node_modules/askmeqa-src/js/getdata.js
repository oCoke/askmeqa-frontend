/**
 * 获取列表
 */

function getParam(reqParam) {
    reqParam = reqParam.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const paraReg = new RegExp('[\\?&]' + reqParam + '=([^&#]*)');
    const results = paraReg.exec(window.location);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const username = getParam("id");
const qid = getParam("qid");
const num = 10;
var page = 0;

var logged = false;
var removeBtnContent = "";
if (localStorage.getItem("username") == username) {
    logged = true;
}

function getContent(log, id) {
    if (log) {
        return `<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-center" style="margin: 30px;" id="del${id}" onclick="remove_id(${id});">删除</button>`;
    }
    return "";
}

function remove_id(qid) {
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

async function getData(user, num, page, next, qid) {
    if (!user) {
        mdui.snackbar({
            message: '用户名不存在。'
        });
    }
    if (qid) {
        num = 20;
        console.log("指定 QID:"+qid);
        let dtrq = await fetch("https://ask-bkend.yfun.top/getqa?user="+user+"&num="+num+"&page="+page);
        var data = JSON.parse(await dtrq.text());
        if (data.code == 200) {
            /* 服务端正确 */
            data = data.data;
            for (i of data) {
                if (i.qid == qid) {
                    console.log(true);
                    var ele = document.createElement("div");
                    ele.id="qid-ans-card";
                    ele.classList += "mdui-card card";
                    let t = new Date(Number(i.date));
                    ele.innerHTML = `
                    <div class="mdui-card-primary">
                    <div class="mdui-card-primary-title">${i.q} (QID: ${i.qid})</div>
                    <div class="mdui-card-primary-subtitle">
                    ${t.getFullYear()+"-"+((t.getMonth()+1).length == 2 ? (t.getMonth()+1): ("0"+String(t.getMonth()+1)))+"-"+(String(t.getDate()).length == 2 ? (t.getDate()) : ("0"+String(t.getDate())))+" "+(String(t.getHours()).length == 2 ? (t.getHours()) : ("0"+String(t.getHours())))+":"+(String(t.getMinutes()).length == 2 ? (t.getMinutes()) : ("0"+String(t.getMinutes())))}</div>
                    </div>
                    </div>
                    <div class="mdui-card-content mdui-typo">
                        <p>${i.a} </p>
                        
                    </div>
                    `;
                    document.getElementById("qa-panel").appendChild(ele);
                    document.getElementsByClassName("mdui-progress")[0].style.display = "none";
                    return true;
                }
            }
            if (data.length == num) {
                getData(user, num, page + 1, false, qid);
            }
        }
        if (!document.getElementById("qid-ans-card")) {
            var ele = document.createElement("div");
                    ele.classList += "mdui-card card";
                    let t = new Date(Number(i.date));
                    ele.innerHTML = `
                    <div class="mdui-card-primary">
                    <div class="mdui-card-primary-title">没有找到您的 QID</div>
                    <div class="mdui-card-primary-subtitle">
                                       </div>
                    </div>
                    <div class="mdui-card-content mdui-typo">
                        <p>这可能是因为用户没有回答您的问题，或是您的 QID 或用户名输入错误。 </p>
                        
                    </div>
                    `;
                    document.getElementById("qa-panel").appendChild(ele);
                    document.getElementsByClassName("mdui-progress")[0].style.display = "none";
        }
    }
    if (next) {
        try {
            document.getElementById("more-btn").innerHTML = `<div class="mdui-spinner mdui-spinner-colorful"></div>`;
            mdui.mutation();
        } catch (e) {}
    }
    let dataReq = await fetch("https://ask-bkend.yfun.top/getqa?user="+user+"&num="+num+"&page="+page);
    var data = JSON.parse(await dataReq.text());
    if (data.code == 200) {
        if (next) {
            try {
                document.getElementById("more-btn").remove();
            } catch(e) {}
        } else {
            document.getElementsByClassName("mdui-progress")[0].style.display = "none";
        }
        /* 服务端正确 */
        data = data.data;
        for (i of data) {
            if (i.q == 0 && i.a == 0) {
                continue;
            }
            var ele = document.createElement("div");
            ele.classList += "mdui-panel-item";
            let t = new Date(Number(i.date));
            ele.innerHTML = `
            <div class="mdui-panel-item-header">
              <div class="mdui-panel-item-title">${i.q}</div>
              <div class="mdui-panel-item-summary">${t.getFullYear()+"-"+((t.getMonth()+1).length == 2 ? (t.getMonth()+1): ("0"+String(t.getMonth()+1)))+"-"+(String(t.getDate()).length == 2 ? (t.getDate()) : ("0"+String(t.getDate())))+" "+(String(t.getHours()).length == 2 ? (t.getHours()) : ("0"+String(t.getHours())))+":"+(String(t.getMinutes()).length == 2 ? (t.getMinutes()) : ("0"+String(t.getMinutes())))}</div>
              <i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>
            </div>
            
            <div class="mdui-panel-item-body mdui-typo" style="margin: 0 1.2rem">
              <h6><b>Q: ${i.q} (QID: ${i.qid})</b></h6>
              <h6 style="/*margin-left: 1.2rem*/">A: ${i.a}</h6>

              ${getContent(logged, i.qid)}
            </div>


          </div>
            `;
            document.getElementById("qa-panel").appendChild(ele);
        }
        if (data.length == num) {
            var btn = document.createElement("button");
            btn.id = "more-btn";
            btn.classList += "mdui-btn mdui-btn-raised mdui-ripple mdui-center mg-top-30";
            btn.innerText = "加载更多";
            btn.setAttribute("onclick", `getData("${username}", ${num}, ${page+1}, true);`);
            document.getElementById("qa-panel").appendChild(btn);
        }
        console.log(data);
        if (data.length == 0) {
            mdui.snackbar({
                message: '没有更多啦~'
            });
        }
    } else if (data.code == 404) {
        mdui.snackbar({
            message: '用户名不存在。'
        });
    }

}

async function getProfile(user) {
    if (!user) {
        mdui.snackbar({
            message: '用户名不存在。'
        });
    }
    let dataReq = await fetch("https://ask-bkend.yfun.top/user/profile?username="+user);
    let data = await dataReq.json();
    if (data.code == 200) {
        var ele = document.getElementById("profile");

        ele.innerHTML = `
        <div class="mdui-card-primary">
            <div class="mdui-card-primary-title" id="user-title">${data.nickname}</div>
            <div class="mdui-card-primary-subtitle" id="user-sub">${data.sub}</div>
            </div>
            <div class="mdui-card-content mdui-typo" id="user-intro">
                <p>${data.intro}</p>
                <hr/>
                <h4 class="mdui-text-center mdui-text-color-light-blue-a700"><b>${data.status}</b></h4>
            </div>
        `;

        document.title = `${data.nickname} 的问答板 - AskMeQA`
    } else {
        var ele = document.getElementById("profile");
        ele.innerHTML = `
        <div class="mdui-card-primary">
            <div class="mdui-card-primary-title" id="user-title">获取用户信息出现错误。</div>
            `;
    }
}
getData(username, num, page, false, qid);
getProfile(username);

