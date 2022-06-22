
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
                            mainActive = "menu-is-opening menu-open";
                        }
                    } else {
                        activeSubMenuClass = "";
                    }

                    if (link.has_sub > 0 && link.parent_name == "0") {
                        menuBar += "<li class='nav-item " + mainActive + "' id='"+link.page_name+"_main_li'>" +
                                        "<a href='"+link.url+"' class='nav-link "+activeMainMenuLink+"' id='"+link.page_name+"_main_a'>" +
                                            "<i class='nav-icon "+link.icon+"'></i>"+
                                            "<p>"+link.page_label+" <i class='right fas fa-angle-left'></i></p>"+
                                        "</a>"+
                                        "<ul class='nav nav-treeview' id='"+link.page_name+"'></ul>"+
                                    "</li>";


                    } else if (link.has_sub == 0 && link.parent_name == "0") {
                        menuBar += "<li class='nav-item " + activeMainMenuLink + "'>" +
                                        "<a href='"+link.url+"' class='nav-link "+mainActive+"'>" +
                                            "<i class='nav-icon "+link.icon+"'></i>"+
                                            "<p>"+link.page_label+"</p>"+
                                        "</a>"+
                                    "</li>";
                    } else if (link.has_sub == 0 && link.parent_name != "0") {
                        parent_id = "#"+link.parent_name;
                        subMenu += "<li class='nav-item'>"+
                                        "<a href='"+link.url+"' class='nav-link "+activeSubMenuClass+"'>"+
                                            "<i class='"+link.icon+" nav-icon'></i>"+
                                            "<p>"+link.page_label+"</p>"+
                                        "</a>"+
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

