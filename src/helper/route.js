/**
 * 其中stat、readdir用到了异步
 * stat调取文件状态
 * fs.stat(path[,options], callback)
 * readdir读取目录的内容
 * fs.readdir(path[,options], callback)
 */
/**
 * util.promisify(original)
 * 传入一个遵循常见的错误优先的回调风格函数（即以 (err, value) => ... 回调作为最后一个参数），并返回一个返回promise的版本
 */
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const conf = require('../config/defaultConfig');
const tplPath = path.join(__dirname, '../template/dir.tpl');
// readFileSync读出的是一个Buffer，可以在后面强制utf-8，或者强制toString()。
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

module.exports = async function(filePath, req, res) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filePath).pipe(res);
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(conf.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files: files
            };
            res.end(template(data));
        }
    } catch (ex) {
        console.error(ex);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file\n ${ex.toString()}`);
    }
};