const getConnection = require('../settings');

class Draft {
    constructor(author, articleName, imgSrc, summary, content, oldAuthor='null') {
        this.author = author;
        this.articleName = articleName;
        this.postTime = postTime;
        this.imgSrc = imgSrc;
        this.summary = summary;
        this.content = content;
        this.oldAuthor = oldAuthor;
    }

    save() {
        return new Promise((resolve, reject)=>{
            getConnection().then(conn=>{
                let sql = `INSERT INTO drafts VALUES(NULL, '${this.articleName}', 
                        CURRENT_TIMESTAMP, '${this.imgSrc}', '${this.author}', 
                        '${this.summary}', '${this.content}')`;

                conn.query(sql, function (err, rows, field) {
                    if (err) reject(err);
                    else resolve(rows.insertId);
                });
                conn.release();
            }).catch(err=>{
                conn.release();
                throw err;
            });
        });
    }

    get() {
        return new Promise((resolve, reject)=>{
            getConnection().then(conn=>{
                let sql = `SELECT * FROM drafts WHERE id='${this.id}'`;
                conn.query(sql, function (err, rows, field) {
                    if (err) reject(err);
                    if (rows[0] === undefined) {
                        resolve('undefined');
                    } else {
                        resolve(rows[0]);
                    }
                });
                conn.release();
            }).catch(err=>{
                conn.release();
                throw err;
            });        
        });
    }

    getDraftByAuthor() {
        return new Promise((resolve, reject)=>{
            getConnection().then(conn=>{
                let sql = `SELECT * FROM drafts WHERE author='${this.author}'`;
                conn.query(sql, function (err, rows, field) {
                    if (err) reject(err);
                    else if(rows) resolve(rows);
                    else resolve('undefined');
                });
                conn.release();
            }).catch(err=>{
                conn.release();
                throw err;
            });
        });
    }

    getAll() {
        return new Promise((resolve, reject)=>{
            getConnection().then(conn=>{
                let sql = `SELECT * FROM drafts Order by drafts.postTime desc`;
                conn.query(sql, function (err, rows, field) {
                    if (err) reject(err);
                    else resolve(rows);
                });
                conn.release();
            }).catch(err=>{
                conn.release();
                throw err;
            });
        });
    }

    updated() {
        return new Promise((resolve, reject)=>{
            getConnection().then(conn=>{
                let sql, data;

                if(this.imgSrc != '') {
                    sql = `UPDATE drafts SET articleName = ?, imgSrc = ?, 
                        summary=?, content=? WHERE drafts.id= ?`;
                    data = [this.articleName, this.imgSrc, this.summary, 
                        this.content, this.id];
                } else {
                    sql = `UPDATE drafts SET articleName = ?, summary=?, 
                        content=? WHERE drafts.id= ?`;
                    data = [this.articleName, this.summary, this.content, 
                        this.id];
                }
                
                conn.query(sql, data, function (err, rows, field) {
                    if (err) reject(err);
                    else resolve(rows);
                });
                conn.release();
            }).catch(err=>{
                conn.release();
                throw err;
            });
        });
    }

    updateAuthor() {
        return new Promise((resolve, reject)=>{
            getConnection().then(conn=>{
                let sql = `UPDATE drafts SET author=? WHERE author=?`;
                let data = [this.author, this.oldAuthor];

                conn.query(sql, data, function (err, rows, field) {
                    if (err) reject(err);
                    else resolve(rows);
                });
                conn.release();
            }).catch(err=>{
                conn.release();
                throw err;
            });
        });
    }

    delete() {
        return new Promise((resolve, reject)=>{
            getConnection().then(conn=>{
                let sql = `DELETE FROM drafts WHERE id='${this.id}'`;
                conn.query(sql, function (err, rows, field) {
                    if (err) reject(err);
                    else resolve(rows);
                });
                conn.release();
            }).catch(err=>{
                conn.release();
                throw err;
            });
        });
    }
}


module.exports = Draft;
