import { EventUtil } from './modules/AddRemoveEvent.js';

let toDelete = document.getElementsByClassName('xdelete');
let toAlter = document.getElementsByClassName('xalter');
let postID = document.getElementsByClassName('postID');

let len = toAlter.length;
let id = [];

for (let i = 0; i < len; i++) {
    id[i] = postID[i].value;
}

for (let i = 0; i < len; i++) {
    EventUtil.addHandler(toAlter[i], 'click', function (e) {
        this.form['apart'].value = 'alter';

        // 防止从控制台修改id
        if (this.form['id'].value != id[i]) {
            alert('somthing wrong!');
        } else {
            this.form.submit();  // this等于事件的目标元素
        }
    });

    EventUtil.addHandler(toDelete[i], 'click', function (e) {
        let flag = window.confirm('确认删除嘛？');
        this.form['apart'].value = 'delete';

        if (flag) {
            if (this.form['id'].value != id[i]) {
                alert('somthing wrong!');
            } else {
                this.form.submit();
            }
        }
    });
}

