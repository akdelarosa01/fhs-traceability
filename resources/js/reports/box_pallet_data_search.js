"use strict";

(function() {
    const BoxPalletDataSearch = function() {
        return new BoxPalletDataSearch.init();
    }
    BoxPalletDataSearch.init = function() {
        $D.init.call(this);
        this.$tbl_data_search = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    BoxPalletDataSearch.prototype = {
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
                    fixedHeader: true,
                    dom: 'Bfrtip',
                    lengthMenu: [
                        [ 10, 25, 50, -1 ],
                        [ '10 rows', '25 rows', '50 rows', 'Show all' ]
                    ],
                    buttons: [
                        'pageLength', {
                            extend: 'collection',
                            className: 'custom-html-collection',
                            buttons: [
                                '<h5>Export</h5>',
                                'csv',
                                'excel'
                            ]
                        }
                    ],
                    ajax: {
                        url: "/reports/box-pallet-data-search/generate-data",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.search_type = $('#search_type').val();
                            d.search_value = $('#search_value').val();
                            d.max_count = $('#max_count').val();
                            d.shipping_date_from = $('#shipping_date_from').val();
                            d.shipping_date_to = $('#shipping_date_to').val();
                            d.production_date_from = $('#production_date_from').val();
                            d.production_date_to = $('#production_date_to').val();
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
                        [2, "desc"]
                    ],
                    columns: [
                        { data: 'shipping_date', name: 'shipping_date' },
                        { data: 'destination', name: 'destination' },
                        { data: 'production_date', name: 'production_date' },
                        { data: 'model', name: 'model' },
                        { data: 'pallet_qr', name: 'pallet_qr' },
                        { data: 'box_id', name: 'box_id' },
                        { data: 'cust_part_no', name: 'cust_part_no' },
                        { data: 'hs_serial', name: 'hs_serial' },
                        { data: 'qa_judgment', name: 'qa_judgment' },
                        { data: 'grease_batch', name: 'grease_batch' },
                        { data: 'grease_no', name: 'grease_no' },
                        { data: 'rca_value', name: 'rca_value' },
                        { data: 'rca_judgment', name: 'rca_judgment' },
                        { data: 'lot_no', name: 'lot_no' }
                    ],
                    rowCallback: function(row, data) {
                        var judgment = data.rca_judgment;
                        if (judgment.includes('NG')) {
                            $(row).css('background-color', '#ff6266');
                            $(row).css('color', '#fff');
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                    },
                    fnDrawCallback: function() {
                        $("#tbl_data_search").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                });

                self.$tbl_data_search.buttons().container().appendTo( '#tbl_data_search_wrapper .col-md-6:eq(0)' );
            }
            return this;
        },
    }
    BoxPalletDataSearch.init.prototype = $.extend(BoxPalletDataSearch.prototype, $D.init.prototype);
    BoxPalletDataSearch.init.prototype = BoxPalletDataSearch.prototype;

    $(document).ready(function() {
        var _BoxPalletDataSearch = BoxPalletDataSearch();
        _BoxPalletDataSearch.permission();
        _BoxPalletDataSearch.drawDatatables();

        $('#shipping_date_from').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#shipping_date_to').attr('min', e.currentTarget.value);
        });

        $('#shipping_date_to').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#shipping_date_from').attr('max', e.currentTarget.value);
        });

        $('#btn_search').on('click', function() {
            var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_type').val();
            if (search_type != "" && search_value == "") {
                _BoxPalletDataSearch.swMsg("Please Provide a the type of data to search","warning");
            } else {
                _BoxPalletDataSearch.$tbl_data_search.ajax.reload(false);
            }
            
        });
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };