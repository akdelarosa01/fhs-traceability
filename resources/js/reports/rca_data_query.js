"use strict";

(function() {
    const RCADataQuery = function() {
        return new RCADataQuery.init();
    }
    RCADataQuery.init = function() {
        $D.init.call(this);
        this.$tbl_data_search = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    RCADataQuery.prototype = {
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
                        url: "/reports/rca-data-query/generate-data",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.search_type = $('#search_type').val();
                            d.search_value = $('#search_value').val();
                            d.max_count = $('#max_count').val();
                            d.ins_date_from = $('#ins_date_from').val();
                            d.ins_date_to = $('#ins_date_to').val();
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
                        { data: 'ins_date', name: 'ins_date', title: 'Inspection Date' },
                        { data: 'model_code', name: 'model_code', title: 'Model Code' },
                        { data: 'hs_serial', name: 'hs_serial', title: 'H.S. Serial' },
                        { data: 'machine_no', name: 'machine_no', title: 'Machine No.' },
                        { data: 'slot', name: 'slot', title: 'Slot No.' },
                        { data: 'judgment', name: 'judgment', title: 'Judgment' },
                        { data: 'error_msg', name: 'error_msg', title: 'Error Message' },
                        { data: 'user_id', name: 'user_id', title: 'Operator' },
                        { data: 'tc1', name: 'tc1', title: 'Tc 1' },
                        { data: 'tc2', name: 'tc2', title: 'Tc 2' },
                        { data: 'ta', name: 'ta', title: 'Ta' },
                        { data: 't_diff1', name: 't_diff1', title: 'T Difference 1' },
                        { data: 't_diff2', name: 't_diff2', title: 'T Difference 2' },
                        { data: 'rth_1_2', name: 'rth_1_2', title: 'R:th 1-1' },
                        { data: 'rth_2_2', name: 'rth_2_2', title: 'R:th 2-2' },
                        { data: 'p1', name: 'p1', title: 'P1' },
                        { data: 'p2', name: 'p2', title: 'P2' },
                        { data: 'test_time_sec', name: 'test_time_sec', title: 'Test Time (Secs)' },
                        { data: 'tc1_temp', name: 'tc1_temp', title: 'Tc 1 Temp' },
                        { data: 'tc2_temp', name: 'tc2_temp', title: 'Tc 2 Temp' },
                        { data: 'tc1_fan_start_temp', name: 'tc1_fan_start_temp', title: 'Tc1 Fan Start Temp' },
                        { data: 'tc2_fan_start_temp', name: 'tc2_fan_start_temp', title: 'Tc2 Fan Start Temp' },
                        { data: 'r1_set', name: 'r1_set', title: 'R2 Set' },
                        { data: 'r2_set', name: 'r2_set', title: 'R2 Set' },
                        { data: 'upper_limit_temp', name: 'upper_limit_temp', title: 'Upper Limit Temp' },
                        { data: 'lower_limit_temp', name: 'lower_limit_temp', title: 'Lower Limit Temp' },
                        { data: 'fan_voltage', name: 'fan_voltage', title: 'Fan Voltage' },
                        { data: 'upper_fan_vol_tolerance', name: 'upper_fan_vol_tolerance', title: 'Upper Fan Voltage Tolerance' },
                        { data: 'lower_fan_vol_tolerance', name: 'lower_fan_vol_tolerance', title: 'Lower Fan Voltage Tolerance' },
                        { data: 'inspection_mode', name: 'inspection_mode', title: 'Inspection Mode' }
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
    RCADataQuery.init.prototype = $.extend(RCADataQuery.prototype, $D.init.prototype);
    RCADataQuery.init.prototype = RCADataQuery.prototype;

    $(document).ready(function() {
        var _RCADataQuery = RCADataQuery();
        _RCADataQuery.permission();
        _RCADataQuery.drawDatatables();

        $('.dataTables_scrollBody').on('scroll', function() {
            _RCADataQuery.$tbl_data_search.fixedHeader.adjust();
        });

        $('#ins_date_from').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#ins_date_to').attr('min', e.currentTarget.value);
        });

        $('#ins_date_to').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#ins_date_from').attr('max', e.currentTarget.value);
        });

        $('#btn_search').on('click', function() {
            
            var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_type').val();
            if (search_type !== "" && search_value == "") {
                _RCADataQuery.swMsg("Please Provide a the type of data to search","warning");
            } else {
                _RCADataQuery.$tbl_data_search.ajax.reload(false);
            }
            
        });

        $('#search_type').on('change', function() {
            var type = $(this).val();

            if (type == 'slot') {
                $('.slot').show().attr({
                    'id': 'search_value',
                    'name': 'search_value'
                });
                $('.normal').hide().removeAttr('id name');
            } else {
                $('.normal').show().attr({
                    'id': 'search_value',
                    'name': 'search_value'
                });
                $('.slot').hide().removeAttr('id name');
            }
        });

        $('#btn_export').on('click', function() {
            var link = '/reports/rca-data-query/download-excel?_token='+ _RCADataQuery.token;
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