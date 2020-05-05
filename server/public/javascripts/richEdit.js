import {EventUtil} from './modules/AddRemoveEvent.js';

let doc = document;

// 操作富文本
let content = doc.getElementById('content');
let bold = doc.getElementById('ebold');
let italic = doc.getElementById('eitalic');
let headline = doc.getElementById('etitle');
let block = doc.getElementById('eblock');
let ul = doc.getElementById('eul');
let title2 = doc.getElementById('etitle2');
let color = doc.getElementById('ecolor');
let line = doc.getElementById('eline');
let indent = doc.getElementById('eindent');

EventUtil.addHandler(bold, 'click', function(e){
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e);  
    doc.execCommand('bold');
});

EventUtil.addHandler(italic, 'click', function(e){
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e); 
    doc.execCommand('italic');
});

EventUtil.addHandler(headline, 'click', function(e){
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e); 
    doc.execCommand('formatblock', false, '<h2>');
});

EventUtil.addHandler(title2, 'click', function(e){
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e);
    doc.execCommand('formatblock', false, '<h4>')
});

EventUtil.addHandler(block, 'click', function(e){
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e); 
    let selection = document.getSelection();
    let range = selection.getRangeAt(0);
    let code = document.createElement('code');
    code.className = 'blockquote';
    range.surroundContents(code);
});

EventUtil.addHandler(indent, 'click', function(e){
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e);
    doc.execCommand('indent');
    /*
    var selection = document.getSelection();

    var selectedText = selection.toString();
    console.log(selectedText);
    //取得代表选区的范围
    
    var range = selection.getRangeAt(0);
    console.log(range);
    
    var p = document.createElement("p");
    p.innerText = selectedText;
    console.log(p.innerText);
    p.style.textIndent+='2em';
    
    range.surroundContents(p);*/
});


EventUtil.addHandler(ul, 'click', function(e){
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e); 
    doc.execCommand('insertunorderedlist', false, null);
    adjustList();
});

EventUtil.addHandler(color, 'click', function(e){
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e);
    let selection = document.getSelection();
    let range = selection.getRangeAt(0);
    let span = document.createElement('span');
    span.style.cssText = 'color:white; background-color:#243C4F; border-radius:4px; padding:2px 4px';
    range.surroundContents(span);
    //doc.execCommand('forecolor', false, `#243C4F`)
});

EventUtil.addHandler(line, 'click', function(e){
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e);
    doc.execCommand('inserthorizontalrule', 'false', null);
});



// 富文本控制框漂浮
let control = doc.getElementById('control');
let width = control.offsetWidth;

EventUtil.addHandler(window, 'scroll', function(){
    let bottom = summary.getBoundingClientRect().bottom;

    if(bottom<50) {
        control.className = 'fixed';
        control.style.width = width+'px';
    }else {
        control.className = 'normal';
    }
});

// 当编辑器中内容全被清空后(delete键也会把<p>标签删除)，
// 要重新加入<p><br></p>标签，并把光标定位在里面。
EventUtil.addHandler(content, 'keyup', e=>{
    if (e.keyCode === 8) {  // 删除键
        let textLen = content.innerText.length;
        let htmlLen = content.innerHTML.length;

        // 如果innerText的长度为0，但是innerHTML的长度不为0
        if (!textLen) {
            content.innerHTML = '<div><br></div>';
        } else if ((!textLen || textLen === 1) && htmlLen) {
            content.innerHTML = '<div><br></div>';
        }
    }
});


// 插入 ul 和 ol 位置错误
function adjustList() {
    let lists = doc.querySelectorAll("ol, ul");

    for (let i = 0; i < lists.length; i++) {
        let ele = lists[i]; // ol
        let parentNode = ele.parentNode;

        if (parentNode.tagName === 'DIV' &&
            parentNode.lastChild === parentNode.firstChild) {
            // The insertAdjacentElement() method of the Element 
            // interface inserts a given element node at a given 
            // position relative to the element it is invoked upon.
            parentNode.insertAdjacentElement('beforebegin', ele);
            parentNode.remove()
        }
    }
}


// 富文本去格式粘贴
EventUtil.addHandler(content, 'paste', function(e){
    // 阻止默认的复制事件
    e = EventUtil.getEvent(e);
    EventUtil.preventDefault(e);

    let txt = '';
    let range = null;
    // 获取复制的文本
    txt = EventUtil.getClipboardText(e);
    // 获取页面文本选区
    range = window.getSelection().getRangeAt(0);
    // 删除默认选中文本
    range.deleteContents();
    // 创建一个文本节点，用于替换选区文本
    let pasteTxt = doc.createTextNode(txt);
    // 插入文本节点
    range.insertNode(pasteTxt);
    // 将焦点移动到复制文本结尾
    range.collapse(false);
    keepLastIndex(content);
});



// 手动将光标定位到最后一个字符
function keepLastIndex(element) {
    if (element && element.focus) {
        element.focus();
    } else return;

    let range = doc.createRange();
    range.selectNodeContents(element);
    range.collapse(false);

    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}