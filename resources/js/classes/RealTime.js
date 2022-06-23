/*****************************************
A. Name: Real Time Script
B. Synopsis: Real Time Script
***********************************************/
"use strict";

(function() {
    const RealTime = function() {
        return new RealTime.init();
    }
    RealTime.init = function() {
        $D.init.call(this);
        this.$tbl_audit_realtime = "";
        this.token = $("meta[name=csrf-token]").attr("content");
    }
    RealTime.prototype = {
        init: function() {},
    }
    RealTime.init.prototype = $.extend(RealTime.prototype, $D.init.prototype);
    RealTime.init.prototype = RealTime.prototype;

    $(document).ready(function() {
        var _RealTime = RealTime();
        // _RealTime.getUnreadNotification();
        // _RealTime.drawRealTimeAuditDatatables();

        // Echo.channel('audit-trail')
        //     .listen('AuditTrail', function(e) {
        //         _RealTime.$tbl_audit_realtime.ajax.reload(null, false);
        //     });

        // Echo.channel('notification')
        //     .listen('Notify', function(e) {
        //         var noti = e._notification;

        //         var receiver_id = parseInt($('meta[name=user_id]').attr('content'));
        //         if (noti.to == receiver_id) {
        //             // redraw notification menu
        //             _RealTime.getUnreadNotification();
        //             // notification message
        //             _RealTime.showNotification(noti);
        //         }
        //     });

        // $('#notification_list_header').on('click', '.view_notification', function() {
        //     _RealTime.readNotification($(this).attr('data-id'), $(this).attr('data-link'));
        // });


    });
})();
