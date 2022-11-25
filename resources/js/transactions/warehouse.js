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

        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
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
                        emptyTable: "No Pallets were transferred to warehouse yet.",
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
                        $('#model_count').html(data_count);
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawPalletsDatatables: function() {
            var self = this;
            var pageScrollPos = "";
            if (!$.fn.DataTable.isDataTable('#tbl_pallets')) {
                self.$tbl_pallets = $('#tbl_pallets').DataTable({
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
                    },
                    ajax: {
                        url: "/transactions/warehouse/get-pallets",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.model_id = $('#model_id').val();
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
                        emptyTable: "Please select model to display the pallets",
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
                            data: 'id', render: function() {
                                return '';
                            }, name: 'id', searchable: false, orderable: false, width: '15px'
                        },
                        { 
                            data: 'pallet_qr', name: 'pallet_qr', searchable: false, orderable: false,
                        },
                        {
                            data: 'pallet_status', name: 'pallet_status', searchable: false, orderable: false, className: 'text-center'
                        },
                        { 
                            data: 'pallet_location', name: 'pallet_location', searchable: false, orderable: false, className: 'text-center align-middle'
                        }
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);
                        dataRow.attr('id','r'+data.id);
                        switch (data.pallet_dispo_status) {
                            case 1:
                                $(dataRow[0].cells[2]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            case 2:
                                $(dataRow[0].cells[2]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            case 3:
                                $(dataRow[0].cells[2]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            case 4:
                                $(dataRow[0].cells[2]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            case 5:
                                $(dataRow[0].cells[2]).css('background-color', data.color_hex);
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                            default:
                                $(dataRow[0].cells[2]).css('background-color', '#FFDCAE');
                                $(dataRow[0].cells[2]).css('color', '#000000');
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
                        $('#available_pallet').val(data_count);
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        getBoxes: function(param, handle) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/transactions/warehouse/get-boxes";
            self.sendData().then(function() {
                var response = self.responseData;
                if (!response.hasOwnProperty('msg')) {
                    console.log(response);
                    handle(response);
                }
                
            });
        },
    }
    Warehouse.init.prototype = $.extend(Warehouse.prototype, $D.init.prototype, $F.init.prototype);
    Warehouse.init.prototype = Warehouse.prototype;

    $(document).ready(function() {
        var _Warehouse = Warehouse();
        _Warehouse.permission();
        _Warehouse.RunDateTime();
        _Warehouse.drawModelsDatatables();
        _Warehouse.drawPalletsDatatables();

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

        _Warehouse.$tbl_hs_models.on('select', function ( e, dt, type, indexes ) {
            var data = _Warehouse.$tbl_hs_models.row( indexes ).data();
            $('#model_id').val(data.model_id);
            $('#model').val(data.model);
            _Warehouse.$tbl_pallets.ajax.reload();
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#model_id').val('');
            $('#model').val('');
            _Warehouse.$tbl_pallets.ajax.reload();
        });

        _Warehouse.$tbl_pallets.on('select', function ( e, dt, type, indexes ) {
            var data = _Warehouse.$tbl_pallets.row( indexes ).data();
            
            $('#pallet_id').val(data.id);
            //$('#pallet_row_index').val(indexes[0]);
            var row = "";

            _Warehouse.getBoxes({
                _token: _Warehouse.token,
                pallet_id: data.id
            }, function(response) {
                row += '<tr id="r'+data.id+'_child_tr">'+
                            '<td></td>'+
                            '<td colspan="3" id="r'+data.id+'_child_td"></td>'+
                        '</tr>';

                $("#r"+data.id).after(row);
                var table = '<table class="table table-sm" style="width:100%;">';
                $.each(response, function(i,x) {
                    var box_judgement = parseInt(data.box_judgement);
                    var bgcolor = "";
                    var ftcolor = "";
                    var judgment = "";
                    switch (box_judgement) {
                        case 1:
                            bgcolor = "#00acac";
                            ftcolor = "#FFFFFF";
                            judgment = "GOOD";
                            break;
                        case 0:
                            bgcolor = "#ff5b57";
                            ftcolor = "#FFFFFF";
                            judgment = "NOT GOOD";
                            break;
                        default:
                            bgcolor = "#ced4da";
                            ftcolor = "#333333";
                            judgment = "NOT YET INSPECTED";
                            break;
                    }
                    table += '<tr><td>'+x.box_qr+'</td><td style="background-color: '+bgcolor+'; color: '+ftcolor+'">'+judgment+'</td></tr>';
                });
                table += '</table>';
                
                $('#r'+data.id+'_child_td').html(table);
            });

        })
        .on('deselect', function ( e, dt, type, indexes ) {
            var data = _Warehouse.$tbl_pallets.row( indexes ).data();

            $('#r'+data.id+'_child_tr').remove();

            
        });
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };
