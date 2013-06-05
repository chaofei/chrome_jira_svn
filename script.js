(function($) {
    var suffix = conf.suffix
    ,expr = conf.expr
    ,ele = conf.ele
    ,getSvnBox = function(lastTime){
        return '<table cellpadding="2" cellspacing="0" border="0" width="100%">\
        <tbody>\
        <tr><td bgcolor="#f0f0f0">\
            <b>Files Changed</b><font color="#999933" style="margin-left:20px;">'+lastTime+'</font>\
            <label style="float:right;color:#009900;"><input type="checkbox"/> 加版本号</label>\
        </td></tr>\
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
                var ver = $(this).find('tr:eq(1) td:eq(1)').html();
                if($td.size()) {
                    files += $td.html().replace(/\n/g,' ').replace(/\s{4,}/g,' ').replace(/<br>/g,'<ver>'+ver+'</ver>|');
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
    },
    getVer = function(s){
        var res = s.match(/<ver>(\d+)<\/ver>/);
        if(!res) {
            return 0;
        }
        return ~~res[1];
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
        var arr = files.split('|'),modify={};
//ccf.log(arr);//debug
        $.each(arr, function(i, s){
            var isDel = ele.isDel(s);
            var ver = getVer(s);
            var file = ele.clear(s);
            if(!isValidFile(file)) {
                return true;
            }
            var res = file.match(/^\/(\w+)\//);
            if(!res) {
                return true;
            }
            var resName = res[1];
            modify[resName] = modify[resName] || {};

            file = file.replace(/^\/(\w+)\//, '').replace(/\s.*$/, '');

            if(isDel) {
                delete(modify[resName][file]);
            } else if(!modify[resName][file] || modify[resName][file] < ver) {
                modify[resName][file] = ver;
            }
        });
        var ret = {};
        for(var resName in modify) {
            var arr = [];
            for(var file in modify[resName]) {
                arr.push(file+'<span class="'+expr.svnver+'" style="display:none;"> -r '+modify[resName][file]+'</span>');
            }
            if(resName == 'trunk') {
                resName = 'ganji_v3';
            }
            ret[resName] = arr;
        }
        return ret;
    }
    ,showFiles = function(files, lastTime) {
        if($('#'+expr.fid).size() == 0) {
            $(expr.svnBox).prepend(getSvnBox(lastTime))
            .find(':checkbox').click(function(){
                if($(this).is(":checked")) {
                    $('.'+expr.svnver).show();
                } else {
                    $('.'+expr.svnver).hide();
                }
            });
        }

        var tmp = getResFiles(files), $files = $('#'+expr.fid).empty();

        $.each(tmp, function(resName, items){
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
