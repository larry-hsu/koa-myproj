const router = require('koa-router')();
const Article = require('../models/article');
const Time = require('./utils/fomatTime');

router.prefix('/api');

// 获取li个数数供给ajax调用
router.get('/artCnt', async (ctx, next) => {
    let articles = new Article();
    let result = await articles.getAll();
    const len = result.length;
    const eachPageNum = 5;
    const total = Math.ceil(len / eachPageNum).toString();
    ctx.body = total;
});

// ajax提交刷新页面
router.post('/jumpTo', async (ctx, next) => {
    let articles = new Article();
    const pageNum = 5;

    let page = ctx.request.body.pages;

    // 是在模板中渲染页面的
    let result = await articles.getAll();
    let len = result.length;

    for (let i = 0; i < len; i++) {
        tmp = result[i].postTime;
        result[i].postTime = Time.getFormatTime(tmp);
    }

    if (page * pageNum <= len) {
        // slice包含开头不包含结尾
        result = result.slice(pageNum * (page - 1), pageNum * page);
    } else {
        result = result.slice(pageNum * (page - 1));
    }

    result = JSON.stringify(result);
    
    ctx.body = result;
});

module.exports = router;