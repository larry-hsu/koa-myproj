import {EventUtil} from './modules/AddRemoveEvent.js';

let doc = document;

let nav = doc.getElementsByClassName('nav')[0];
let summary = doc.getElementsByClassName('summaryFirst')[0];
let asideRight = doc.getElementsByClassName('toChange')[0];
let header = doc.getElementsByTagName('header')[0];
let flag = false;

EventUtil.addHandler(header, 'click', function(e){
    window.location.href='/sign/signIn';

});

EventUtil.addHandler(window, 'load', function(e){
    let bottom = nav.getBoundingClientRect().bottom;
    if(bottom<0){
        summary.className = 'fix';
        asideRight.className='backToTopOn';
    }
});


EventUtil.addHandler(window, 'scroll', function(){
    let bottom = nav.getBoundingClientRect().bottom;

    if(bottom < 0){
        flag = true;
        summary.className = 'fix';
        asideRight.className='backToTopOn';
    }else if(bottom && flag) {
        summary.className = 'summary';
        asideRight.className='backToTopOff';
    }
});

function getScrollTop(){
    var osTop = 0;
    // 标准模式生效
    if(document.documentElement&&document.documentElement.scrollTop) {
        osTop = document.documentElement.scrollTop;
    }else if(document.body) { // 混杂模式生效
        osTop = document.body.scrollTop;
    }
    return osTop;
}


//点击返回顶部
EventUtil.addHandler(asideRight, 'click', function(e){
    e = EventUtil.getEvent(e);

    //设置定时器
    function upToTop(){
        //获取滚动条距离顶部高度
        let osTop = getScrollTop();
        let ispeed = Math.floor(-osTop / 7);

        setTimeout(function(){
            doc.documentElement.scrollTop = doc.body.scrollTop = osTop + ispeed;
            //到达顶部，清除定时器
            if (osTop > 0) {
                setTimeout(upToTop, 10);
            };
        }, 10);
    }

    upToTop();
});


//canvas图形绘制，向上的箭头
let upArrow = doc.getElementById('upArrow');
//确定浏览器支持<canvas>元素
if(upArrow.getContext){
    let context = upArrow.getContext('2d');
    context.fillStyle = '#8590a6';
    context.fillRect(13, 17, 8, 10);

    context.beginPath();
    
    context.moveTo(17, 6);
    context.lineTo(8, 17);
    context.lineTo(26, 17);
    context.closePath();
    context.fill();
}





