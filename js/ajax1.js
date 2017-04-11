/**
 * Created by Administrator on 2017/2/10.
 */
~function () {
    function check(val,type){
        var a = Object.prototype.toString.call(val);
        type='[object '+type+']';
        return a.toUpperCase()==type.toUpperCase()
    }
    function format(obj){
        var res = '';
        for(var attr in obj){
            if(obj.hasOwnProperty(attr)){
                res+=attr+'='+obj[attr]+'&'
            }
        }
        res=res.substring(0,res.length-1);
        return res
    }
    function ajax(url,opt){
        var defaultOpt = {
            method:'get',
            url:null,
            async:true,
            cache:true,
            data:null,
            dataType:'json',
            success:null
        };
        if(typeof url == 'string'){
            defaultOpt.url=url
        }else if(check(url,'object')){
            opt=url;
            url=undefined;
        }
        for(var attr in opt){
            if(opt.hasOwnProperty(attr)){
                if(attr=='type'){
                    defaultOpt['method']=opt['type'];
                    continue
                }
                defaultOpt[attr]=opt[attr]
            }
        }
        var isMark=false;
        defaultOpt.url.indexOf('?')>=0?isMark=true:null;
        var chart='?';
        isMark?chart='&':null;
        if(defaultOpt.data){
            check(defaultOpt.data,'object')?defaultOpt.data=format(defaultOpt.data):null;
            if(/^(get|head|delete)$/i.test(defaultOpt.method)){
                defaultOpt.url+=chart+defaultOpt.data;
                defaultOpt.data=null;
                isMark=true;
                chart='&';
            }
        }
        if(/^(get|head|delete)$/i.test(defaultOpt.method) && defaultOpt.cache==false){
            defaultOpt.url+=chart+'_='+Math.random()
        }
        var xhr = new XMLHttpRequest();
        xhr.open(defaultOpt.method,defaultOpt.url,defaultOpt.async);
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4&&xhr.status==200){
                var result = xhr.responseText;
                switch (defaultOpt.dataType.toUpperCase()){
                    case 'JSON':
                        result='JSON' in window?JSON.parse(result):eval('('+result+')');
                        break;
                    case 'XML':
                        result=xhr.responseXML;
                        break;
                }
                defaultOpt.success&&defaultOpt.success.call(xhr,result)
            }
        };
        xhr.send(defaultOpt.data)
    }
    window.ajax=ajax;
}();