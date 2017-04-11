/**
 * Created by Administrator on 2017/2/13.
 */

(function (pro) {
    function myquery() {
        var reg = /([^?&#=]+)=([^?&#=]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2]
        });
        return obj;
    }
    pro.myquery = myquery
})(String.prototype);
var Rengder1 = (function () {
    var userName = document.getElementById('text');
    var submit = document.getElementById('submit');
    function bindEvent(id) {
        var val = userName.value;
        if (typeof id !== 'undefined') {
            ajax('/updateInfo', {
                method: 'post',
                data: {
                    id: id,
                    name: val
                },
                success: function (res) {
                    if (res && res.code == 0) {
                        alert('success');
                        window.location.href = 'index.html'
                    }
                }
            });
            return
        }
        ajax('/addInfo', {
            method: 'post',
            data: {
                name: val
            },
            success: function (res) {
                if (res && res.code == 0) {
                    alert('success');
                    window.location.href = 'index.html'
                }
            }
        })

    }

    return {
        init: function () {
            var obj1 = window.location.href.myquery(),
                customId = obj1['id'];
            if (typeof customId !== 'undefined') {
                ajax('/getInfo', {
                    cache: false,
                    data: {
                        id: customId
                    },
                    success: function (res) {
                        if (res && res.code == 0) {
                            res = res.data;
                            userName.value = res.name;
                        }
                    }
                })
            }
            submit.onclick = function () {
                bindEvent.call(this, customId)
            }
        }
    }
})();
Rengder1.init();