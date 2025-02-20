"use strict";

(function() {
    const PackagingDataQuery = function() {
        return new PackagingDataQuery.init();
    }
    PackagingDataQuery.init = function() {
        $D.init.call(this);
        this.$tbl_data_search = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    PackagingDataQuery.prototype = {
        permission: function() {
            var self = this;
            $('.read-only').each(function(i,x) {
                $state = (self.read_only == 1)? true : false;
                $(x).prop('disabled',$state);
            });
        },
        drawDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_data_search')) {
                self.$tbl_data_search = $('#tbl_data_search').DataTable({
                    processing: true,
                    scrollY: 500,
                    scrollX: true,
                    scrollCollapse: true,
                    paging: false,
                    lengthChange: false,
                    fixedHeader: {
                        header: true,
                    },
                    dom: 'Bfrtip',
                    buttons: [
                        'csv', 'excel'
                    ],
                    ajax: {
                        url: "/reports/packaging-data-query/generate-data",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.search_type = $('#search_type').val();
                            d.search_value = $('#search_value').val();
                            d.max_count = $('#max_count').val();
                            d.packaging_date_from = $('#packaging_date_from').val();
                            d.packaging_date_to = $('#packaging_date_to').val();
                        },
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
                    //pageLength: 10,
                    order: [
                        [0, "desc"]
                    ],
                    columns: [
                        { data: 'packaging_date', name: 'packaging_date', title: 'Packaging Date' },
                        { data: 'machine_no', name: 'machine_no', title: 'Machine No.' },
                        { data: 'model_code', name: 'model_code', title: 'Model Code' },
                        { data: 'hs_serial', name: 'hs_serial', title: 'H.S. Serial' },
                        { data: 'box_no', name: 'box_no', title: 'Box No.' },
                        { data: 'work_order', name: 'work_order', title: 'Work Order' },
                        { data: 'lot_no', name: 'lot_no', title: 'Lot No.' },
                        { data: 'old_hs_serial', name: 'old_hs_serial', title: 'Old H.S. Serial' },
                        { data: 'change_date', name: 'change_date', title: 'Change Date' },
                        { data: 'leader_in_charge', name: 'leader_in_charge', title: 'Leader In Charge' },
                        { data: 'remarks', name: 'remarks', title: 'Remarks' },
                        { data: 'operator', name: 'operator', title: 'Operator' },
                    ],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                    },
                    fnDrawCallback: function() {
                        //$("#tbl_data_search").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                });

                self.$tbl_data_search.buttons().container().appendTo( '#tbl_data_search_wrapper .col-md-6:eq(0)' );
            }
            return this;
        },
    }
    PackagingDataQuery.init.prototype = $.extend(PackagingDataQuery.prototype, $D.init.prototype);
    PackagingDataQuery.init.prototype = PackagingDataQuery.prototype;

    $(document).ready(function() {
        var _PackagingDataQuery = PackagingDataQuery();
        _PackagingDataQuery.permission();
        _PackagingDataQuery.drawDatatables();

        $('.dataTables_scrollBody').on('scroll', function() {
            _PackagingDataQuery.$tbl_data_search.fixedHeader.adjust();
        });

        $('#packaging_date_from').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#packaging_date_to').attr('min', e.currentTarget.value);
        });

        $('#packaging_date_to').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#packaging_date_from').attr('max', e.currentTarget.value);
        });

        $('#btn_search').on('click', function() {
            
            var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_type').val();
            if (search_type !== "" && search_value == "") {
                _PackagingDataQuery.swMsg("Please Provide a the type of data to search","warning");
            } else {
                _PackagingDataQuery.$tbl_data_search.ajax.reload(false);
            }
            
        });

        $('#btn_export').on('click', function() {
            var link = '/reports/packaging-data-query/download-excel?_token='+ _PackagingDataQuery.token;
            window.location.href = link;
        });
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };