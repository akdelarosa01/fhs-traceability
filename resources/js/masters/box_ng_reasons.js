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
        drawDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_reasons')) {
                self.$tbl_reasons = $('#tbl_reasons').DataTable({
                    processing: true,
                    ajax: {
                        url: "/masters/box-ng-reasons/list",
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
                        [4, "desc"]
                    ],
                    columns: [{
                            data: function(x) {
                                return '<input type="checkbox" class="table-checkbox check_reason" value="' + x.id + '">';
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
                        { data: 'reason', name: 'reason' },
                        { data: 'create_user', name: 'create_user' },
                        { data: 'updated_at', name: 'updated_at' },
                    ],
                    rowCallback: function(row, data) {
                        var td = $(row).find('td:first .check_reason');
                        if (td.is(':checked')) {
                            self.cust_checked++;
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        if (data.is_deleted === 1) {
                            $(row).css('background-color', '#ff6266');
                            $(row).css('color', '#fff');
                        }
                    },
                    initComplete: function() {
                        $('.check_all_reasons').prop('checked', false);
                    },
                    fnDrawCallback: function() {
                        if (self.cust_checked > 9) {
                            $('.check_all_reasons').prop('checked', true);
                        } else {
                            $('.check_all_reasons').prop('checked', false);
                        }
                        self.checkCheckboxesInTable('#tbl_reasons', '.check_all_reasons', '.check_reason');
                        self.checkAllCheckboxesInTable('#tbl_reasons', '.check_all_reasons', '.check_reason');
                        $("#tbl_reasons").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                    self.cust_checked = 0;
                });
            }
            return this;
        },
        clearForm: function(inputs) {
            var self = this;
            $.each(inputs, function(i,x) {
                $('#'+x).val('');
                self.hideInputErrors(x);
            });
        },
        delete_reasons: function(IDs) {
            var self = this;
            self.formAction = '/masters/box-ng-reasons/delete-reason';
            self.jsonData = { _token: self.token, ids: IDs };
            self.sendData().then(function() {
                self.$tbl_reasons.ajax.reload(null, false);
            });
            return this;
        },
    }
    BoxNGReason.init.prototype = $.extend(BoxNGReason.prototype, $D.init.prototype);
    BoxNGReason.init.prototype = BoxNGReason.prototype;

    $(document).ready(function() {
        var _BoxNGReason = BoxNGReason();
        _BoxNGReason.permission();
        _BoxNGReason.drawDatatables();

        $('#frm_reasons').on('submit', function(e) {
            e.preventDefault();
            $('#loading_modal').modal('show');
                
            var data = $(this).serializeArray();
            $.ajax({
                url: $(this).attr('action'),
                type: 'POST',
                dataType: 'JSON',
                data: data
            }).done(function(response, textStatus, xhr) {
                if (textStatus) {
                    switch (response.msgType) {
                        case "failed":
                            _BoxNGReason.showWarning(response.msg);
                            break;
                        case "error":
                            _BoxNGReason.ErrorMsg(response.msg);
                            break;
                        default:
                            _BoxNGReason.clearForm(response.inputs);
                            _BoxNGReason.$tbl_reasons.ajax.reload();
                            _BoxNGReason.showSuccess(response.msg);
                            break;
                    }
                    _BoxNGReason.id = 0;
                }
            }).fail(function(xhr, textStatus, errorThrown) {
                var errors = xhr.responseJSON.errors;
                _BoxNGReason.showInputErrors(errors);

                if (errorThrown == "Internal Server Error") {
                    _BoxNGReason.ErrorMsg(xhr);
                }
            }).always(function() {
                $('#loading_modal').modal('hide');
            });
        });

        $('#tbl_reasons').on('click', '.btn_edit_reason', function() {
            var inputs = $('.clear').map(function() {
                return this.name;
            });
            _Reason.clearForm(inputs);

            var data = $('#tbl_reasons').DataTable().row($(this).parents('tr')).data();

            $('#id').val(data.id);
            $('#reason').val(data.reason);
        });

        $('#btn_delete_reasons').on('click', function() {
            var chkArray = [];
            var table = _BoxNGReason.$tbl_reasons;

            for (var x = 0; x < table.context[0].aoData.length; x++) {
                var DataRow = table.context[0].aoData[x];
                if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                    chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                }
            }

            if (chkArray.length > 0) {
                _BoxNGReason.msg = "Are you sure you want to delete this reason/s?";
                _BoxNGReason.confirmAction(_BoxNGReason.msg).then(function(approve) {
                    if (approve)
                        _BoxNGReason.delete_reasons(chkArray);

                    $('.check_all_reasons').prop('checked', false);
                });
            } else {
                _BoxNGReason.showWarning('Please select at least 1 reason.');
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