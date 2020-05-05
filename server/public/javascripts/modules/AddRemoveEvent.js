import {client} from './client.js';

let EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + handler] = handler;
        }
    },

    getEvent: function (event) {
        return event ? event : window.event;
    },

    getTarget: function (event) {
        return event.target || event.srcElement;
    },

    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    removeHandler: function (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },

    stopPropagation: function (event) {
        if (event.stopPrapagation) {
            event.stopPrapagation();
        } else {
            event.cancelBubble = true;
        }
    },

    getButton: function (event) {
        if (document.implementation.hasFeature("MouseEnvents", "2.0")) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 1;
                case 4:
                    return 2;
            }
        }
    },

    getClipboardText: function (event) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },

    setClipboardText: function (event, value) {
        if (event.clipboardData) { // 非IE中
            event.clipboardData.setData("text/plain", value);
        } else if (window.clipboardData) { // IE中
            window.clipboardData.setData("text", value);
        }
    },

    getWheelDelta: function(event) {
        if(event.wheelDelta) {
            return (client.engine.opera && client.engine.opera < 9.5 ?
            -event.wheelDelta : event.wheelDelta);
        } else {
            return -event.detail * 40;
        }
    }


};

export {EventUtil};


