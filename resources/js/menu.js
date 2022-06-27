
const drawUserMenu = (menu,currentlUrl) => {
    const tmpForParentMenu = menu;
    const tmpForSubMenu = menu;
    //var sortedMenu = _.sortBy(menu, function(o) { return o.category; }, ['asc']);
    var arrGroupedData = _.mapValues(_.groupBy(menu, 'parent_menu'), (function(clist) {
        return clist.map(function(byCategory) {
            return _.omit(byCategory, 'parent_menu');
        });
    }));
    
    var activeMainMenuLink = "";
    var activeSubMenuClass = "";

    $.each(arrGroupedData, function(i, groupedMainMenu) {
        if (i) {
            var mainActive = '';
            var menuBar = "";
            var subMenu = "";
            var parent_id = "";
            $.each(groupedMainMenu, function(indx, link) {
                if (i == link.parent_name) {
                    if (currentlUrl.includes(link.url)) {
                        activeSubMenuClass = "active";
                        if (mainActive == '') {
                            activeMainMenuLink = "active";
                            mainActive = "active";
                        }
                    } else {
                        activeSubMenuClass = "";
                    }

                    if (link.has_sub > 0 && link.parent_name == "0") {
                        menuBar += "<li class='has-sub " + mainActive + "' id='"+link.page_name+"_main_li'>" +
                                        "<a href='"+link.url+"' id='"+link.page_name+"_main_a'>" +
                                            "<b class='caret'></b>"+
                                            "<i class='"+link.icon+"'></i>"+
                                            "<span>"+link.page_label+"</span>"+
                                        "</a>"+
                                        "<ul class='sub-menu' id='"+link.page_name+"'></ul>"+
                                    "</li>";


                    } else if (link.has_sub == 0 && link.parent_name == "0") {
                        menuBar += "<li class='" + activeMainMenuLink + "'>" +
                                        "<a href='"+link.url+"'>" +
                                            "<i class='"+link.icon+"'></i>"+
                                            "<span>"+link.page_label+"</span>"+
                                        "</a>"+
                                    "</li>";
                    } else if (link.has_sub == 0 && link.parent_name != "0") {
                        parent_id = "#"+link.parent_name;
                        subMenu += "<li>"+
                                        "<a href='"+link.url+"'>"+link.page_label+"</a>"+
                                    "</li>";
                    }


                }

                $("#menuBar").append(menuBar);
                $(parent_id).append(subMenu);
                $(parent_id+"_main_li").addClass(mainActive);
                $(parent_id+"_main_a").addClass(activeMainMenuLink);

                menuBar="";
                subMenu="";
                parent_id="";
                mainActive="";
                activeMainMenuLink="";
            });
            
        }
    });
}

var menu = $("#hdnMenu").val();
var currentlUrl = $("#hdnMenu").data("currurl");

if ($("#hdnMenu").length) {
    if (menu.replace(" ", "") != "") {
        drawUserMenu(JSON.parse(menu),currentlUrl);
    }
}

