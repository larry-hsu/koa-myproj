import {EventUtil} from './modules/AddRemoveEvent.js';

let password = document.getElementById('password');
let pass_rep = document.getElementById('password-repeat');

EventUtil.addHandler(password, 'input', function(e){
    let tip = document.getElementById('pass-tip');
    let retip = document.getElementById('repass-tip');
    let UpLetter = /^[A-Z]/g;

    if(!UpLetter.test(password.value)){
        tip.innerHTML = '需要大写字符开头';
    }else if(password.value.length < 8) {
        tip.innerHTML = '密码需要多于8位';
    }else {
        tip.innerHTML = '';
    }

    if(!password.value.length) tip.innerHTML = '';

    if(pass_rep.value){
        if(pass_rep.value !== password.value) {
            retip.innerHTML = '两次密码不同';
        }else {
            retip.innerHTML = '';
        }
    }
});

EventUtil.addHandler(pass_rep, 'input', function(e){
    let tip = document.getElementById('repass-tip');

    if(pass_rep.value !== password.value) {
        tip.innerHTML = '两次密码不同';
    }else {
        tip.innerHTML = '';
    }

    if(!pass_rep.value.length) tip.innerHTML='';
});

