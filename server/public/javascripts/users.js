import { EventUtil } from './modules/AddRemoveEvent.js';

let toDelete = document.getElementsByClassName('xdelete');
let toReset = document.getElementsByClassName('xreset');
let toMember = document.getElementsByClassName('xmember');
let toFish = document.getElementsByClassName('xfish');
let userID = document.getElementsByClassName('userID');

let len = toReset.length;
let id = [];

for (let i = 0; i < len; i++) {
    id[i] = userID[i].value;
}

for (let i = 0; i < len; i++) {
    EventUtil.addHandler(toDelete[i], `click`, function () {
        let flag = window.confirm('确认删除嘛？');
        this.form['apart'].value = 'delete';

        if (flag) {
            // 防止从控制台修改id
            if (this.form['userID'].value != id[i]) {
                alert('somthing wrong!');
            } else {
                this.form.submit();
            }
        }
    });


    EventUtil.addHandler(toReset[i], `click`, function () {
        this.form['apart'].value = 'reset';
        let flag = window.confirm('密码将重置为123456');

        if(flag) {
            // 防止从控制台修改id
            if (this.form['userID'].value != id[i]) {
                alert('somthing wrong!');
            } else {
                this.form.submit();
            }
        }
    });

    EventUtil.addHandler(toMember[i], `click`, function () {
        this.form['apart'].value = 'member';

        // 防止从控制台修改id
        if (this.form['userID'].value != id[i]) {
            alert('somthing wrong!');
        } else {
            this.form.submit();
        }
    });

    EventUtil.addHandler(toFish[i], `click`, function () {
        this.form['apart'].value = 'fish';
        
        // 防止从控制台修改id
        if (this.form['userID'].value != id[i]) {
            alert('somthing wrong!');
        } else {
            this.form.submit();
        }
    });
}