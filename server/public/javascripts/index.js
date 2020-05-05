import {EventUtil} from './modules/AddRemoveEvent.js';
const doc = document;

const article = doc.getElementsByClassName('articleWrap');
const form = doc.getElementsByTagName('form');



/*
function init(){
    for(let i=0; i<article.length; i++) {
        let pageHeight = getBrowseInfo().pageHeight;
        let top = article[i].getBoundingClientRect().top;
        if(top - pageHeight < 0) {
            article[i].classList.add('fadeIn');
        }
    }
};

// 和其他动画错开
setTimeout(() => {
    init();
}, 400);


// 滑动到对应的方块时才显示
EventUtil.addHandler(window, 'scroll', function(e){
    for(let i=0; i<article.length; i++) {
        let pageHeight = getBrowseInfo().pageHeight;
        let top = article[i].getBoundingClientRect().top;
        if(top - pageHeight < 0) {
            if(article[i].classList.contains('fadeIn')) continue;
            article[i].classList.add('fadeIn');
        }
    }
});
*/
(function(){
    const len = form.length;
    for(let i=0; i<len; i++){
        EventUtil.addHandler(form[i], 'click', function(e){
            form[i].submit();
            // 访问表单字段 form[i]['readmore']
        });
    }
})();




