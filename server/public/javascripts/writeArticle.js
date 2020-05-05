import {EventUtil} from './modules/AddRemoveEvent.js';
let doc = document;

let title = doc.getElementById('title');
let summary = doc.getElementById('summary');
let content = doc.getElementById('content');
let post = doc.getElementById('post');
let form = doc.getElementById('postArticle');
let upInput = doc.getElementById('upInput');
let pic = doc.getElementById('pic');
let canWrap = doc.getElementById('canWrap');
let addPic = doc.getElementById('addPic');
let text = doc.getElementById('text');
let more = doc.getElementsByClassName('more')[0];
let moreDetail = doc.getElementsByClassName('more-detail')[0];


function lightUp(dom) {
    if(tFlag && sFlag) {
        dom.className = 'available';
        dom.disabled = ''; 
    }else {
        dom.className = 'unavailable';
        dom.disabled = 'disabled';
    }
}

// 后期期望实现点击时有动画效果
EventUtil.addHandler(more, `click`, function(e){
    let style = moreDetail.style.visibility;
    style = style == 'hidden'?'visible':'hidden';
    moreDetail.style.visibility = style;
});

let tFlag = 0;
EventUtil.addHandler(title, `keyup`, function(){
    tFlag = Boolean(title.value.length);
    lightUp(post);
});

let sFlag = 0;
EventUtil.addHandler(summary, `keyup`, function(){
    sFlag = Boolean(summary.value.length);
    lightUp(post);
});


EventUtil.addHandler(post, 'click', function(e){
    let flag = tFlag || sFlag;
    let tmp = content.innerHTML;
    /*
    tmp = tmp.replace(/<div><br><\/div>/g, '<div></div>')
    tmp = tmp.replace(/<div>/g, '');
    tmp = tmp.replace(/<\/div>/g, '<br>');
    tmp = tmp.replace(/<h2>/g, '<br><h2>')
    */

    text.value = tmp;

    if(post.className == 'available' && flag) {
        form.submit();
    }
});

EventUtil.addHandler(content, 'focus', function(e){
    if(!content.innerText) {
        content.innerHTML += `<div></div>`;
    }
});


EventUtil.addHandler(pic, 'click', function(){
    upInput.click();
});

EventUtil.addHandler(upInput, 'change', function(e){
    // 展示上传的图片
    if(upInput.value != '') {
        console.log(e.target.files);
        let files = e.target.files, file;
        if(files && files.length>0) {
            file = files[0];
            // 获取window的URL工具
            let URL = window.URL || window.webkitURL;
            // 通过file生成目标url工具
            let imgURL = URL.createObjectURL(file);
            // console.log(imgURL);
            addPic.style.display = 'none';
            canWrap.style.display = 'none';
            pic.style.backgroundImage = `url(${imgURL})`;
        }
    }
});













//canvas图形绘制
let upArrow = doc.getElementById('canPic');
//确定浏览器支持<canvas>元素
if(upArrow.getContext){
    let context = upArrow.getContext('2d');
    context.fillStyle = 'white';
    
    context.beginPath();
    context.moveTo(12, 12);
    context.lineTo(7, 24);
    context.lineTo(17, 24);
    context.closePath();
    context.fill();

    context.beginPath();
    context.moveTo(21, 7);
    context.lineTo(14, 24);
    context.lineTo(28, 24);
    context.fill();
}

let dot = doc.getElementsByClassName('more-canvas')[0];
if(dot.getContext){
    let context = dot.getContext('2d');

    context.fillStyle = '#fff';

    context.font = "bold 22px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("···", 15, 12);
}
