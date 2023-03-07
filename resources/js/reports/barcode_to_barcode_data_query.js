"use strict";

(function() {
    const BarcodeToBarcodeDataQuery = function() {
        return new BarcodeToBarcodeDataQuery.init();
    }
    BarcodeToBarcodeDataQuery.init = function() {
        $D.init.call(this);
        this.$tbl_data_search = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    BarcodeToBarcodeDataQuery.prototype = {
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
                        url: "/reports/barcode-to-barcode-data-query/generate-data",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.search_type = $('#search_type').val();
                            d.search_value = $('#search_value').val();
                            d.max_count = $('#max_count').val();
                            d.transfer_date_from = $('#transfer_date_from').val();
                            d.transfer_date_to = $('#transfer_date_to').val();
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
                        { data: 'transfer_date', name: 'transfer_date', title: 'Transfer Date' },
                        { data: 'model_code', name: 'model_code', title: 'Model' },
                        { data: 'old_barcode', name: 'old_barcode', title: 'Old Barcode' },
                        { data: 'new_barcode', name: 'new_barcode', title: 'New Barcode' },
                        { data: 'reason', name: 'reason', title: 'Reason' },
                        { data: 'transfer_status', name: 'transfer_status', title: 'Transfer Status' },
                        { data: 'machine_no', name: 'machine_no', title: 'Machine No.' },
                        { data: 'num_of_repairs', name: 'num_of_repairs', title: 'No. of Repairs' },
                        { data: 'process_type', name: 'process_type', title: 'Process Type' },
                        { data: 'process_by', name: 'process_by', title: 'Process By' }
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
    BarcodeToBarcodeDataQuery.init.prototype = $.extend(BarcodeToBarcodeDataQuery.prototype, $D.init.prototype);
    BarcodeToBarcodeDataQuery.init.prototype = BarcodeToBarcodeDataQuery.prototype;

    $(document).ready(function() {
        var _BarcodeToBarcodeDataQuery = BarcodeToBarcodeDataQuery();
        _BarcodeToBarcodeDataQuery.permission();
        _BarcodeToBarcodeDataQuery.drawDatatables();

        $('.dataTables_scrollBody').on('scroll', function() {
            _BarcodeToBarcodeDataQuery.$tbl_data_search.fixedHeader.adjust();
        });

        $('#transfer_date_from').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#transfer_date_to').attr('min', e.currentTarget.value);
        });

        $('#transfer_date_to').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#transfer_date_from').attr('max', e.currentTarget.value);
        });

        $('#btn_search').on('click', function() {
            
            var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_type').val();
            if (search_type !== "" && search_value == "") {
                _BarcodeToBarcodeDataQuery.swMsg("Please Provide a the type of data to search","warning");
            } else {
                _BarcodeToBarcodeDataQuery.$tbl_data_search.ajax.reload(false);
            }
            
        });

        $('#btn_export').on('click', function() {
            var link = '/reports/barcode-to-barcode-data-query/download-excel?_token='+ _BarcodeToBarcodeDataQuery.token;
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