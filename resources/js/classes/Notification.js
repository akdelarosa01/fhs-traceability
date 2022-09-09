/*****************************************
A. Name: Notification Script
B. Synopsis: Notification Script
***********************************************/
"use strict";

(function() {
    const Notification = function() {
        return new Notification.init();
    }
    Notification.init = function() {
        $D.init.call(this);
        this.$tbl_obas = "";
        this.token = $("meta[name=csrf-token]").attr("content");
    }
    String.prototype.trunc = 
      function(n){
          return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
      };

    Notification.prototype = {
        init: function() {},
        showNotificationList: function() {
            var self = this;
            self.submitType = "GET";
            self.jsonData = {
                _token: self.token,
            };
            self.formAction = "/notifications/show";
            self.sendDataNoLoading().then(function() {
                var response = self.responseData;
                var list = "";
                var cnt = 0;
                $.each(response, function(i,x) {
                    var timeAgo = self.timeSince(x.created_at);
                    var message = x.message;

                    list += '<a href="'+x.url+'" class="dropdown-item media notification-item" data-noti_type="'+x.noti_type+'" title="'+message+'">'+
                                '<div class="media-left">'+
                                    '<i class="fa fa-search media-object bg-silver-darker"></i>'+
                                '</div>'+
                                '<div class="media-body">'+
                                    '<h6 class="media-heading u-wrap">'+x.title+'</h6>'+
                                    '<div class="f-s-11">'+message.trunc(55)+'</div>'+
                                    '<div class="text-muted f-s-10" id="time_ago">'+timeAgo+'</div>'+
                                '</div>'
                            '</a>';
                    cnt++;
                });

                if (cnt < 1) {
                    $('#notification_count').hide();
                } else {
                    $('#notification_count').show();
                    $('#notification_count').html(cnt)
                }
                
                $('#notification_list').html(list);
            });
        },
        readNotification: function(noti_type, link) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = {
                _token: self.token,
                noti_type: noti_type
            };
            self.formAction = "/notifications/read";
            self.sendDataNoLoading().then(function() {
                window.location.href = link;
            });
        }
    }
    Notification.init.prototype = $.extend(Notification.prototype, $D.init.prototype,$R.init.prototype);
    Notification.init.prototype = Notification.prototype;

    $(document).ready(function() {
        var _Notification = Notification();
        _Notification.initOBAdataTable();
        _Notification.showNotificationList();

        Echo.channel('pallet-transferred')
            .listen('.pallet.transferred', function(e) {
                var content = e._content;
                var pallet = e._pallet;
                var recepients = e._recepients;
                var noti_count = e._noti_count;

                console.log(e);

                $.each(recepients, function(i,x) {
                    if (x.user_id == e._current_user) {
                        $('#notification_count').show();
                        $('#notification_count').html(noti_count)
                        _Notification.showNotification(content);
                        //_Notification.$tbl_obas.row.add(pallet).draw();
                    }
                });
            });

        $('#notification_list').on('click', '.notification-item', function(e) {
            e.preventDefault();
            _Notification.readNotification($(this).attr('data-noti_type'), $(this).attr('href'));
        });

        $('#notification_icon a').on('click', function(e) {
            _Notification.showNotificationList();
            // $('#notification_list .notification-item').each(function(i,x) {
            //     var created_at = $(x).attr('created_at');
            //     var timeAgo = _Notification.timeSince(created_at);
            //     $('#time_ago').html(timeAgo);
            // });
        });


    });
})();