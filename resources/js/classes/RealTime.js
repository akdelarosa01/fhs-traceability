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
        drawRealTimeAuditDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_audit')) {
                self.$tbl_audit_realtime = $('#tbl_audit').DataTable({
                    processing: true,
                    serverSide: true,
                    ajax: {
                        url: "/admin/audit-trail/get-data",
                        dataType: "JSON",
                        error: function(response) {
                            console.log(response);
                            var errors = response.responseJSON.errors;
                            self.showInputErrors(errors);

                            if (errorThrown == "Internal Server Error") {
                                self.ErrorMsg(response);
                            }
                        }
                    },
                    deferRender: true,
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No data available in table",
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
                    lengthMenu: [
                        [10, 20, 50, 100, 150, 200, 500],
                        [10, 20, 50, 100, 150, 200, 500]
                    ],
                    pageLength: 10,
                    order: [
                        [5, "desc"]
                    ],
                    columns: [
                        { data: 'id', orderable: false, width: '5%' },
                        { data: 'user_type', orderable: false, width: '15%' },
                        { data: 'module', orderable: false, width: '15%' },
                        {
                            data: function(data) {
                                return self.ellipsis(data.action, 80);
                            },
                            orderable: false,
                            width: '40%'
                        },
                        { data: 'fullname', orderable: false, width: '10%' },
                        { data: 'created_at', orderable: false, width: '15%' }
                    ],
                    initComplete: function() {
                        //$('.dataTables_scrollBody').slimscroll();
                    },
                    fnDrawCallback: function() {
                        $("#tbl_audit").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                });
            }
            return this;
        },
        readNotification: function(id, link) {
            $('#notification_bell').html('<i class="fa fa-bell"></i>');

            var self = this;
            self.submitType = "POST";
            self.jsonData = {
                _token: self.token,
                id: id
            };
            self.formAction = "/notification/read";
            self.sendData().then(function() {
                var response = self.responseData;
                if (response.noti_count > 0) {
                    var cnt = response.noti_count;

                    if (response.noti_count > 99) {
                        cnt = "99+";
                    }
                    $('#notification_bell').append('<span class="label label-danger">' + cnt + '</span>');
                }

                self.notiList(response.noti_list, response.noti_count);

                if (link !== undefined) {
                    window.location.href = link;
                }
            });
            return this;
        },
        getUnreadNotification: function() {
            $('#notification_bell').html('<i class="fa fa-bell"></i>');

            var self = this;
            self.submitType = "GET";
            self.jsonData = {
                _token: self.token
            };
            self.formAction = "/notification/get-unread";
            self.sendData().then(function() {
                var response = self.responseData;
                if (response.noti_count > 0) {
                    var cnt = response.noti_count;

                    if (response.noti_count > 99) {
                        cnt = "99+";
                    }
                    $('#notification_bell').append('<span class="label label-danger">' + cnt + '</span>');
                }

                self.notiList(response.noti_list, response.noti_count);
            });
            return this;
        },
        notiList: function(data, count) {
            var list = '';
            var self = this;
            $('#notification_list_header').html(list);

            list += '<li class="dropdown-header" id="noti_header">NOTIFICATIONS (' + count + ')</li>';

            $.each(data, function(i, x) {
                list += '<li class="media view_notification" data-link="' + x.link + '" data-id="' + x.id + '"> \
                    <a href="javascript:;" title="' + x.content + '"> \
                        <div class="media-left"> \
                            <img src="../../../' + x.photo + '" class="media-object" alt=""> \
                        </div> \
                        <div class="media-body"> \
                            <h6 class="media-heading">' + x.title + '</h6> \
                            <p>' + self.ellipsis(x.content, 30) + '</p> \
                            <div class="text-muted f-s-11">' + moment(x.created_at).fromNow() + '</div> \
                        </div> \
                    </a> \
                </li>';
            });
            list += '<li class="dropdown-footer text-center"> \
                        <a href="/notification"> See all Notification </a> \
                    </li>';
            $('#notification_list_header').html(list);
        },
        ellipsis: function(string, string_count) {
            if (string.length > string_count)
                return string.substring(0, string_count) + '...';
            else
                return string;
        }
    }
    RealTime.init.prototype = $.extend(RealTime.prototype, $D.init.prototype);
    RealTime.init.prototype = RealTime.prototype;

    $(document).ready(function() {
        var _RealTime = RealTime();
        _RealTime.getUnreadNotification();
        _RealTime.drawRealTimeAuditDatatables();

        Echo.channel('audit-trail')
            .listen('AuditTrail', function(e) {
                _RealTime.$tbl_audit_realtime.ajax.reload(null, false);
            });

        Echo.channel('notification')
            .listen('Notify', function(e) {
                var noti = e._notification;

                var receiver_id = parseInt($('meta[name=user_id]').attr('content'));
                if (noti.to == receiver_id) {
                    // redraw notification menu
                    _RealTime.getUnreadNotification();
                    // notification message
                    _RealTime.showNotification(noti);
                }
            });

        $('#notification_list_header').on('click', '.view_notification', function() {
            _RealTime.readNotification($(this).attr('data-id'), $(this).attr('data-link'));
        });


    });
})();
