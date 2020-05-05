const router = require('koa-router')()
const config = require('./utils/config');
const User = require('../models/user');
const Article = require('../models/article');
const Time = require('./utils/fomatTime');
const crypto = require('crypto');
const koaBody = require('koa-body');
const path = require('path');
const fs = require('fs');

router.prefix('/user')


// 获得个人中心页面
// 页面权限控制
// 使用cookie签名后要使用signedCookies访问
router.get('/my', async (ctx, next) => {
  //未登录的用户跳转到登陆页面
  let userId = ctx.cookies.get('userId');

  if (typeof userId === 'undefined') {
    ctx.redirect('/sign/signIn');
  } else {
    let user = new User();
    user.id = ctx.cookies.get('userId');
    let result = await user.getById();
    // user页面根据limit的不同而展示不同的页面
    await ctx.render('personal', {
      limit: result[0].admin,
      succ: result[0].nickname,
      signature: result[0].signature
    });
  }
});


// 修改个人资料，普通用户没有该入口
router.get('/edit_data', async (ctx, next) => {
  let userId = ctx.cookies.get('userId');
  if (typeof userId === 'undefined') {
    ctx.redirect('/sign/signIn');
  } else {
    let newUser = new User();
    newUser.id = userId;
    let result = await newUser.getById();
    let limit = result[0].admin;
    if (limit > 1) {
      await ctx.render('editData', {
        limit: limit,
        nickname: result[0].nickname || '还未设置哦',
        signature: result[0].signature,
      });
    } else {
      await ctx.render('notfound');
    }
  }
}).post('/edit_data', async (ctx, next) => {  // 提交修改
  //res.send('success');
  let userId = ctx.cookies.get('userId');
  if (typeof userId === 'undefined') {
    ctx.redirect('/sign/signIn');
  } else {
    let user = new User();

    user.id = userId;
    user.signature = ctx.request.body.signature;
    nickname = ctx.request.body.nickname;

    // 存在笔名
    if (nickname) {
      user.nickname = nickname;
      try {
        let rows = await user.getNickName();
      } catch (e) {
        await ctx.render('error', {
          err: 'bad operator with database'
        })
      }

      // 笔名重复
      if (typeof rows[0] !== 'undefined') {
        ctx.status = 403;
        ctx.body = '笔名重复';
      } else {
        // 笔名未重复
        try {
          let result = await user.getById();
        } catch (e) {
          await ctx.render('error', {
            err: 'bad operator with database'
          })
        }

        let article = new Article();
        article.oldAuthor = result[0].nickname;
        article.author = nickname;
        try {
          await article.updateAuthor(); // 先更新文章中的作者
          await user.updated(); // 再更新用户的昵称
        } catch (e) {
          await ctx.render('error', {
            err: 'bad operator with database'
          })
        }

        ctx.body = '更新成功';
      }
    } else {
      // 笔名没有更新，只更新签名
      try {
        await user.updateSign();
      } catch (e) {
        await ctx.render('error', {
          err: 'bad operator with database'
        })
      }
      ctx.body = '更新成功';
    }
  }
});

// 到达发表文章的页面
router.get('/write', async (ctx, next) => {
  //未登录的用户跳转到登陆页面
  let userId = ctx.cookies.get('userId');
  if (typeof userId === 'undefined') {
    ctx.redirect('/sign/signIn');
  } else {
    let newUser = new User();
    newUser.id = userId;

    let result = await newUser.getById();
    let limit = result[0].admin;
    if (limit > 1) {
      await ctx.render('writeArticle', {
        limit: limit,
        author: result[0].nickname
      });
    } else {
      await ctx.render('notfound');
    }
  }
}).post('/write', koaBody(config.upFileOptions),
  async (ctx, next) => {
    // console.log(req.files);
    let title = ctx.request.body.title;
    let author = ctx.request.body.author;
    let summary = ctx.request.body.summary;
    let content = ctx.request.body.content;
    let imgSrc = '';

    const file = ctx.request.files.file1;
    console.log(file);

    // todo：没有文件上传时会生成一个0kb的文件
    if (file.size != 0) {
      // 拿到后缀名
      let extname = path.extname(file.name);
      // 拼接新的文件路径，文件加上后缀名
      let newPath = file.path + extname;
      // imgSrc = /images/xxx.jpg
      // 重命名
      fs.rename(file.path, newPath, function (err) {
        if (err) {
          throw new Error('rename fail');
        }
      });

      imgSrc = newPath.replace(/\\/g, '/').substr(6);
    }

    let flag = Boolean(title.length)
      && Boolean(author.length)
      && Boolean(summary.length)
      && Boolean(content.length);

    if (!flag) {
      ctx.redirect('/user/write');
    } else {
      let newArt = new Article(null, title, imgSrc, author, summary, content);
      await newArt.save();
      ctx.redirect('/user/MyPost');
    }
  });

