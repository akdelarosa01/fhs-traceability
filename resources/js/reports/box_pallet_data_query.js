"use strict";

(function() {
    const BoxPalletDataQuery = function() {
        return new BoxPalletDataQuery.init();
    }
    BoxPalletDataQuery.init = function() {
        $D.init.call(this);
        this.$tbl_data_search = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    BoxPalletDataQuery.prototype = {
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
                        url: "/reports/grease-data-query/generate-data",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.search_type = $('#search_type').val();
                            d.search_value = $('#search_value').val();
                            d.max_count = $('#max_count').val();
                            d.grease_date_from = $('#grease_date_from').val();
                            d.grease_date_to = $('#grease_date_to').val();
                            d.exp_date_from = $('#exp_date_from').val();
                            d.exp_date_to = $('#exp_date_to').val();
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
                        { data: 'grease_date', name: 'grease_date', title: 'Grease Date' },
                        { data: 'model_code', name: 'model_code', title: 'Model Code' },
                        { data: 'hs_serial', name: 'hs_serial', title: 'H.S. Serial' },
                        { data: 'container_no', name: 'container_no', title: 'Container No.' },
                        { data: 'grease_batch_no', name: 'grease_batch_no', title: 'Grease Batch No.' },
                        { data: 'grease_model', name: 'grease_model', title: 'Grease Model' },
                        { data: 'grease_exp_date', name: 'grease_exp_date', title: 'Expiration Date' },
                        { data: 'yield_count', name: 'yield_count', title: 'Yield Count' },
                        { data: 'bin_count', name: 'bin_count', title: 'Bin Count' },
                        { data: 'remarks', name: 'remarks', title: 'Remarks' },
                        { data: 'work_user', name: 'work_user', title: 'Work User' },
                        { data: 'machine_no', name: 'machine_no', title: 'Machine No.' }
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
    BoxPalletDataQuery.init.prototype = $.extend(BoxPalletDataQuery.prototype, $D.init.prototype);
    BoxPalletDataQuery.init.prototype = BoxPalletDataQuery.prototype;

    $(document).ready(function() {
        var _BoxPalletDataQuery = BoxPalletDataQuery();
        _BoxPalletDataQuery.permission();
        _BoxPalletDataQuery.drawDatatables();

        $('.dataTables_scrollBody').on('scroll', function() {
            _BoxPalletDataQuery.$tbl_data_search.fixedHeader.adjust();
        });

        $('#grease_date_from').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#grease_date_to').attr('min', e.currentTarget.value);
        });

        $('#grease_date_to').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#grease_date_from').attr('max', e.currentTarget.value);
        });

        $('#btn_search').on('click', function() {
            
            var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_type').val();
            if (search_type !== "" && search_value == "") {
                _BoxPalletDataQuery.swMsg("Please Provide a the type of data to search","warning");
            } else {
                _BoxPalletDataQuery.$tbl_data_search.ajax.reload(false);
            }
            
        });

        $('#btn_export').on('click', function() {
            var link = '/reports/grease-data-query/download-excel?_token='+ _BoxPalletDataQuery.token;
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