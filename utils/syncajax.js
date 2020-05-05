function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
        createXHR = function () {
            return new XMLHttpRequest();
        };
    } else if (typeof ActiveXObject != "undefined") {
        createXHR = function () {
            if (typeof arguments.callee.activeXString != "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                    "MSXML2.XMLHttp"], i, len;
                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    } catch (ex) {
                        //pass
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString);
            }
        };
    } else {
        createXHR = function () {
            throw new Error("No XHR object available.");
        };
    }
    return createXHR();
}

const myAjax = {
    get: function (url, data) {
        return new Promise((resolve, reject) => {
            if (!url) {
                console.error('请输入请求地址')
                return;
            }

            let query = [];

            for (let key in data) {
                query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
            }

            query = query.join('&');

            const xhr = createXHR();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    const status = xhr.status;
                    if (status >= 200 && status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(status);
                    }
                }
            }

            if(query) {
                url = `${url}?${query}`
            }

            xhr.open('GET', url, true);
            xhr.send(null);
        });
    },

    post: function (url, data) {
        return new Promise((resolve, reject) => {
            if (!url) {
                console.error('请输入请求地址')
                return;
            }

            let query = [];

            if (typeof data !== 'undefined') {
                for (let key in data) {
                    query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
                }
                query = query.join('&');
            }

            const xhr = createXHR();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    const status = xhr.status;
                    if (status >= 200 && status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(status);
                    }
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(query);
        });

    }
}

export { myAjax }

