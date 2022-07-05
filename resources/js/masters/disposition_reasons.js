"use strict";

(function() {
    const Reason = function() {
        return new Reason.init();
    }
    Reason.init = function() {
        $D.init.call(this);
        this.$tbl_reasons = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.cust_checked = 0;
    }
    Reason.prototype = {
        init: function() {},
        clearForm: function(inputs) {
            var self = this;
            $.each(inputs, function(i,x) {
                $('#'+x).val('');
                if (i == 'disposition') {
                    $('#'+x).empty().trigger('change')
                }
                self.hideInputErrors(x);
            });
        }
    }
    Reason.init.prototype = $.extend(Reason.prototype, $D.init.prototype);
    Reason.init.prototype = Reason.prototype;

    $(document).ready(function() {
        var _Reason = Reason();

        $('#disposition').select2({
            allowClear: true,
            placeholder: 'Select Disposition',
            theme: 'bootstrap4',
            width: 'auto',
            ajax: {
                url: '/masters/disposition-reasons/get-dispositions',
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

        $('#frm_reasons').on('submit', function(e) {
            e.preventDefault();
            $('#loading_modal').modal('show');
                
            var data = $(this).serializeArray();
            $.ajax({
                url: $(this).attr('action'),
                type: 'POST',
                dataType: 'JSON',
                data: data
            }).done(function(response, textStatus, xhr) {
                console.log(response);
                console.log(response.inputs);
                if (textStatus) {
                    switch (response.status) {
                        case "failed":
                            _Reason.showWarning(response.msg);
                            break;
                        case "error":
                            _Reason.ErrorMsg(response.msg);
                            break;
                        default:
                            _Reason.clearForm(response.inputs);
                            _Reason.$tbl_reasons.ajax.reload();
                            _Reason.showSuccess(response.msg);
                            break;
                    }
                    _Reason.id = 0;
                }
            }).fail(function(xhr, textStatus, errorThrown) {
                var errors = xhr.responseJSON.errors;
                _Reason.showInputErrors(errors);

                if (errorThrown == "Internal Server Error") {
                    _Reason.ErrorMsg(xhr);
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