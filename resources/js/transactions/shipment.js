"use strict";

(function() {
    const Shipment = function() {
        return new Shipment.init();
    }
    Shipment.init = function() {
        $D.init.call(this);
        $F.init.call(this);
        this.$tbl_models = "";
        this.$tbl_pallets = "";
        this.$tbl_shipments = "";
        this.$tbl_shipment_details = "";
        this.shipment_details_arr = {};
        this.editstate = false;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    Shipment.prototype = {
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
                    var title = $('#btn_start_scan').html();
                    if (title == "Start Scan") {
                        $('#warehouse_pic').prop('readonly', true);
                        $('#ship_qty').prop('readonly', true);
                        $('#qc_pic').prop('readonly', true);
                        $('#invoice_no').prop('readonly', true);
                        $('#container_no').prop('readonly', true);
                        $('#truck_plate_no').prop('readonly', true);
                        $('#shipping_seal_no').prop('readonly', true);
                        $('#peza_seal_no').prop('readonly', true);

                        $('#btn_start_scan').html("Stop Scan");
                        $('#btn_start_scan').removeClass("btn-success");
                        $('#btn_start_scan').addClass("btn-danger");
                        $('#pallet_qr').prop('readonly', false);
                        $('#pallet_qr').val('');

                        $('#tbl_models').addClass('disabled');
                        $('#tbl_pallets').addClass('disabled');

                        $('#btn_save_transaction').prop('disabled', true);
                        $('#btn_delete_transaction').prop('disabled', true);
                        $('#btn_complete_transaction').prop('disabled', true);

                        $('#destination').select2({
                            disabled: true,
                            allowClear: true,
                            placeholder: 'Select Customer Destination',
                            theme: 'bootstrap4',
                            width: 'auto',
                        });

                        self.hideInputErrors('pallet_qr');
                    } else {
                        $('#warehouse_pic').prop('readonly', false);
                        $('#ship_qty').prop('readonly', false);
                        $('#qc_pic').prop('readonly', false);
                        $('#invoice_no').prop('readonly', false);
                        $('#container_no').prop('readonly', false);
                        $('#truck_plate_no').prop('readonly', false);
                        $('#shipping_seal_no').prop('readonly', false);
                        $('#peza_seal_no').prop('readonly', false);

                        $('#btn_start_scan').html("Start Scan");
                        $('#btn_start_scan').removeClass("btn-danger");
                        $('#btn_start_scan').addClass("btn-success");
                        $('#pallet_qr').prop('readonly', true);
                        $('#pallet_qr').val('');

                        $('#tbl_models').removeClass('disabled');
                        $('#tbl_pallets').removeClass('disabled');

                        $('#btn_save_transaction').prop('disabled', false);
                        $('#btn_delete_transaction').prop('disabled', false);
                        $('#btn_complete_transaction').prop('disabled', false);

                        $('#destination').select2({
                            disabled: false,
                            allowClear: true,
                            placeholder: 'Select Customer Destination',
                            theme: 'bootstrap4',
                            width: 'auto',
                        });
                        
                        self.hideInputErrors('pallet_qr');
                    }
                    
                    break;
                case 'MODEL_SELECTED':
                    $('#btn_sort_by').prop('disabled', false);
                    $('#btn_start_scan').prop('disabled', false);
                    break;
                case 'MODEL_DESELECTED':
                    $('#btn_sort_by').prop('disabled', true);
                    $('#btn_start_scan').prop('disabled', true);
                    break;
                case 'DELETED':
                case 'SHIPPED':
                case 'CANCELLED':
                    $('#tbl_models').addClass('disabled');
                    $('#tbl_shipment_details').addClass('disabled');

                    $('#destination').select2({
                        disabled: true,
                        allowClear: true,
                        placeholder: 'Select Customer Destination',
                        theme: 'bootstrap4',
                        width: 'auto',
                    });

                    $('#warehouse_pic').prop('readonly', true);
                    $('#ship_qty').prop('readonly', true);

                    $('#btn_start_scan').prop('disabled', true);
                    $('#btn_save_transaction').prop('disabled', true);
                    $('#btn_delete_transaction').prop('disabled', true);
                    $('#btn_complete_transaction').prop('disabled', true);
                    break;
                case 'COMPLETED':
                    $('#tbl_models').removeClass('disabled');
                    $('#tbl_shipment_details').removeClass('disabled');

                    $('#destination').select2({
                        disabled: false,
                        allowClear: true,
                        placeholder: 'Select Customer Destination',
                        theme: 'bootstrap4',
                        width: 'auto',
                    });

                    $('#warehouse_pic').prop('readonly', false);
                    $('#ship_qty').prop('readonly', false);

                    $('#btn_start_scan').prop('disabled', false);
                    $('#btn_save_transaction').prop('disabled', true);
                    $('#btn_delete_transaction').prop('disabled', true);
                    $('#btn_complete_transaction').prop('disabled', false);
                    break;
                case 'INCOMPLETE':
                    $('#tbl_models').removeClass('disabled');
                    $('#tbl_shipment_details').removeClass('disabled');

                    $('#destination').select2({
                        disabled: false,
                        allowClear: true,
                        placeholder: 'Select Customer Destination',
                        theme: 'bootstrap4',
                        width: 'auto',
                    });

                    $('#warehouse_pic').prop('readonly', false);
                    $('#ship_qty').prop('readonly', false);

                    $('#btn_start_scan').prop('disabled', false);
                    $('#btn_save_transaction').prop('disabled', false);
                    $('#btn_delete_transaction').prop('disabled', false);
                    $('#btn_complete_transaction').prop('disabled', false);
                    break;
                default:
                    $('#btn_transfer').prop('disabled', true);
                    $('#btn_sort_by').prop('disabled', true);
                    $('#btn_close_shipment').prop('disabled', true);
                    $('#btn_start_scan').prop('disabled', true);

                    $('#btn_start_scan').prop('disabled', false);
                    $('#btn_start_scan').html("Start Scan");
                    $('#btn_start_scan').removeClass("btn-danger");
                    $('#btn_start_scan').addClass("btn-success");
                    $('#pallet_qr').prop('readonly', true);
                    $('#pallet_qr').val('');

                    $('#tbl_models').removeClass('disabled');
                    $('#tbl_pallets').removeClass('disabled');

                    $('#btn_remove_shipment_details').prop('disabled', true);

                    $('#btn_save_transaction').prop('disabled', false);
                    $('#btn_delete_transaction').prop('disabled', false);
                    $('#btn_complete_transaction').prop('disabled', false);
                    
                    self.hideInputErrors('pallet_qr');
                    break;
            }
        },
        RunDateTime: function() {
            const zeroFill = n => {
				return ('0' + n).slice(-2);
			}

			const interval = setInterval(() => {
				const now = new Date();
				const dateTime =  now.getFullYear() + '/' + zeroFill((now.getMonth() + 1)) + '/' + zeroFill(now.getUTCDate()) + ' ' + zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds());

				$('#present_date_time').val(dateTime);
			}, 1000);
        },
        drawModelsDatatables: function() {
            var self = this;
            var pageScrollPos = "";
            if (!$.fn.DataTable.isDataTable('#tbl_models')) {
                self.$tbl_models = $('#tbl_models').DataTable({
                    scrollY: "110px",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    columnDefs: [ {
                        orderable: false,
                        searchable: false,
                        className: 'select-checkbox',
                        targets:   0
                    } ],
                    select: {
                        style: 'single',
                    },
                    ajax: {
                        url: "/transactions/shipment/get-models-for-ship",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.state = self.editstate;
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
                        emptyTable: "No Pallets were transferred to warehouse yet.",
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
                    deferRender: true,
                    columns: [
                        { 
                            data: 'model_id', render: function() {
                                return '';
                            }, name: 'model_id', searchable: false, orderable: false, width: '15px'
                        },
                        { 
                            data: 'model', name: 'model', searchable: false, orderable: false,
                        }
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                        $('#tbl_models > .dataTables_scrollBody').slimscroll();
                        $('#tbl_models > .dataTables_scrollBody').css('height','110px');
                        $('#tbl_models > .dataTables_scroll > .slimScrollDiv').css('height','110px');

                        $('#tbl_models > .dataTables_scrollBody').css('min-height','110px');
                        $('#tbl_models > .dataTables_scroll > .slimScrollDiv').css('min-height','110px');
                    },
                    preDrawCallback: function (settings) {
                        pageScrollPos = $('div.dataTables_scrollBody').scrollTop();
                    },
                    fnDrawCallback: function() {
                        $('div.dataTables_scrollBody').scrollTop(pageScrollPos);
                        var data = this.fnGetData();
                        var data_count = data.length;
                        $('#model_count').html(data_count);
                        
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawPalletsDatatables: function() {
            var self = this;
            var pageScrollPos = "";
            if (!$.fn.DataTable.isDataTable('#tbl_pallets')) {
                self.$tbl_pallets = $('#tbl_pallets').DataTable({
                    scrollY: "300px",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    ajax: {
                        url: "/transactions/shipment/get-pallets",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.model_id = $('#model_id').val();
                            d.state = self.editstate;
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
                        emptyTable: "Please select model to display the pallets",
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
                    deferRender: true,
                    columns: [
                        // { 
                        //     data: 'id', render: function() {
                        //         return '';
                        //     }, name: 'id', searchable: false, orderable: false, width: '15px'
                        // },
                        { 
                            data: 'pallet_qr', name: 'pallet_qr', searchable: false, orderable: false,
                        },
                        { 
                            data: 'box_qty', name: 'box_qty', searchable: false, orderable: false,
                        },
                        { 
                            data: 'hs_qty', name: 'hs_qty', searchable: false, orderable: false,
                        }
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);
                        dataRow.attr('id','r'+data.id);
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                        $('#tbl_pallets_wrapper > .dataTables_scrollBody').slimscroll();
                        $('#tbl_pallets_wrapper > .dataTables_scrollBody').css('height','300px');
                        $('#tbl_pallets_wrapper > .dataTables_scroll > .slimScrollDiv').css('height','300px');

                        $('#tbl_pallets_wrapper > .dataTables_scrollBody').css('min-height','300px');
                        $('#tbl_pallets_wrapper > .dataTables_scroll > .slimScrollDiv').css('min-height','300px');
                    },
                    preDrawCallback: function (settings) {
                    },
                    fnDrawCallback: function() {
                        var data = this.fnGetData();
                        var data_count = data.length;
                        $('#available_pallet').val(data_count);
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawShipmentDetailsDatatables: function() {
            var self = this;
            var pageScrollPos = "";
            if (!$.fn.DataTable.isDataTable('#tbl_shipment_details')) {
                self.$tbl_shipment_details = $('#tbl_shipment_details').DataTable({
                    scrollY: "300px",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    columnDefs: [ {
                        orderable: false,
                        searchable: false,
                        className: 'select-checkbox',
                        targets:   0
                    } ],
                    select: {
                        style: 'single',
                    },
                    ajax: {
                        url: "/transactions/shipment/get-shipment-details",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.id = $('#id').val();
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
                        emptyTable: "Please select model to display the pallets",
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
                    deferRender: true,
                    columns: [
                        {
                            data: function() { return ''; }, name: 'pallet_id', searchable: false, orderable: false,
                        },
                        { 
                            data: 'pallet_qr', name: 'pallet_qr', searchable: false, orderable: false,
                        },
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);
                        dataRow.attr('id','r'+data.id);
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                        $('#tbl_shipment_details_wrapper > .dataTables_scrollBody').slimscroll();
                        $('#tbl_shipment_details_wrapper > .dataTables_scrollBody').css('height','300px');
                        $('#tbl_shipment_details_wrapper > .dataTables_scroll > .slimScrollDiv').css('height','300px');

                        $('#tbl_shipment_details_wrapper > .dataTables_scrollBody').css('min-height','300px');
                        $('#tbl_shipment_details_wrapper > .dataTables_scroll > .slimScrollDiv').css('min-height','300px');
                    },
                    preDrawCallback: function (settings) {
                    },
                    fnDrawCallback: function() {
                        var data = this.fnGetData();
                        var total_hs_qty = 0;
                        $.each(data, function(i,x) {
                            total_hs_qty += x.hs_qty;
                        });

                        $('#total_ship_qty').html(total_hs_qty);
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawShipmentsDatatables: function() {
            var self = this;
            var pageScrollPos = "";
            if (!$.fn.DataTable.isDataTable('#tbl_shipments')) {
                self.$tbl_shipments = $('#tbl_shipments').DataTable({
                    processing: true,
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
                        url: "/transactions/shipment/get-shipments",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                        },
                        error: function(response) {
                            console.log(response);
                        }
                    },
                    order: [
                        [9, 'desc'],
                        [2, 'desc']
                    ],
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No Shipment created",
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
                    deferRender: true,
                    columns: [
                        { data: function(data) {
                            return '';
                        }, name: 'id', searchable: false, orderable: false },
                        { data: function(data) {
                            return '<button type="button" class="btn btn-sm btn-blue btn_edit_shipment"><i class="fa fa-edit"></i></button>';
                        }, name: 'id', searchable: false, orderable: false, className: 'p-0' },
                        { data: 'control_no', name: 'control_no', searchable: false, orderable: false },
                        { data: 'model', name: 'model', searchable: false, orderable: false },
                        { data: 'shipment_status', name: 'shipment_status', searchable: false, orderable: false },
                        { data: 'ship_qty', name: 'ship_qty', searchable: false, orderable: false },
                        { data: 'total_ship_qty', name: 'total_ship_qty', searchable: false, orderable: false },
                        { data: 'destination', name: 'destination', searchable: false, orderable: false },
                        { data: 'shipper', name: 'shipper', searchable: false, orderable: false },
                        { data: 'ship_date', name: 'ship_date', searchable: false, orderable: false },
                        { data: function(data) {
                            return '<button type="button" class="btn btn-sm btn-green btn-block btn_print_shipment"><i class="fa fa-print"></i></button>';
                        }, name: 'id', searchable: false, orderable: false, className: 'p-1' }
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);

                        var shipment_status = parseInt(data.shipment_status);
                        switch (shipment_status) {
                            case 4:
                                $(dataRow[0].cells[4]).css('background-color', '#9C254D');
                                $(dataRow[0].cells[4]).css('color', '#FFFFFF');
                                $(dataRow[0].cells[4]).html('DELETED');
                                $(dataRow[0].cells[0]).removeClass('select-checkbox');

                                for (let index = 0; index < 10; index++) {
                                    if (index != 1) {
                                        $(dataRow[0].cells[index]).addClass('disabled');
                                    }
                                }
                                break;
                            case 3:
                                $(dataRow[0].cells[4]).css('background-color', '#00acac');
                                $(dataRow[0].cells[4]).css('color', '#FFFFFF');
                                $(dataRow[0].cells[4]).html('SHIPPED');
                                $(dataRow[0].cells[0]).removeClass('select-checkbox');

                                for (let index = 0; index < 10; index++) {
                                    if (index != 1) {
                                        $(dataRow[0].cells[index]).addClass('disabled');
                                    }
                                }
                                break;
                            case 2:
                                $(dataRow[0].cells[4]).css('background-color', '#EB455F');
                                $(dataRow[0].cells[4]).css('color', '#FFFFFF');
                                $(dataRow[0].cells[4]).html('CANCELLED');
                                $(dataRow[0].cells[0]).removeClass('select-checkbox');

                                for (let index = 0; index < 10; index++) {
                                    if (index != 1) {
                                        $(dataRow[0].cells[index]).addClass('disabled');
                                    }
                                }
                                break;
                            case 1:
                                $(dataRow[0].cells[4]).css('background-color', '#0081C9');
                                $(dataRow[0].cells[4]).css('color', '#FFFFFF');
                                $(dataRow[0].cells[4]).html('COMPLETED');
                                break;
                            case 0:
                                $(dataRow[0].cells[4]).css('background-color', '#C58940');
                                $(dataRow[0].cells[4]).css('color', '#FFFFFF');
                                $(dataRow[0].cells[4]).html('INCOMPLETE');
                                break;
                            default:
                                $(dataRow[0].cells[4]).css('background-color', '#ced4da');
                                $(dataRow[0].cells[4]).css('color', '#433333');
                                $(dataRow[0].cells[3]).html('');
                                break;
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                    },
                    preDrawCallback: function (settings) {
                    },
                    fnDrawCallback: function() {
                        $("#tbl_shipments").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                        var data = this.fnGetData();
                        var data_count = data.length;
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        TransferTo: function (param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/shipment/transfer-to";
            self.sendData().then(function() {
                self.$tbl_pallets.row(param.row_index).remove().draw();
                $('#modal_transfer_to').modal('hide');
            });
        },
        addToShipmentDetails: function(param) {
            var self = this;
            self.$tbl_shipment_details.rows.add([param]).draw();
        },
        saveTransaction: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/shipment/save-transaction";
            self.sendData().then(function() {
                var response = self.responseData;
                $('.clear').val('');
                $('#destination').val(null).trigger('change.select2');
                self.$tbl_models.rows({selected: true}).deselect();
                self.$tbl_shipment_details.clear().draw();
                self.$tbl_shipments.ajax.reload();
            });
        },
        deleteTransaction: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/shipment/delete-transaction";
            self.sendData().then(function() {
                var response = self.responseData;
                $('.clear').val('');
                $('#destination').val(null).trigger('change.select2');
                self.$tbl_models.rows({selected: true}).deselect();
                self.$tbl_shipment_details.clear().draw();
                self.$tbl_shipments.ajax.reload();
            });
        },
        completeTransaction: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/shipment/complete-transaction";
            self.sendData().then(function() {
                var response = self.responseData;
                $('.clear').val('');
                $('#destination').val(null).trigger('change.select2');
                self.$tbl_models.rows({selected: true}).deselect();
                self.$tbl_shipment_details.clear().draw();
                self.$tbl_shipments.ajax.reload();
            });
        },
        cancelShipment: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/shipment/cancel-shipment";
            self.sendData().then(function() {
                var response = self.responseData;
                self.$tbl_shipments.ajax.reload();
            });
        },
        finishShipment: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/shipment/finish-shipment";
            self.sendData().then(function() {
                var response = self.responseData;
                self.$tbl_shipments.ajax.reload();
            });
        },
        initModal: function(){
            if($('#ship_qty').val() != ""){
                $('#ship_qty').val("").trigger('change');
            }
            this.$tbl_models.rows( { selected: true }).deselect();
            this.$tbl_shipment_details.clear().draw();
            this.shipment_details_arr = {};
            $("#control_no").val("");
            $("#invoice_no").val("");
            $("#container_no").val("");
            $("#truck_plate_no").val("");
            $("#shipping_seal_no").val("");
            $("#peza_seal_no").val("");
            $("#invoice_no").prop('readonly', false);
            $("#container_no").prop('readonly', false);
            $("#truck_plate_no").prop('readonly', false);
            $("#shipping_seal_no").prop('readonly', false);
            $("#peza_seal_no").prop('readonly', false);
            $('#destination').val("").trigger('change');
            $('#btn_start_scan').html("Start Scan");
            $('#btn_start_scan').removeClass("btn-danger");
            $('#btn_start_scan').addClass("btn-success");

            $('#btn_start_scan').prop('disabled', false);
            $('#warehouse_pic').prop('readonly', false);
            $('#ship_qty').prop('readonly', false);
            $('#pallet_qr').prop('readonly', true);
            $('#pallet_qr').val('');

            $('#tbl_models').removeClass('disabled');
            $('#tbl_pallets').removeClass('disabled');
            $('#destination').select2({
                disabled:false,
                allowClear: true,
                placeholder: 'Select Customer Destination',
                theme: 'bootstrap4',
                width: 'auto',
                ajax: {
                    url: '/transactions/shipment/get-customer-destinations',
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
            $('#btn_remove_shipment_details').prop('disabled', false);
            // this.viewState('SCAN');
            
        },
        ValidatePallet:function(param){
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/shipment/validate-Palletqr";
            self.sendData().then(function() {
                var response = self.responseData;
                if(response == 0){
                    self.addToShipmentDetails(self.shipment_details_arr);
                }else{
                    self.swMsg("Pallet is already on Loading","warning");
                    self.shipment_details_arr = {};
                }
            });
        }

    }
    Shipment.init.prototype = $.extend(Shipment.prototype, $D.init.prototype, $F.init.prototype);
    Shipment.init.prototype = Shipment.prototype;

    $(document).ready(function() {
        var _Shipment = Shipment();
        _Shipment.permission();
        _Shipment.viewState('');
        // _Shipment.RunDateTime();
        _Shipment.drawShipmentsDatatables();
        _Shipment.drawModelsDatatables();
        _Shipment.drawPalletsDatatables();
        _Shipment.drawShipmentDetailsDatatables();

        $('.modal').on('shown.bs.modal', function (e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });
        $('.modal').on('hidden.bs.modal', function (e) {
            
        });

        $('#destination').select2({
            allowClear: true,
            placeholder: 'Select Customer Destination',
            theme: 'bootstrap4',
            width: 'auto',
            ajax: {
                url: '/transactions/shipment/get-customer-destinations',
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

        $('#btn_create_shipment').on('click', function() {
            _Shipment.initModal();
            $('#modal_shipment').modal('show');
            _Shipment.editstate = false;
            $('#btn_delete_transaction').prop('disabled',true);
            $('#btn_complete_transaction').prop('disabled',true);
        });

        _Shipment.$tbl_models.on('select', function ( e, dt, type, indexes ) {
            var data = _Shipment.$tbl_models.row( indexes ).data();
            $('#model_id').val(data.model_id);
            $('#model').val(data.model);
            $('#selected_model').html(data.model);
            // _Shipment.viewState('MODEL_SELECTED');
            _Shipment.$tbl_pallets.ajax.reload();
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#model_id').val('');
            $('#model').val('');
            $('#selected_model').html('');
            // _Shipment.viewState('MODEL_DESELECTED');
            _Shipment.$tbl_pallets.ajax.reload();
        });

        _Shipment.$tbl_shipment_details.on('select', function ( e, dt, type, indexes ) {
            var count = _Shipment.$tbl_shipment_details.rows({selected: true}).count();

            if (count > 0) {
                $('#btn_remove_shipment_details').prop('disabled', false);
            }
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            var count = _Shipment.$tbl_shipment_details.rows({selected: true}).count();

            if (count == 0) {
                $('#btn_remove_shipment_details').prop('disabled', true);
            }
        });

        _Shipment.$tbl_shipments.on('select', function ( e, dt, type, indexes ) {
            var count = _Shipment.$tbl_shipments.rows({selected: true}).count();

            if (count > 0) {
                $('#btn_create_shipment').prop('disabled', true);
                $('#btn_cancel_shipment').prop('disabled', false);
                $('#btn_finish_shipment').prop('disabled', false);
            }
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            var count = _Shipment.$tbl_shipments.rows({selected: true}).count();

            if (count == 0) {
                $('#btn_create_shipment').prop('disabled', false);
                $('#btn_cancel_shipment').prop('disabled', true);
                $('#btn_finish_shipment').prop('disabled', true);
            }
        });

        $('#btn_start_scan').on('click', function () {
            var model = $('#model').val();
            var warehouse_pic = $('#warehouse_pic').val();
            var destination = $('#destination').val();
            var ship_qty = $('#ship_qty').val();
            var container_no = $('#container_no').val();
            var invoice_no = $('#invoice_no').val();
            var truck_plate_no = $('#truck_plate_no').val();
            var shipping_seal_no = $('#shipping_seal_no').val();
            var Peza_seal_no = $('#Peza_seal_no').val();

            if (model == "") {
                _Shipment.swMsg('Please select a Model','warning');
            }
            else if (warehouse_pic == "") {
                _Shipment.swMsg('Please input a Shipper / Warehouse PIC','warning');
            }
            else if (destination == "" || destination == null) {
                _Shipment.swMsg('Please choose Customer Destination.','warning');
            }
            else if (ship_qty < 1 || ship_qty == "") {
                _Shipment.swMsg('Please provide Target Shipment Qty.','warning');
            }
            else if (container_no == "") {
                _Shipment.swMsg('Please provide Target Container No.','warning');
            }
            else if (invoice_no == "") {
                _Shipment.swMsg('Please provide Target Invoice No.','warning');
            }
            else if (truck_plate_no == "") {
                _Shipment.swMsg('Please provide Target Truck Plate No.','warning');
            }
            else if (shipping_seal_no == "") {
                _Shipment.swMsg('Please provide Target Shipping Seal No.','warning');
            }
            else if (Peza_seal_no == "") {
                _Shipment.swMsg('Please provide Target Peza Seal No.','warning');
            }
            else {
                _Shipment.viewState('SCAN');
            }
            
        });

        $('#pallet_qr').on('change', function() {
            var pallet_qr = $(this).val();
            var pallet_id = 0;
            var box_qty = 0;
            var hs_qty = 0;
            let ship_qty = $('#ship_qty').val();
            let total_hs_qty = parseInt($('#total_ship_qty').html());
            var shipper = $('#warehouse_pic').val();
            pallet_qr = pallet_qr.replace(/\s/g, '');
            var validated = false;

            _Shipment.$tbl_pallets.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
                var data = this.data();
                
                if (data.pallet_qr == pallet_qr) {
                    pallet_id = data.id;
                    box_qty = data.box_qty;
                    hs_qty = data.hs_qty;
                    validated = true;
                    return false;
                }
            });
            
            if (!validated) {
                _Shipment.swMsg("Pallet ID is not belong in this model.","warning");
            } else {
                var already_scanned = false;
                _Shipment.$tbl_shipment_details.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
                    var data = this.data();
                    
                    if (data.pallet_qr == pallet_qr) {
                        already_scanned = true;
                        return false;
                    }
                });
                if(hs_qty > ship_qty){
                    _Shipment.swMsg("The ship quantity is not enough to for scanned pallet","warning");
                    return;
                }
                if((ship_qty - total_hs_qty) < hs_qty){
                    _Shipment.swMsg("The HS quantity of pallet is more than the total ship quantity ","warning");
                    return;
                }
                if (already_scanned) {
                    _Shipment.swMsg("Pallet ID was already scanned.","warning");

                } else {
                    _Shipment.shipment_details_arr = {
                        'pallet_qr': pallet_qr,
                        'pallet_id': pallet_id,
                        'box_qty': box_qty,
                        'hs_qty': hs_qty
                    };
                    var param = {
                        _token: _Shipment.token,
                        qr:pallet_qr
                    }
                    _Shipment.ValidatePallet(param)
                   
                    
                }
            }

            $('#pallet_qr').val('');
        });

        $('#ship_qty').on('change', function() {
            var ship_qty = parseInt($(this).val());
            var model = _Shipment.$tbl_models.row({ selected:true }).data();

            if (model != undefined) {
                var pallet_qty = parseInt(ship_qty / parseInt(model.hs_qty));
                var box_qty = parseInt(pallet_qty * parseInt(model.box_qty));
                var hs_qty_per_box = pallet_qty * parseInt(model.hs_qty);
                var broken_pcs_qty = parseInt(ship_qty - hs_qty_per_box);
                var model_hs_qty = parseInt(model.hs_qty);
    
                $('#pallet_qty').val(pallet_qty);
                $('#box_qty').val(box_qty);
                $('#broken_pcs_qty').val(broken_pcs_qty);
                $('#hs_qty').val(hs_qty_per_box);
                $('#model_hs_qty').val(model_hs_qty);
            } else {
                $(this).val('');
                _Shipment.swMsg("Please Select a Model before declaring Shipment Qty.","warning");
            }
        });

        $('#btn_remove_shipment_details').on('click', function() {
            var msg = "Are you sure to remove all selected Pallets?";
            _Shipment.msg = msg;
            _Shipment.confirmAction(msg).then(function(approve) {
                if (approve) {
                    _Shipment.$tbl_shipment_details.rows({selected: true}).remove().draw();
                }
            });
        });

        $('#btn_save_transaction').on('click', function() {
            var msg = "Are you sure to save this Transaction?";
            var status = 0;
            _Shipment.msg = msg;
            _Shipment.confirmAction(msg).then(function(approve) {
                if (approve) {
                    var total_hs_qty = parseInt($('#total_ship_qty').html());
                    var ship_qty = parseInt($('#ship_qty').val());

                    if (ship_qty == total_hs_qty) {
                        status = 1
                    }

                    var param = {
                        _token: _Shipment.token,
                        id: $('#id').val(),
                        control_no: $('#control_no').val(),
                        model_id: $('#model_id').val(),
                        model: $('#model').val(),
                        warehouse_pic: $('#warehouse_pic').val(),
                        qc_pic:$("#qc_pic").val(),
                        destination: $('#destination').val(),
                        hs_qty: $('#hs_qty').val(),
                        model_hs_qty: $('#model_hs_qty').val(),
                        ship_qty: $('#ship_qty').val(),
                        pallet_qty: $('#pallet_qty').val(),
                        box_qty: $('#box_qty').val(),
                        broken_pcs_qty: $('#broken_pcs_qty').val(),
                        status: status,
                        container_no: $('#container_no').val(),
                        invoice_no: $('#invoice_no').val(),
                        shipping_seal_no: $('#shipping_seal_no').val(),
                        truck_plate_no: $('#truck_plate_no').val(),
                        peza_seal_no: $('#peza_seal_no').val(),
                        shipment_details: _Shipment.$tbl_shipment_details.rows().data().toArray()
                    };
                    _Shipment.saveTransaction(param);
                }
            });
        });

        $('#tbl_shipments tbody').on('click', '.btn_edit_shipment', function() {
            var data = _Shipment.$tbl_shipments.row($(this).parents('tr')).data();
            console.log(data);
            _Shipment.editstate = true;
            _Shipment.$tbl_models.row(':contains("'+data.model+'")').select();

            $('#container_no').val(data.container_no);
            $('#invoice_no').val(data.invoice_no);
            $('#shipping_seal_no').val(data.shipping_seal_no);
            $('#truck_plate_no').val(data.truck_plate_no);
            $('#peza_seal_no').val(data.peza_seal_no);
            $('#qc_pic').val(data.qc_pic);
            $('#id').val(data.id);
            $('#control_no').val(data.control_no);
            var destination = new Option(data.destination, data.destination, false, false);
            $('#destination').append(destination).trigger('change');
            $('#ship_qty').val(data.ship_qty).trigger('change');

            _Shipment.$tbl_shipment_details.ajax.reload();

            var shipment_status = parseInt(data.shipment_status);
            switch (shipment_status) {
                case 4:
                    _Shipment.viewState('DELETED');
                    break;
                case 3:
                    _Shipment.viewState('SHIPPED');
                    break;
                case 2:
                    _Shipment.viewState('CANCELLED');
                    break;
                case 1:
                    _Shipment.viewState('COMPLETED');
                    break;
                default:
                    _Shipment.viewState('INCOMPLETE');
                    break;
            }

            $('#modal_shipment').modal('show');
        });

        $('#btn_delete_transaction').on('click', function() {
            var msg = "Are you sure to delete this Transaction?";
            _Shipment.msg = msg;
            _Shipment.confirmAction(msg).then(function(approve) {
                if (approve) {
                    var id = $('#id').val();

                    var param = {
                        _token: _Shipment.token,
                        id: id,
                        status: 4
                    };
                    _Shipment.deleteTransaction(param);
                }
            });
        });

        $('#btn_complete_transaction').on('click', function() {
            var msg = "Are you sure to complete this Transaction?";
            _Shipment.msg = msg;
            _Shipment.confirmAction(msg).then(function(approve) {
                if (approve) {
                    var id = $('#id').val();

                    var param = {
                        _token: _Shipment.token,
                        id: id,
                        status: 1
                    };
                    _Shipment.completeTransaction(param);
                }
            });
        });

        $('#btn_cancel_shipment').on('click', function() {
            var data = _Shipment.$tbl_shipments.rows({selected: true}).data().toArray();
            var count = _Shipment.$tbl_shipments.rows({selected: true}).count();
            var msg = "Are you sure to cancel this Shipment?";

            if (count > 1) {
                msg = "Are you sure to cancel these Shipments?";
            }

            _Shipment.msg = msg;
            _Shipment.confirmAction(msg).then(function(approve) {
                if (approve) {
                    var ids = [];

                    $.each(data, function(i,x) {
                        ids.push(x.id);
                    });

                    var param = {
                        _token: _Shipment.token,
                        ids: ids,
                        status: 2
                    };
                    _Shipment.cancelShipment(param);
                }
            });
        });

        $('#btn_finish_shipment').on('click', function() {
            var data = _Shipment.$tbl_shipments.rows({selected: true}).data().toArray();
            var count = _Shipment.$tbl_shipments.rows({selected: true}).count();
            var msg = "Are you sure to finish this Shipment?";
            var notCompleteArr = data.filter(i => i.shipment_status != 1)
            if(notCompleteArr.length > 0){
                _Shipment.swMsg("Contains Incomplete Pallet","warning");
                return;
            }
            if (count > 1) {
                msg = "Are you sure to finish these Shipments?";
            }

            _Shipment.msg = msg;
            _Shipment.confirmAction(msg).then(function(approve) {
                if (approve) {
                    var ids = [];

                    $.each(data, function(i,x) {
                        ids.push(x.id);
                    });

                    var param = {
                        _token: _Shipment.token,
                        ids: ids,
                        status: 3
                    };
                    _Shipment.finishShipment(param);
                }
            });
        });

        $('#tbl_shipments tbody').on('click', '.btn_print_shipment', function() {
            var data = _Shipment.$tbl_shipments.row($(this).closest('tr')).data() ; 
            if(data.shipment_status == 1){
                window.open('/transactions/shipment/system-report?id='+data.id, '_tab');
            }else{
            _Shipment.swMsg("You cannot print the reports of not completed shipment","warning")
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
