import {EventUtil} from './modules/AddRemoveEvent.js';
import {$} from './modules/ajax.js';

let post = document.getElementById('post');
let nickname = document.getElementById('nickname');
let signature = document.getElementById('signature');

const oldNickName = nickname.value;
const oldSignature = signature.value;
let N_flag = 0;
let S_flag = 0;

// 只要有一个修改了就使得按钮生效
function lightUp(dom) {
    if(N_flag || S_flag) {
        dom.className = 'available';
        dom.disabled = ''; 
    }
}
// 全部未修改，按钮失效
function lightOff(dom) {
    if(!N_flag && !S_flag) {
        dom.className = 'unavailable';
        dom.disabled = 'disabled';
    }
}

EventUtil.addHandler(nickname, 'input', function() {
    // 笔名不为空且和之前的不同
    if(nickname.value && nickname.value !== oldNickName) {
        N_flag = 1;
        lightUp(post);
    }else {
        N_flag = 0;
        lightOff(post);
    }
});

EventUtil.addHandler(signature, 'input', function(){
    // 笔名不为空且签名和之前的不同
    if(nickname.value && signature.value !== oldSignature) {
        S_flag = 1;
        lightUp(post);
    }else {
        S_flag = 0;
        lightOff(post);
    }
});


EventUtil.addHandler(post, 'click', function() {
    if(nickname.value) {
        if(nickname.value === oldNickName) {
            var data = {
                signature: signature.value
            }
        }else {
            var data = {
                nickname: nickname.value,
                signature: signature.value
            }
        }
        $.ajax({
            type: 'POST',
            url: '/user/edit_data',
            data:data,
            success: function(res){
                alert(res);
            },
            error: function(){
                alert('该笔名已被占用，重新设置一个吧');
            }
        });
        //form.submit();
    } else {
        alert('笔名为空');
    }
});


