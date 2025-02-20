"use strict";

(function() {
    const Warehouse = function() {
        return new Warehouse.init();
    }
    Warehouse.init = function() {
        $D.init.call(this);
        $F.init.call(this);
        this.$tbl_hs_models = "";
        this.$tbl_pallets = "";
        this.$tbl_shipments = "";

        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    Warehouse.prototype = {
        permission: function() {
            var self = this;
            $('.read-only').each(function(i,x) {
                $state = (self.read_only == 1)? true : false;
                $(x).prop('disabled',$state);
            });
        },
        viewState: function(state) {
            var self = this;
            switch (state) {
                case 'SCAN':
                    $('#destination').select2({
                        disabled: true,
                        allowClear: true,
                        placeholder: 'Select Customer Destination',
                        theme: 'bootstrap4',
                        width: 'auto',
                    });

                    var title = $('#btn_start_shipment').html();
                    if (title == "Start Shipment") {
                        $('#btn_transfer').prop('disabled', true);
                        $('#btn_sort_by').prop('disabled', true);
                        $('#btn_close_shipment').prop('disabled', false);

                        $('#btn_start_shipment').html("Stop Shipment");
                        $('#btn_start_shipment').removeClass("btn-success");
                        $('#btn_start_shipment').addClass("btn-danger");
                        $('#scan_pallet_qr').prop('readonly', false);
                        $('#scan_pallet_qr').val('');

                        $('#tbl_hs_models').addClass('disabled');
                        $('#tbl_pallets').addClass('disabled');

                        self.hideInputErrors('scan_pallet_qr');
                    } else {
                        
                        $('#btn_transfer').prop('disabled', false);
                        $('#btn_sort_by').prop('disabled', false);
                        $('#btn_close_shipment').prop('disabled', true);

                        $('#btn_start_shipment').html("Start Shipment");
                        $('#btn_start_shipment').removeClass("btn-danger");
                        $('#btn_start_shipment').addClass("btn-success");
                        $('#scan_pallet_qr').prop('readonly', true);
                        $('#scan_pallet_qr').val('');

                        $('#tbl_hs_models').removeClass('disabled');
                        $('#tbl_pallets').removeClass('disabled');
                        
                        self.hideInputErrors('scan_pallet_qr');
                    }
                    
                    break;
                case 'MODEL_SELECTED':
                    $('#btn_sort_by').prop('disabled', false);
                    $('#btn_start_shipment').prop('disabled', false);
                    break;
                case 'MODEL_DESELECTED':
                    $('#btn_sort_by').prop('disabled', true);
                    $('#btn_start_shipment').prop('disabled', true);
                    break;
                default:
                    $('#btn_transfer').prop('disabled', true);
                    $('#btn_sort_by').prop('disabled', true);
                    $('#btn_close_shipment').prop('disabled', true);
                    $('#btn_start_shipment').prop('disabled', true);

                    $('#btn_start_shipment').prop('disabled', false);
                    $('#btn_start_shipment').html("Start Shipment");
                    $('#btn_start_shipment').removeClass("btn-danger");
                    $('#btn_start_shipment').addClass("btn-success");
                    $('#scan_pallet_qr').prop('readonly', true);
                    $('#scan_pallet_qr').val('');

                    $('#tbl_hs_models').removeClass('disabled');
                    $('#tbl_pallets').removeClass('disabled');
                    
                    self.hideInputErrors('scan_pallet_qr');
                    break;
            }
        },
        drawPalletsDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_pallets')) {
                self.$tbl_pallets = $('#tbl_pallets').DataTable({
                    processing: true,
                    lengthMenu: [
                        [ 10, 25, 50, -1 ],
                        [ '10 rows', '25 rows', '50 rows', 'Show all' ]
                    ],
                    columnDefs: [ {
                        orderable: false,
                        searchable: false,
                        className: 'select-checkbox',
                        targets:   0
                    } ],
                    select: {
                        style: 'multi',
                        selector: 'td:not(:nth-child(2))'
                    },
                    ajax: {
                        url: "/transactions/warehouse/get-pallets",
                        type: 'GET',
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.trans_id = $('#trans_id').val();
                            d.search_type = $('#search_type').val();
                            d.search_value = $('#search_value').val();
                            d.max_count = $('#max_count').val();
                            d.update_date_to = $('#update_date_to').val();
                            d.update_date_from = $('#update_date_from').val();
                        },
                        error: function(response) {
                            console.log(response);
                        }
                    },
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No Pallet was transferred to warehouse.",
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
                    order: [[7,'asc']],
                    deferRender: true,
                    columns: [
                        { 
                            data: function(data) {
                                return '';
                            }, name: 'id', searchable: false, orderable: false, target: 0 , width: '15px'
                        },
                        { 
                            data: function(data) {
                                return '<button type="button" class="btn btn-sm btn-primary btn_view_boxes"><i class="fa fa-eye"></i></button>';
                            }, name: 'id', searchable: false, orderable: false, target: 1 , width: '15px'
                        },
                        {
                            data: 'model', name: 'model', orderable: false 
                        },
                        {
                            data: 'pallet_qr', name: 'pallet_qr', orderable: false 
                        },
                        {
                            data: 'box_count_per_pallet', name: 'box_count_per_pallet', orderable: false 
                        },
                        {
                            data: 'pallet_status', name: 'pallet_status', orderable: false, className: 'text-center'
                        },
                        { 
                            data: 'pallet_location', name: 'pallet_location', orderable: false, className: 'text-center'
                        },
                        {
                            data: 'updated_at', name: 'updated_at', orderable: false, className: 'text-center'
                        },
                        {
                            data: 'shipment_status', name: 'shipment_status', orderable: false, className: 'text-center'
                        },
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);
                        dataRow.attr('id','r'+data.id);
                    },
                    createdRow: function(row, data, dataIndex) {
                        var dataRow = $(row);
                        var checkbox = $(dataRow[0].cells[0].firstChild);
                        switch (data.pallet_dispo_status) {
                            case 1:
                                $(dataRow[0].cells[5]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[5]).css('color', '#000000');
                                break;
                            case 2:
                                $(dataRow[0].cells[5]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[5]).css('color', '#000000');
                                break;
                            case 3:
                                $(dataRow[0].cells[5]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[5]).css('color', '#000000');
                                break;
                            case 4:
                                $(dataRow[0].cells[5]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[5]).css('color', '#000000');
                                break;
                            case 5:
                                $(dataRow[0].cells[5]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[5]).css('color', '#000000');
                                break;
                            default:
                                $(dataRow[0].cells[5]).css('background-color', '#FFDCAE');
                                $(dataRow[0].cells[5]).css('color', '#000000');
                                break;
                        }

                        switch(data.shipment_status){
                            case 'FOR SHIPMENT':
                                $(dataRow[0].cells[8]).css('background-color', '#32CD32');
                                $(dataRow[0].cells[8]).css('color', '#000000');
                                break;
                            case 'ONLOAD':
                                $(dataRow[0].cells[8]).css('background-color', '#1E90FF');
                                $(dataRow[0].cells[8]).css('color', '#000000');
                                break;
                            case 'SHIPPED':
                                $(dataRow[0].cells[8]).css('background-color', '#00ACAC');
                                $(dataRow[0].cells[8]).css('color', '#000000');
                                break;
                            default:
                                $(dataRow[0].cells[8]).css('background-color', '#FFC000');
                                $(dataRow[0].cells[8]).css('color', '#000000');
                                break;
                        }
                    },
                    initComplete: function() {
                    },
                    fnDrawCallback: function() {
                        $("#tbl_pallets").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        getBoxes: function(param,handle) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/transactions/warehouse/get-boxes";
            self.sendData().then(function() {
                var response = self.responseData;
                handle(response);
            });
        },
        addToShipment: function(param) {
            var self = this;
            let IDs = param.Data.map(i => i.id);
                self.submitType = "GET";
                self.jsonData = param;
                self.formAction = "/transactions/warehouse/send-to-shipment";
                self.sendData().then(function() {
                    self.$tbl_pallets.ajax.reload();
                });
        },

        removeFromWarehouse:function(IDs){
                var self = this;
                let param = {_token:self.token,data:IDs};
                self.submitType = "POST";
                self.jsonData = param;
                self.formAction = "/transactions/warehouse/remove-to-warehouse";
                self.sendData().then(function() {
                    self.$tbl_pallets.ajax.reload();
                    // var response = self.msgType;
                    // if(reponse = 'success'){

                    // }
                });
        },
        addToQA:function(param){
            var self = this;
            let IDs = param.Data.map(i => i.id);
                self.submitType = "POST";
                self.jsonData = param;
                self.formAction = "/transactions/warehouse/send-to-qa";
                self.sendData().then(function() {
                    self.$tbl_pallets.ajax.reload();
                });
        }
    }
    Warehouse.init.prototype = $.extend(Warehouse.prototype, $D.init.prototype, $F.init.prototype);
    Warehouse.init.prototype = Warehouse.prototype;

    $(document).ready(function() {
        var _Warehouse = Warehouse();
        _Warehouse.permission();
        _Warehouse.viewState('');
        _Warehouse.drawPalletsDatatables();

        $('#destination').select2({
            allowClear: true,
            placeholder: 'Select Customer Destination',
            theme: 'bootstrap4',
            width: 'auto',
            ajax: {
                url: '/transactions/warehouse/get-customer-destinations',
                data: function(params) {
                    var query = "";
                    return {
                        q: params.term,
                        id: '',
                        text: '',
                        table: '',
                        condition: '',
                        display: 'id&text',
                        orderBy: '',
                        sql_query: query,
                    };
                },
                processResults: function(data) {
                    return {
                        results: data
                    };
                },
            }
        }).val(null).trigger('change.select2');

        $('#search_type').select2({
            allowClear: true,
            placeholder: 'Select Search Type',
            theme: 'bootstrap4',
            width: 'auto',
        }).val(null).trigger('change.select2');

        $('#tbl_pallets tbody').on('click', '.btn_view_boxes', function() {
            var data = _Warehouse.$tbl_pallets.row($(this).parents('tr')).data();

            if ($('#r'+data.id+'_child_tr').is(':visible')) {
                $('#r'+data.id+'_child_tr').remove();
            } else {
                var row = "";
                _Warehouse.getBoxes({
                    _token: _Warehouse.token,
                    pallet_id: data.id
                }, function(response) {
                    row += '<tr id="r'+data.id+'_child_tr">'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td colspan="7" id="r'+data.id+'_child_td" class="p-0"></td>'+
                            '</tr>';

                    $("#r"+data.id).after(row);
                    var table = '<table class="table table-sm table-striped" style="width:98%;">';
                    table += '<thead>'+
                                '<th width="20px"></th>'+
                                '<th>Box ID</th>'+
                                '<th>Qty / Box</th>'+
                                '<th>Date Manufactured</th>'+
                                '<th>Expiration Data</th>'+
                                '<th>Lot No.</th>'+
                                '<th>Production Line</th>'+
                                '<th>Inspector</th>'+
                                '<th>Shift</th>'+
                            '</thead>';
                    $.each(response, function(i,x) {

                        table += '<tr>'+
                                    '<td>'+(i+1)+'</td>'+
                                    '<td>'+x.box_qr+'</td>'+
                                    '<td>'+x.qty_per_box+'</td>'+
                                    '<td>'+x.date_manufactured+'</td>'+
                                    '<td>'+x.date_expired+'</td>'+
                                    '<td>'+x.lot_no+'</td>'+
                                    '<td>'+x.prod_line_no+'</td>'+
                                    '<td>'+x.inspector+'</td>'+
                                    '<td>'+x.shift+'</td>'+
                                '</tr>';
                    });
                    table += '</table>';
                    
                    $('#r'+data.id+'_child_td').html(table);
                });
            }

            
        });
        
        $('#btn_search').on('click', function() {
            _Warehouse.$tbl_pallets.ajax.reload(false);
            $('.clear').val('');
            $('#search_type').val('').trigger('change');
            // var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            // var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_type').val();
            // if (search_type == "" || search_value == "") {
            //     _Warehouse.swMsg("Please Provide a the type of data to search","warning");
            // } else {
            //     _Warehouse.$tbl_pallets.ajax.reload(false);
            // }
        });

        $('#btn_shipment').on('click',function(e){
            e.preventDefault();
            const data = _Warehouse.$tbl_pallets.rows('.selected').data().toArray();
            const ids = data.map(data => data.id);
            const withForshipment = data.filter(i => i.shipment_status == 'FOR SHIPMENT' || i.shipment_status == 'ONLOAD');
            if(data.length == 0){
                _Warehouse.swMsg("Please Select Pallet to transfer to Shipment","warning");
            }else if (withForshipment.length > 0){
                _Warehouse.swMsg("Please Unselect Pallet that is already sent to shipment","warning");
            }else{
                var param = {
                    _token: _Warehouse.token,
                    Data:ids
                }
                _Warehouse.addToShipment(param);
            }
            
        });

        $("#btn_qa").on("click",function(e){
            e.preventDefault();
            const data = _Warehouse.$tbl_pallets.rows('.selected').data().toArray();
            const ids = data.map(data => data.id);
            const withForshipment = data.filter(i => i.shipment_status == 'FOR SHIPMENT' || i.shipment_status == 'ONLOAD');
            _Warehouse.msg = "Are you sure you want to send it back to QA";
            _Warehouse.confirmAction(_Warehouse.msg).then(function(approve) {
                if (approve) {
                    if(data.length == 0){
                        _Warehouse.swMsg("Please Select Pallet to transfer to Q.A.","warning");
                    }else if (withForshipment.length > 0){
                        _Warehouse.swMsg("Please Unselect Pallet that is already sent to shipment","warning");
                    }else{
                        var param = {
                            _token: _Warehouse.token,
                            Data:ids
                        }
                        _Warehouse.addToQA(param);
                    }
                }
            });
        })


    });

    
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };
