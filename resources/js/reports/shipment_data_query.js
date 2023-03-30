"use strict";

(function() {
    const ShipmentDataQuery = function() {
        return new ShipmentDataQuery.init();
    }
    ShipmentDataQuery.init = function() {
        $D.init.call(this);
        this.$tbl_data_search = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    ShipmentDataQuery.prototype = {
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
                    ajax: {
                        url: "/reports/shipment-data-query/generate-data",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.search_type = $('#search_type').val();
                            d.search_value = $('#search_value').val();
                            d.max_count = $('#max_count').val();
                            d.shipment_date_from = $('#shipment_date_from').val();
                            d.shipment_date_to = $('#shipment_date_to').val();
                            d.create_date_from = $('#create_date_from').val();
                            d.create_date_to = $('#create_date_to').val();
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
                        [1, "desc"]
                    ],
                    columns: [
                        { 
                            data: function(data) {
                                return '<button type="button" class="btn btn-sm btn-primary btn_view_boxes"><i class="fa fa-eye"></i></button>';
                            }, name: 'pallet_id', searchable: false, orderable: false, target: 1 , width: '15px', title: ""
                        },
                        { data: 'ship_date', name: 'ship_date', title: "Shipped Date" },
                        { data: 'control_no', name: 'control_no', title: "Control No." },
                        { data: 'model', name: 'model', title: "Model" },
                        { data: 'total_ship_qty', name: 'total_ship_qty', title: "Total Ship Qty" },
                        { data: 'pallet_qty', name: 'pallet_qty', title: "Pallet Qty" },
                        { data: 'destination', name: 'destination', title: "Destination" },
                        { data: 'truck_plate_no', name: 'truck_plate_no', title: "Truck Plate No." },
                        { data: 'shipping_seal_no', name: 'shipping_seal_no', title: "Shipping Seal No." },
                        { data: 'peza_seal_no', name: 'peza_seal_no', title: "PEZA Seal No." },
                        { data: 'shipper', name: 'shipper', title: "Shipper" },
                        { data: 'qc_pic', name: 'qc_pic', title: "QC PIC" },
                        { data: function(x) {
                            var shipment_status = parseInt(x.shipment_status);

                            switch (shipment_status) {
                                case 4:
                                    return 'DELETED';
                                case 3:
                                    return 'SHIPPED';
                                case 2:
                                    return 'CANCELLED';
                                case 1:
                                    return 'COMPLETED';
                                case 0:
                                    return 'INCOMPLETE';
                                default:
                                    return '';
                            }
                        }, name: 'shipment_status', title: "Status" },
                        { data: 'pallet_qr', name: 'pallet_qr', title: "Pallet No." },
                        { data: 'box_qty', name: 'box_qty', title: "Box Qty" },
                        { data: 'hs_qty', name: 'hs_qty', title: "HS Qty" }
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);
                        dataRow.attr('id','r'+data.pallet_id);
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
        getBoxes: function(param,handle) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/reports/shipment-data-query/get-boxes";
            self.sendData().then(function() {
                var response = self.responseData;
                handle(response);
            });
        },
        getHeatSink: function(param,handle) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/reports/shipment-data-query/get-heat-sinks";
            self.sendData().then(function() {
                var response = self.responseData;
                handle(response);
            });
        },
    }
    ShipmentDataQuery.init.prototype = $.extend(ShipmentDataQuery.prototype, $D.init.prototype);
    ShipmentDataQuery.init.prototype = ShipmentDataQuery.prototype;

    $(document).ready(function() {
        var _ShipmentDataQuery = ShipmentDataQuery();
        _ShipmentDataQuery.permission();
        _ShipmentDataQuery.drawDatatables();

        $('.dataTables_scrollBody').on('scroll', function() {
            _ShipmentDataQuery.$tbl_data_search.fixedHeader.adjust();
        });

        $('#shipment_date_from').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#shipment_date_to').attr('min', e.currentTarget.value);
        });

        $('#shipment_date_to').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#shipment_date_from').attr('max', e.currentTarget.value);
        });

        $('#create_date_from').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#create_date_to').attr('min', e.currentTarget.value);
        });

        $('#create_date_to').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#create_date_from').attr('max', e.currentTarget.value);
        });

        $('#btn_search').on('click', function() {
            
            var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_value').val();
            if (search_type !== "" && search_value == "") {
                _ShipmentDataQuery.swMsg("Please Provide a the type of data to search","warning");
            } else {
                _ShipmentDataQuery.$tbl_data_search.ajax.reload(false);
            }
            
        });

        $('#btn_export').on('click', function() {
            var link = '/reports/shipment-data-query/download-excel?_token='+ _ShipmentDataQuery.token;

            var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_value').val();
            var shipment_date_from = $('#shipment_date_from').val();
            var shipment_date_to = $('#shipment_date_to').val();
            var create_date_from = $('#create_date_from').val();
            var create_date_to = $('#create_date_to').val();
            var max_count = $('#max_count').val();

            if (search_type !== "" && search_value == "") {
                _ShipmentDataQuery.swMsg("Please Provide a the type of data to search","warning");
            } else {
                window.location.href = link + "&search_type="+search_type+"&search_value="+search_value+
                                        "&shipment_date_from="+shipment_date_from+"&shipment_date_to="+shipment_date_to+
                                        "&create_date_from="+create_date_from+"&create_date_to="+create_date_to+
                                        "&max_count="+max_count;
            }

            
        });

        $('#tbl_data_search tbody').on('click', '.btn_view_boxes', function() {
            var data = _ShipmentDataQuery.$tbl_data_search.row($(this).parents('tr')).data();

            if ($('#r'+data.pallet_id+'_child_tr').is(':visible')) {
                $('#r'+data.pallet_id+'_child_tr').remove();
            } else {
                var row = "";
                _ShipmentDataQuery.getBoxes({
                    _token: _ShipmentDataQuery.token,
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
                                '<th>Date Manufactured</th>'+
                                '<th>Expiration Data</th>'+
                                '<th>Lot No.</th>'+
                                '<th>Production Line</th>'+
                                '<th>Customer PN</th>'+
                            '</thead>';
                    $.each(response, function(i,x) {

                        table += '<tr id="r'+x.box_id+'_box_tr" >'+
                                    '<td>'+
                                        '<button type="button" class="btn btn-sm btn-primary btn_view_hs" data-pallet_id="'+data.pallet_id+'" data-box_id="'+x.box_id+'">'+
                                            '<i class="fa fa-eye"></i>'+
                                        '</button>'+
                                    '</td>'+
                                    '<td>'+x.box_qr+'</td>'+
                                    '<td>'+x.qty_per_box+'</td>'+
                                    '<td>'+x.date_manufactured+'</td>'+
                                    '<td>'+x.date_expired+'</td>'+
                                    '<td>'+x.lot_no+'</td>'+
                                    '<td>'+x.prod_line_no+'</td>'+
                                    '<td>'+x.customer_pn+'</td>'+
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
                _ShipmentDataQuery.getHeatSink({
                    _token: _ShipmentDataQuery.token,
                    box_id: box_id,
                    pallet_id: pallet_id
                }, function(response) {
                    row += '<tr id="r'+box_id+'_box_child_tr">'+
                                '<td style="width: 15px"></td>'+
                                '<td colspan="7" id="r'+box_id+'_box_child_td" class="p-0"></td>'+
                            '</tr>';

                    $("#r"+box_id+"_box_tr").after(row);
                    var table = '<table class="table table-sm tbl_heat_sink" style="width:99%;">';
                    table += '<thead>'+
                                '<th width="20px"></th>'+
                                '<th>HS Serial No.</th>'+
                                '<th>Production Date</th>'+
                                '<th>Operator</th>'+
                                '<th>Work Order</th>'+
                            '</thead>';
                    $.each(response, function(i,x) {

                        table += '<tr id="r'+x.id+'_hs_tr" >'+
                                    '<td>'+(i+1)+'</td>'+
                                    '<td>'+x.hs_serial+'</td>'+
                                    '<td>'+x.prod_date+'</td>'+
                                    '<td>'+x.operator+'</td>'+
                                    '<td>'+x.work_order+'</td>'+
                                '</tr>';
                    });
                    table += '</table>';
                    
                    $('#r'+box_id+'_box_child_td').html(table);
                });
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