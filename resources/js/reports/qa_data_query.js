"use strict";

(function() {
    const QADataQuery = function() {
        return new QADataQuery.init();
    }
    QADataQuery.init = function() {
        $D.init.call(this);
        this.$tbl_data_search = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    QADataQuery.prototype = {
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
                    scrollY: 600,
                    scrollX: true,
                    scrollCollapse: true,
                    paging: false,
                    lengthChange: false,
                    fixedHeader: {
                        header: true,
                    },
                    // fixedColumns: {
                    //     left: 5,
                    // },
                    dom: 'Bfrtip',
                    buttons: [
                        'csv', 'excel'
                    ],
                    // lengthMenu: [
                    //     [ 10, 25, 50, -1 ],
                    //     [ '10 rows', '25 rows', '50 rows', 'Show all' ]
                    // ],
                    // buttons: [
                    //     'pageLength', {
                    //         extend: 'collection',
                    //         className: 'custom-html-collection',
                    //         buttons: [
                    //             '<h5>Export</h5>',
                    //             'csv',
                    //             'excel'
                    //         ]
                    //     }
                    // ],
                    ajax: {
                        url: "/reports/qa-data-query/generate-data",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.search_type = $('#search_type').val();
                            d.search_value = $('#search_value').val();
                            d.max_count = $('#max_count').val();
                            d.exp_date_from = $('#exp_date_from').val();
                            d.exp_date_to = $('#exp_date_to').val();
                            d.oba_date_from = $('#oba_date_from').val();
                            d.oba_date_to = $('#oba_date_to').val();
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
                        { data: 'oba_date', name: 'oba_date', title: "Date" },
                        { data: 'shift', name: 'shift', title: "Shift" },
                        { data: 'box_label', name: 'box_label', title: "Box Label" },
                        { data: 'model_code', name: 'model_code', title: "Model" },
                        { data: 'model_name', name: 'model_name', title: "Model Name" },
                        { data: 'date_manufactured', name: 'date_manufactured', title: "Date Manufactured" },
                        { data: 'date_expired', name: 'date_expired', title: "Exp. Date" },
                        { data: 'pallet_no', name: 'pallet_no', title: "Pallet No." },
                        { data: 'cutomer_pn', name: 'cutomer_pn', title: "Customer P/N" },
                        { data: 'lot_no', name: 'lot_no', title: "Lot No." },
                        { data: 'prod_line_no', name: 'prod_line_no', title: "Prod. Line No." },
                        { data: 'box_no', name: 'box_no', title: "Box No." },
                        { data: 'serial_nos', name: 'serial_nos', title: "Serial Nos." },
                        { data: 'qty_per_box', name: 'qty_per_box', title: "Qty / Box" },
                        { data: 'qc_incharge', name: 'qc_incharge', title: "QC In-charge" },
                        { data: 'hs_history', name: 'hs_history', title: "HS History" },
                        { data: function(x) {
                            var disposition = parseInt(x.disposition);
                            switch (disposition) {
                                case 0:
                                    return 'NG';
                                case 1:
                                    return 'GOOD';
                                default:
                                    return '';
                            }
                        }, name: 'disposition', title: "QA Remarks" },
                        { data: 'qa_judgment', name: 'qa_judgment', title: "QA Judgement" },
                        { data: 'product_1', name: 'product_1', title: "Product 1" },
                        { data: 'product_2', name: 'product_2', title: "Product 2" },
                        { data: 'product_3', name: 'product_3', title: "Product 3" },
                        { data: 'product_4', name: 'product_4', title: "Product 4" },
                        { data: 'product_5', name: 'product_5', title: "Product 5" },
                        { data: 'product_6', name: 'product_6', title: "Product 6" },
                        { data: 'product_7', name: 'product_7', title: "Product 7" },
                        { data: 'product_8', name: 'product_8', title: "Product 8" },
                        { data: 'product_9', name: 'product_9', title: "Product 9" },
                        { data: 'product_10', name: 'product_10', title: "Product 10" },
                        { data: 'product_11', name: 'product_11', title: "Product 11" },
                        { data: 'product_12', name: 'product_12', title: "Product 12" },
                        { data: 'product_13', name: 'product_13', title: "Product 13" },
                        { data: 'product_14', name: 'product_14', title: "Product 14" },
                        { data: 'product_15', name: 'product_15', title: "Product 15" },
                        { data: 'product_16', name: 'product_16', title: "Product 16" },
                        { data: 'product_17', name: 'product_17', title: "Product 17" },
                        { data: 'product_18', name: 'product_18', title: "Product 18" },
                        { data: 'product_19', name: 'product_19', title: "Product 19" },
                        { data: 'product_20', name: 'product_20', title: "Product 20" },
                        { data: 'product_21', name: 'product_21', title: "Product 21" },
                        { data: 'product_22', name: 'product_22', title: "Product 22" },
                        { data: 'product_23', name: 'product_23', title: "Product 23" },
                        { data: 'product_24', name: 'product_24', title: "Product 24" },
                        { data: 'product_25', name: 'product_25', title: "Product 25" },
                        { data: 'product_26', name: 'product_26', title: "Product 26" },
                        { data: 'product_27', name: 'product_27', title: "Product 27" },
                        { data: 'product_28', name: 'product_28', title: "Product 28" },
                        { data: 'product_29', name: 'product_29', title: "Product 29" },
                        { data: 'product_30', name: 'product_30', title: "Product 30" },
                        { data: 'product_31', name: 'product_31', title: "Product 31" },
                        { data: 'product_32', name: 'product_32', title: "Product 32" },
                        { data: 'product_33', name: 'product_33', title: "Product 33" },
                        { data: 'product_34', name: 'product_34', title: "Product 34" },
                        { data: 'product_35', name: 'product_35', title: "Product 35" },
                        { data: 'product_36', name: 'product_36', title: "Product 36" },
                        { data: 'product_37', name: 'product_37', title: "Product 37" },
                        { data: 'product_38', name: 'product_38', title: "Product 38" },
                        { data: 'product_39', name: 'product_39', title: "Product 39" },
                        { data: 'product_40', name: 'product_40', title: "Product 40" },
                        { data: 'product_41', name: 'product_41', title: "Product 41" },
                        { data: 'product_42', name: 'product_42', title: "Product 42" },
                        { data: 'product_43', name: 'product_43', title: "Product 43" },
                        { data: 'product_44', name: 'product_44', title: "Product 44" },
                        { data: 'product_45', name: 'product_45', title: "Product 45" },
                        { data: 'product_46', name: 'product_46', title: "Product 46" },
                        { data: 'product_47', name: 'product_47', title: "Product 47" },
                        { data: 'product_48', name: 'product_48', title: "Product 48" },
                        { data: 'product_49', name: 'product_49', title: "Product 49" },
                        { data: 'product_50', name: 'product_50', title: "Product 50" },
                        { data: 'product_51', name: 'product_51', title: "Product 51" },
                        { data: 'product_52', name: 'product_52', title: "Product 52" },
                        { data: 'product_53', name: 'product_53', title: "Product 53" },
                        { data: 'product_54', name: 'product_54', title: "Product 54" },
                        { data: 'product_55', name: 'product_55', title: "Product 55" },
                        { data: 'product_56', name: 'product_56', title: "Product 56" },
                        { data: 'product_57', name: 'product_57', title: "Product 57" },
                        { data: 'product_58', name: 'product_58', title: "Product 58" },
                        { data: 'product_59', name: 'product_59', title: "Product 59" },
                        { data: 'product_60', name: 'product_60', title: "Product 60" },
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
    QADataQuery.init.prototype = $.extend(QADataQuery.prototype, $D.init.prototype);
    QADataQuery.init.prototype = QADataQuery.prototype;

    $(document).ready(function() {
        var _QADataQuery = QADataQuery();
        _QADataQuery.permission();
        _QADataQuery.drawDatatables();

        $('.dataTables_scrollBody').on('scroll', function() {
            _QADataQuery.$tbl_data_search.fixedHeader.adjust();
        });

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
            if (search_type !== "" && search_value == "") {
                _QADataQuery.swMsg("Please Provide a the type of data to search","warning");
            } else {
                _QADataQuery.$tbl_data_search.ajax.reload(false);
            }
            
        });

        $('#search_type').on('change', function() {
            var type = $(this).val();

            if (type == 'shift') {
                $('.shift').show().attr({
                    'id': 'search_value',
                    'name': 'search_value'
                });
                $('.normal').hide().removeAttr('id name');
            } else {
                $('.normal').show().attr({
                    'id': 'search_value',
                    'name': 'search_value'
                });
                $('.shift').hide().removeAttr('id name');
            }
        });

        $('#btn_export').on('click', function() {
            var link = '/reports/qa-data-query/download-excel?_token='+ _QADataQuery.token;
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