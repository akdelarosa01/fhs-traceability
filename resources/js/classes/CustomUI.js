/*****************************************
A. Name: Custom UI Class
B. Synopsis: Class Module used to Create custom UI features
***********************************************/
;
(function() {
    const CustomUI = function() {
        return new CustomUI.init();
    }
    CustomUI.init = function() {
        this.dataTableID = "";
        this.notifTable = "";
    }
    CustomUI.prototype = {
        setDatatableMaxHeight: function() {
            if (this.dataTableID) {
                var $closestDiv = $(this.dataTableID).closest(".col-sm-12");
                if ($closestDiv.length) {
                    var eTop = $($closestDiv).offset().top;
                    var windowHeight = $(window).height();
                    var containerID = this.dataTableID + "-container";
                    var adjust = $(this.dataTableID).data("adjust") || 0;
                    var pagingHeight = $(this.dataTableID + "_wrapper .pagination").height();
                    var divHeight = windowHeight - eTop - 30 - pagingHeight + adjust;
                    var containerHeight = divHeight;

                    $($closestDiv).attr("id", containerID.replace('#', ''));
                    $($closestDiv).css("max-height", containerHeight + "px");
                    $($closestDiv).addClass("fixed-tblcontainer");
                } else if ($("#tblPriceEstimation_filter").length) {
                    var eTop = $("#tblPriceEstimation_filter").offset().top;
                    var windowHeight = $(window).height();
                    var containerID = this.dataTableID + "-container";
                    var adjust = $(this.dataTableID).data("adjust") || 0;
                    var pagingHeight = $(this.dataTableID + "_wrapper .pagination").height();
                    var divHeight = windowHeight - eTop - 70 - pagingHeight + adjust;
                    var containerHeight = divHeight;
                    if (!$(".tbl-container-here").length) $(this.dataTableID).wrap("<div class='tbl-container-here'></div>");
                    $(".tbl-container-here").attr("id", containerID.replace('#', ''));
                    $(".tbl-container-here").css("max-height", containerHeight + "px");
                    $(".tbl-container-here").addClass("fixed-tblcontainer");
                }
            }
        },
        setDatatableMaxHeightFixed: function() {
            var self = this;
            if (this.dataTableID) {
                var $closestDiv = $(this.dataTableID + "_wrapper");
                if ($closestDiv.length) {
                    var eTop = $($closestDiv).offset().top || 0;
                    var windowHeight = $(window).height() || 0;
                    var containerID = this.dataTableID + "-container" || 0;
                    var adjust = $(this.dataTableID).data("adjust") || 0 || 0;
                    var pagingHeight = $(this.dataTableID + "_wrapper .pagination").height() || 0;
                    var divHeight = 0;
                    var docWidth = $(document).width() || 0;

                    if (docWidth >= 767)
                        divHeight = windowHeight - eTop - 70 - pagingHeight + adjust;
                    else if (docWidth >= 576 && docWidth < 767)
                        divHeight = windowHeight - eTop - pagingHeight + adjust;
                    else if (docWidth < 576)
                        divHeight = windowHeight - eTop - pagingHeight + adjust;
                    if ($(this.dataTableID + " > tfoot").length || $(this.dataTableID + " > thead").length)
                        divHeight = divHeight - 31;
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").css("height", "100%");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").css("max-height", divHeight + "px");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").attr("data-scrollbar", true);
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").attr("data-height", divHeight + "px");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").attr("data-width", $(this.dataTableID + "_wrapper").width() + "px");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").slimScroll({
                        height: (divHeight + "px"),
                        width: ($(this.dataTableID + "_wrapper").width() + "px"),
                        size: '20px',
                    });
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.slimScrollDiv > div.dataTables_scrollBody").css("overflow", "");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.slimScrollDiv > div.dataTables_scrollBody").css("overflow-x", "auto");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.slimScrollDiv > div.dataTables_scrollBody").css("overflow-y", "hidden");
                    $(this.dataTableID + ">tbody>tr:nth-child(1)>td").each(function() {
                        var tdIndex = $(this).index();
                        var tdWidth = $(this).width();
                        var $headerTable = $(self.dataTableID).closest(".dataTables_scroll").find(".table").first();
                        $headerTable.find("tr").each(function() {
                            $(this).find("th").each(function() {
                                var thIndex = $(this).index();
                                if (tdIndex == thIndex) {
                                    $(this).css("width", tdWidth + "px");
                                }
                            });
                        });
                    });
                }
            }
        },
        setDivMaxHeight: function(ID) {
            if (ID) {
                if (ID.length) {
                    var eTop = $(ID).offset().top;
                    var windowHeight = $(window).height();
                    var adjust = $(ID).data("adjust") || 0;
                    var divHeight = windowHeight - eTop - 70 + adjust;
                    var containerHeight = divHeight;
                    $(ID).css("max-height", containerHeight + "px");
                    $(ID).css("overflow-y", "auto");
                }
            }
        },
        createSelectOption: function(selectOptionsList) {
            var options = "<option value=''>--Please Select--</option>";
            if (selectOptionsList.length) {
                $.each(selectOptionsList, function(i, x) {
                    options += '<option value="' + x.value + '">' + x.text + '</option>';
                });
            }
            return options;
        },
        createSelect2: function(arrID, arrList) {
            var self = this;
            $.each(arrID, function(i, val) {
                if (arrList[i].length > 0) {
                    $(val).html(self.createSelectOption(arrList[i]));
                }
                $(val).select2({
                    placeholder: '--Please Select--',
                    allowClear: true
                });
            })
        },
        clearCustomError: function(id) {
            $("#" + id).removeClass("input-error");
            $("#err-" + id).text("");
            $("#err-" + id).removeClass("text-danger")
        },
        openCreatePanel: function() {
            var bodyID = $(".btnCreateData").data("panelbodyid");
            $(bodyID).show();
            $(bodyID).removeClass("tago");
            $(".btnCreateData")[0].children[0].className = "fa fa-minus";
            $(".btnCreateData").prop("title", "Collapse");
            this.setDatatableMaxHeight();
        },
        closeCreatePanel: function() {
            var bodyID = $(".btnCreateData").data("panelbodyid");
            $(bodyID).hide();
            $(bodyID).addClass("tago");
            $(".btnCreateData")[0].children[0].className = "fa fa-plus";
            $(".btnCreateData").prop("title", "Create");
            this.setDatatableMaxHeight();
        }
    }
    CustomUI.init.prototype = CustomUI.prototype;
    return window.CustomUI = window.$UI = CustomUI;
}());

const CUI = $UI();
$(document).ready(function() {
    $(window).resize(function() {
        CUI.setDatatableMaxHeight();
    });
    $('.tabs-with-datatable .nav-tabs a').on('shown.bs.tab', function(event) {
        CUI.dataTableID = "#tbl" + $(this).attr("href").replace("#", "");
        if ($.fn.DataTable.isDataTable(CUI.dataTableID)) {
            CUI.setDatatableMaxHeight();
        }
    });
    if ($("#iziModalError").length) {
        $(document).on('closing', '#iziModalError', function(e) {
            window.location.href = "/login";
        });
    }
    $('#loading_modal').on('hidden.bs.modal', function() {
        if ($('.modal:visible').length) {
            $('body').addClass('modal-open');
        }
    });
});