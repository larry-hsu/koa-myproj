import { myAjax } from './modules/syncajax.js';
import { makePages } from './modules/makePage.js';

const doc = document;

const getScrollTop = function () {
    var osTop = 0;
    // 标准模式生效
    if (doc.documentElement && doc.documentElement.scrollTop) {
        osTop = doc.documentElement.scrollTop;
    } else if (doc.body) { // 混杂模式生效
        osTop = doc.body.scrollTop;
    }
    return osTop;
}

const getBrowseInfo = (function () {
    var pageWidth = window.innerWidth,
        pageHeight = window.innerHeight;

    if (typeof pageWidth !== "number") {
        if (document.compatMode == "CSS1Compat") {
            pageWidth = document.documentElement.clientWidth;
            pageHeight = document.documentElement.clientHeight;
        } else {
            pageWidth = document.body.clientWidth;
            pageHeight = document.body.clientHeight;
        }
    }
    return {
        pageWidth: pageWidth,
        pageHeight: pageHeight
    }
}());

function operateLi(total) {
    let ul = doc.querySelector('.ul');
    let firstChild = doc.querySelector('.prev');
    let lastChild = doc.querySelector('.next');
    let article = doc.querySelector('.article');

    (function () {
        let res = makePages(1, total);
        function createEleLi(ctx) {
            let li = doc.createElement('li');
            li.innerText = ctx;
            return li;
        }

        for (let i = 0; i < res.length; i++) {
            let li = createEleLi(res[i]);
            if (res[i] === 1) {  // 默认第一页为当前页
                li.className = 'active';
            }
            if (li.innerText === '...') {
                li.classList.add('ellipsis');
            }
            ul.insertBefore(li, lastChild);
        }
    }());

    function refreshLi(cur) {
        let res = makePages(cur, total);
        let curNode = firstChild;
        let i = 0;
        while (curNode) {
            curNode = curNode.nextSibling;
            if (curNode.nodeName === 'LI') {
                curNode.classList.remove('ellipsis');  // 先去掉省略号样式
                curNode.classList.remove('active');
                curNode.innerText = res[i];
                if (res[i] === '...') {
                    curNode.classList.add('ellipsis');  // 再添加省略号样式
                }
                if (res[i] == cur) {
                    curNode.classList.add('active');
                }
                i++;
                // 只更新中间的数字1到total
                if (i >= res.length) { break; }
            }
        }
    }

    function getCurPage() {
        let curNode = firstChild;
        while (curNode) {
            if (curNode.nodeName === 'LI'
                && curNode.classList.contains('active')) {
                return Number(curNode.innerText);
            }
            curNode = curNode.nextSibling;
        }
    }

    function switchClass() {
        let curPage = getCurPage();
        if (curPage === 1) {
            firstChild.classList.add('disable');
        } else {
            if (firstChild.classList.contains('disable')) {
                firstChild.classList.remove('disable');
            }
        }

        if (curPage === total) {
            lastChild.classList.add('disable');
        } else {
            if (lastChild.classList.contains('disable')) {
                lastChild.classList.remove('disable');
            }
        }
    }

    function createArticle(posts) {
        let fragment = doc.createDocumentFragment();
        for (let i = 0; i < posts.length; i++) {
            let articleWrap = doc.createElement('div');
            articleWrap.className = 'articleWrap';

            let form = doc.createElement('form');
            form.method = 'post';
            form.action = '/article';

            let id = doc.createElement('input');
            id.name = 'id';
            id.value = posts[i].id;
            id.style = 'display:none';
            form.appendChild(id);

            let title = doc.createElement('p');
            title.className = 'title';
            title.innerText = posts[i].articleName;
            form.appendChild(title);

            let time = doc.createElement('p');
            time.className = 'time';
            time.innerText = `Posted on ${posts[i].postTime}`;
            form.appendChild(time);

            let imgWrap = '';
            if (posts[i].imgSrc) {
                imgWrap = doc.createElement('div');
                imgWrap.className = 'imgWrap';
                let img = doc.createElement('div');
                img.className = 'img';
                img.style = 'background-image: url(' + posts[i].imgSrc + ')';
                imgWrap.appendChild(img);
                form.appendChild(imgWrap);
            }

            let author = doc.createElement('p');
            author.className = 'author';
            author.innerText = posts[i].author;
            form.appendChild(author);

            let abstract = doc.createElement('p');
            abstract.className = 'abstract';
            abstract.innerText = posts[i].summary;
            form.appendChild(abstract);

            let submit = doc.createElement('input');
            submit.type = 'submit';
            submit.className = 'readmore';
            submit.name = 'readmore';
            submit.value = 'readmore';
            form.appendChild(submit);

            articleWrap.appendChild(form);
            fragment.appendChild(articleWrap);
        }
        return fragment;
    }

    function scrollToTop() {
        let osTop = getScrollTop();
        let ispeed = Math.floor(-osTop / 5);

        setTimeout(function () {
            doc.documentElement.scrollTop = doc.body.scrollTop = osTop + ispeed;
            if (osTop > 0) {
                setTimeout(scrollToTop, 5);
            }
        }, 5);
    }

    function riseOneByOne() {
        var posts = doc.querySelectorAll('.articleWrap');
        let pageHeight = getBrowseInfo.pageHeight;

        for (let i = 0; i < posts.length; i++) {
            setTimeout(function () {
                let top = posts[i].getBoundingClientRect().top;
                //if (top - pageHeight < 0) {
                posts[i].classList.add('fadeIn');
                //}
            }, i * 100);
        }

        // 希望实现依次加载动画
    }

    function successFn(res) {
        res = JSON.parse(res);
        let fragment = createArticle(res);
        article.innerHTML = '';  // 清空当前页面的内容
        article.appendChild(fragment);
        switchClass();
        scrollToTop();
        riseOneByOne();
    }

    function errorFn() {
        alert('error');
    }

    ul.addEventListener('click', async function (e) {
        let curClick = e.target;
        if (curClick.classList.contains('disable')
            || curClick.classList.contains('active')) {
            return;
        }
    
        if (curClick.nodeName === 'LI') {
            if (curClick.innerText === '...') { return; } //点击省略号不刷新
            let curPage = getCurPage();

            if (curClick.classList.contains('prev')) {  // 上一页
                if (curPage !== 1) {
                    let page = curPage - 1;

                    let data = { pages: page }
                    
                    try {
                        let res = await myAjax.post(`/api/jumpTo`, data);
                        history.pushState('', '', page);  // 改变url
                        successFn(res);
                    } catch (err) {
                        errorFn();
                    }

                    refreshLi(page);
                }
            } else if (curClick.classList.contains('next')) {  // 下一页
                if (curPage !== total) {
                    let page = curPage + 1;

                    let data = { pages: page }

                    try {
                        let res = await myAjax.post(`/api/jumpTo`, data);
                        history.pushState('', '', page);  // 改变url
                        successFn(res);
                    } catch (err) {
                        errorFn();
                    }

                    refreshLi(page);
                }

            } else {
                let page = curClick.innerText;
                let data = { pages: page }

                try {
                    let res = await myAjax.post(`/api/jumpTo`, data);
                    history.pushState('', '', page);  // 改变url
                    successFn(res);
                } catch (err) {
                    errorFn();
                }

                refreshLi(page);
            }
        }
    }, false);

    return {
        refreshLi: refreshLi,
        switchClass: switchClass
    }
};


(async function init(){
    try{
        let total = await myAjax.get(`/api/artCnt`);
        total = Number(total);
        let res = operateLi(total);
        let pathname = window.location.pathname;
        let curPage = pathname.substr(7);  // 获得url中的当前页
        curPage = Number(curPage);
        res.refreshLi(curPage);  // 刷新li
        res.switchClass();  // 切换上下页的样式
    } catch (err) {
        alert('get total error');
    }
}());