"use strict";

(function() {
    const Customers = function() {
        return new Customers.init();
    }
    Customers.init = function() {
        $D.init.call(this);
        this.$tbl_customers = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.cust_checked = 0;
    }
    Customers.prototype = {
        init: function() {},
        // drawDatatables: function() {
        //     var self = this;
        //     if (!$.fn.DataTable.isDataTable('#tbl_customers')) {
        //         self.$tbl_customers = $('#tbl_customers').DataTable({
        //             processing: true,
        //             ajax: {
        //                 url: "/masters/customer/list",
        //                 dataType: "JSON",
        //                 error: function(response) {
        //                     console.log(response);
        //                 }
        //             },
        //             deferRender: true,
        //             language: {
        //                 aria: {
        //                     sortAscending: ": activate to sort column ascending",
        //                     sortDescending: ": activate to sort column descending"
        //                 },
        //                 emptyTable: "No data available in table",
        //                 info: "Showing _START_ to _END_ of _TOTAL_ records",
        //                 infoEmpty: "No records found",
        //                 infoFiltered: "(filtered1 from _MAX_ total records)",
        //                 lengthMenu: "Show _MENU_",
        //                 search: "Search:",
        //                 zeroRecords: "No matching records found",
        //                 paginate: {
        //                     "previous": "Prev",
        //                     "next": "Next",
        //                     "last": "Last",
        //                     "first": "First"
        //                 }
        //             },
        //             pageLength: 10,
        //             order: [
        //                 [13, "desc"]
        //             ],
        //             columns: [{
        //                     data: function(x) {
        //                         return '<input type="checkbox" class="table-checkbox check_customer" value="' + x.id + '">';
        //                     },
        //                     name: 'id',
        //                     searchable: false,
        //                     orderable: false
        //                 },
        //                 {
        //                     data: 'action',
        //                     name: 'action',
        //                     orderable: false,
        //                     searchable: false
        //                 },
        //                 { data: 'customer_name', name: 'customer_name' },
        //                 { data: 'address', name: 'address' },
        //                 { data: 'customer_person1', name: 'customer_person1' },
        //                 { data: 'customer_number1', name: 'customer_number1' },
        //                 { data: 'extension1', name: 'extension1' },
        //                 { data: 'email1', name: 'email1' },
        //                 { data: 'customer_person2', name: 'customer_person2' },
        //                 { data: 'customer_number2', name: 'customer_number2' },
        //                 { data: 'extension2', name: 'extension2' },
        //                 { data: 'email2', name: 'email2' },
        //                 { data: 'create_user', name: 'create_user' },
        //                 { data: 'updated_at', name: 'updated_at' },
        //             ],
        //             rowCallback: function(row, data) {
        //                 var td = $(row).find('td:first .check_customer');
        //                 if (td.is(':checked')) {
        //                     self.cust_checked++;
        //                 }
        //             },
        //             createdRow: function(row, data, dataIndex) {
        //                 if (data.is_deleted === 1) {
        //                     $(row).css('background-color', '#ff6266');
        //                     $(row).css('color', '#fff');
        //                 }
        //             },
        //             initComplete: function() {
        //                 $('.check_all_customers').prop('checked', false);
        //             },
        //             fnDrawCallback: function() {
        //                 if (self.cust_checked > 9) {
        //                     $('.check_all_customers').prop('checked', true);
        //                 } else {
        //                     $('.check_all_customers').prop('checked', false);
        //                 }
        //                 self.checkCheckboxesInTable('#tbl_customers', '.check_all_customers', '.check_customer');
        //                 self.checkAllCheckboxesInTable('#tbl_customers', '.check_all_customers', '.check_customer');
        //                 $("#tbl_customers").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
        //             },
        //         }).on('page.dt', function() {
        //             self.cust_checked = 0;
        //         });
        //     }
        //     return this;
        // },
        // delete_page: function(IDs) {
        //     var self = this;
        //     self.formAction = '/masters/page/delete-page';
        //     self.jsonData = { _token: self.token, ids: IDs };
        //     self.sendData().then(function() {
        //         self.$tbl_customers.ajax.reload(null, false);
        //     });
        //     return this;
        // },
        // clearForm: function(inputs) {
        //     var self = this;
        //     $.each(inputs, function(i,x) {
        //         $('#'+x).val('');
        //         self.hideInputErrors(x);
        //     });
        // }
    }
    Customers.init.prototype = $.extend(Customers.prototype, $D.init.prototype);
    Customers.init.prototype = Customers.prototype;

    $(document).ready(function() {
        var _Customers = Customers();
        _Customers.drawDatatables();

        $('#btn_add_customers').on('click', function() {
            $('.clear').val('');
            $('#modal_form_title').html('Add Customer');
            $('#modal_customers').modal('show');
        });

        $('#frm_customers').on('submit', function(e) {
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
                        _Pages.showWarning(response.msg);
                    } else {
                        _Pages.clearForm();
                        _Pages.$tbl_customers.ajax.reload();
                        _Pages.showSuccess("Page data was successfully saved.");
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

        $('#tbl_customers').on('click', '.btn_edit_customer', function() {
            var data = $('#tbl_customers').DataTable().row($(this).parents('tr')).data();

            $('#id').val(data.id);
            $('#page_name').val(data.page_name);
            $('#page_label').val(data.page_label);
            $('#url').val(data.url);
            $('#parent_menu').val(data.parent_menu);
            $('#parent_name').val(data.parent_name);
            $('#parent_order').val(data.parent_order);
            $('#order').val(data.order);
            $('#icon').val(data.icon);

            if (data.has_sub == "YES") {
                $('#has_sub').prop('checked', true);
            } else {
                $('#has_sub').prop('checked', false);
            }

            $('#modal_form_title').html('Edit Page');
            $('#modal_pages').modal('show');
        });

        $('#btn_delete_customers').on('click', function() {
            var chkArray = [];
            var table = _Pages.$tbl_customers;

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

                    $('.check_all_customers').prop('checked', false);
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