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
        this.BoxPalletApp_checked = 0;
        this.box_qr_code = "";
        this.pallet_qr_code = "";
        this.prv_box_id_qr = "";
        this.prv_pallet_id_qr = "";
        this.removed_box_arr = [];
    }
    BoxPalletApp.prototype = {
        init: function() {},
        viewState: function(state) {
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
                    $('#target_no_of_pallet').prop('readonly', false);
                    $('#btn_add_new').prop('disabled', true);
                    $('#btn_cancel').prop('disabled', false);
                    $('#btn_proceed').prop('disabled', false);
                    $('#btn_start_scan').prop('disabled', true);
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
                    } else {
                        $('#btn_add_new').prop('disabled', false);
                        $('#btn_cancel').prop('disabled', true);
                        $('#btn_proceed').prop('disabled', true);
                        $('#btn_start_scan').html("Start Scan");
                        $('#btn_start_scan').removeClass("btn-danger");
                        $('#btn_start_scan').addClass("btn-success");
                        $('#box_qr').prop('readonly', true);
                        $('#box_qr').val('');
                        $('#tbl_transactions').removeClass('disabled');
                        $('#tbl_pallets').removeClass('disabled');
                        $('#tbl_boxes').removeClass('disabled');
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
                    $('#target_no_of_pallet').prop('readonly', true);
                    $('#btn_add_new').prop('disabled', false);
                    $('#btn_cancel').prop('disabled', true);
                    $('#btn_proceed').prop('disabled', true);
                    $('#btn_start_scan').prop('disabled', false);
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
                    scrollY: "400px",
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
                        dataType: "JSON",
                        error: function(response) {
                            console.log(response);
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
                        $('.dataTables_scrollBody, .slimScrollDiv').css('height','400px');
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
                    scrollY: "400px",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    select: {
                        style: 'single',
                        selector: 'td:not(:first-child)'
                    },
                    ajax: {
                        url: "/transactions/box-and-pallet/get-pallets",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.with_zero = self._with_zero;
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
                                return '<input type="checkbox" class="check_pallet" value="'+data.id+'"/>';
                            }, name: 'id', searchable: false, orderable: false, width: '10px'
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
                        $('.dataTables_scrollBody, .slimScrollDiv').css('height','400px');
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
                    scrollY: "400px",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    ajax: {
                        url: "/transactions/box-and-pallet/get-boxes",
                        dataType: "JSON",
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
                        $('.dataTables_scrollBody, .slimScrollDiv').css('height','400px');
                    },
                    fnDrawCallback: function() {
                        // $("#tbl_boxes").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                        var data = this.fnGetData();
                        var data_count = data.length;
                        var box_count_full = parseInt($('#box_count_full').html());
                        var is_printed = parseInt($('#is_printed').val());
                        $('#box_count').html(data_count);

                        if (data_count > 0 && box_count_full == data_count) {
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
                    box_qr: param.box_qr
                };
                self.formAction = "/transactions/box-and-pallet/save-box";
                self.sendData().then(function() {
                    $('#box_qr').val('');
                    self.$tbl_boxes.ajax.reload();
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
                $('#btn_print_preview').prop('disabled',false);
                $('#btn_reprint_pallet').prop('disabled',false);
                $('#btn_print_pallet').prop('disabled',true);
                $('#btn_preview_print').prop('disabled',true);
                self.statusMsg("Pallet was already printed!","success");
                self.$tbl_pallets.ajax.reload();
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
        checkAuthorization: function(pallet_id, mode) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = {
                _token: self.token,
            };
            self.formAction = "/transactions/box-and-pallet/check-authorization";
            self.sendData().then(function() {
                var response = self.responseData;

                if (mode == 'broken_pallet') {
                    if (response.permission) {
                        $('.auth').hide();
                        $('#new_box_count').prop('readonly', false);
                        $('#btn_set_new_box_count').prop('disabled', false);
                    } else {
                        $('.auth').show();
                        $('#new_box_count').prop('readonly', true);
                        $('#btn_set_new_box_count').prop('disabled', true);
                    }
                    $('#broken_pallet_id').val(pallet_id);
                    $('#modal_broken_pallet').modal('show');
                } else {
                    $('.btn_remove_box').prop('disabled', false);
                    $('.remarks_input').prop('disabled', false);
                    $('#btn_save_box').prop('disabled', false);
                    $('#btn_start_scan').prop('disabled', true);

                    $('#save_div').show();
                    $('#preview_div').hide();
                }
                
            });
        },
        setNewBoxCount: function() {
            var self = this;
            self.submitType = "POST";
            self.jsonData = {
                _token: self.token,
                new_box_count: $('#new_box_count').val(),
                pallet_id: $('#broken_pallet_id').val()
            };
            self.formAction = "/transactions/box-and-pallet/set-new-box-count";
            self.sendData().then(function() {
                self.$tbl_pallets.ajax.reload();
                self.$tbl_boxes.ajax.reload();
                $('#box_count_full').html($('#new_box_count').val());
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

        $('#save_div').hide()
        $('#preview_div').show()

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
            _BoxPalletApp.viewState('NEW');
            var inputs = ['model_id', 'target_no_of_pallet'];
            _BoxPalletApp.clearForm(inputs);
            $('#model_id').empty().trigger('change.select2');
        });

        $('#btn_cancel').on('click', function() {
            _BoxPalletApp.viewState('');

            var inputs = ['model_id', 'target_no_of_pallet'];
            _BoxPalletApp.clearForm(inputs);
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
        });

        $('#frm_transactions').on('submit', function(e) {
            e.preventDefault();
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
                        _BoxPalletApp.clearForm(response.inputs);
                        _BoxPalletApp.viewState('');
                        _BoxPalletApp.$tbl_transactions.ajax.reload();
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
        });

        _BoxPalletApp.$tbl_transactions.on('select', function ( e, dt, type, indexes ) {
            var rowData = _BoxPalletApp.$tbl_transactions.rows( indexes ).data().toArray();
            var data = rowData[0];
            $('#trans_id').val(data.id);
            $('#selected_model_id').val(data.model_id);
            $('#running_model').val(data.model);
            $('#target_pallet').val(data.target_no_of_pallet);
            $('#pallet_count_full').html(data.target_no_of_pallet);

            $('#pallet_id').val('');
            $('#pallet_id_qr').val('');
            $('#is_printed').val('');
            $('#box_count_full').html(0);

            _BoxPalletApp.statusMsg('','clear');
            _BoxPalletApp.$tbl_pallets.ajax.reload();
            _BoxPalletApp.$tbl_boxes.ajax.reload();
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#trans_id').val('');
            $('#running_model').val('');
            $('#target_pallet').val('');
            $('#box_per_pallet').val('');

            $('#pallet_id').val('');
            $('#pallet_id_qr').val('');
            $('#is_printed').val('');
            $('#box_count_full').html(0);
            $('#pallet_count_full').html(0);
            $('#pallet_count').html(0);

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

            _BoxPalletApp.statusMsg('','clear');
            _BoxPalletApp.$tbl_boxes.ajax.reload();
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#pallet_id').val('');
            $('#pallet_id_qr').val('');
            $('#is_printed').val(0);
            $('#box_per_pallet').val(0);
            $('#box_count_full').html(0);

            _BoxPalletApp.$tbl_boxes.ajax.reload();
            $('#box_count').html(0);
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

        $('#box_qr').on('change', function() {
            var param = {
                pallet_id: $('#pallet_id').val(),
                selected_model_id: $('#selected_model_id').val(),
                box_qr: $('#box_qr').val(),
                box_per_pallet: $('#box_per_pallet').val()
            };
            _BoxPalletApp.scanBoxQR(param);
        });

        $('#btn_print_pallet, #btn_preview_print').on('click', function() {
            var box_ids = "";
            _BoxPalletApp.$tbl_boxes.rows().data().map((row) => {
                box_ids += row.box_qr+";"+"\n";
            });

            _BoxPalletApp.printPallet({
                _token: _BoxPalletApp.token,
                trans_id: $('#trans_id').val(),
                model_id: $('#selected_model_id').val(),
                pallet_id: $('#pallet_id').val(),
                model: $('#running_model').val(),
                lot_no: '------',
                box_qty: $('#box_count').html(),
                box_qr: box_ids,
                pallet_qr: $('#pallet_id_qr').val(),
                mode: 'print'
            });
        });

        $('#btn_reprint_pallet').on('click', function() {
            var box_ids = "";
            _BoxPalletApp.$tbl_boxes.rows().data().map((row) => {
                box_ids += row.box_qr+";";
            });

            _BoxPalletApp.printPallet({
                _token: _BoxPalletApp.token,
                trans_id: $('#trans_id').val(),
                model_id: $('#selected_model_id').val(),
                pallet_id: $('#pallet_id').val(),
                model: $('#running_model').val(),
                lot_no: '------',
                box_qty: $('#box_count').html(),
                box_qr: box_ids,
                pallet_qr: $('#pallet_id_qr').val(),
                mode: 'reprint'
            });
        });

        $('#btn_print_preview').on('click', function() {
            var pallet_id_qr = $('#pallet_id_qr').val();
            var model = $('#running_model').val();
            var box_count = $('#box_count_full').html();
            var box_ids = "";

            if (pallet_id_qr != "") {
                $('#modal_form_title').html("Print Preview: " + pallet_id_qr);
                const month = moment().format('MMM');
                const print_Date = moment().format('YYYY/MM/DD');

                $('#prv_label_title').html(month.toUpperCase() + " FTL PALLET LABEL");

                _BoxPalletApp.$tbl_boxes.rows().data().map((row) => {
                    box_ids += row.box_qr+";"+"\n";
                });

                $('#prv_model').html(model);
                $('#prv_date').html(print_Date);
                $('#prv_box_count').html(box_count);
                $('#prv_pallet_id_val').html(pallet_id_qr);

                _BoxPalletApp.box_qr_code.clear();
                _BoxPalletApp.box_qr_code.makeCode(box_ids);
                
                _BoxPalletApp.pallet_qr_code.clear();
                _BoxPalletApp.pallet_qr_code.makeCode(pallet_id_qr);

                $('#modal_print_preview').modal('show');
            } else {
                _BoxPalletApp.showWarning("Please click the pallet number to select.");
            }
            
        });

        $('#btn_transfer').on('click', function() {
            var chkArray = [];
            var table = _BoxPalletApp.$tbl_pallets;
            var cnt = 0;

            for (var x = 0; x < table.context[0].aoData.length; x++) {
                var DataRow = table.context[0].aoData[x];
                if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                    var status = $(DataRow.anCells[2]).html();
                    if (status == "FOR OBA") {
                        chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                    }
                    cnt++;
                }
            }            

            if (chkArray.length > 0) {
                var msg = "Do you want to transfer this Pallet to Q.A.?";

                if (cnt > 1) {
                    msg = "Do you want to transfer these Pallets to Q.A.?";
                }
                _BoxPalletApp.msg = msg;
                _BoxPalletApp.confirmAction(msg).then(function(approve) {
                    if (approve)
                        _BoxPalletApp.transferTo({
                            _token: _BoxPalletApp.token,
                            ids: chkArray
                        });
                });
            } else {
                _BoxPalletApp.showWarning("Please select at least 1 Pallet with a 'FOR OBA' status.");
            }
        });

        $('#btn_broken_pallet').on('click', function() {
            var chkArray = [];
            var table = _BoxPalletApp.$tbl_pallets;
            var cnt = 0;

            for (var x = 0; x < table.context[0].aoData.length; x++) {
                var DataRow = table.context[0].aoData[x];
                if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                    chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                    cnt++;
                }
            }

            if (chkArray.length == 1) {
                var msg = "Do you want to assign this Pallet as Broken Pallet?";
                _BoxPalletApp.msg = msg;

                _BoxPalletApp.confirmAction(msg).then(function(approve) {
                    if (approve)
                        _BoxPalletApp.checkAuthorization(chkArray[0],'broken_pallet');
                });
            } else {
                _BoxPalletApp.showWarning('Please check / select only 1 Pallet.');
            }
        });

        $('#btn_set_new_box_count').on('click', function() {
            _BoxPalletApp.setNewBoxCount();
        });

        $('#btn_update').on('click', function() {
            var chkArray = [];
            var table = _BoxPalletApp.$tbl_pallets;
            var cnt = 0;

            for (var x = 0; x < table.context[0].aoData.length; x++) {
                var DataRow = table.context[0].aoData[x];
                if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                    chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                    cnt++;
                }
            }

            if (chkArray.length == 1) {
                var msg = "Do you want to update this Pallet?";
                _BoxPalletApp.msg = msg;

                _BoxPalletApp.confirmAction(msg).then(function(approve) {
                    if (approve)
                        _BoxPalletApp.checkAuthorization(chkArray[0],'update_pallet');
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
            });
        });
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };