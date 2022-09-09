"use strict";

(function() {
    const BoxPalletApp = function() {
        return new BoxPalletApp.init();
    }
    BoxPalletApp.init = function() {
        $D.init.call(this);
        $F.init.call(this);
        this.$tbl_transactions = "";
        this.$tbl_pallets = "";
        this.$tbl_boxes = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
        this.BoxPalletApp_checked = 0;
        this.box_qr_code = "";
        this.pallet_qr_code = "";
        this.prv_box_id_qr = "";
        this.prv_pallet_id_qr = "";
        this.removed_box_arr = [];
    }
    BoxPalletApp.prototype = {
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
                case 'NEW':
                    $('#model_id').select2({
                        disabled: false,
                        allowClear: true,
                        placeholder: 'Select Model',
                        theme: 'bootstrap4',
                        width: 'auto',
                        ajax: {
                            url: '/transactions/box-and-pallet/get-models',
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
                    $('#target_hs_qty').prop('readonly', false);
                    $('#btn_add_new').prop('disabled', true);
                    $('#btn_cancel').prop('disabled', false);
                    $('#btn_proceed').prop('disabled', false);
                    $('#btn_start_scan').prop('disabled', true);

                    $('#tbl_transactions').addClass('disabled');
                    $('#tbl_pallets').addClass('disabled');
                    $('#tbl_boxes').addClass('disabled');
                    break;

                case 'UPDATE':
                    $('#model_id').select2({
                        disabled: false,
                        allowClear: true,
                        placeholder: 'Select Model',
                        theme: 'bootstrap4',
                        width: 'auto',
                        ajax: {
                            url: '/transactions/box-and-pallet/get-models',
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
                    }).trigger('change.select2');

                    $('#target_hs_qty').prop('readonly', false);
                    $('#btn_add_new').prop('disabled', true);
                    $('#btn_cancel').prop('disabled', false);
                    $('#btn_proceed').prop('disabled', false);
                    $('#btn_start_scan').prop('disabled', true);

                    $('#tbl_transactions').addClass('disabled');
                    $('#tbl_pallets').addClass('disabled');
                    $('#tbl_boxes').addClass('disabled');

                    $('#btn_transfer').prop('disabled', true);
                    $('#btn_update').prop('disabled', true);
                    $('#btn_broken_pallet').prop('disabled', true);
                    break;

                case 'SCAN':
                    var title = $('#btn_start_scan').html();
                    if (title == "Start Scan") {
                        $('#btn_add_new').prop('disabled', true);
                        $('#btn_cancel').prop('disabled', true);
                        $('#btn_proceed').prop('disabled', true);
                        $('#btn_start_scan').html("Stop Scan");
                        $('#btn_start_scan').removeClass("btn-success");
                        $('#btn_start_scan').addClass("btn-danger");
                        $('#box_qr').prop('readonly', false);
                        $('#box_qr').val('');
                        $('#tbl_transactions').addClass('disabled');
                        $('#tbl_pallets').addClass('disabled');
                        $('#tbl_boxes').addClass('disabled');

                        $('#btn_delete_transaction').prop('disabled', true);
                        $('#btn_transfer').prop('disabled', true);
                        $('#btn_update').prop('disabled', true);
                        $('#btn_broken_pallet').prop('disabled', true);
                        $('#btn_print_preview').prop('disabled', true);
                        $('#btn_print_pallet').prop('disabled', true);
                        $('#btn_reprint_pallet').prop('disabled', true);

                        self.hideInputErrors('box_qr');
                    } else {
                        $('#btn_add_new').prop('disabled', false);

                        var pallet_id = $('#pallet_id').val();

                        if (pallet_id != "") {
                            $('#btn_cancel').prop('disabled', false);
                            $('#btn_proceed').prop('disabled', false);
                        } else {
                            $('#btn_cancel').prop('disabled', true);
                            $('#btn_proceed').prop('disabled', true);
                        }
                        
                        $('#btn_start_scan').html("Start Scan");
                        $('#btn_start_scan').removeClass("btn-danger");
                        $('#btn_start_scan').addClass("btn-success");
                        $('#box_qr').prop('readonly', true);
                        $('#box_qr').val('');
                        $('#tbl_transactions').removeClass('disabled');
                        $('#tbl_pallets').removeClass('disabled');
                        $('#tbl_boxes').removeClass('disabled');

                        $('#btn_delete_transaction').prop('disabled', false);
                        $('#btn_transfer').prop('disabled', false);
                        $('#btn_update').prop('disabled', false);
                        $('#btn_broken_pallet').prop('disabled', false);
                        $('#btn_print_preview').prop('disabled', false);
                        $('#btn_print_pallet').prop('disabled', false);
                        $('#btn_reprint_pallet').prop('disabled', false);

                        self.hideInputErrors('box_qr');
                    }
                    
                    break;
            
                default:
                    $('#model_id').select2({
                        disabled: true,
                        allowClear: true,
                        placeholder: 'Select Model',
                        theme: 'bootstrap4',
                        width: 'auto',
                    });
                    $('#target_hs_qty').prop('readonly', true);
                    $('#btn_add_new').prop('disabled', false);
                    $('#btn_cancel').prop('disabled', true);
                    $('#btn_proceed').prop('disabled', true);
                    $('#btn_start_scan').prop('disabled', false);

                    $('#tbl_transactions').removeClass('disabled');
                    $('#tbl_pallets').removeClass('disabled');
                    $('#tbl_boxes').removeClass('disabled');

                    $('#btn_add_new').html('<i class="fa fa-plus"></i> Add New');
                    $('#btn_add_new').removeClass('btn-info');
                    $('#btn_add_new').addClass('btn-primary');

                    $('#save_div').hide()
                    $('#preview_div').show()

                    $('#btn_delete_transaction').prop('disabled', true);
                    $('#btn_transfer').prop('disabled', true);
                    $('#btn_update').prop('disabled', true);
                    $('#btn_broken_pallet').prop('disabled', true);
                    $('#btn_reprint_pallet').prop('disabled', true);
                    
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
        clearForm: function(inputs) {
            var self = this;
            $('#model_id').val(null).trigger('change.select2');
            $.each(inputs, function(i,x) {
                $('#'+x).val('');
                self.hideInputErrors(x);
            });
        },
        drawTransactionsDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_transactions')) {
                self.$tbl_transactions = $('#tbl_transactions').DataTable({
                    scrollY: "43vh",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    select: {
                        style: 'single'
                    },
                    ajax: {
                        url: "/transactions/box-and-pallet/get-transactions",
                        type: 'POST',
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                        },
                        error: function(response) {
                            if (response.hasOwnProperty('responseJSON')) {
                                if (response.status == 401) {
                                    window.location.href = "/login";
                                }
                            }
                        }
                    },
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No Model was transacted.",
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
                                return '<span>'+data.model+'</span><br>'+
                                        '<small>Target: '+data.target_no_of_pallet+' Pallets</small><br>'+
                                        '<small>Created: '+data.created_at+'</small>';
                        }, name: 'model', searchable: false, orderable: false },
                        { data: function(data) {
                            var model_status = "NOT READY";
                            var color = "badge-danger";
                            if (data.model_status == 1) {
                                model_status = "READY";
                                color = "badge-success";
                            }
                            return '<span class="badge '+color+'">'+model_status+'</span>';
                        }, name: 'model_status', searchable: false, orderable: false, className: 'text-right' },
                    ],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
                        $('.dataTables_scrollBody').css('height','43vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('height','43vh');

                        $('.dataTables_scrollBody').css('min-height','10vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('min-height','10vh');
                    },
                    fnDrawCallback: function() {
                        // $("#tbl_transactions").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
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
            if (!$.fn.DataTable.isDataTable('#tbl_pallets')) {
                self.$tbl_pallets = $('#tbl_pallets').DataTable({
                    scrollY: "43vh",
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
                        url: "/transactions/box-and-pallet/get-pallets",
                        type: 'POST',
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.trans_id = $('#trans_id').val()
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
                        emptyTable: "No Pallet was created.",
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
                            data: function(data) {
                                return '';
                            }, name: 'id', searchable: false, orderable: false, target: 0 , width: '15px'
                        },
                        {
                            data: function(data) {
                                return '<span>'+data.pallet_qr+'</span><br>' +
								        '<small>'+data.created_at+'</small>';
                            }, name: 'pallet_qr', searchable: false, orderable: false 
                        },
                        {
                            data: function(data) {
                                switch (data.pallet_status) {
                                    case 1:
                                        return 'FOR OBA';
                                        break;
                                    case 2:
                                        return 'GOOD';
                                        break;
                                    case 3:
                                        return 'REWORK';
                                        break;
                                    case 4:
                                        return 'HOLD PALLET';
                                        break;
                                    case 5:
                                        return 'HOLD LOT';
                                        break;
                                
                                    default:
                                        return 'ON PROGRESS'
                                        break;
                                }
                            }, name: 'pallet_status', searchable: false, orderable: false, className: 'text-center'
                        },
                        { data: 'pallet_location', name: 'pallet_location', searchable: false, orderable: false, className: 'text-center' },
                    ],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {
                        var dataRow = $(row);
                        var checkbox = $(dataRow[0].cells[0].firstChild);
                        switch (data.pallet_status) {
                            case 1:
                                $(dataRow[0].cells[2]).css('background-color', '#FFC4DD');
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            case 2:
                                $(dataRow[0].cells[2]).css('background-color', '#36AE7C');
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            case 3:
                                $(dataRow[0].cells[2]).css('background-color', '#47B5FF');
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            case 4:
                                $(dataRow[0].cells[2]).css('background-color', '#FF0063');
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            case 5:
                                $(dataRow[0].cells[2]).css('background-color', '#FF0063');
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            default:
                                $(dataRow[0].cells[2]).css('background-color', '#FFDCAE');
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                        }
                        
                        if (data.pallet_location != "PRODUCTION") {
                            checkbox.prop('disabled', true);
                        }
                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
                        $('.dataTables_scrollBody').css('height','43vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('height','43vh');

                        $('.dataTables_scrollBody').css('min-height','10vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('min-height','10vh');
                    },
                    fnDrawCallback: function() {
                        // $("#tbl_pallets").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                        var data = this.fnGetData();
                        var data_count = data.length;
                        $('#pallet_count').html(data_count);
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawBoxesDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_boxes')) {
                self.$tbl_boxes = $('#tbl_boxes').DataTable({
                    scrollY: "43vh",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    ajax: {
                        url: "/transactions/box-and-pallet/get-boxes",
                        type: 'POST',
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.pallet_id = $('#pallet_id').val()
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
                        emptyTable: "No Box ID was scanned.",
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
                            data: function(data) {
                                return '<button type="button" class="btn btn-danger btn_remove_box" disabled><i class="fa fa-times"></i></button>'+
                                '<input type="hidden" class="update_box_id" name="update_box_id[]" value="'+data.id+'"/>';
                            }, name: 'id', searchable: false, orderable: false, width: '10px'
                        },
                        { data: 'box_qr', name: 'box_qr', searchable: false, orderable: false },
                        { data: function(data) {
                            var remarks = (data.remarks == null)? "" : data.remarks;
                            return '<textarea class="form-control remarks_input" name="remarks_input[]" placeholder="Write Remarks here..." style="resize:none;" disabled>'+remarks+'</textarea>';
                        }, name: 'remarks', searchable: false, orderable: false, className:'remarks' }
                    ],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {     
                        var dataRow = $(row);  
                        $(dataRow[0].cells[2]).addClass('p-0');                
                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
                        $('.dataTables_scrollBody').css('height','43vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('height','43vh');

                        $('.dataTables_scrollBody').css('min-height','10vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('min-height','10vh');
                    },
                    fnDrawCallback: function() {
                        // $("#tbl_boxes").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                        var data = this.fnGetData();
                        var data_count = data.length;
                        $('#box_count').html(data_count);
                        // $('#total_scanned_box_qty').val(data_count);

                        var box_count_full = parseInt($('#box_count_full').html());
                        var is_printed = parseInt($('#is_printed').val());
                        var total_scanned_box_qty = parseFloat($('#total_scanned_box_qty').val());
                        var total_box_qty = parseFloat($('#total_box_qty').val());
                        

                        if (self.$tbl_pallets.rows({ selected: true }).any()) {
                            if ((data_count > 0 && box_count_full == data_count) || total_scanned_box_qty == total_box_qty) {
                                if (is_printed > 0) {
                                    self.statusMsg("Pallet was already printed!","success");
                                    $('#btn_reprint_pallet').prop('disabled',false);
                                    $('#btn_print_pallet').prop('disabled',true);
                                    $('#btn_preview_print').prop('disabled',true);
                                    $('#btn_print_preview').prop('disabled',false);
                                } else {
                                    self.statusMsg("Ready to Print!","success");
                                    $('#btn_print_preview').prop('disabled',false);
                                    $('#btn_reprint_pallet').prop('disabled',true);
                                    $('#btn_print_pallet').prop('disabled',false);
                                    $('#btn_preview_print').prop('disabled',false);
                                }
                            }
                        }
                        
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        scanBoxQR: function(param) {
            
            var self = this;
            var running_model = $('#running_model').val();
            var scanned_box_count = parseInt($('#box_count').html());
            var pallet_qr = $('#pallet_id_qr').val();

            self.hideInputErrors('box_qr');

            if (!param.box_qr.includes(running_model)) {
                $('#box_qr').val('');
                var errors = {
                    box_qr: ["Please scan box with same " + running_model + " model."]
                };
                self.showInputErrors(errors);
            } else if (scanned_box_count == param.box_per_pallet) {
                $('#box_qr').val('');
                var errors = {
                    box_qr: ["Pallet "+pallet_qr+" was already full."]
                };
                self.showInputErrors(errors);
            } else {
                self.submitType = "POST";
                self.jsonData = {
                    _token: self.token,
                    pallet_id: param.pallet_id,
                    selected_model_id: param.selected_model_id,
                    box_qr: param.box_qr,
                    trans_id: param.trans_id
                };
                self.formAction = "/transactions/box-and-pallet/save-box";
                self.sendData().then(function() {
                    var response = self.responseData;
                    var box = response.box_data;

                    if (response.hasOwnProperty('count')) {
                        $('#total_scanned_box_qty').val(response.count);
                    }

                    if (response.success) {
                        self.$tbl_boxes.row.add(box).order([1,'desc']).draw();
                    }

                    $('#box_qr').val('');
                    //self.$tbl_boxes.ajax.reload();
                    
                });
            }
            
            return this;
        },
        statusMsg: function(msg,status) {
            switch (status) {
                case 'success':
                    $('#status_msg').html(msg);
                    $('#status_msg').removeClass('text-danger')
                    $('#status_msg').addClass('text-success')
                    break;
                case 'failed':
                    $('#status_msg').html(msg);
                    $('#status_msg').removeClass('text-success')
                    $('#status_msg').addClass('text-danger')
                    break;
                default:
                    $('#status_msg').html(msg);
                    $('#status_msg').removeClass('text-danger')
                    $('#status_msg').removeClass('text-success')
                    break;
            }
        },
        printPallet: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/box-and-pallet/print-pallet";
            self.sendData().then(function() {
                var response = self.responseData;
                $('#btn_print_preview').prop('disabled',false);
                $('#btn_reprint_pallet').prop('disabled',false);
                $('#btn_print_pallet').prop('disabled',true);
                $('#btn_preview_print').prop('disabled',true);
                self.statusMsg("Pallet was already printed!","success");

                console.log(response);

                self.$tbl_transactions.row(param.row_index).data(response).draw();
                self.$tbl_pallets.ajax.reload();

                $('#pallet_id').val('');
                $('#pallet_id_qr').val('');
                $('#is_printed').val(0);
                $('#box_per_pallet').val(0);
                $('#box_count_full').html(0);

                $('#btn_transfer').prop('disabled', true);
                $('#btn_update').prop('disabled', true);
                $('#btn_broken_pallet').prop('disabled', true);
                $('#box_count').html(0);

                $('#tbl_transactions').removeClass('disabled');
                $('#tbl_pallets').removeClass('disabled');
                $('#tbl_boxes').removeClass('disabled');

                self.$tbl_boxes.ajax.reload();
            });
        },
        printPreview: function(param) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/transactions/box-and-pallet/print-preview";
            self.sendData().then(function() {
                var response = self.responseData;

                $('#prv_model').html(response.model);
                $('#prv_date').html(response.print_date);
                $('#prv_box_count').html(response.box_qty);
                $('#prv_pallet_id_val').html(response.pallet_qr);
                $('#prv_lot_no').html(response.lot_no);

                self.box_qr_code.clear();
                self.box_qr_code.makeCode(response.box_qr);
                
                self.pallet_qr_code.clear();
                self.pallet_qr_code.makeCode(response.pallet_qr);

                $('#modal_print_preview').modal('show');
            });
        },
        transferTo: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/box-and-pallet/transfer-to";
            self.sendData().then(function() {
                self.$tbl_pallets.ajax.reload();
            });
        },
        setNewBoxCount: function() {
            var self = this;
            self.submitType = "POST";
            self.jsonData = $('#frm_new_box_count').serialize();
            self.formAction = "/transactions/box-and-pallet/set-new-box-count";
            self.sendData().then(function() {
                self.$tbl_pallets.ajax.reload();
                self.$tbl_boxes.ajax.reload();
                $('#box_count_full').html($('#new_box_count').val());

                $('.clear').val('');
                $('#modal_broken_pallet').modal('hide');
            });
        },
        updateBoxes: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/box-and-pallet/update-box";
            self.sendData().then(function() {
                $('#btn_start_scan').prop('disabled', false);
                $('#btn_save_box').prop('disabled', false);

                $('#save_div').hide();
                $('#preview_div').show();

                self.$tbl_boxes.ajax.reload();
            });
        },
        deleteTransaction: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/box-and-pallet/delete-transaction";
            self.sendData().then(function() {
                self.$tbl_transactions.ajax.reload();
                self.viewState('');
            });
        }
    }
    BoxPalletApp.init.prototype = $.extend(BoxPalletApp.prototype, $D.init.prototype, $F.init.prototype);
    BoxPalletApp.init.prototype = BoxPalletApp.prototype;

    $(document).ready(function() {
        var _BoxPalletApp = BoxPalletApp();
        _BoxPalletApp.viewState('');
        _BoxPalletApp.RunDateTime();
        _BoxPalletApp.drawTransactionsDatatables();
        _BoxPalletApp.drawPalletsDatatables();
        _BoxPalletApp.drawBoxesDatatables();
        _BoxPalletApp.permission();

        var prv_box_id_qr = document.getElementById('prv_box_id_qr')
        _BoxPalletApp.box_qr_code = new QRCode(prv_box_id_qr, {
            text: "",
            width: 290,
            height: 290,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        var prv_pallet_id_qr = document.getElementById('prv_pallet_id_qr')
        _BoxPalletApp.pallet_qr_code = new QRCode(prv_pallet_id_qr, {
            text: "",
            width: 80,
            height: 80,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        
        $('#btn_add_new').on('click', function() {
            if ($(this).hasClass('btn-primary')) {
                _BoxPalletApp.viewState('NEW');
                var inputs = [
                    'id',
                    'model',
                    'hs_qty',
                    'box_count_per_pallet',
                    'model_id',
                    'target_hs_qty',
                    'target_no_of_pallet',
                    'total_box_qty',
                    'trans_id',
                    'selected_model_id',
                    'running_model',
                    'total_scanned_box_qty',
                    'pallet_count_full',
                    'pallet_id',
                    'pallet_id_qr',
                    'is_printed'
                ];
                _BoxPalletApp.clearForm(inputs);
                $('#model_id').empty().trigger('change.select2');
            } else {
                _BoxPalletApp.viewState('UPDATE');
            }
            
        });

        $('#btn_cancel').on('click', function() {
            _BoxPalletApp.viewState('');

            var inputs = [
                'id',
                'model',
                'hs_qty',
                'box_count_per_pallet',
                'model_id',
                'target_hs_qty',
                'target_no_of_pallet',
                'total_box_qty',
                'trans_id',
                'selected_model_id',
                'running_model',
                'total_scanned_box_qty',
                'pallet_count_full',
                'pallet_id',
                'pallet_id_qr',
                'is_printed'
            ];
            _BoxPalletApp.clearForm(inputs);
            _BoxPalletApp.$tbl_transactions.ajax.reload();
            _BoxPalletApp.$tbl_pallets.ajax.reload();
            $('#model_id').empty().trigger('change.select2');
        });

        $('#btn_start_scan').on('click', function() {
            var pallet_id = $('#pallet_id').val();
            if (pallet_id != "") {
                _BoxPalletApp.viewState('SCAN');
            } else {
                _BoxPalletApp.showWarning("Please select a Pallet first.");
            }
        });

        $('#model_id').select2({
            allowClear: true,
            placeholder: 'Select Model',
            theme: 'bootstrap4',
            width: 'auto',
            ajax: {
                url: '/transactions/box-and-pallet/get-models',
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

        $('#model_id').on('select2:select', function (e) {
            var data = e.params.data;
            $('#model').val(data.model);
            $('#hs_qty').val(data.hs_count_per_box);
            $('#box_count_per_pallet').val(data.box_count_per_pallet);
        });

        $('#frm_transactions').on('submit', function(e) {
            e.preventDefault();

            var pallets_count = _BoxPalletApp.$tbl_pallets.data().count();
            var target_no_of_pallet = parseFloat($('#target_no_of_pallet').val());

            if (pallets_count > target_no_of_pallet) {
                _BoxPalletApp.swMsg("Created Pallets("+pallets_count+") are more than the new target number of pallets. Please assign more than the created pallets("+pallets_count+").","warning");
            } else {
                $('#loading_modal').modal('show');
                var data = $(this).serializeArray();
                $.ajax({
                    url: $(this).attr('action'),
                    type: 'POST',
                    dataType: 'JSON',
                    data: data
                }).done(function(response, textStatus, xhr) {
                    if (textStatus) {
                        if (response.msgType == "success") {
                            $('#pallet_count_full').html($('#target_no_of_pallet').val());
                            _BoxPalletApp.clearForm(response.inputs);
                            _BoxPalletApp.viewState('');
                            _BoxPalletApp.$tbl_transactions.ajax.reload();
                            _BoxPalletApp.$tbl_pallets.ajax.reload();
                            _BoxPalletApp.swMsg(response.msg,response.msgType);
                        } else {
                            _BoxPalletApp.swMsg(response.msg,response.msgType);
                        }
                        _BoxPalletApp.id = 0;
                    }
                }).fail(function(xhr, textStatus, errorThrown) {
                    var errors = xhr.responseJSON.errors;
                    _BoxPalletApp.showInputErrors(errors);

                    if (errorThrown == "Internal Server Error") {
                        _BoxPalletApp.ErrorMsg(xhr);
                    }
                }).always(function() {
                    $('#loading_modal').modal('hide');
                });
            }
        });

        _BoxPalletApp.$tbl_transactions.on('select', function ( e, dt, type, indexes ) {
            var rowData = _BoxPalletApp.$tbl_transactions.rows( indexes ).data().toArray();
            var data = rowData[0];
            $('#id').val(data.id);
            $('#model').val(data.model);
            $('#hs_qty').val(data.hs_count_per_box);
            $('#box_count_per_pallet').val(data.box_count_per_pallet);

            var $model_id = $("<option selected='selected'></option>").val(data.model_id).text(data.model_name);
            $('#model_id').append($model_id).trigger('change.select2');

            $('#target_hs_qty').val(data.target_hs_qty);
            $('#target_no_of_pallet').val(data.target_no_of_pallet);
            $('#total_box_qty').val(data.total_box_qty);

            $('#btn_add_new').html('<i class="fa fa-pen"></i> Update');
            $('#btn_add_new').removeClass('btn-primary');
            $('#btn_add_new').addClass('btn-info');

            $('#trans_id').val(data.id);
            $('#selected_model_id').val(data.model_id);
            $('#running_model').val(data.model);
            $('#total_scanned_box_qty').val(data.total_scanned_box_qty);
            $('#pallet_count_full').html(data.target_no_of_pallet);

            $('#pallet_id').val('');
            $('#pallet_id_qr').val('');
            $('#is_printed').val('');
            $('#box_count_full').html(0);

            $('#btn_print_preview').prop('disabled', true);
            $('#btn_print_pallet').prop('disabled', true);
            $('#btn_delete_transaction').prop('disabled', false);

            _BoxPalletApp.statusMsg('','clear');
            _BoxPalletApp.$tbl_pallets.ajax.reload();
            _BoxPalletApp.$tbl_boxes.ajax.reload();
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#id').val('');
            $('#model').val('');
            $('#hs_qty').val('');
            $('#box_count_per_pallet').val('');

            $('#model_id').val(null).trigger('change.select2');

            $('#target_hs_qty').val('');
            $('#target_no_of_pallet').val('');
            $('#total_box_qty').val('');

            $('#btn_add_new').html('<i class="fa fa-plus"></i> Add New');
            $('#btn_add_new').removeClass('btn-info');
            $('#btn_add_new').addClass('btn-primary');

            $('#trans_id').val('');
            $('#running_model').val('');
            $('#total_scanned_box_qty').val('');
            $('#box_per_pallet').val('');

            $('#pallet_id').val('');
            $('#pallet_id_qr').val('');
            $('#is_printed').val('');
            $('#box_count_full').html(0);
            $('#pallet_count_full').html(0);
            $('#pallet_count').html(0);

            $('#btn_start_scan').prop('disabled', true);
            $('#btn_delete_transaction').prop('disabled', true);
            $('#btn_transfer').prop('disabled', true);
            $('#btn_update').prop('disabled', true);
            $('#btn_broken_pallet').prop('disabled', true);
            $('#btn_print_preview').prop('disabled', true);
            $('#btn_print_pallet').prop('disabled', true);
            $('#btn_reprint_pallet').prop('disabled', true);

            _BoxPalletApp.statusMsg('','clear');
            _BoxPalletApp.$tbl_pallets.ajax.reload();
            _BoxPalletApp.$tbl_boxes.ajax.reload();
        });

        _BoxPalletApp.$tbl_pallets.on('select', function ( e, dt, type, indexes ) {
            var rowData = _BoxPalletApp.$tbl_pallets.rows( indexes ).data().toArray();
            var data = rowData[0];

            $('#pallet_id').val(data.id);
            $('#pallet_id_qr').val(data.pallet_qr);
            $('#is_printed').val(data.is_printed);
            $('#box_per_pallet').val(data.box_count_per_pallet);
            $('#box_count_full').html(data.box_count_per_pallet);

            var total_box_qty = parseInt($('#total_box_qty').val());
            
            if (total_box_qty < data.box_count_per_pallet) {
                _BoxPalletApp.swMsg("Please update Box Count per Pallet. Please use the function of 'Mark as Broken Pallet'.","info");
            }

            if (data.is_printed) {
                $('#btn_reprint_pallet').prop('disabled', false);
                $('#btn_start_scan').prop('disabled', true);
            } else {
                $('#btn_reprint_pallet').prop('disabled', true);
                $('#btn_start_scan').prop('disabled', false);
            }

            // if (total_box_qty > data.box_count_per_pallet) 
            //     _BoxPalletApp.swMsg("Please update Box Count per Pallet. Please use the function of 'Mark as Broken Pallet'.","info");

            if (data.pallet_location == 'Q.A.') {
                $('#btn_transfer').prop('disabled', true);
                $('#btn_update').prop('disabled', true);
                $('#btn_broken_pallet').prop('disabled', true);
            } else {
                $('#btn_transfer').prop('disabled', false);
                $('#btn_update').prop('disabled', false);
                $('#btn_broken_pallet').prop('disabled', false);
            }

            _BoxPalletApp.statusMsg('','clear');
            _BoxPalletApp.$tbl_boxes.ajax.reload();
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#pallet_id').val('');
            $('#pallet_id_qr').val('');
            $('#is_printed').val(0);
            $('#box_per_pallet').val(0);
            $('#box_count_full').html(0);

            $('#btn_transfer').prop('disabled', true);
            $('#btn_update').prop('disabled', true);
            $('#btn_broken_pallet').prop('disabled', true);
            $('#box_count').html(0);

            _BoxPalletApp.$tbl_boxes.ajax.reload();
        });

        $('#tbl_pallets tbody').on('change', '.check_pallet', function() {
            var checked = $(this).is(':checked');

            if (checked) {
                $('#btn_transfer').prop('disabled', false);
                $('#btn_update').prop('disabled', false);
                $('#btn_broken_pallet').prop('disabled', false);
            } else {
                $('#btn_transfer').prop('disabled', true);
                $('#btn_update').prop('disabled', true);
                $('#btn_broken_pallet').prop('disabled', true);
            }
        });

        $('#btn_delete_transaction').on('click', function() {
            var ids = $.map(_BoxPalletApp.$tbl_transactions.rows({selected: true}).data(), function (item) {
                return item.id;
            });

            if (ids.length > 0) {
                var msg = "Do you want to delete this Model Transaction?";
                _BoxPalletApp.msg = msg;
                _BoxPalletApp.confirmAction(msg).then(function(approve) {
                    if (approve) {
                        _BoxPalletApp.deleteTransaction({
                            _token: _BoxPalletApp.token,
                            id: ids
                        });
                    }
                });
            }
        });

        /**
         * Scanning of Box ID
         */
        $('#box_qr').on('change', function() {
            var param = {
                pallet_id: $('#pallet_id').val(),
                selected_model_id: $('#selected_model_id').val(),
                box_qr: $('#box_qr').val(),
                box_per_pallet: $('#box_per_pallet').val(),
                trans_id: $('#trans_id').val()
            };
            var total_scanned_box_qty = parseFloat($('#total_scanned_box_qty').val());
            var total_box_qty = parseFloat($('#total_box_qty').val());

            if (total_scanned_box_qty == total_box_qty) {
                _BoxPalletApp.swMsg("Target Heat Sink Quantity has already met.","info");
            } else {
                _BoxPalletApp.scanBoxQR(param);
            }
            
        });

        $('#btn_print_pallet, #btn_preview_print').on('click', function() {
            var box_ids = "";
            const month = moment().format('MMM');
            var box_count = parseFloat($('#box_count').html());
            var box_count_full = parseFloat($('#box_count_full').html());
            var row_index = _BoxPalletApp.$tbl_transactions.rows({selected:  true}).indexes();

            if (_BoxPalletApp.$tbl_pallets.rows({ selected: true }).any()) {
                if (box_count_full > box_count) {
                    _BoxPalletApp.swMsg("Please scan more Box ID or set this pallet as Broken Pallet.","warning");
                } else {
                    _BoxPalletApp.$tbl_boxes.rows().data().map((row) => {
                        box_ids += row.box_qr+";"+"\n";
                    });
        
                    _BoxPalletApp.printPallet({
                        _token: _BoxPalletApp.token,
                        month: month.toUpperCase(),
                        trans_id: $('#trans_id').val(),
                        model_id: $('#selected_model_id').val(),
                        pallet_id: $('#pallet_id').val(),
                        model: $('#running_model').val(),
                        lot_no: '------',
                        box_qty: $('#box_count').html(),
                        box_qr: box_ids,
                        pallet_qr: $('#pallet_id_qr').val(),
                        mode: 'print',
                        row_index: row_index[0],
                        target_no_of_pallet: $('#target_no_of_pallet').val(),
                        total_box_qty: $('#total_box_qty').val(),
                        total_scanned_box_qty: $('#total_scanned_box_qty').val(),
                        box_per_pallet: $('#box_per_pallet').val()
                    });
                }
            } else {
                _BoxPalletApp.swMsg("Please select a pallet first.","warning");
            }

           
            
        });

        $('#btn_reprint_pallet').on('click', function() {
            var box_ids = "";
            const month = moment().format('MMM');
            var row_index = _BoxPalletApp.$tbl_transactions.rows({selected:  true}).indexes();

            if (_BoxPalletApp.$tbl_pallets.rows({ selected: true }).any()) {
                _BoxPalletApp.$tbl_boxes.rows().data().map((row) => {
                    box_ids += row.box_qr+";"+"\r";
                });

                _BoxPalletApp.printPallet({
                    _token: _BoxPalletApp.token,
                    month: month.toUpperCase(),
                    trans_id: $('#trans_id').val(),
                    model_id: $('#selected_model_id').val(),
                    pallet_id: $('#pallet_id').val(),
                    model: $('#running_model').val(),
                    lot_no: '------',
                    box_qty: $('#box_count').html(),
                    box_qr: box_ids,
                    pallet_qr: $('#pallet_id_qr').val(),
                    mode: 'reprint',
                    row_index: row_index[0],
                    target_no_of_pallet: $('#target_no_of_pallet').val(),
                    total_box_qty: $('#total_box_qty').val(),
                    total_scanned_box_qty: $('#total_scanned_box_qty').val(),
                    box_per_pallet: $('#box_per_pallet').val()
                });
            } else {
                _BoxPalletApp.swMsg("Please select a pallet first.","warning");
            }
        });

        $('#btn_print_preview').on('click', function() {
            var pallet_qr = $('#pallet_id_qr').val();
            var pallet_id = $('#pallet_id').val();

            if (pallet_qr != "") {
                const month = moment().format('MMM');

                $('#modal_form_title').html("Print Preview: " + pallet_qr);
                $('#prv_label_title').html(month.toUpperCase() + " FTL PALLET LABEL");

                _BoxPalletApp.printPreview({
                    _token: _BoxPalletApp.token,
                    pallet_id: pallet_id
                });
                
            } else {
                _BoxPalletApp.showWarning("Please click the pallet number to select.");
            }
            
        });

        $('#btn_transfer').on('click', function() {
            var rowData = _BoxPalletApp.$tbl_pallets.rows( {selected: true} ).data().toArray();
            var data = rowData[0];
            var box_count = parseFloat($('#box_count').html());
            var box_per_pallet = parseFloat($('#box_per_pallet').val());

            if (rowData.length > 0) {
                var msg = "Do you want to transfer this Pallet to Q.A.?";
                _BoxPalletApp.msg = msg;
                _BoxPalletApp.confirmAction(msg).then(function(approve) {
                    if (approve) {
                        if (box_per_pallet != box_count) {
                            _BoxPalletApp.swMsg("Scanned Boxes must be equal to Number of Box per Pallet Requirement. Box Count ("+box_count+" / "+box_per_pallet+")","warning");
                        } else if (data.is_printed != 1) {
                            _BoxPalletApp.swMsg("Please print Pallet label first before transferring","warning");
                        } else {
                            _BoxPalletApp.transferTo({
                                _token: _BoxPalletApp.token,
                                id: data.id
                            });
                        }
                    }
                });
            } else {
                _BoxPalletApp.showWarning("Please select at least 1 Pallet with a 'FOR OBA' status.");
            }
        });

        $('#btn_broken_pallet').on('click', function() {
            var rowData = _BoxPalletApp.$tbl_pallets.rows({selected: true}).data().toArray();
            var data = rowData[0];

            if (rowData.length == 1) {
                var msg = "Do you want to assign this Pallet as Broken Pallet?";
                _BoxPalletApp.msg = msg;

                _BoxPalletApp.confirmAction(msg).then(function(approve) {
                    if (approve) {
                        if (_BoxPalletApp.authorize == 1) {
                            $('#new_box_count').prop('readonly', false);
                            $('#btn_set_new_box_count').prop('disabled', false);

                            $('#broken_pallet_id').val(data.id);
                            $('#modal_broken_pallet').modal('show');
                        } else {
                            // check dialog.blade.php
                            $('#auth_id').val(data.id);
                            $('#authentication_type').val('broken_pallet');
                            $('#modal_authentication').modal('show');
                        }
                    }
                });
            } else {
                _BoxPalletApp.showWarning('Please check / select only 1 Pallet.');
            }
        });

        $('#frm_authenticate').on('submit', function(e) {
            e.preventDefault();
            _BoxPalletApp.authenticate(function(response) {
                var authentication_type = $('#authentication_type').val();

                if (response.permission) {
                    switch (authentication_type) {
                        case 'broken_pallet':
                            $('#modal_authentication').modal('hide');

                            var auth_id = $('#auth_id').val();
                            $('#new_box_count').prop('readonly', false);
                            $('#btn_set_new_box_count').prop('disabled', false);
    
                            $('#broken_pallet_id').val(auth_id);
                            $('#modal_broken_pallet').modal('show');
                            break;
                        case 'update_pallet':
                            $('#modal_authentication').modal('hide');

                            $('.btn_remove_box').prop('disabled', false);
                            $('.remarks_input').prop('disabled', false);
                            $('#btn_save_box').prop('disabled', false);
                            $('#btn_start_scan').prop('disabled', true);

                            $('#save_div').show();
                            $('#preview_div').hide();
                            break;
                    }
                } else {
                    _BoxPalletApp.swMsg("Pleae provide an authorized user credential.","warning");
                }
            });
        });

        $('#frm_new_box_count').on('submit', function(e) {
            e.preventDefault();
            _BoxPalletApp.setNewBoxCount();
        });

        /**
         * Update Pallet Data
         */
        $('#btn_update').on('click', function() {
            var rowData = _BoxPalletApp.$tbl_pallets.rows( {selected: true} ).data().toArray();
            var data = rowData[0];         

            if (rowData.length > 0) {
                var msg = "Do you want to update this Pallet?";
                _BoxPalletApp.msg = msg;

                _BoxPalletApp.confirmAction(msg).then(function(approve) {
                    if (approve)
                        if (_BoxPalletApp.authorize == 1) {
                            $('.btn_remove_box').prop('disabled', false);
                            $('.remarks_input').prop('disabled', false);
                            $('#btn_save_box').prop('disabled', false);
                            $('#btn_start_scan').prop('disabled', true);

                            $('#save_div').show();
                            $('#preview_div').hide();
                        } else {
                            // check dialog.blade.php
                            $('#auth_id').val(data.id);
                            $('#authentication_type').val('update_pallet');
                            $('#modal_authentication').modal('show');
                        }
                });
            } else {
                _BoxPalletApp.showWarning('Please check / select only 1 Pallet.');
            }
        });

        $('#tbl_boxes tbody').on('click', '.btn_remove_box', function() {
            var this_row = $(this).parents('tr');
            var data = _BoxPalletApp.$tbl_boxes.row(this_row).data();
            var msg = "Do you want to remove box "+data.box_qr+" ?";

            _BoxPalletApp.msg = msg;
            _BoxPalletApp.confirmAction(msg).then(function(approve) {
                if (approve)
                    _BoxPalletApp.removed_box_arr.push(data.id);
                    $('#btn_save_box').prop('disabled', false);
                    _BoxPalletApp.$tbl_boxes.row(this_row).remove().draw();
            });
        });
        
        $('#btn_save_box').on('click', function() {
            var update_box_id = $('input[name="update_box_id[]"]').map(function() {
                return $(this).val();
            }).get();

            var remarks_input = $('textarea[name="remarks_input[]"]').map(function() {
                return $(this).val();
            }).get();

            _BoxPalletApp.updateBoxes({
                _token: _BoxPalletApp.token,
                remove_box_id: _BoxPalletApp.removed_box_arr,
                update_box_id: update_box_id,
                remarks_input: remarks_input,
                trans_id: $('#trans_id').val()
            });
        });

        $('#target_hs_qty').on('focusout', function () {
            var hs_qty = parseFloat($('#hs_qty').val());
            var target_hs_qty = parseFloat($('#target_hs_qty').val());
            var box_count_per_pallet = parseFloat($('#box_count_per_pallet').val());
            var target_no_of_pallet = 0;

            total_box_qty = (target_hs_qty/hs_qty);
            target_no_of_pallet = total_box_qty / box_count_per_pallet;

            if (target_no_of_pallet % 1 != 0) {
                target_no_of_pallet = parseInt(target_no_of_pallet)+1;
            }

            $('#target_no_of_pallet').val(target_no_of_pallet);
            $('#total_box_qty').val(total_box_qty);
        });

        
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };