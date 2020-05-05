const User = require('../models/user');

let user = new User();
user.nickname = 'larry';

async function query (ctx, next){
    let result = await user.getNickName();
    console.log(result);
}

query();