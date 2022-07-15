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
                            switch (data.model_status) {
                                case 1:
                                    return 'READY';
                                    break;
                            
                                default:
                                    return 'NOT READY'
                                    break;
                            }
                        }, name: 'model_status', searchable: false, orderable: false, className: 'text-right' },
                    ],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {
                        if (data.model_status == 0) {
                            $(row).css('background-color', '#FF8080'); // YELLOW = NOT READY
                            $(row).css('color', '#000000');
                        }

                        if (data.model_status == 1) {
                            $(row).css('background-color', '#66BFBF'); // GREEN = READY
                            $(row).css('color', '#000000');
                        }
                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
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
                        switch (data.pallet_status) {
                            case 1:
                                $(row).css('background-color', '#FFC4DD');
                                $(row).css('color', '#000000');
                                break;
                            case 2:
                                $(row).css('background-color', '#36AE7C');
                                $(row).css('color', '#000000');
                                break;
                            case 3:
                                $(row).css('background-color', '#47B5FF');
                                $(row).css('color', '#000000');
                                break;
                            case 4:
                                $(row).css('background-color', '#FF0063');
                                $(row).css('color', '#000000');
                                break;
                            case 5:
                                $(row).css('background-color', '#FF0063');
                                $(row).css('color', '#000000');
                                break;
                            default:
                                $(row).css('background-color', '#FFDCAE');
                                $(row).css('color', '#000000');
                                break;
                        }                        
                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
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
                    select: {
                        style: 'multiple',
                    },
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
                        { data: 'box_qr', name: 'box_qr', searchable: false, orderable: false },
                        { data: 'pallet_id', name: 'pallet_id', searchable: false, orderable: false }
                    ],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {                     
                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
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
                                $('#btn_print_preview').prop('disabled',false);
                            } else {
                                self.statusMsg("Ready to Print!","success");
                                $('#btn_print_preview').prop('disabled',false);
                                $('#btn_print_pallet').prop('disabled',false);
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
        printPallet: function(pallet_id) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = {
                _token: self.token,
                pallet_id: pallet_id
            };
            self.formAction = "/transactions/box-and-pallet/print-pallet";
            self.sendData().then(function() {
                $('#btn_print_preview').prop('disabled',false);
                $('#btn_reprint_pallet').prop('disabled',false);
                $('#btn_print_pallet').prop('disabled',true);
                self.statusMsg("Pallet was already printed!","success");
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
        });

        $('#btn_cancel').on('click', function() {
            _BoxPalletApp.viewState('');
            $('.clear').val('');
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
                    switch (response.msgType) {
                        case "failed":
                            _BoxPalletApp.showWarning(response.msg);
                            break;
                        case "error":
                            _BoxPalletApp.showError(response.msg);
                            break;
                        default:
                            _BoxPalletApp.clearForm(response.inputs);
                            _BoxPalletApp.viewState('');
                            _BoxPalletApp.$tbl_transactions.ajax.reload();
                            _BoxPalletApp.showSuccess(response.msg);
                            break;
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
            console.log(data);
            $('#trans_id').val(data.id);
            $('#selected_model_id').val(data.model_id);
            $('#running_model').val(data.model);
            $('#target_pallet').val(data.target_no_of_pallet);
            $('#box_per_pallet').val(data.box_count_per_pallet);
            $('#pallet_count_full').html(data.target_no_of_pallet);

            $('#pallet_id').val('');
            $('#pallet_id_qr').val('');
            $('#is_printed').val('');
            $('#box_count_full').html(0);
            $('#pallet_count_full').html(0);
            $('#pallet_count').html(0);

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
            $('#is_printed').val(data.is_deleted);
            $('#box_count_full').html(data.box_count_per_pallet);

            _BoxPalletApp.statusMsg('','clear');
            _BoxPalletApp.$tbl_boxes.ajax.reload();
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#pallet_id').val('');
            $('#pallet_id_qr').val('');
            $('#is_printed').val('');
            $('#box_count_full').html(0);

            _BoxPalletApp.$tbl_boxes.ajax.reload();
            $('#box_count').html(0);
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

        $('#btn_print_pallet').on('click', function() {
            var pallet_id = $('#pallet_id').val();
            _BoxPalletApp.printPallet(pallet_id);
        });

        $('#btn_print_preview').on('click', function() {
            var pallet_id_qr = $('#pallet_id_qr').val();
            var model = $('#running_model').val();
            var box_count = $('#box_count_full').html();
            var box_ids = "";

            if (pallet_id_qr != "") {
                $('#modal_form_title').html("Print Preview: " + pallet_id_qr);
                const month = moment().format('MMM')
                $('#prv_label_title').html(month.toUpperCase() + " FTL PALLET LABEL");

                _BoxPalletApp.$tbl_boxes.rows().data().map((row) => {
                    box_ids += row.box_qr+";";
                });

                $('#prv_model').html(model);
                $('#prv_date').html('2022/07/15');
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
        
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };