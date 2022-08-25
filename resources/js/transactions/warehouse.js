"use strict";

(function() {
    const Warehouse = function() {
        return new Warehouse.init();
    }
    Warehouse.init = function() {
        $D.init.call(this);
        $F.init.call(this);
        this.$tbl_hs_models = "";
        this.$tbl_pallets = "";
        this.$tbl_shipments = "";
    }
    Warehouse.prototype = {
        permission: function() {
            var self = this;
            $('.read-only').each(function(i,x) {
                $state = (self.read_only == 1)? true : false;
                $(x).prop('disabled',$state);
            });
        },
        RunDateTime: function() {
            const zeroFill = n => {
				return ('0' + n).slice(-2);
			}

			const interval = setInterval(() => {
				const now = new Date();
				const dateTime =  now.getFullYear() + '/' + zeroFill((now.getMonth() + 1)) + '/' + zeroFill(now.getUTCDate()) + ' ' + zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds());

				$('#present_date_time').val(dateTime);
			}, 1000);
        },
        drawModelsDatatables: function() {
            var self = this;
            var pageScrollPos = "";
            if (!$.fn.DataTable.isDataTable('#tbl_hs_models')) {
                self.$tbl_hs_models = $('#tbl_hs_models').DataTable({
                    scrollY: "43vh",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    columnDefs: [ {
                        orderable: false,
                        searchable: false,
                        className: 'select-checkbox',
                        targets:   0
                    } ],
                    select: {
                        style: 'single',
                        selector: 'td:not(:last-child)'
                    },
                    ajax: {
                        url: "/transactions/warehouse/get-models-for-ship",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                        },
                        error: function(response) {
                            console.log(response);
                        }
                    },
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No Box ID was scanned.",
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
                    deferRender: true,
                    columns: [
                        { 
                            data: 'model_id', render: function() {
                                return '';
                            }, name: 'model_id', searchable: false, orderable: false, width: '15px'
                        },
                        { 
                            data: 'model', name: 'model', searchable: false, orderable: false,
                        }
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);

                        var box_qr_judgement = parseInt(data.box_qr_judgement);
                        switch (box_qr_judgement) {
                            case 1:
                                $(dataRow[0].cells[2]).css('background-color', '#00acac');
                                $(dataRow[0].cells[2]).css('color', '#FFFFFF');
                                break;
                            case 0:
                                $(dataRow[0].cells[2]).css('background-color', '#ff5b57');
                                $(dataRow[0].cells[2]).css('color', '#FFFFFF');
                                break;
                            default:
                                $(dataRow[0].cells[2]).css('background-color', '#FFFFFF');
                                $(dataRow[0].cells[2]).css('color', '#333333');
                                break;
                        }

                        $(dataRow[0].cells[3]).addClass('py-0');
                        
                        var box_judgement = parseInt(data.box_judgement);
                        switch (box_judgement) {
                            case 1:
                                $(dataRow[0].cells[3]).css('background-color', '#00acac');
                                $(dataRow[0].cells[3]).css('color', '#FFFFFF');
                                break;
                            case 0:
                                $(dataRow[0].cells[3]).css('background-color', '#ff5b57');
                                $(dataRow[0].cells[3]).css('color', '#FFFFFF');
                                break;
                            default:
                                $(dataRow[0].cells[3]).css('background-color', '#ced4da');
                                $(dataRow[0].cells[3]).css('color', '#333333');
                                break;
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
                        $('.dataTables_scrollBody').css('height','43vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('height','43vh');

                        $('.dataTables_scrollBody').css('min-height','10vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('min-height','10vh');
                    },
                    preDrawCallback: function (settings) {
                        pageScrollPos = $('div.dataTables_scrollBody').scrollTop();
                    },
                    fnDrawCallback: function() {
                        $('div.dataTables_scrollBody').scrollTop(pageScrollPos);
                        var data = this.fnGetData();
                        var data_count = data.length;
                        $('#box_count').html(data_count);

                        var inspected = 0;
                        $.each(data, function(i, x) {
                            if (x.box_qr_judgement > -1) {
                                inspected = inspected+1;
                            }
                        });

                        var box_judge = 0;
                        $.each(data, function(i, x) {
                            if (x.box_judgement > -1) {
                                box_judge = box_judge+1;
                            }
                        });

                        $('#box_tested').html(box_judge);

                        $('[data-toggle="tooltip"]').tooltip();

                        // if (inspected == data_count) {
                        //     $('.remarks_td').css('background-color', '#ffffff');
                        //     $('.remarks_td').css('color', '#333333');
                        // }
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
    }
    Warehouse.init.prototype = $.extend(Warehouse.prototype, $D.init.prototype, $F.init.prototype);
    Warehouse.init.prototype = Warehouse.prototype;

    $(document).ready(function() {
        var _Warehouse = Warehouse();
        _Warehouse.permission();
        _Warehouse.RunDateTime();
        _Warehouse.drawModelsDatatables();

        $('#destination').select2({
            allowClear: true,
            placeholder: 'Select Customer Destination',
            theme: 'bootstrap4',
            width: 'auto',
            ajax: {
                url: '/transactions/warehouse/get-customer-destinations',
                data: function(params) {
                    var query = "";
                    return {
                        q: params.term,
                        id: '',
                        text: '',
                        table: '',
                        condition: '',
                        display: 'id&text',
                        orderBy: '',
                        sql_query: query,
                    };
                },
                processResults: function(data) {
                    return {
                        results: data
                    };
                },
            }
        }).val(null).trigger('change.select2');
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };
