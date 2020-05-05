const router = require('koa-router')()
const Article = require('../models/article');
const Time = require('./utils/fomatTime');

router.prefix('/archives')


// archives page
router.get('/', async (ctx, next) => {
    let article = new Article();

    let result = await article.getAll();

    let archives = [];
    let year = [];
    // 发表日期
    for (let i = 0; i < result.length; i++) {
        let tmp = result[i].postTime;
        year[i] = Time.getYear(tmp);
    }

    year = [...new Set(year)];

    // 处理数据
    for (let i = 0; i < year.length; i++) {
        let post = new Object();
        let index = 0;

        post.year = year[i];

        for (let j = 0; j < result.length; j++) {
            let tmpTime = result[j].postTime;
            let temYear = Time.getYear(tmpTime);
            tmpTime = Time.getMonthAndDay(tmpTime);
            let tmpTitle = result[j].articleName;

            if (temYear === year[i]) {
                post[`article${index}`] = `${tmpTime} ${tmpTitle}`;
                index++;
            }
        }

        archives.push(post);
        /*
          archives = [
            {
              year: year,
              article1: article1,
              article2: article2,
            },
            {
              year: year,
              article1: article1,
              article2: article2,
            }
          ]
        */
    }
    await ctx.render('archives', {
        postNumber: result.length,
        archives: archives
    });
});

module.exports = router;