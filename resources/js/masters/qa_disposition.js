"use strict";

(function() {
    const Disposition = function() {
        return new Disposition.init();
    }
    Disposition.init = function() {
        $D.init.call(this);
        this.$tbl_dispositions = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.cust_checked = 0;
    }
    Disposition.prototype = {
        init: function() {},
        drawDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_dispositions')) {
                self.$tbl_dispositions = $('#tbl_dispositions').DataTable({
                    processing: true,
                    ajax: {
                        url: "/masters/qa-disposition/list",
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
                        [5, "desc"]
                    ],
                    columns: [{
                            data: function(x) {
                                return '<input type="checkbox" class="table-checkbox check_disposition" value="' + x.id + '">';
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
                        { data: 'disposition', name: 'disposition' },
                        { data: 'color_hex', name: 'color_hex' },
                        { data: 'create_user', name: 'create_user' },
                        { data: 'updated_at', name: 'updated_at' },
                    ],
                    rowCallback: function(row, data) {
                        var td = $(row).find('td:first .check_disposition');
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
                        $('.check_all_dispositions').prop('checked', false);
                    },
                    fnDrawCallback: function() {
                        if (self.cust_checked > 9) {
                            $('.check_all_dispositions').prop('checked', true);
                        } else {
                            $('.check_all_dispositions').prop('checked', false);
                        }
                        self.checkCheckboxesInTable('#tbl_dispositions', '.check_all_dispositions', '.check_disposition');
                        self.checkAllCheckboxesInTable('#tbl_dispositions', '.check_all_dispositions', '.check_disposition');
                        $("#tbl_dispositions").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                    self.cust_checked = 0;
                });
            }
            return this;
        },
        checkIfHex: function(color_hex) {
            var color =/^#([0-9a-f]{3}){1,2}$/i;
            if (color.test(color_hex)) {
                return true;
            }
            return false;
        },
        // delete_dispositions: function(IDs) {
        //     var self = this;
        //     self.formAction = '/masters/dispositions/delete-disposition';
        //     self.jsonData = { _token: self.token, ids: IDs };
        //     self.sendData().then(function() {
        //         self.$tbl_dispositions.ajax.reload(null, false);
        //     });
        //     return this;
        // },
        clearForm: function(inputs) {
            var self = this;
            $.each(inputs, function(i,x) {
                $('#'+x).val('');
                self.hideInputErrors(x);
            });
        }
    }
    Disposition.init.prototype = $.extend(Disposition.prototype, $D.init.prototype);
    Disposition.init.prototype = Disposition.prototype;

    $(document).ready(function() {
        var _Disposition = Disposition();
        _Disposition.drawDatatables();

        $('#color_hex').colorpicker();

        $('#color_hex').on('colorpickerChange', function(event) {
            $('.colorpicker-input-addon i').css('background-color', event.color.toString());
          });

        $('#frm_dispositions').on('submit', function(e) {
            e.preventDefault();
            var checkColor = _Disposition.checkIfHex($('#color_hex').val());

            if (checkColor) {
                $('#loading_modal').modal('show');
                
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
                        switch (response.status) {
                            case "failed":
                                _Disposition.showWarning(response.msg);
                                break;
                            case "error":
                                _Disposition.ErrorMsg(response.msg);
                                break;
                            default:
                                _Disposition.clearForm(response.inputs);
                                _Disposition.$tbl_dispositions.ajax.reload();
                                _Disposition.showSuccess(response.msg);
                                break;
                        }
                        _Disposition.id = 0;
                    }
                }).fail(function(xhr, textStatus, errorThrown) {
                    var errors = xhr.responseJSON.errors;
                    _Disposition.showInputErrors(errors);

                    if (errorThrown == "Internal Server Error") {
                        _Disposition.ErrorMsg(xhr);
                    }
                }).always(function() {
                    $('#loading_modal').modal('hide');
                });
            } else {
                _Disposition.showWarning("Please use hexed format color code.");
            }
        });

        $('#tbl_dispositions').on('click', '.btn_edit_disposition', function() {
            var inputs = $('.clear').map(function() {
                return this.name;
            });
            _Disposition.clearForm(inputs);

            var data = $('#tbl_dispositions').DataTable().row($(this).parents('tr')).data();

            $('#id').val(data.id);
            $('#disposition').val(data.disposition);
            $('#color_hex').val(data.color_hex).trigger('change');
        });

        // $('#btn_delete_dispositions').on('click', function() {
        //     var chkArray = [];
        //     var table = _Disposition.$tbl_dispositions;

        //     for (var x = 0; x < table.context[0].aoData.length; x++) {
        //         var DataRow = table.context[0].aoData[x];
        //         if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
        //             chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
        //         }
        //     }

        //     if (chkArray.length > 0) {
        //         _Disposition.msg = "Are you sure you want to delete this disposition/s?";
        //         _Disposition.confirmAction().then(function(approve) {
        //             if (approve)
        //                 _Disposition.delete_dispositions(chkArray);

        //             $('.check_all_dispositions').prop('checked', false);
        //         });
        //     } else {
        //         _Disposition.showWarning('Please select at least 1 disposition.');
        //     }
        // });
    });
})();




window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };