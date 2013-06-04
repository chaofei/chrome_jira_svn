var conf = {
    suffix : ['.php', '.js', '.css', '.html', '.htm', '.bmp', '.jpg', '.png', '.gif'],
    ele: {
        isDel:function(s){
            var delIndex = s.indexOf('DEL');
            return (delIndex>-1 && delIndex<60);
        },
        clear:function(s){
            return $.trim(s.replace(/<font.*?font>/g, '').replace(/<ver.*?ver>/g, ''));
        }
    },
    expr : {
        svnBox : '#issue_actions_container',
        svnTab : '#subversion-commits-tabpanel',
        fid : 'js-svn-files'
    }
};