/**
 * 用于控制页面样式的 JavaScript 文件
 */

 function render(text, devL, devW, sp) {
    if (sp) {
        document.getElementById("content").innerHTML =  `<svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <g>
        <animateTransform attributeName="transform" type="rotate" values="0 33 33;270 33 33" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"/>
        <circle fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30" stroke-dasharray="187" stroke-dashoffset="610">
            <animate attributeName="stroke" values="#4285F4;#DE3E35;#F7C223;#1B9A59;#4285F4" begin="0s" dur="5.6s" fill="freeze" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="rotate" values="0 33 33;135 33 33;450 33 33" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" values="187;46.75;187" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"/>
        </circle>
        </g>
    </svg>`;
        return true;
    }
    var cl = text.length || devL;
    if (cl > 150 && !sp) return false;
    if (devL) {
        for (let i = 0; i < devL-1; i++) {
            text += devW;
        }
    }
    var ctel = document.getElementsByClassName("content")[0];
    var width = document.body.clientWidth;
    ctel.setAttribute("style", "width: "+width*0.8+"px");
    // 小型移动设备
    if (width <= 320) {
        if (cl <= 12) {
            ctel.style["font-size"] = "2.5rem";
        } else if (cl >= 110) {
            ctel.style["font-size"] = "1.6rem";
        } else if (cl >= 90 && cl < 110) {
            ctel.style["font-size"] = "1.8rem";
        } else {
            ctel.style["font-size"] = "2rem";
        }
    }
    // 中型移动设备
    if (width <= 375 && width > 320) {
        if (cl <= 12) {
            ctel.style["font-size"] = "2.5rem";
        } else if (cl >= 110) {
            ctel.style["font-size"] = "1.65rem";
        } else if (cl >= 90 && cl < 110) {
            ctel.style["font-size"] = "1.8rem";
        } else {
            ctel.style["font-size"] = "2rem";
        }
    }
    // 大型移动设备
    if (width <= 425 && width > 375) {
        if (cl <= 12) {
            ctel.style["font-size"] = "2.5rem";
        } else if (cl >= 110) {
            ctel.style["font-size"] = "1.7rem";
        } else if (cl >= 90 && cl < 110) {
            ctel.style["font-size"] = "1.8rem";
        } else {
            ctel.style["font-size"] = "2rem";
        }
    }

    if (width <= 768 && width > 425) {
        if (cl <= 12) {
            ctel.style["font-size"] = "3rem";
        } else if (cl >= 110) {
            ctel.style["font-size"] = "2.1rem";
        } else if (cl >= 90 && cl < 110) {
            ctel.style["font-size"] = "2.35rem";
        } else {
            ctel.style["font-size"] = "2.75rem";
        }
    }
    if (width <= 1024 && width > 768) {
        if (cl <= 12) {
            ctel.style["font-size"] = "3.5rem";
        } else if (cl >= 110) {
            ctel.style["font-size"] = "2.75rem";
        } else if (cl >= 90 && cl < 110) {
            ctel.style["font-size"] = "2.9rem";
        } else {
            ctel.style["font-size"] = "3rem";
        }
    }
    if (width <= 1440 && width > 1024) {
        if (cl <= 12) {
            ctel.style["font-size"] = "4rem";
        } else if (cl >= 110) {
            ctel.style["font-size"] = "3rem";
        } else if (cl >= 90 && cl < 110) {
            ctel.style["font-size"] = "3.35rem";
        } else {
            ctel.style["font-size"] = "3.75rem";
        }
    }
    if (width > 1440) {
        if (cl <= 12) {
            ctel.style["font-size"] = "4rem";
        } else if (cl >= 110) {
            ctel.style["font-size"] = "3rem";
        } else if (cl >= 90 && cl < 110) {
            ctel.style["font-size"] = "3.35rem";
        } else {
            ctel.style["font-size"] = "3.75rem";
        }
    }
    document.getElementById("content").innerText = text;
}

render(false, false, false, true)