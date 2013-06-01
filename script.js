(function($) {
    var suffix = conf.suffix
    ,expr = conf.expr
    ,getSvnBox = function(lastTime){
        return '<table cellpadding="2" cellspacing="0" border="0" width="100%">\
        <tbody>\
        <tr><td bgcolor="#f0f0f0"><b>Files Changed</b><font color="#999933" style="margin-left:20px;">'+lastTime+'</font></td></tr>\
        <tr><td bgcolor="#ffffff" id="'+expr.fid+'"></td></tr>\
        </tbody></table>';
    }
    ,checkMore = function() {
        ccf.wait(function(){
            ccf.click('.plugin_subversion_showmore_issuetab_button');
            checkMore();
        }, '.plugin_subversion_showmore_issuetab_button:visible');
    }
    ,initBtn = function() {
        var btnId = 'js-get-svn-files';
        $(expr.svnTab).html('<strong><a id="'+btnId+'" href="javascript:void(0);" title="'+suffix.join('|')+'">提取SVN文件</a></strong>');
        $('#'+btnId).click(function(){
            var files = '',lastTime='';
            $(expr.svnBox).find('table').each(function(){
                var $td = $(this).find('tr:eq(3) td');
                if($td.size()) {
                    files += $td.html();
                }
                var d = fmtDate($(this).find('tr:eq(1) td:eq(2)').html());
                if(lastTime<d) {
                    lastTime=d;
                }
            });
            if(!files) {
                return true;
            }
            showFiles(files, lastTime);
            return false;
        });
    }
    ,fmtDate = function(str) { //'Wed May 08 15:25:35 CST 2013'
        var mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']
        ,   arr = str.split(' ')
        ,   m = $.inArray(arr[1], mons)+1;
        
        return arr[5]+'-'+(m<10?'0':'')+m+'-'+arr[2]+' '+arr[3];
    }
    ,isValidFile = function(file) {
        for(var i in suffix) {
            if(file.indexOf(suffix[i])>-1) {
                return true;
            }
        }
        return false;
    }
    ,getResFiles = function(files) {
        var arr = files.split('<br>'),modify={};
        $.each(arr, function(i, s){
            s = $.trim(s);
            var delIndex = s.indexOf('DEL');
            s = $.trim(s.replace(/<font.*font>/, ''));
            if(!isValidFile(s)) {
                return true;
            }
            var res = s.match(/^\/(\w+)\//);
            if(!res) {
                return true;
            }
            var resName = res[1];
            modify[resName] = modify[resName] || [];

            s = s.replace(/^\/(\w+)\//, '');
            s = s.replace(/\s.*$/, '');
            s = $.trim(s);

            if(delIndex>-1 && delIndex<60) {
                var modifyIndex = $.inArray(s, modify[resName]);
                if( modifyIndex != -1) {
                    modify[resName].splice(modifyIndex, 1);
                }
            } else if($.inArray(s, modify[resName]) == -1) {
                modify[resName].push(s);
            }
        });
        return modify;
    }
    ,showFiles = function(files, lastTime) {
        if($('#'+expr.fid).size() == 0) $(expr.svnBox).prepend(getSvnBox(lastTime));

        var tmp = getResFiles(files), $files = $('#'+expr.fid).empty();

        ;
        $.each(tmp, function(resName, items){
            if(resName == 'trunk') {
                resName = 'ganji_v3';
            }
            $files.append(resName+'<br/>---<br/>');
            $files.append(items.sort().join('<br/>'));
            $files.append('<br/><br/>');
        });
    }
    ,init = function(){
        if(!$(expr.svnTab).is('.active')) {
            return true;
        }
        initBtn();
        checkMore();
    };

     /****************run****************/ 
     ccf.wait(init, expr.svnTab);
})(jQuery);
