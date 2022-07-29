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
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
        this.model_checked = 0;
    }
    Model.prototype = {
        permission: function() {
            var self = this;
            $('.read-only').each(function(i,x) {
                $state = (self.read_only)? true : false;
                $(x).prop('disabled',$state);
            });
        },
        drawDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_models')) {
                self.$tbl_models = $('#tbl_models').DataTable({
                    processing: true,
                    ajax: {
                        url: "/masters/model-matrix/list",
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
                                return '<input type="checkbox" class="table-checkbox check_model" value="' + x.id + '">';
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
                        { data: 'model', name: 'model' },
                        { data: 'model_name', name: 'model_name' },
                        { data: 'hs_count_per_box', name: 'hs_count_per_box' },
                        { data: 'box_count_per_pallet', name: 'box_count_per_pallet' },
                        { data: 'box_count_to_inspect', name: 'box_count_to_inspect' },
                        { data: 'create_user', name: 'create_user' },
                        { data: 'updated_at', name: 'updated_at' },
                    ],
                    rowCallback: function(row, data) {
                        var td = $(row).find('td:first .check_model');
                        if (td.is(':checked')) {
                            self.model_checked++;
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        if (data.is_deleted === 1) {
                            $(row).css('background-color', '#ff6266');
                            $(row).css('color', '#fff');
                        }
                    },
                    initComplete: function() {
                        $('.check_all_models').prop('checked', false);
                    },
                    fnDrawCallback: function() {
                        if (self.model_checked > 9) {
                            $('.check_all_models').prop('checked', true);
                        } else {
                            $('.check_all_models').prop('checked', false);
                        }
                        self.checkCheckboxesInTable('#tbl_models', '.check_all_models', '.check_model');
                        self.checkAllCheckboxesInTable('#tbl_models', '.check_all_models', '.check_model');
                        $("#tbl_models").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                    self.model_checked = 0;
                });
            }
            return this;
        },
        delete_models: function(IDs) {
            var self = this;
            self.formAction = '/masters/model-matrix/delete-model';
            self.jsonData = { _token: self.token, ids: IDs };
            self.sendData().then(function() {
                self.$tbl_models.ajax.reload(null, false);
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
    Model.init.prototype = $.extend(Model.prototype, $D.init.prototype);
    Model.init.prototype = Model.prototype;

    $(document).ready(function() {
        var _Model = Model();
        _Model.permission();
        _Model.drawDatatables();

        $('#frm_models').on('submit', function(e) {
            e.preventDefault();
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
                            _Model.showWarning(response.msg);
                            break;
                        case "error":
                            _Model.ErrorMsg(response.msg);
                            break;
                        default:
                            _Model.clearForm(response.inputs);
                            _Model.$tbl_models.ajax.reload();
                            _Model.showSuccess(response.msg);
                            break;
                    }
                    _Model.id = 0;
                }
            }).fail(function(xhr, textStatus, errorThrown) {
                var errors = xhr.responseJSON.errors;
                _Model.showInputErrors(errors);

                if (errorThrown == "Internal Server Error") {
                    _Model.ErrorMsg(xhr);
                }
            }).always(function() {
                $('#loading_modal').modal('hide');
            });
        });

        $('#tbl_models tbody').on('click', '.btn_edit_model', function() {
            var inputs = $('.clear').map(function() {
                return this.name;
            });
            _Model.clearForm(inputs);

            var data =  _Model.$tbl_models.row($(this).parents('tr')).data();

            $('#id').val(data.id);
            $('#model').val(data.model);
            $('#model_name').val(data.model_name);
            $('#box_count_per_pallet').val(data.box_count_per_pallet);
            $('#box_count_to_inspect').val(data.box_count_to_inspect);
            $('#hs_count_per_box').val(data.hs_count_per_box);
        });

        $('#btn_delete_models').on('click', function() {
            var chkArray = [];
            var table = _Model.$tbl_models;

            for (var x = 0; x < table.context[0].aoData.length; x++) {
                var DataRow = table.context[0].aoData[x];
                if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                    chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                }
            }

            if (chkArray.length > 0) {
                _Model.msg = "Are you sure you want to delete this model/s?";
                _Model.confirmAction().then(function(approve) {
                    if (approve)
                    _Model.delete_models(chkArray);

                    $('.check_all_models').prop('checked', false);
                });
            } else {
                _Model.showWarning('Please select at least 1 model.');
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