/**
 * Created by Administrator on 2017/2/10.
 */
var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server2 = http.createServer(function(req,res){
    var urlObj = url.parse(req.url,true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/html';
        suffix === 'CSS' ? suffixMIME = 'text/css' : (suffix === 'JS' ? suffixMIME = 'text/javascript' : 'text/html');
        var conFile = 'i am sorry',
            status = 404;
        try {
            conFile = fs.readFileSync('.' + pathname, 'utf-8');
            status = 200;
        } catch (e) {

        }
        res.writeHead(status, {'content-type': suffixMIME + ';charset=utf-8;'});
        res.end(conFile);
        return;
    }

    //--API
    var customData = fs.readFileSync('./json/custom.json','utf-8');
    customData=customData.length==0?'[]':customData;
    customData=JSON.parse(customData);
    var result = {code:1,msg:'error',data:null};

    //suoyou
    if(pathname=='/getAllList'){
        if(customData.length>0){
            result={
                code:0,
                msg:'success',
                data:customData
            }
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    //zengjia
    if(pathname=='/addInfo'){
        var aaa = '';
        req.on('data',function(chuan){
            aaa+=chuan;
        });
        req.on('end',function(){
            aaa=format(aaa);
            aaa['id']=customData.length===0?1:parseFloat(customData[customData.length-1]['id'])+1;
            customData.push(aaa);
            fs.writeFileSync('./json/custom.json',JSON.stringify(customData),'utf-8');
            result={
                code:0,
                msg:'success'
            };
            res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
            res.end(JSON.stringify(result))
        });
        return;
    }

    //xiugai
    if(pathname=='/updateInfo'){
        var bbb = '';
        req.on('data',function(chuan){
            bbb+=chuan
        });
        req.on('end',function(){
            bbb=format(bbb);
            customData.forEach(function(item,index){
                if(bbb['id']==item['id']){
                    customData[index]=bbb;
                    return false;
                }
            });
            fs.writeFileSync('./json/custom.json',JSON.stringify(customData),'utf-8');
            result={
                code:0,
                msg:'success'
            };
            res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
            res.end(JSON.stringify(result))
        });
        return;
    }

    //zhiding
    if(pathname=='/getInfo'){
        var cId = query['id'];
        customData.forEach(function(item,index){
            if(item['id']==cId){
                result={
                    code:0,
                    msg:'success',
                    data:customData[index]
                };
                return false;
            }
        });
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    if(pathname==='/removeInfo'){
        cId = query['id'];
        customData.forEach(function(item,index){
            if(item['id']==cId){
                customData.splice(index,1);
                fs.writeFileSync('./json/custom.json',JSON.stringify(customData),'utf-8');
                result={
                    code:0,
                    msg:'success'
                }
            }
        });
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result))
    }
});
server2.listen(80,function(){
    console.log('ok')
});
function format(str){
    var reg = /([^&]+)=([^&]+)/g,
        obj={};
    str.replace(reg,function(){
        obj[arguments[1]]=arguments[2]
    });
    return obj;
}