const router = require('koa-router')()
const Article = require('../models/article');


router.prefix('/article');

// 浏览文章
router.post('/', async (ctx, next) => {
    //转到具体的文章页
    let id = ctx.request.body.id;
    ctx.redirect(`/article/${id}`);
}).get(`/:articleId`, async (ctx, next) => {
    //要使用req.params获得路径中的参数
    let id = Number(ctx.params.articleId);
    let article = new Article(id);

    let rows = await article.get();

    if (rows[0] === 'undefined') {
        await ctx.render('notfound');
    } else {
        await ctx.render('article', {
            tmp_content: rows[0].content,
            author: rows[0].author,
            title: rows[0].articleName
        });
    }
});



module.exports = router;