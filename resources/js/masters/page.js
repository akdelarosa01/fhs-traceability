"use strict";

(function() {
    const Pages = function() {
        return new Pages.init();
    }
    Pages.init = function() {
        $D.init.call(this);
        this.$tbl_pages = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
        this.page_checked = 0;
    }
    Pages.prototype = {
        permission: function() {
            var self = this;
            $('.read-only').each(function(i,x) {
                $state = (self.read_only == 1)? true : false;
                $(x).prop('disabled',$state);
            });
        },
        drawDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_pages')) {
                self.$tbl_pages = $('#tbl_pages').DataTable({
                    processing: true,
                    ajax: {
                        url: "/masters/page/list",
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
                        [12, "desc"]
                    ],
                    columns: [{
                            data: function(x) {
                                return '<input type="checkbox" class="table-checkbox check_page" value="' + x.id + '">';
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
                        { data: 'page_name', name: 'page_name' },
                        { data: 'page_label', name: 'page_label' },
                        { data: 'url', name: 'url' },
                        { data: 'has_sub', name: 'has_sub' },
                        { data: 'parent_menu', name: 'parent_menu' },
                        { data: 'parent_name', name: 'parent_name' },
                        { data: 'parent_order', name: 'parent_order' },
                        { data: 'page_order', name: 'page_order' },
                        { data: 'icon', name: 'icon' },
                        { data: 'create_user', name: 'create_user' },
                        { data: 'updated_at', name: 'updated_at' },
                    ],
                    rowCallback: function(row, data) {
                        var td = $(row).find('td:first .check_page');
                        if (td.is(':checked')) {
                            self.page_checked++;
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        if (data.del_flag === 1) {
                            $(row).css('background-color', '#ff6266');
                            $(row).css('color', '#fff');
                        }
                    },
                    initComplete: function() {
                        $('.check_all_pages').prop('checked', false);
                    },
                    fnDrawCallback: function() {
                        if (self.page_checked > 9) {
                            $('.check_all_pages').prop('checked', true);
                        } else {
                            $('.check_all_pages').prop('checked', false);
                        }
                        self.checkCheckboxesInTable('#tbl_pages', '.check_all_pages', '.check_page');
                        self.checkAllCheckboxesInTable('#tbl_pages', '.check_all_pages', '.check_page');
                        $("#tbl_pages").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                    self.page_checked = 0;
                });
            }
            return this;
        },
        delete_page: function(IDs) {
            var self = this;
            self.formAction = '/masters/page/delete-page';
            self.jsonData = { _token: self.token, ids: IDs };
            self.sendData().then(function() {
                self.$tbl_pages.ajax.reload(null, false);
            });
            return this;
        },
        clearForm: function(inputs) {
            var self = this;
            $.each(inputs, function(i,x) {
                $('#'+x).val('');
                self.hideInputErrors(x);
            });
        }
    }
    Pages.init.prototype = $.extend(Pages.prototype, $D.init.prototype);
    Pages.init.prototype = Pages.prototype;

    $(document).ready(function() {
        var _Pages = Pages();
        _Pages.permission();
        _Pages.drawDatatables();

        $('#btn_add_pages').on('click', function() {
            var inputs = $('.clear').map(function() {
                return this.name;
            });
            _Pages.clearForm(inputs);
            $('#modal_form_title').html('Add Page');
            $('#modal_pages').modal('show');
        });

        $('#frm_pages').on('submit', function(e) {
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
                            _Pages.showWarning(response.msg);
                            break;
                        case "error":
                            _Pages.ErrorMsg(response.msg);
                            break;
                        default:
                            _Pages.clearForm(response.inputs);
                            _Pages.$tbl_pages.ajax.reload();
                            _Pages.showSuccess(response.msg);
                            break;
                    }
                    
                    _Pages.id = 0;
                }
            }).fail(function(xhr, textStatus, errorThrown) {
                var errors = xhr.responseJSON.errors;
                _Pages.showInputErrors(errors);

                if (errorThrown == "Internal Server Error") {
                    _Pages.ErrorMsg(xhr);
                }
            }).always(function() {
                $('#loading_modal').modal('hide');
            });
        });

        $('#tbl_pages').on('click', '.btn_edit_page', function() {
            var inputs = $('.clear').map(function() {
                return this.name;
            });
            _Pages.clearForm(inputs);

            var data = $('#tbl_pages').DataTable().row($(this).parents('tr')).data();

            $('#id').val(data.id);
            $('#page_name').val(data.page_name);
            $('#page_label').val(data.page_label);
            $('#url').val(data.url);
            $('#parent_menu').val(data.parent_menu);
            $('#parent_name').val(data.parent_name);
            $('#parent_order').val(data.parent_order);
            $('#order').val(data.page_order);
            $('#icon').val(data.icon);

            if (data.has_sub == "YES") {
                $('#has_sub').prop('checked', true);
            } else {
                $('#has_sub').prop('checked', false);
            }

            $('#modal_form_title').html('Edit Page');
            $('#modal_pages').modal('show');
        });

        $('#btn_delete_pages').on('click', function() {
            var chkArray = [];
            var table = _Pages.$tbl_pages;

            for (var x = 0; x < table.context[0].aoData.length; x++) {
                var DataRow = table.context[0].aoData[x];
                if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                    chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                }
            }

            if (chkArray.length > 0) {
                _Pages.msg = "Are you sure you want to delete this page/s?";
                _Pages.confirmAction().then(function(approve) {
                    if (approve)
                        _Pages.delete_page(chkArray);

                    $('.check_all_pages').prop('checked', false);
                });
            } else {
                _Pages.showWarning('Please select at least 1 page.');
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
