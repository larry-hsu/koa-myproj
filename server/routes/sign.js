const router = require('koa-router')()
const config = require('./utils/config');
const User = require('../models/user');
const crypto = require('crypto');

router.prefix('/sign')



// 登陆
router.get('/signIn', async (ctx, next) => {
    //已登录的用户直接跳转
    let userId = ctx.cookies.get('userId');

    if (typeof userId !== 'undefined') {
        ctx.redirect(`/user/my`);
    } else {
        await ctx.render('login');
    }
}).post('/signIn', async (ctx, next) => {
    //生成口令的散列值
    let md5 = crypto.createHash('md5');
    let psd = ctx.request.body.password;
    let password = md5.update(psd).digest('base64');
    let username = ctx.request.body.username;
    let user = new User(username, password);

    let rows = await user.get();
    // cookies 加密在koa中的使用？

    if (typeof rows[0] === 'undefined') {
        await ctx.render('login', {
            cuee: '用户不存在'
        });
    } else if (rows[0].password !== password) {
        await ctx.render('login', {
            cuee: '用户名或者密码不正确'
        });
    } else {
        ctx.cookies.set('userId', rows[0].id, config.cookiesOptions);
        ctx.redirect(`/user/my`);
    }
});

//注册
router.get('/signUp', async (ctx, next) => {
    //已登录的用户再次获取注册页面时直接跳转
    let userId = ctx.cookies.get('userId');
    if (userId) {
        ctx.redirect('/user/my');
    }
    else {
        await ctx.render('register');
    }
}).post('/signUp', async (ctx, next) => {
    let psd = ctx.request.body.password;
    let psdr = ctx.request.body.password_repeat;
    console.log('psd', psd);
    console.log('psdr', psdr);
    if (psd !== psdr) {
        await ctx.render('register', { 
            cuee: '两次密码不一致' 
        });
        return;
    }

    let UpLetter = /^[A-Z]/g;
    if (!UpLetter.test(psd)) {
        await ctx.render('register', { 
            cuee: '密码需要大写开头' 
        });
        return;
    }

    if (psd.length < 8) {
        await ctx.render('register', { 
            cuee: '密码需要多于8位' 
        });
        return;
    }

    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(psd).digest('base64');
    let username = ctx.request.body.username;

    let newUser = new User(username, password);
    let random = Math.ceil(Math.random() * 10000000000);
    newUser.nickname = `${username}${random.toString()}`;

    let rows = await newUser.get();
    //检查是否存在
    if (typeof rows[0] === 'undefined') {
        //用户不存在则可以注册
        await newUser.save();
        ctx.redirect('/sign/signIn');
    } else {
        await ctx.render('register', {
            cuee: `用户名 ${rows[0].username} 已经存在`
        });
    }
});

//登出
router.get('/signOut', async (ctx, next) => {
    //登出时要清除cookies
    ctx.cookies.set('userId', null, config.cookiesOptions);
    ctx.cookies.set('id', null, config.cookiesOptions);
    ctx.redirect('/sign/signIn');
});


module.exports = router;