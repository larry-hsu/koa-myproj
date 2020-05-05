import {EventUtil} from './modules/AddRemoveEvent.js';
import {serialize} from './modules/serialize.js';

let doc = document;
/*
let title = doc.getElementById('title');
let summary = doc.getElementById('summary');
let content = doc.getElementById('content');
let text = doc.getElementById('text');
let author = doc.getElementById('author');
let upInput = doc.getElementById('upInput');*/
let from = doc.getElementById('postArticle')
let tip = doc.getElementsByClassName('tip')[0];
let text = doc.getElementById('text');
let content = doc.getElementById('content');


//跨浏览器获取XMLHttpRequest对象
//使用了惰性载入
/*
function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
        createXHR = function () {
            return new XMLHttpRequest();
        };
    } else if (typeof ActiveXObject != "undefined") {
        createXHR = function () {
            if (typeof arguments.callee.activeXString != "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                    "MSXML2.XMLHttp"], i, len;
                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    } catch (ex) {
                        //pass
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString);
            }
        };
    } else {
        createXHR = function () {
            throw new Error("No XHR object available.");
        };
    }
    //这句有什么用？
    return createXHR();
}*/

/* 使用方法 */
/*
var xhr = createXHR();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            tip.innerHTML = xhr.responseText;
            //console.log(xhr.responseText);
        } else {
            console.log("Request was unsuccessful: " + xhr.status);
        }
    }
};



EventUtil.addHandler(from, 'input', function(){
    text.value = content.innerHTML;

    xhr.open("post", "/user/autosave", true);   
    // 可以使用 XHR 来模仿表单提交：
    // 首先将 Content-Type 头部信息设置为 application/x-www-form-urlencoded ，
    // 也就是表单提交时的内容类型，其次是以适当的格式创建一个字符串。
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.timeout = 1000;
    xhr.ontimeout = function () {
        console.log("Request did not return in time");
    };
    xhr.setRequestHeader("MyHeader", "MyValue");
    xhr.send(serialize(from));
});*/


EventUtil.addHandler(from, 'input', function(){
    text.value = content.innerHTML;

    let fromdata = new FormData();

    fromdata.append('file', $('#upInput')[0].files[0]);
    fromdata.append('title', $('#title').val());
    fromdata.append('author', $('#author').val());
    fromdata.append('summary', $('#summary').val());
    fromdata.append('content', $('#text').val());

    $.ajax({
        url: '/user/autosave',
        data: fromdata,
        type: 'post',
        datatype: 'json',
        contentType: false,
        processData: false,
        success: function(res, status, xhr) {
            tip.innerHTML = res;
        }
    });
});


