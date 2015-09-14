$(window).bind('beforeunload', function() {
    deleteCookie('broj_procesa');
}); 

$(document).ready(function() {
        $('a[rel!=ext]').click(function() { window.onbeforeunload = null; });
        $('form').submit(function() { window.onbeforeunload = null; });
    });