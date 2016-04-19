/*
    参照http://chenxi.name/60.html写的一个小爬虫

*/ 
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var requrl = "http://sucai.redocn.com/tupian/301666.html";
/*
*  调用request模块生成请求 
*/
request(requrl, function (error, response, body) {
  //检测能否正常获取
  if (!error && response.statusCode == 200) {
    acquireData(body);
}
})
 
function acquireData(data) {
    //cheerio与jsdom类似，能像jQuery那样去解释获取回来的HTML
    var $ = cheerio.load(data);
    var img = $('img').toArray();
    var len = img.length;
    for (var i=0; i<len; i++) {
        //发现返回来的img数组并不能调用jquery的API获取src
        var imgsrc = img[i].attribs.src;
        var filename = parseUrlForFileName(imgsrc);  //生成文件名
        //提供回调显示已经完成的图片
        downloadImg(imgsrc,filename,function() {
            console.log(filename + ' done');
        });
    }
}
/*
    解析图片的名字，通过提取src路径中的basename
 */
function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}
//一定要自己新建images文件夹，不然会显示no such dir
var downloadImg = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
    if (err) {
        console.log('err: '+ err);
        return false;
    }
    console.log('res: '+ res);
    request(uri).pipe(fs.createWriteStream('images/'+filename)).on('close', callback);  //调用request的管道来下载到 images文件夹下
    });
};
 