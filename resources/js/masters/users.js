"use strict";

(function() {
    const Users = function() {
        return new Users.init();
    }
    Users.init = function() {
        $D.init.call(this);
        this.$tbl_users = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
    }
    Users.prototype = {
        init: function() {},
        drawDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_users')) {
                self.$tbl_users = $('#tbl_users').DataTable({
                    processing: true,
                    ajax: {
                        url: "/masters/users/list",
                        dataType: "JSON",
                        error: function(response) {
                            console.log(response);
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
                    pageLength: 10,
                    order: [
                        [7, "desc"]
                    ],
                    columns: [{
                            data: function(x) {
                                return '<input type="checkbox" class="table-checkbox check_user" value="' + x.id + '">';
                            },
                            name: 'id',
                            searchable: false,
                            orderable: false
                        },
                        {
                            data: 'action',
                            name: 'action',
                            orderable: false,
                            searchable: false
                        },
                        { data: 'username', name: 'username' },
                        { data: 'firstname', name: 'firstname' },
                        { data: 'lastname', name: 'lastname' },
                        { data: 'email', name: 'email' },
                        { data: 'create_user', name: 'create_user' },
                        { data: 'updated_at', name: 'updated_at' },
                    ],
                    rowCallback: function(row, data) {
                        var td = $(row).find('td:first .check_user');
                        if (td.is(':checked')) {
                            self.user_checked++;
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        if (data.del_flag === 1) {
                            $(row).css('background-color', '#ff6266');
                            $(row).css('color', '#fff');
                        }
                    },
                    initComplete: function() {
                        $('.check_all_users').prop('checked', false);
                    },
                    fnDrawCallback: function() {
                        if (self.user_checked > 9) {
                            $('.check_all_users').prop('checked', true);
                        } else {
                            $('.check_all_users').prop('checked', false);
                        }
                        self.checkCheckboxesInTable('#tbl_users', '.check_all_users', '.check_user');
                        self.checkAllCheckboxesInTable('#tbl_users', '.check_all_users', '.check_user');
                        $("#tbl_users").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                    self.user_checked = 0;
                });
            }
            return this;
        },
        deleteUser: function() {

        },
        clearForm: function(inputs) {
            var self = this;
            $.each(inputs, function(i,x) {
                $('#'+x).val('');
                self.hideInputErrors(x);
            });
        }
    }
    Users.init.prototype = $.extend(Users.prototype, $D.init.prototype);
    Users.init.prototype = Users.prototype;

    $(document).ready(function() {
        var _Users = Users();
        _Users.drawDatatables();

        $('#btn_add_users').on('click', function() {
            $('.clear').val('');
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
            }).done(function(response, textStatus, xhr) {
                console.log(response);
                console.log(response.inputs);
                if (textStatus) {
                    if (response.status == "failed") {
                        _Users.showWarning(response.msg);
                    } else {
                        _Users.clearForm();
                        _Users.$tbl_users.ajax.reload();
                        _Users.showSuccess("User data was successfully saved.");
                    }
                    _Users.id = 0;
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

        $('#tbl_users').on('click', '.btn_edit_user', function() {
            var data = $('#tbl_users').DataTable().row($(this).parents('tr')).data();

            $('#id').val(data.id);
            $('#username').val(data.username);
            $('#firstname').val(data.firstname);
            $('#lastname').val(data.lastname);
            $('#email').val(data.email);

            $('#modal_form_title').html('Edit User');
            $('#modal_users').modal('show');
        });

        $('#btn_delete_user').on('click', function() {
            var chkArray = [];
            var table = $('#tbl_users').DataTable();

            for (var x = 0; x < table.context[0].aoData.length; x++) {
                var DataRow = table.context[0].aoData[x];
                if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                    chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                }
            }

            if (chkArray.length > 0) {
                _Users.msg = "Are you sure you want to delete this User/s?";
                _Users.confirmAction().then(function(approve) {
                    if (approve)
                        _Users.deleteUser(chkArray);

                    $('.check_all_users').prop('checked', false);
                });
            } else {
                _Users.showWarning('Please select at least 1 user.');
            }
        });
    });
})();




window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };
