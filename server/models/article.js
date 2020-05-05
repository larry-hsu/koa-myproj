const query = require('../async-db');

class Article {
    constructor(id, title, imgSrc, author, abstract, content, oldAuthor='null') {
        this.id = id;
        this.title = title;
        this.imgSrc = imgSrc;
        this.author = author;
        this.abstract = abstract;
        this.content = content;
        this.oldAuthor = oldAuthor;
    }

    async save() {
        let sql = `INSERT INTO articles VALUES(NULL, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?)`;
        let data = [this.title, this.imgSrc, this.author, this.abstract, this.content];
        let res = await query(sql, data);
        return res;
    }

    async get() {
        let sql = `SELECT * FROM articles WHERE id='${this.id}'`;
        let rows = await query(sql);
        return rows; // rows是一个数组
    }

    async getArticleByAuthor() {
        let sql = `SELECT * FROM articles WHERE author=? 
            Order BY articles.postTime desc`;
        let data = [this.author];
        let rows = await query(sql, data);
        return rows;
    }

    async getAll() {
        let sql = `SELECT * FROM articles Order by articles.postTime desc`;
        let rows = await query(sql);
        return rows;
    }

    async updated() {
        let sql, data;

        if(this.imgSrc != ''){
            sql = `UPDATE articles SET articleName = ?, imgSrc = ?, 
                summary=?, content=? WHERE articles.id= ?`;
            data = [this.title, this.imgSrc, this.abstract, 
                this.content, this.id];
        }else {
            sql = `UPDATE articles SET articleName = ?, summary=?, 
                content=? WHERE articles.id= ?`;
            data = [this.title, this.abstract, this.content, this.id];
        }
        
        let rows = await query(sql, data);
        return rows;
    }

    async updateAuthor() {
        let sql = `UPDATE articles SET author=? WHERE author=?`;
        let data = [this.author, this.oldAuthor];

        let rows = await query(sql, data);
        return rows;
    }

    async delete() {
        let sql = `DELETE FROM articles WHERE id='${this.id}'`;
        let rows = await query(sql);
        return rows;
    }
}

module.exports = Article;