// 获取我自己发表过的文章
router.get('/MyPost', async (ctx, next) => {
  let userId = ctx.cookies.get('userId');

  function handleResult(result) {
    for (let i = 0; i < result.length; i++) {
      let tmp = result[i].postTime;
      result[i].postTime = Time.getFormatTime(tmp);
      tmp = result[i].author;
      result[i].author = tmp.substr(0, 1).toUpperCase()
        + tmp.substr(1); // 首字母大写
    }
  }

  if (typeof userId === 'undefined') {
    ctx.redirect('/sign/signIn');
  } else {
    let newUser = new User();
    let newArt = new Article();
    newUser.id = userId;

    let result = await newUser.getById();

    let limit = result[0].admin;
    newArt.author = result[0].nickname;  // result是一个数组
    if (limit == 1) {
      await ctx.render('notfound');
    }
    else if (limit == 2) {
      let result = await newArt.getArticleByAuthor();
      handleResult(result);
      await ctx.render('MyPost', {
        limit: limit,
        articleNum: result.length,
        article: result
      });
    }
    // 超级管理员可以获得所有的文章
    else if (limit == 3) {
      let result = await newArt.getAll();
      handleResult(result);
      await ctx.render('MyPost', {
        limit: limit,
        articleNum: result.length,
        article: result
      });
    }
  }
}).post('/MyPost', async (ctx, next) => {
  let userId = ctx.cookies.get('userId');

  if (typeof userId === 'undefined') {
    ctx.redirect('/sign/signIn');
  } else {
    let id = ctx.request.body.id;
    let apart = ctx.request.body.apart;
    let article = new Article(id);

    if (apart == 'delete') {
      try {
        await article.delete();
        ctx.redirect('/user/MyPost');
      } catch (e) {
        await ctx.render('error', {
          err: 'bad operator with database'
        })
      }

    } else if (apart = 'alter') {
      ctx.cookies.set('id', id, config.cookiesOptions);
      ctx.redirect('/user/alter');
    }
  }
});

// 进入修改文章的页面
router.get('/alter', async (ctx, next) => {
  let userId = ctx.cookies.get('userId');
  let id = ctx.cookies.get('id');
  if (typeof userId === 'undefined') {
    ctx.redirect('/sign/signIn');
  } else if (typeof id === 'undefined') {  // 没有修改文章的id
    ctx.redirect('/user/my');
  } else {
    let article = new Article(id);
    let user = new User();
    user.id = userId;

    let result = await user.getById();
    let rows = await article.get();

    await ctx.render('alter', {
      limit: result[0].admin,
      imgSrc: rows[0].imgSrc,
      author: rows[0].author,
      title: rows[0].articleName,
      summary: rows[0].summary,
      content: rows[0].content,
    });
  }
}).post('/alter', koaBody(config.upFileOptions),
  async (ctx, next) => {
    let id = ctx.cookies.get('id'); //req.signedCookies.id;
    let content = ctx.request.body.content;
    let title = ctx.request.body.title;
    let summary = ctx.request.body.summary;
    let imgSrc = '';

    const file = ctx.request.files.file1;

    // todo：没有文件上传时会生成一个0kb的文件
    if (file.size != 0) {
      // 拿到后缀名
      let extname = path.extname(file.name);
      // 拼接新的文件路径，文件加上后缀名
      let newPath = file.path + extname;
      // imgSrc = /images/xxx.jpg
      // 重命名
      fs.rename(file.path, newPath, function (err) {
        if (err) {
          throw new Error('rename fail');
        }
      });

      imgSrc = newPath.replace(/\\/g, '/').substr(6);
    }

    let flag = Boolean(title.length)
      && Boolean(summary.length)
      && Boolean(content.length);

    if (!flag) {
      ctx.redirect('/user/write');
    } else {
      let newArt = new Article(id);
      newArt.abstract = summary;
      newArt.imgSrc = imgSrc;
      newArt.content = content;
      newArt.title = title;

      await newArt.updated();
      ctx.redirect('/user/MyPost');
    }
  });

// 管理用户
router.get('/person', async (ctx, next) => {
  let userId = ctx.cookies.get('userId');
  if (typeof userId === 'undefined') {
    ctx.redirect('/sign/signIn');
  } else {
    let user = new User();
    user.id = userId;

    let result = await user.getById();
    let limit = result[0].admin;

    if (limit != 3) {
      await ctx.render('notfound');
    }
    else {
      let result = await user.getAllUser();
      await ctx.render('users', {
        limit: limit,
        users: result,
      });
    }
  }
}).post('/person', async (ctx, next) => {
  let userId = ctx.cookies.get('userId');

  if (typeof userId === 'undefined') {
    ctx.redirect('/sign/signIn');
  } else {
    let userId = ctx.request.body.userID;
    let apart = ctx.request.body.apart;
    let user = new User();
    user.id = userId;

    if (apart == 'delete') {
      await user.delete();
      ctx.redirect('/user/person');
    } else if (apart == 'member') {
      await user.setMember();
      ctx.redirect('/user/person');
    } else if (apart == 'fish') {
      await user.setFish();
      ctx.redirect('/user/person');
    } else if (apart == 'reset') {
      //生成口令的散列值
      let md5 = crypto.createHash('md5');
      let password = md5.update(`123456`).digest('base64');
      user.password = password;
      await user.resetPassword();
      ctx.redirect('/user/person');
    }
  }
});

module.exports = router
