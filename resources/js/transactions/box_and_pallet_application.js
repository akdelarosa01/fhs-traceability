"use strict";

(function() {
    const BoxPalletApp = function() {
        return new BoxPalletApp.init();
    }
    BoxPalletApp.init = function() {
        $D.init.call(this);
        this.$tbl_BoxPalletApps = "";
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
        }
    }
    BoxPalletApp.init.prototype = $.extend(BoxPalletApp.prototype, $D.init.prototype);
    BoxPalletApp.init.prototype = BoxPalletApp.prototype;

    $(document).ready(function() {
        var _BoxPalletApp = BoxPalletApp();

        _BoxPalletApp.viewState('');

        $('#btn_add_new').on('click', function() {
            _BoxPalletApp.viewState('NEW');
        });

        $('#btn_cancel').on('click', function() {
            _BoxPalletApp.viewState('');
            $('.clear').val('');
            $('#model_id').empty().trigger('change');
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
        
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };