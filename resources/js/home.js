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
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    Home.prototype = {
        permission: function() {
            var self = this;
            $('.read-only').each(function(i,x) {
                $state = (self.read_only)? true : false;
                $(x).prop('disabled',$state);
            });
        },
        showMenu: function(menuObj) {
            menuObj = JSON.parse(menuObj)

            menuObj.sort((a, b) => {
                return a.id - b.id;
            });

            var HomeMenu = "";

            $.each(menuObj, function(i, x) {
                if (x.url != "#") {
                    var parent_name = (x.parent_name == 0)? "Transaction" : x.parent_name;
                    var color_div = "";
                    switch (x.parent_name) {
                        case "Reports":
                            color_div = "bg-red";
                            break;

                        case "MasterMaintenance":
                            color_div = "bg-blue";
                            break;
                    
                        default:
                            color_div = "bg-info";
                            break;
                    }

                    HomeMenu +='<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12">'+
                    '<div class="widget widget-stats '+color_div+'">'+
                    '<div class="stats-icon"><i class="'+x.icon+'"></i></div>'+
                    '<div class="stats-info">'+
                    '<h4>'+parent_name+'</h4>'+
                    '<p>'+x.page_label+'</p>'+
                    '</div>'+
                    '<div class="stats-link">'+
                    '<a href="'+x.url+'">Go to module <i class="fa fa-arrow-alt-circle-right"></i></a>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                }
            });
            $('#HomeMenu').html(HomeMenu);
        }
    }
    Home.init.prototype = $.extend(Home.prototype, $D.init.prototype);
    Home.init.prototype = Home.prototype;

    $(document).ready(function() {
        var _Home = Home();
        _Home.permission();
        _Home.showMenu($("#hdnMenu").val());
    });
})();




window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };
