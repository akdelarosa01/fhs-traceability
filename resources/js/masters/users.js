"use strict";

(function() {
    const Users = function() {
        return new Users.init();
    }
    Users.init = function() {
        $D.init.call(this);
        this.$tbl_users = "";
        this.ID = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
    }
    Users.prototype = {
        init: function() {},
        drawDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_users')) {
                self.$tbl_users = $('#tbl_users').DataTable({
                    // processing: true,
                    // ajax: {
                    //     url: "/admin/user-master/list",
                    //     dataType: "JSON",
                    //     error: function(response) {
                    //         console.log(response);
                    //     }
                    // },
                    // deferRender: true,
                    // language: {
                    //     aria: {
                    //         sortAscending: ": activate to sort column ascending",
                    //         sortDescending: ": activate to sort column descending"
                    //     },
                    //     emptyTable: "No data available in table",
                    //     info: "Showing _START_ to _END_ of _TOTAL_ records",
                    //     infoEmpty: "No records found",
                    //     infoFiltered: "(filtered1 from _MAX_ total records)",
                    //     lengthMenu: "Show _MENU_",
                    //     search: "Search:",
                    //     zeroRecords: "No matching records found",
                    //     paginate: {
                    //         "previous": "Prev",
                    //         "next": "Next",
                    //         "last": "Last",
                    //         "first": "First"
                    //     }
                    // },
                    // pageLength: 10,
                    // order: [
                    //     [10, "desc"]
                    // ],
                    // columns: [{
                    //         data: function(x) {
                    //             return '<input type="checkbox" class="table-checkbox check_user" value="' + x.id + '">';
                    //         },
                    //         name: 'id',
                    //         searchable: false,
                    //         orderable: false,
                    //         width: '3.09%'
                    //     },
                    //     {
                    //         data: function(x) {

                    //             return '<button type="button" class="btn btn-xs btn-primary btn_edit_user" data-id="' + x.id + '">' +
                    //                 '<i class="fa fa-edit"></i>' +
                    //                 '</button>';
                    //         },
                    //         name: 'action',
                    //         orderable: false,
                    //         searchable: false,
                    //         width: '3.09%'
                    //     },
                    //     { data: 'user_id', name: 'user_id', width: '9.09%' },
                    //     { data: 'firstname', name: 'firstname', width: '12.09%' },
                    //     { data: 'nickname', name: 'nickname', width: '12.09%' },
                    //     { data: 'lastname', name: 'lastname', width: '12.09%' },
                    //     { data: 'email', name: 'email', width: '9.09%' },
                    //     { data: 'div_code', name: 'div_code', width: '12.09%' },
                    //     { data: 'user_type', name: 'user_type', width: '9.09%' },
                    //     { data: 'actual_password', name: 'actual_password', width: '9.09%' },
                    //     { data: 'created_at', name: 'created_at', width: '9.09%' },
                    // ],
                    // rowCallback: function(row, data) {
                    //     var td = $(row).find('td:first .check_user');
                    //     if (td.is(':checked')) {
                    //         self.user_checked++;
                    //     }
                    // },
                    // createdRow: function(row, data, dataIndex) {
                    //     if (data.del_flag === 1) {
                    //         $(row).css('background-color', '#ff6266');
                    //         $(row).css('color', '#fff');
                    //     }
                    // },
                    // initComplete: function() {
                    //     $('.check_all_users').prop('checked', false);
                    // },
                    // fnDrawCallback: function() {
                    //     if (self.user_checked > 9) {
                    //         $('.check_all_users').prop('checked', true);
                    //     } else {
                    //         $('.check_all_users').prop('checked', false);
                    //     }
                    //     self.checkCheckboxesInTable('#tbl_users', '.check_all_users', '.check_user');
                    //     self.checkAllCheckboxesInTable('#tbl_users', '.check_all_users', '.check_user');
                    //     $("#tbl_users").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    // },
                }).on('page.dt', function() {
                    self.user_checked = 0;
                });
            }
            return this;
        },
        saveUser: function() {
            var self = this;
            self.submitType = "POST";
            self.formAction = $('#frm_users').attr('action');
            self.jsonData = $('#frm_users').serializeArray();
            self.sendData().then(function() {
                // self.clear();
                // self.GuiState();
                // self.$tbl_machineno.ajax.reload(null, false);
            });
            return this;
        }
    }
    Users.init.prototype = $.extend(Users.prototype, $D.init.prototype);
    Users.init.prototype = Users.prototype;

    $(document).ready(function() {
        var _Users = Users();
        _Users.drawDatatables();

        $('#btn_add_users').on('click', function() {
            $('#modal_form_title').html('Add User');
            $('#modal_users').modal('show');
        });

        $('#frm_users').on('submit', function(e) {
            $('#loading_modal').modal('show');
            e.preventDefault();
            var data = $(this).serializeArray();
            $.ajax({
                url: $(this).attr('action'),
                type: 'POST',
                dataType: 'JSON',
                data: data
            }).done(function(data, textStatus, xhr) {
                if (textStatus) {
                    if (data.status == "failed") {
                        _Users.showWarning(data.msg);
                    } else {
                        _Users.clearForm();
                        $('#tbl_user').DataTable().ajax.reload();
                        _Users.showSuccess("User data was successfully saved.");
                    }

                    _Users.user_type_id = "";
                    _Users.user_id = "";
                    $('#tbl_modules').DataTable().ajax.reload();
                }
            }).fail(function(xhr, textStatus, errorThrown) {
                var errors = xhr.responseJSON.errors;
                _Users.showInputErrors(errors);

                if (errorThrown == "Internal Server Error") {
                    _Users.ErrorMsg(xhr);
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
