"use strict";

(function() {
    const Home = function() {
        return new Home.init();
    }
    Home.init = function() {
        $D.init.call(this);
        this.$tbl_dashboard = "";
        this.ID = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
    }
    Home.prototype = {
        init: function() {},
        showMenu: function(menuObj) {
            menuObj = JSON.parse(menuObj)

            menuObj.sort((a, b) => {
                return a.id - b.id;
            });

            var HomeMenu = "";

            $.each(menuObj, function(i, x) {
                if (x.url != "#") {
                    var parent_name = (x.parent_name == 0)? "Transaction" : x.parent_name;
                    HomeMenu += "<div class='col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12'>"+
                    "<a href='"+x.url+"' class='info-box'>"+
                    "<span class='info-box-icon bg-info'><i class='"+x.icon+"'></i></span>"+
                    "<div class='info-box-content'>"+
                    "<span class='info-box-text'>"+parent_name+"</span>"+
                    "<span class='info-box-number'>"+x.page_label+"</span>"+
                    "</div>"+
                    "</a>"+
                    "</div>";
                }
            });

            $('#HomeMenu').html(HomeMenu);
        }
    }
    Home.init.prototype = $.extend(Home.prototype, $D.init.prototype);
    Home.init.prototype = Home.prototype;

    $(document).ready(function() {
        var _Home = Home();

        _Home.showMenu($("#hdnMenu").val());
    });
})();




window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };
