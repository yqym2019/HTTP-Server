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
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

module.exports = async function(filePath, req, res) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            fs.createReadStream(filePath).pipe(res);
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(files.join(','));
        }
    } catch (ex) {
        console.error(ex);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file\n ${ex.toString()}`);
    }
};