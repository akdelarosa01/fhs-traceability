"use strict";

(function() {
    const Model = function() {
        return new Model.init();
    }
    Model.init = function() {
        $D.init.call(this);
        this.$tbl_models = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.model_checked = 0;
    }
    Model.prototype = {
        init: function() {},
        drawDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_models')) {
                self.$tbl_models = $('#tbl_models').DataTable({
                    processing: true,
                    ajax: {
                        url: "/masters/model-matrix/list",
                        dataType: "JSON",
                        error: function(response) {
                            console.log(response);
                        }
                    },
                    deferRender: true,
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No data available in table",
                        info: "Showing _START_ to _END_ of _TOTAL_ records",
                        infoEmpty: "No records found",
                        infoFiltered: "(filtered1 from _MAX_ total records)",
                        lengthMenu: "Show _MENU_",
                        search: "Search:",
                        zeroRecords: "No matching records found",
                        paginate: {
                            "previous": "Prev",
                            "next": "Next",
                            "last": "Last",
                            "first": "First"
                        }
                    },
                    pageLength: 10,
                    order: [
                        [6, "desc"]
                    ],
                    columns: [{
                            data: function(x) {
                                return '<input type="checkbox" class="table-checkbox check_model" value="' + x.id + '">';
                            },
                            name: 'id',
                            searchable: false,
                            orderable: false
                        },
                        {
                            data: 'action',
                            name: 'action',
                            orderable: false,
                            searchable: false
                        },
                        { data: 'model', name: 'model' },
                        { data: 'model_name', name: 'model_name' },
                        { data: 'box_count_per_pallet', name: 'box_count_per_pallet' },
                        { data: 'create_user', name: 'create_user' },
                        { data: 'updated_at', name: 'updated_at' },
                    ],
                    rowCallback: function(row, data) {
                        var td = $(row).find('td:first .check_model');
                        if (td.is(':checked')) {
                            self.model_checked++;
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        if (data.is_deleted === 1) {
                            $(row).css('background-color', '#ff6266');
                            $(row).css('color', '#fff');
                        }
                    },
                    initComplete: function() {
                        $('.check_all_models').prop('checked', false);
                    },
                    fnDrawCallback: function() {
                        if (self.model_checked > 9) {
                            $('.check_all_models').prop('checked', true);
                        } else {
                            $('.check_all_models').prop('checked', false);
                        }
                        self.checkCheckboxesInTable('#tbl_models', '.check_all_models', '.check_model');
                        self.checkAllCheckboxesInTable('#tbl_models', '.check_all_models', '.check_model');
                        $("#tbl_models").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                    self.model_checked = 0;
                });
            }
            return this;
        },
    }
    Model.init.prototype = $.extend(Model.prototype, $D.init.prototype);
    Model.init.prototype = Model.prototype;

    $(document).ready(function() {
        var _Model = Model();
        _Model.drawDatatables();
        
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };