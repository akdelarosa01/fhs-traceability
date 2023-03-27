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
        drawDatatables: function(arrData, columns) {
            var self = this;
            
            
            if (!$.fn.DataTable.isDataTable('#tbl_data_search')) {
                $('#tbl_data_search').DataTable({
                    destroy: true,
                    processing: true,
                    scrollY: 500,
                    scrollX: true,
                    scrollCollapse: true,
                    paging: false,
                    lengthChange: false,
                    fixedHeader: {
                        header: true,
                    },
                    data: arrData,
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
                    columns: columns,
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
            } else {
                // $('#tbl_data_search').DataTable().clear();
                $('#tbl_data_search').DataTable().clear().destroy();
                $("#tbl_data_search tbody").empty();
                $("#tbl_data_search thead").empty();

                self.drawDatatables(arrData, columns);
            }
        },
        search: function(param) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/reports/box-pallet-data-query/generate-data";
            self.sendData().then(function() {
                var response = self.responseData;

                var columns = [];

                switch (param.search_type) {
                    case 'hs_serial':
                        columns = [
                            { data: 'created_at', name: 'created_at', title: 'Date' },
                            { data: 'HS_Serial', name: 'HS_Serial', title: 'HS Serial' },
                            { data: 'model', name: 'model', title: 'Model' },
                            { data: 'model_name', name: 'model_name', title: 'Model Name' },
                            { data: 'pallet_qr', name: 'pallet_qr', title: 'Pallet ID' },
                            { data: 'pallet_status', name: 'pallet_status', title: 'Pallet Status' },
                            { data: 'pallet_location', name: 'pallet_location', title: 'Pallet Location' },
                            { data: 'box_qr', name: 'box_qr', title: 'Box ID' },
                            { data: 'box_judgement', name: 'box_judgement', title: 'Box Judgment' }
                        ];

                        break;
                    case 'box_no':
                        columns = [
                            { data: 'created_at', name: 'created_at', title: 'Date' },
                            { data: 'box_qr', name: 'box_qr', title: 'Box ID' },
                            { data: 'box_judgement', name: 'box_judgement', title: 'Box Judgment' },
                            { data: 'model', name: 'model', title: 'Model' },
                            { data: 'model_name', name: 'model_name', title: 'Model Name' },
                            { data: 'pallet_qr', name: 'pallet_qr', title: 'Pallet ID' },
                            { data: 'pallet_status', name: 'pallet_status', title: 'Pallet Status' },
                            { data: 'pallet_location', name: 'pallet_location', title: 'Pallet Location' },
                            
                        ];
                        break;
                
                    default:
                        columns = [
                            { data: 'created_at', name: 'created_at', title: 'Date' },
                            { data: 'pallet_qr', name: 'pallet_qr', title: 'Pallet ID' },
                            { data: 'model', name: 'model', title: 'Model' },
                            { data: 'model_name', name: 'model_name', title: 'Model Name' },
                            { data: 'pallet_status', name: 'pallet_status', title: 'Pallet Status' },
                            { data: 'pallet_location', name: 'pallet_location', title: 'Pallet Location' },
                            
                        ];
                        break;
                }

                self.drawDatatables(response, columns);
                $('#modal_print_preview').modal('show');
            });
        }
    }
    BoxPalletDataQuery.init.prototype = $.extend(BoxPalletDataQuery.prototype, $D.init.prototype);
    BoxPalletDataQuery.init.prototype = BoxPalletDataQuery.prototype;

    $(document).ready(function() {
        var _BoxPalletDataQuery = BoxPalletDataQuery();
        _BoxPalletDataQuery.permission();
        //_BoxPalletDataQuery.drawDatatables([],[]);

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
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_value').val();
            if (search_type !== "" && search_value == "") {
                _BoxPalletDataQuery.swMsg("Please Provide a the type of data to search","warning");
            } else {
                _BoxPalletDataQuery.search({
                    search_type: search_type,
                    search_value: search_value
                });
            }
            
        });

        $('#btn_export').on('click', function() {
            var link = '/reports/box-pallet-data-query/download-excel?_token='+ _BoxPalletDataQuery.token;
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