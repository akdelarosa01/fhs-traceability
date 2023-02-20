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
                        url: "/reports/qa-data-query/generate-data",
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
                        [0, "desc"]
                    ],
                    columns: [
                        { data: 'oba_date', name: 'oba_date' },
                        { data: 'shift', name: 'shift' },
                        { data: 'box_label', name: 'box_label' },
                        { data: 'model_code', name: 'model_code' },
                        { data: 'model_name', name: 'model_name' },
                        { data: 'date_manufactured', name: 'date_manufactured' },
                        { data: 'date_expired', name: 'date_expired' },
                        { data: 'pallet_no', name: 'pallet_no' },
                        { data: 'cutomer_pn', name: 'cutomer_pn' },
                        { data: 'lot_no', name: 'lot_no' },
                        { data: 'prod_line_no', name: 'prod_line_no' },
                        { data: 'box_no', name: 'box_no' },
                        { data: 'serial_nos', name: 'serial_nos' },
                        { data: 'qty_per_box', name: 'qty_per_box' },
                        { data: 'qc_incharge', name: 'qc_incharge' },
                        { data: 'hs_history', name: 'hs_history' },
                        { data: 'disposition', name: 'disposition' },
                        { data: 'qa_judgment', name: 'qa_judgment' },
                        { data: 'product_1', name: 'product_1' },
                        { data: 'product_2', name: 'product_2' },
                        { data: 'product_3', name: 'product_3' },
                        { data: 'product_4', name: 'product_4' },
                        { data: 'product_5', name: 'product_5' },
                        { data: 'product_6', name: 'product_6' },
                        { data: 'product_7', name: 'product_7' },
                        { data: 'product_8', name: 'product_8' },
                        { data: 'product_9', name: 'product_9' },
                        { data: 'product_10', name: 'product_10' },
                        { data: 'product_11', name: 'product_11' },
                        { data: 'product_12', name: 'product_12' },
                        { data: 'product_13', name: 'product_13' },
                        { data: 'product_14', name: 'product_14' },
                        { data: 'product_15', name: 'product_15' },
                        { data: 'product_16', name: 'product_16' },
                        { data: 'product_17', name: 'product_17' },
                        { data: 'product_18', name: 'product_18' },
                        { data: 'product_19', name: 'product_19' },
                        { data: 'product_20', name: 'product_20' },
                        { data: 'product_21', name: 'product_21' },
                        { data: 'product_22', name: 'product_22' },
                        { data: 'product_23', name: 'product_23' },
                        { data: 'product_24', name: 'product_24' },
                        { data: 'product_25', name: 'product_25' },
                        { data: 'product_26', name: 'product_26' },
                        { data: 'product_27', name: 'product_27' },
                        { data: 'product_28', name: 'product_28' },
                        { data: 'product_29', name: 'product_29' },
                        { data: 'product_30', name: 'product_30' },
                        { data: 'product_31', name: 'product_31' },
                        { data: 'product_32', name: 'product_32' },
                        { data: 'product_33', name: 'product_33' },
                        { data: 'product_34', name: 'product_34' },
                        { data: 'product_35', name: 'product_35' },
                        { data: 'product_36', name: 'product_36' },
                        { data: 'product_37', name: 'product_37' },
                        { data: 'product_38', name: 'product_38' },
                        { data: 'product_39', name: 'product_39' },
                        { data: 'product_40', name: 'product_40' },
                        { data: 'product_41', name: 'product_41' },
                        { data: 'product_42', name: 'product_42' },
                        { data: 'product_43', name: 'product_43' },
                        { data: 'product_44', name: 'product_44' },
                        { data: 'product_45', name: 'product_45' },
                        { data: 'product_46', name: 'product_46' },
                        { data: 'product_47', name: 'product_47' },
                        { data: 'product_48', name: 'product_48' },
                        { data: 'product_49', name: 'product_49' },
                        { data: 'product_50', name: 'product_50' },
                        { data: 'product_51', name: 'product_51' },
                        { data: 'product_52', name: 'product_52' },
                        { data: 'product_53', name: 'product_53' },
                        { data: 'product_54', name: 'product_54' },
                        { data: 'product_55', name: 'product_55' },
                        { data: 'product_56', name: 'product_56' },
                        { data: 'product_57', name: 'product_57' },
                        { data: 'product_58', name: 'product_58' },
                        { data: 'product_59', name: 'product_59' },
                        { data: 'product_60', name: 'product_60' },
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);
                        dataRow.attr('id','r'+data.id);

                        var judgment = data.remarks;
                        if (judgment == 'NOT GOOD') {
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
    QADataQuery.init.prototype = $.extend(QADataQuery.prototype, $D.init.prototype);
    QADataQuery.init.prototype = QADataQuery.prototype;

    $(document).ready(function() {
        var _QADataQuery = QADataQuery();
        _QADataQuery.permission();
        _QADataQuery.drawDatatables();

        $('#shipping_date_from').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#shipping_date_to').attr('min', e.currentTarget.value);
        });

        $('#shipping_date_to').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#shipping_date_from').attr('max', e.currentTarget.value);
        });

        $('#btn_search').on('click', function() {
          dd(yeah)
            var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_type').val();
            if (search_type == "" || search_value == "") {
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