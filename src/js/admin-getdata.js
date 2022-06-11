/**
 * 获取列表
 */

function getParam(reqParam) {
    reqParam = reqParam.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const paraReg = new RegExp('[\\?&]' + reqParam + '=([^&#]*)');
    const results = paraReg.exec(window.location);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const username = localStorage.getItem("username");
const num = 10;
var page = 0;

async function getData(user, num, page, next) {
    if (!user) {
        mdui.snackbar({
            message: '用户名不存在。'
        });
    }
    if (next) {
        document.getElementById("more-btn").innerHTML = `<div class="mdui-spinner mdui-spinner-colorful"></div>`;
        mdui.mutation();
    }
    let dataReq = await fetch("https://ask-bkend.yfun.top/getqa?user="+user+"&num="+num+"&page="+page+"&token="+localStorage.getItem("login-token"));
    var data = JSON.parse(await dataReq.text());
    if (data.code == 200) {
        if (next) {
            document.getElementById("more-btn").remove();
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
            let t = new Date(Number(i.date));
            ele.classList += "mdui-panel-item";
            ele.innerHTML = `
            <div class="mdui-panel-item-header">
              <div class="mdui-panel-item-title">${i.q}</div>
              <div class="mdui-panel-item-summary">${t.getFullYear()+"-"+((t.getMonth()+1).length == 2 ? (t.getMonth()+1): ("0"+String(t.getMonth()+1)))+"-"+(String(t.getDate()).length == 2 ? (t.getDate()) : ("0"+String(t.getDate())))+" "+(String(t.getHours()).length == 2 ? (t.getHours()) : ("0"+String(t.getHours())))+":"+(String(t.getMinutes()).length == 2 ? (t.getMinutes()) : ("0"+String(t.getMinutes())))}</div>
              <i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>
            </div>
            
            <div class="mdui-panel-item-body mdui-typo" style="margin: 0 1.2rem">
              <h6>Q: ${i.q} (QID: ${i.qid})</h6>
              
              <div id="input-area" class="mdui-textfield mdui-textfield-floating-label" style="margin: 0 35px;">
                    <label class="mdui-textfield-label">回答内容</label>
                    <input class="mdui-textfield-input" maxlength="150" id="input-${i.qid}"></input>

                </div>
                <button class="mdui-btn mdui-btn-raised mdui-ripple mdui-center" style="margin: 30px;" id="btn${i.qid}"onclick="answer(${i.qid});">回答</button>
                <button class="mdui-btn mdui-btn-raised mdui-ripple mdui-center" style="margin: 30px;" id="del${i.qid}" onclick="qa_del(${i.qid});">删除</button>
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
    mdui.mutation();
}
getData(username, num, page);