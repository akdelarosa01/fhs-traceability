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
        drawDatatables: function(arrData, columns, search_type) {
            var self = this;
            
            
            if (!$.fn.DataTable.isDataTable('#tbl_data_search')) {
                self.$tbl_data_search = $('#tbl_data_search').DataTable({
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
                        var dataRow = $(row);
                        switch (search_type) {
                            case 'box_no':
                                dataRow.attr('id','r'+data.id+'_box_tr');
                                break;
                        
                            default:
                                dataRow.attr('id','r'+data.pallet_id);
                                break;
                        }
                        
                        
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                        $('#tbl_data_search tbody').on('click', '.btn_view_boxes', function() {
                            var data = self.$tbl_data_search.row($(this).parents('tr')).data();
                
                            if ($('#r'+data.pallet_id+'_child_tr').is(':visible')) {
                                $('#r'+data.pallet_id+'_child_tr').remove();
                            } else {
                                var row = "";
                                self.getBoxes({
                                    _token: self.token,
                                    pallet_id: data.pallet_id
                                }, function(response) {
                                    row += '<tr id="r'+data.pallet_id+'_child_tr">'+
                                                '<td style="width: 15px"></td>'+
                                                '<td colspan="15" id="r'+data.pallet_id+'_child_td" class="p-0"></td>'+
                                            '</tr>';
                
                                    $("#r"+data.pallet_id).after(row);
                                    var table = '<table class="table table-sm tbl_boxes" style="width:99%;">';
                                    table += '<thead>'+
                                                '<th width="20px"></th>'+
                                                '<th>Box ID</th>'+
                                                '<th>Qty / Box</th>'+
                                                '<th>Wt. / Box</th>'+
                                                '<th>Production Date</th>'+
                                                '<th>Lot No.</th>'+
                                                '<th>Customer PN</th>'+
                                                '<th>FEC PN</th>'+
                                                '<th>Judgment</th>'+
                                            '</thead>';
                                    $.each(response, function(i,x) {
                                        var judgment = "";
                                        var box_judgement = parseInt(x.box_judgement);
                                        var remarks = (x.prod_remarks == null)? "" : x.prod_remarks;
                                        switch (box_judgement) {
                                            case 0:
                                                judgment = '<span style="color: #ff5b57" title="'+remarks+'">NG</span>';
                                            case 1:
                                                judgment = '<span style="color: #00acac" title="'+remarks+'">GOOD</span>';
                                            default:
                                                judgment = '';
                                        }
                
                                        table += '<tr id="r'+x.box_id+'_box_tr" >'+
                                                    '<td>'+
                                                        '<button type="button" class="btn btn-sm btn-primary btn_view_hs" data-pallet_id="'+data.pallet_id+'" data-box_id="'+x.box_id+'">'+
                                                            '<i class="fa fa-eye"></i>'+
                                                        '</button>'+
                                                    '</td>'+
                                                    '<td>'+x.box_qr+'</td>'+
                                                    '<td>'+x.qty+'</td>'+
                                                    '<td>'+x.weight+'</td>'+
                                                    '<td>'+x.production_date+'</td>'+
                                                    '<td>'+x.lot_no+'</td>'+
                                                    '<td>'+x.cust_part_no+'</td>'+
                                                    '<td>'+x.fec_part_no+'</td>'+
                                                    '<td>'+judgment+'</td>'+
                                                '</tr>';
                                    });
                                    table += '</table>';
                                    
                                    $('#r'+data.pallet_id+'_child_td').html(table);
                                });
                            }
                
                            
                        });
                
                        $('#tbl_data_search tbody').on('click', '.btn_view_hs', function() {
                            var pallet_id = $(this).attr('data-pallet_id');
                            var box_id = $(this).attr('data-box_id');
                
                            if ($('#r'+box_id+'_box_child_tr').is(':visible')) {
                                $('#r'+box_id+'_box_child_tr').remove();
                            } else {
                                var row = "";
                                self.getHeatSink({
                                    _token: self.token,
                                    box_id: box_id,
                                    pallet_id: pallet_id
                                }, function(response) {
                                    row += '<tr id="r'+box_id+'_box_child_tr">'+
                                                '<td style="width: 15px"></td>'+
                                                '<td colspan="8" id="r'+box_id+'_box_child_td" class="p-0"></td>'+
                                            '</tr>';
                
                                    $("#r"+box_id+"_box_tr").after(row);
                                    var table = '<table class="table table-sm tbl_heat_sink" style="width:99%;">';
                                    table += '<thead>'+
                                                '<th width="20px"></th>'+
                                                '<th>HS Serial No.</th>'+
                                                '<th>Scanned Date</th>'+
                                                '<th>Production Line</th>'+
                                                '<th>Operator</th>'+
                                                '<th>Work Order</th>'+
                                                '<th>Grease Batch No.</th>'+
                                                '<th>Container No.</th>'+
                                                '<th>RCA Value</th>'+
                                                '<th>RCA Judgment</th>'+
                                                '<th>B2B Old Barcode</th>'+
                                                '<th>B2B Process Type</th>'+
                                                '<th>B2B Date</th>'+
                                            '</thead>';
                                    $.each(response, function(i,x) {

                                        table += '<tr id="r'+x.id+'_hs_tr" >'+
                                                    '<td>'+(i+1)+'</td>'+
                                                    '<td>'+x.hs_serial+'</td>'+
                                                    '<td>'+x.date_scanned+'</td>'+
                                                    '<td>'+x.production_line+'</td>'+
                                                    '<td>'+x.operator+'</td>'+
                                                    '<td>'+x.work_order+'</td>'+
                                                    '<td>'+x.grease_batch+'</td>'+
                                                    '<td>'+x.grease_no+'</td>'+
                                                    '<td>'+x.rca_value+'</td>'+
                                                    '<td>'+x.rca_judgment+'</td>'+
                                                    '<td>'+x.old_barcode+'</td>'+
                                                    '<td>'+x.process_type+'</td>'+
                                                    '<td>'+x.B2B_date+'</td>'+
                                                '</tr>';
                                    });
                                    table += '</table>';
                                    
                                    $('#r'+box_id+'_box_child_td').html(table);
                                });
                            }
                        });
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

                self.drawDatatables(arrData, columns, search_type);
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
                            { data: 'created_at', name: 'created_at', title: 'Box-Pallet Entry' },
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
                            { data: function(x) {
                                return '<button type="button" class="btn btn-sm btn-primary btn_view_hs"><i class="fa fa-eye"></i></button>';
                            }, name: 'id', title: '', width: '20px' },
                            { data: 'created_at', name: 'created_at', title: 'Box-Pallet Entry' },
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
                            { data: function(x) {
                                return '<button type="button" class="btn btn-sm btn-primary btn_view_boxes"><i class="fa fa-eye"></i></button>';
                            }, name: 'id', title: '', width: '20px' },
                            { data: 'created_at', name: 'created_at', title: 'Box-Pallet Entry' },
                            { data: 'pallet_qr', name: 'pallet_qr', title: 'Pallet ID' },
                            { data: 'model', name: 'model', title: 'Model' },
                            { data: 'model_name', name: 'model_name', title: 'Model Name' },
                            { data: 'pallet_status', name: 'pallet_status', title: 'Pallet Status' },
                            { data: 'pallet_location', name: 'pallet_location', title: 'Pallet Location' },
                            
                        ];
                        break;
                }

                self.drawDatatables(response, columns, param.search_type);
                $('#modal_print_preview').modal('show');
            });
        },

        getBoxes: function(param,handle) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/reports/box-pallet-data-query/get-boxes";
            self.sendData().then(function() {
                var response = self.responseData;
                handle(response);
            });
        },
        getHeatSink: function(param,handle) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/reports/box-pallet-data-query/get-heat-sinks";
            self.sendData().then(function() {
                var response = self.responseData;
                handle(response);
            });
        },
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