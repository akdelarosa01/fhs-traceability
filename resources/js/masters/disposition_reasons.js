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
    });
})();




window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };