/**
 * Created by Administrator on 2017/2/13.
 */
var interRender = (function () {
    var aUl = document.querySelector('ul');
    function bindHtml(data){
        var str = '';
        for(var i=0;i<data.length;i++){
            var cur = data[i];
            str+='<li>'+
                '<span>'+cur.id+'</span>'+
                '<span>'+cur.name+'</span>'+
                '<span>'+
                '<a href="detail.html?id='+cur.id+'">修改</a>'+
                '<a href="javascript:;" data-id="'+cur.id+'">删除</a>'+
                '</span>'+
                '</li>'
        }
        aUl.innerHTML=str;
    }
    function delete1(){
        aUl.onclick=function(e){
            e=e||window.event;
            var target = e.target||e.srcElement;
            if(target.tagName.toUpperCase()=='A' && target.innerHTML=='删除'){
                var dataId = target.getAttribute('data-id');
                var flag = confirm('你确定要删除'+dataId+'的信息吗');
                if(flag){
                    ajax('/removeInfo',{
                        cache:false,
                        data:{
                            id:dataId
                        },
                        success:function(res){
                            if(res && res.code==0){
                                alert('删除成功');
                                aUl.removeChild(target.parentNode.parentNode)
                            }else{
                                alert('删除失败')
                            }
                        }
                    })
                }
            }
        }
    }
    return {
        init: function () {
            ajax('/getAllList',{
                cache:false,
                success:function(res){
                    if(res && res.code==0){
                        bindHtml(res.data);
                        delete1();
                    }
                }
            })
        }
    }
})();
interRender.init();