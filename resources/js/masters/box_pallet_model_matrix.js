"use strict";

(function() {
    const Model = function() {
        return new Model.init();
    }
    Model.init = function() {
        $D.init.call(this);
        this.$tbl_models = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.model_checked = 0;
    }
    Model.prototype = {
        init: function() {},
    }
    Model.init.prototype = $.extend(Model.prototype, $D.init.prototype);
    Model.init.prototype = Model.prototype;

    $(document).ready(function() {
        var _Model = Model();

        
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };