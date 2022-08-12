"use strict";

(function() {
    const BoxNGReason = function() {
        return new BoxNGReason.init();
    }
    BoxNGReason.init = function() {
        $D.init.call(this);
        this.$tbl_reasons = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
        this.cust_checked = 0;
    }
    BoxNGReason.prototype = {
        permission: function() {
            var self = this;
            $('.read-only').each(function(i,x) {
                $state = (self.read_only == 1)? true : false;
                $(x).prop('disabled',$state);
            });
        },
    }
    BoxNGReason.init.prototype = $.extend(BoxNGReason.prototype, $D.init.prototype);
    BoxNGReason.init.prototype = BoxNGReason.prototype;

    $(document).ready(function() {
        var _BoxNGReason = BoxNGReason();
        _BoxNGReason.permission();
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };