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
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.BoxPalletApp_checked = 0;
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
                    } else {
                        $('#btn_add_new').prop('disabled', false);
                        $('#btn_cancel').prop('disabled', true);
                        $('#btn_proceed').prop('disabled', true);
                        $('#btn_start_scan').html("Start Scan");
                        $('#btn_start_scan').removeClass("btn-danger");
                        $('#btn_start_scan').addClass("btn-success");
                        $('#box_qr').prop('readonly', true);
                        $('#box_qr').val('');
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

        $('#btn_add_new').on('click', function() {
            _BoxPalletApp.viewState('NEW');
        });

        $('#btn_cancel').on('click', function() {
            _BoxPalletApp.viewState('');
            $('.clear').val('');
            $('#model_id').empty().trigger('change.select2');
        });

        $('#btn_start_scan').on('click', function() {
            _BoxPalletApp.viewState('SCAN');
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
            $('#trans_id').val(data.id);
            $('#running_model').val(data.model);
            $('#target_pallet').val(data.target_no_of_pallet);
            $('#box_per_pallet').val(data.box_count_per_pallet);

            $('#pallet_count_full').html(data.target_no_of_pallet);

            _BoxPalletApp.$tbl_pallets.ajax.reload();
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#trans_id').val('');
            $('#running_model').val('');
            $('#target_pallet').val('');
            $('#box_per_pallet').val('');

            $('#pallet_count_full').html(0);

            _BoxPalletApp.$tbl_pallets.ajax.reload();
            $('#pallet_count').html(0);
        });

        _BoxPalletApp.$tbl_pallets.on('select', function ( e, dt, type, indexes ) {
            var rowData = _BoxPalletApp.$tbl_pallets.rows( indexes ).data().toArray();
            var data = rowData[0];

            $('#pallet_id').val(data.id);
            $('#pallet_id_qr').val(data.pallet_qr);

            $('#box_count_full').html(data.box_count_per_pallet);

            // _BoxPalletApp.$tbl_boxes.ajax.reload();
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#pallet_id').val('');
            $('#pallet_id_qr').val('');

            $('#box_count_full').html(0);

            // _BoxPalletApp.$tbl_boxes.ajax.reload();
            $('#box_count').html(0);
        });
        
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };