(function($) {
    ccf = new function() {
        return {
            log : function(str) {
                console.log(str);
            }
            ,click : function(expr) {
                $(expr).get(0).click();
            }
            ,format : function(str, value) {
                return str.replace(/\{([^{}]+)\}/g, function (match, capture){
                    var temp = value[capture];
                    return temp === undefined ? "" : temp;
                });
            }
            ,wait : function(callback, expr, lazyTime) {
                if (typeof callback != 'function') {
                    alert('wait params error');
                    return;
                }
                
                var when = null;
                if (typeof expr == 'string') {
                    when = function(){return $(expr).size()>0;};
                } else if(typeof expr == 'function') {
                    when = expr;
                } else {
                    return false;
                }
                
                var lazycount = 0
                   ,_lazy = function() {
                    if (when()) {
                        callback();
                        return false;
                    }
                    if(lazycount++>10000) return false;
                    return setTimeout(_lazy, 10);
                };
                lazyTime = lazyTime || 10;
                setTimeout(_lazy, lazyTime);
            }
        };
    };
})(jQuery);
