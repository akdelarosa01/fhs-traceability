"use strict";

(function() {
    const BoxPalletApp = function() {
        return new BoxPalletApp.init();
    }
    BoxPalletApp.init = function() {
        $D.init.call(this);
        $F.init.call(this);
        this.$tbl_transactions = "";
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
                    } else {
                        $('#btn_add_new').prop('disabled', false);
                        $('#btn_cancel').prop('disabled', true);
                        $('#btn_proceed').prop('disabled', true);
                        $('#btn_start_scan').html("Start Scan");
                        $('#btn_start_scan').removeClass("btn-danger");
                        $('#btn_start_scan').addClass("btn-success");
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
            var model_count = 0;
            if (!$.fn.DataTable.isDataTable('#tbl_transactions')) {
                self.$tbl_transactions = $('#tbl_transactions').DataTable({
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    select: true,
                    ajax: {
                        url: "/transactions/box-and-pallet/get-transactions",
                        dataType: "JSON",
                        error: function(response) {
                            console.log(response);
                        }
                    },
                    deferRender: true,
                    columns: [
                        { data: function(data) {
                            console.log(data);
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

                        model_count++;
                        $('#model_count').html(model_count);
                    },
                    initComplete: function() {
                    },
                    fnDrawCallback: function() {
                        // $("#tbl_transactions").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
    }
    BoxPalletApp.init.prototype = $.extend(BoxPalletApp.prototype, $D.init.prototype, $F.init.prototype);
    BoxPalletApp.init.prototype = BoxPalletApp.prototype;

    $(document).ready(function() {
        var _BoxPalletApp = BoxPalletApp();
        _BoxPalletApp.viewState('');
        _BoxPalletApp.RunDateTime();
        _BoxPalletApp.drawTransactionsDatatables();

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
                            // _BoxPalletApp.$tbl_transactions.ajax.reload();
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
        
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };