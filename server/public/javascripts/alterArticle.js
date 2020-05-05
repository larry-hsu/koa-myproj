import {EventUtil} from './modules/AddRemoveEvent.js';

let title = document.getElementById('title');
let summary = document.getElementById('summary');
let content = document.getElementById('content');
let post = document.getElementById('post');
let form = document.getElementById('postArticle');
let upInput = document.getElementById('upInput');
let pic = document.getElementById('pic');
let canWrap = document.getElementById('canWrap');
let addPic = document.getElementById('addPic');
let text = document.getElementById('text');

content.innerHTML = text.value; // 将隐藏域的文字复制到内容域中


// 只要有一个修改了就可以发布了
function lightUp(dom) {
    dom.className = 'available';
    dom.disabled = ''; 
}

// 只有全部未修改时才不能发布
function lightOff(dom) {
    if(!tFlag && !sFlag && !cFlag && !fFlag) {
        dom.className = 'unavailable';
        dom.disabled = 'disabled';
    }   
}

let titleValue = title.value;
let tFlag = 0;
EventUtil.addHandler(title, `keyup`, function(){
    if(titleValue != title.value) { // 如果修改过
        tFlag = 1;
        lightUp(post);
    }else {  // 如果未修改
        tFlag = 0;
        lightOff(post);
    }
    
});

let summaryValue = summary.value;
let sFlag = 0;
EventUtil.addHandler(summary, `keyup`, function(){
    if(summaryValue != summary.value) {
        sFlag = 1;
        lightUp(post);
    } else {
        sFlag = 0;
        lightOff(post);
    }
    
});

let conInTxt = content.innerText;
let cFlag = 0;
EventUtil.addHandler(content, `keyup`, function(){
    if(conInTxt != content.innerText) {
        cFlag = 1;
        lightUp(post);
    }else {
        cFlag = 0;
        lightOff(post);
    }
});




EventUtil.addHandler(post, 'click', function(e){
    let flag = tFlag || cFlag || sFlag || fFlag;

    let tmp = content.innerHTML;
    /*
    tmp = tmp.replace(/<div><br><\/div>/g, '<div></div>')
    tmp = tmp.replace(/<div>/g, '<br>');
    tmp = tmp.replace(/<\/div>/g, '');
    */
    text.value = tmp;
    
    if(post.className == 'available' && flag) {
        form.submit();
    }
});


//canvas图形绘制
let upArrow = document.getElementById('canPic');
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

EventUtil.addHandler(pic, 'click', function(){
    upInput.click();
});

let fFlag = 0;
EventUtil.addHandler(upInput, 'change', function(e){
    // 展示上传的图片
    if(upInput.value != '') {
        //console.log(e.target.files);
        let files = e.target.files, file;
        if(files && files.length>0) {
            fFlag = 1;
            lightUp(post);
            file = files[0];
            // 获取window的URL工具
            let URL = window.URL || window.webkitURL;
            // 通过file生成目标url工具
            let imgURL = URL.createObjectURL(file);
            // console.log(imgURL);
            addPic.style.display = 'none';
            canWrap.style.display = 'none';
            pic.style.backgroundImage = `url(${imgURL})`;
        }else {
            fFlag = 0;
            lightOff(post);
        }
    }
});