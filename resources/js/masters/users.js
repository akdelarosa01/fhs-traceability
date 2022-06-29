"use strict";

(function() {
    const Users = function() {
        return new Users.init();
    }
    Users.init = function() {
        $D.init.call(this);
        this.$tbl_users = "";
        this.$tbl_pages = "";
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
        drawPageDatatables: function(user_id) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = {
                _token: self.token,
                user_id: user_id
            };
            self.formAction = "/masters/users/page-list";
            self.sendData().then(function() {
                var response = self.responseData;
                self.$tbl_pages = "";

                $.each(response, function(i,x) {
                    self.$tbl_pages += "<tr>";

                    var authorize = (x.authorize > 0)? "checked":""; 
                    var read_and_write = (x.read_and_write > 0)? "checked":"";
                    var deletes = (x.delete > 0)? "checked":"";

                    if (x.has_sub > 0 && x.parent_name == 0) {
                        self.$tbl_pages += '<td colspan="5">'+x.page_label+'<input type="hidden" class="page_id" name="page_id[]" data-has_sub="'+x.has_sub +'" data-page_label="'+x.page_label +'" data-parent_name="'+x.parent_name +'" value="'+x.id+'"/></td>';
                    } else if (x.parent_name == 0 && x.has_sub == 0) {
                        self.$tbl_pages += '<td colspan="2">'+x.page_label+'<input type="hidden" class="page_id" name="page_id[]" data-has_sub="'+x.has_sub +'" data-parent_name="'+x.parent_name +'" value="'+x.id+'"/></td>'+
                                            '<td class="text-center"><input type="checkbox" id="authorize_'+x.id+'" class="authorize" name="authorize[]" value="1" '+authorize+'/></td>'+
                                            '<td class="text-center"><input type="checkbox" id="read_and_write_'+x.id+'" class="read_and_write" name="read_and_write[]" value="1" '+read_and_write+'/></td>'+
                                            '<td class="text-center"><input type="checkbox" id="delete_'+x.id+'" class="delete" name="delete[]" value="1" '+deletes+'/></td>';
                    } else {
                        self.$tbl_pages += '<td></td><td>'+x.page_label+'<input type="hidden" class="page_id" name="page_id[]" data-has_sub="'+x.has_sub +'" data-parent_name="'+x.parent_name +'" value="'+x.id+'"/></td>'+
                                            '<td class="text-center"><input type="checkbox" id="authorize_'+x.id+'" class="authorize" name="authorize[]" value="1" '+authorize+'/></td>'+
                                            '<td class="text-center"><input type="checkbox" id="read_and_write_'+x.id+'" class="read_and_write" name="read_and_write[]" value="1" '+read_and_write+'/></td>'+
                                            '<td class="text-center"><input type="checkbox" id="delete_'+x.id+'" class="delete" name="delete[]" value="1" '+deletes+'/></td>';
                    }
                    
                    self.$tbl_pages += "</tr>";
                });

                $('#tbl_pages tbody').html(self.$tbl_pages);
                $('#modal_user_access').modal('show');
            });
        },
        deleteUser: function(IDs) {
            var self = this;
            self.submitType = "POST";
            self.formAction = '/masters/users/delete-user';
            self.jsonData = { _token: self.token, ids: IDs };
            self.sendData().then(function() {
                self.$tbl_users.ajax.reload(null, false);
            });
            return this;
        },
        clearForm: function(inputs) {
            var self = this;
            $.each(inputs, function(i,x) {
                $('#'+x).val('');
                self.hideInputErrors(x);
            });
        },
        saveUserAccess: function() {
            var read_and_write = 0;
            var deletes = 0;
            var authorize = 0;

            var params = $('.page_id').map(function() {

                if ($(this).attr('data-has_sub') > 0) {
                    var page_label = $(this).attr('data-page_label');
                    page_label = page_label.replace(' ','');

                    read_and_write = 0;
                    deletes = 0;
                    authorize = 0;
                    
                    $('.page_id').each(function(i,x) {
                        var parent_name = $(x).attr('data-parent_name');
                        parent_name = parent_name.replace(' ','');

                        if (page_label == parent_name) {
                            if ($('#authorize_'+this.value).is(':checked')) {
                                read_and_write = 1;
                                deletes = 1;
                                authorize = 1;
                                return false;
                            }
                        }
                    });

                    return {
                        'page_id': this.value,
                        'read_and_write': read_and_write,
                        'delete': deletes,
                        'authorize': authorize
                    };
                } else {
                    read_and_write = ($('#read_and_write_'+this.value).is(':checked'))? 1 : 0;
                    deletes = ($('#delete_'+this.value).is(':checked'))? 1 : 0;
                    authorize = ($('#authorize_'+this.value).is(':checked'))? 1 : 0;

                    return {
                        'page_id': this.value,
                        'read_and_write': read_and_write,
                        'delete': deletes,
                        'authorize': authorize
                    };
                }
                
            }).get();

            var self = this;
            self.submitType = "POST";
            self.formAction = '/masters/users/save-user-access';
            self.jsonData = { 
                _token: self.token,
                user_id: $('#user_id').val(),
                access: params
            };
            self.sendData().then(function() {
                
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
            var inputs = $('.clear').map(function() {
                return this.name;
            });
            _Users.clearForm(inputs);
            $('.clear').val('');
            $('#modal_form_title').html('Add User');
            $('#modal_users').modal('show');
        });

        $('#btn_user_access').on('click', function() {
            var chkArray = [];
            var table = $('#tbl_users').DataTable();

            for (var x = 0; x < table.context[0].aoData.length; x++) {
                var DataRow = table.context[0].aoData[x];
                if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                    chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                }
            }
            if (chkArray.length == 1) {
                $('#user_id').val(chkArray[0]);
                _Users.drawPageDatatables(chkArray[0]);
            } else {
                _Users.showWarning('Please select or check 1 user.');
            }
            
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
                if (textStatus) {
                    switch (response.status) {
                        case "failed":
                            _Users.showWarning(response.msg);
                            break;
                        case "error":
                            _Users.ErrorMsg(response.msg);
                            break;
                        default:
                            _Users.clearForm(response.inputs);
                            _Users.$tbl_users.ajax.reload();
                            _Users.showSuccess(response.msg);
                            break;
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
            var inputs = $('.clear').map(function() {
                return this.name;
            });
            _Users.clearForm(inputs);
            
            var data = $('#tbl_users').DataTable().row($(this).parents('tr')).data();

            $('#id').val(data.id);
            $('#username').val(data.username);
            $('#firstname').val(data.firstname);
            $('#lastname').val(data.lastname);
            $('#email').val(data.email);

            $('#modal_form_title').html('Edit User');
            $('#modal_users').modal('show');
        });

        $('#btn_delete_users').on('click', function() {
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

        $('#btn_save_user_access').on('click', function() {
            _Users.saveUserAccess();
        });

        $('#tbl_pages tbody').on('change', '.authorize', function() {
            var id = $(this).attr('id');
            var page_id = id.replace('authorize_','');

            if ($(this).is(':checked')) {
                console.log(page_id);
                $('#read_and_write_'+page_id).prop('checked',true);
                $('#delete_'+page_id).prop('checked',true);
            } else {
                $('#read_and_write_'+page_id).prop('checked',false);
                $('#delete_'+page_id).prop('checked',false);
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
