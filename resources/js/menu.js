

// const menu_list = () => {
//     $.ajax({
//         dataType: 'json',
//         type: 'GET',
//         url: '/helpers/menu_list',
//     }).done( function(response, textStatus, xhr) {
//         var url = window.location.href;
//         var currentlUrl = url.replace("http://"+window.location.hostname,'');
//         var menu = response.data;

//         if (menu.length) {
//             drawUserMenu(menu, currentlUrl);
//             // if (menu.replace(" ", "") != "") {
//             //     drawUserMenu(JSON.parse(menu), currentlUrl);
//             // }
//         }
//     }).fail( function(xhr, textStatus, errorThrown) {

//     }).always( function() {

//     });
// }


const drawUserMenu = (menu,currentlUrl) => {
    const tmpForParentMenu = menu;
    const tmpForSubMenu = menu;
    //var sortedMenu = _.sortBy(menu, function(o) { return o.category; }, ['asc']);
    var arrGroupedData = _.mapValues(_.groupBy(menu, 'parent_menu'), (function(clist) {
        return clist.map(function(byCategory) {
            return _.omit(byCategory, 'parent_menu');
        });
    }));
    //console.log(arrGroupedData)
    var AccessType = 0;
    var DeleteEnabled = 0;
    var activeMainMenuLink = "";
    var activeSubMenuClass = "";
    
    var activeMainElement = '';

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
                            mainActive = "menu-open";
                        }
                    } else {
                        activeSubMenuClass = "";
                    }

                    if (link.has_sub > 0 && link.parent_name == "0") {
                        menuBar += "<li class='nav-item " + mainActive + "'>" +
                                        "<a href='"+link.url+"' class='nav-link'>" +
                                            "<i class='nav-icon "+link.icon+"'></i>"+
                                            "<p>"+link.page_label+" <i class='right fas fa-angle-left'></i></p>"+
                                        "</a>"+
                                        "<ul class='nav nav-treeview' id='"+link.page_name+"'></ul>"+
                                    "</li>";


                    } else if (link.has_sub == 0 && link.parent_name == "0") {
                        menuBar += "<li class='nav-item " + mainActive + "'>" +
                                        "<a href='"+link.url+"' class='nav-link "+activeSubMenuClass+"'>" +
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
            });
            $("#menuBar").append(menuBar);
            $(parent_id).append(subMenu);


                
            //}

            // switch (i) {
            //     case "System Maintenance":
            //         menuBar += "<li class='has-sub " + activeMainMenuClass + "' id='SystemMaintenance'>\
            //                         <a href='javascript:;'>\
            //                             <b class='caret'></b>\
            //                             <i class='fa fa-cogs'></i>\
            //                             <span>System Maintenance</span>\
            //                         </a>\
            //                         <ul class='sub-menu'>";

            //         $.each(groupedMainMenu, function(indx, link) {
            //             if (currentlUrl.includes(link.url)) {
            //                 activeSubMenuClass = "active";
            //                 if (mainActive == '') {
            //                     mainActive = "active";
            //                 }
            //             } else {
            //                 activeSubMenuClass = "";
            //             }

            //             AccessType = (link.access == 0) ? 0 : 1;

            //             if (AccessType) {
            //                 menuBar += "<li class='" + activeSubMenuClass + "'>\
            //                                     <a href='" + link.url + "'>" + link.title + "</a>\
            //                                 </li>";
            //             }
            //         });

            //         menuBar += "    </ul>";
            //         menuBar += "</li>";

            //         if (mainActive == 'active') {
            //             activeMainElement = '#SystemMaintenance';
            //         }
            //         break;

            //     case "Transaction":
            //         menuBar += "<li class='has-sub " + activeMainMenuClass + "' id='Transaction'>\
            //                         <a href='javascript:;'>\
            //                             <b class='caret'></b>\
            //                             <i class='fa fa-database'></i>\
            //                             <span>Transaction</span>\
            //                         </a>\
            //                         <ul class='sub-menu'>";

            //         $.each(groupedMainMenu, function(indx, link) {
            //             if (currentlUrl.includes(link.url)) {
            //                 activeSubMenuClass = "active";
            //                 if (mainActive == '') {
            //                     mainActive = "active";
            //                 }
            //             } else {
            //                 activeSubMenuClass = "";
            //             }

            //             AccessType = (link.access == 0) ? 0 : 1;

            //             if (AccessType) {
            //                 menuBar += "<li class='" + activeSubMenuClass + "'>\
            //                                     <a href='" + link.url + "'>" + link.title + "</a>\
            //                                 </li>";
            //             }
            //         });

            //         menuBar += "    </ul>";
            //         menuBar += "</li>";

            //         if (mainActive == 'active') {
            //             activeMainElement = '#Transaction';
            //         }
            //         break;

            //     case "Reports":
            //         menuBar += "<li class='nav-item " + activeMainMenuClass + "' id='Reports'>" +
            //                         "<a href='#' class='nav-link active'>" +
            //                             "<i class='nav-icon fas fa-tachometer-alt'></i>"+
            //                             "<p>Reports <i class='right fas fa-angle-left'></i></p>"+
            //                         "</a>"+
            //                         "<ul class='nav nav-treeview'>";

            //         $.each(groupedMainMenu, function(indx, link) {
            //             if (currentlUrl.includes(link.url)) {
            //                 activeSubMenuClass = "active";
            //                 if (mainActive == '') {
            //                     mainActive = "active";
            //                 }
            //             } else {
            //                 activeSubMenuClass = "";
            //             }

            //             AccessType = (link.authorize == 0) ? 0 : 1;

            //             if (AccessType) {
            //                 menuBar += "<li class='nav-link " + activeSubMenuClass + "'>"+
            //                                     "<a href='" + link.url + "'>"+
            //                                         "<i class='" + link.icon + " nav-icon'></i>"+
            //                                         "<p>" + link.page_label + "</p>"+
            //                                     "</a>"+
            //                                 "</li>";
            //             }
            //         });

            //         menuBar += "    </ul>";
            //         menuBar += "</li>";

            //         if (mainActive == 'active') {
            //             activeMainElement = '#Reports';
            //             $(activeMainElement).addClass("menu-open");
            //             $(activeMainElement + '.nav-link').addClass(mainActive);
            //         }
            //         break;

            //     default:
            //         break;
            // }
        }
    });
    
    $(".has-sub").removeClass("active");
    
}

$( function() {
    // menu_list();
    var menu = $("#hdnMenu").val();
    var currentlUrl = $("#hdnMenu").data("currurl");

    if ($("#hdnMenu").length) {
        if (menu.replace(" ", "") != "") {
            drawUserMenu(JSON.parse(menu),currentlUrl);
        }
    }
    
});

