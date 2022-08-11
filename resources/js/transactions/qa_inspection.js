"use strict";

(function() {
    const QAInspection = function() {
        return new QAInspection.init();
    }
	QAInspection.init = function() {
		$D.init.call(this);
        $F.init.call(this);
        $R.init.call(this);

        this.$tbl_boxes = "";
        this.$tbl_affected_serials = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
	}
	QAInspection.prototype = {
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

				$('#date_and_time').val(dateTime);
			}, 1000);
		},
        drawBoxesDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_boxes')) {
                self.$tbl_boxes = $('#tbl_boxes').DataTable({
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
                        url: "/transactions/qa-inspection/get-boxes",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.pallet_id = $('#pallet_id').val()
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
                            data: 'id', render: function() {
                                return '';
                            }, name: 'id', searchable: false, orderable: false, width: '15px'
                        },
                        { 
                            data: function(data) {
                                return '<h5 class="font-weight-normal m-0">'+data.box_qr+'</h5>';
                            }, name: 'box_qr', searchable: false, orderable: false, width: '250px'
                        },
                        { 
                            data: function(data) {

                                switch (data.box_qr_judgement) {
                                    case 0:
                                        return 'NOT MATCHED';
                                    case 1:
                                        return 'MATCHED';
                                    default:
                                        return '';
                                }
                                
                            }, name: 'inspection', searchable: false, orderable: false, width: '150px', className: 'text-center align-middle' 
                        },
                        { 
                            data: function() {
                                return '<p class="bg-red"></p>';
                            }, name: 'remarks', searchable: false, orderable: false, className: 'text-center align-middle'   
                        }
                    ],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {     
                        var dataRow = $(row);
                        var checkbox = $(dataRow[0].cells[0].firstChild);

                        switch (data.box_qr_judgement) {
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
                                $(dataRow[0].cells[2]).css('color', '#000000');
                                break;
                        }
                        
                        if (data.remarks == null) {
                            $(dataRow[0].cells[3]).css('background-color', '#ced4da');
                            $(dataRow[0].cells[3]).css('color', '#000000');
                        } else {

                        }
                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
                        $('.dataTables_scrollBody').css('height','43vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('height','43vh');

                        $('.dataTables_scrollBody').css('min-height','10vh');
                        $('.dataTables_scroll > .slimScrollDiv').css('min-height','10vh');
                    },
                    fnDrawCallback: function() {
                        // $("#tbl_boxes").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                        var data = this.fnGetData();
                        var data_count = data.length;
                        $('#box_count').html(data_count);
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawAffectedSerialsDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_affected_serials')) {
                self.$tbl_affected_serials = $('#tbl_affected_serials').DataTable({
                    scrollY: "43vh",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    ajax: {
                        url: "/transactions/qa-inspection/get-affected-serial-no",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.box_id = $('#box_id').val();
                            d.pallet_id = $('#pallet_id').val()
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
                        emptyTable: "No HS Serial No. was scanned.",
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
                            data: 'hs_serial', name: 'hs_serial', searchable: false, orderable: false 
                        },
                    ],
                    rowCallback: function(row, data) {
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
                    fnDrawCallback: function() {
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        statusMsg: function(msg,status) {
            switch (status) {
                case 'success':
                    $('#status_msg').html(msg);
                    $('#status_msg').removeClass('text-danger')
                    $('#status_msg').addClass('text-success')
                    break;
                case 'failed':
                    $('#status_msg').html(msg);
                    $('#status_msg').removeClass('text-success')
                    $('#status_msg').addClass('text-danger')
                    break;
                default:
                    $('#status_msg').html(msg);
                    $('#status_msg').removeClass('text-danger')
                    $('#status_msg').removeClass('text-success')
                    break;
            }
        },
		scanInspectionSheet: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/check-hs-serial";
            self.sendData().then(function() {
                var response = self.responseData;

                console.log(response.box_data);
                self.$tbl_boxes.row(param.row_index).data(response.box_data).draw();
                //self.$tbl_boxes.ajax.reload();
                 
                if (response.matched == 1)  {
                    $('.check_box').prop('checked', false);
                    $('#inspqection_sheet_qr').val('');
                    $('#inspqection_sheet_qr').prop('readonly', true);
                    $('#scan_serial').prop('readonly', true);
                    $('#match').css('display', 'block');
                } else {
                    $('.check_box').prop('checked', false);
                    $('#inspqection_sheet_qr').val('');
                    $('#inspqection_sheet_qr').prop('readonly', true);
                    $('#scan_serial').prop('readonly', false);
                    $('#not-match').css('display', 'block');
                }
            });
        },
        getLotNo: function(param, handle) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/get-lot-no";
            self.sendData().then(function() {
                var response = self.responseData;
                handle(response);
            });
        }
	}
	QAInspection.init.prototype = $.extend(QAInspection.prototype, $D.init.prototype, $F.init.prototype, $R.init.prototype);
   
	$(document).ready(function() {
		var _QAInspection = QAInspection();
        _QAInspection.permission();
        _QAInspection.RunDateTime();
        _QAInspection.drawBoxesDatatables();
        _QAInspection.drawAffectedSerialsDatatables();

        $('#btn_transfer').prop('disabled', true);
        $('#btn_disposition').prop('disabled', true);

        $('#btn_good').prop('disabled', true);
        $('#btn_notgood').prop('disabled', true);
        
        $('#tbl_obas').DataTable().on('select', function ( e, dt, type, indexes ) {
            var rowData = $('#tbl_obas').DataTable().rows( indexes ).data().toArray();
            var data = rowData[0];
            
            $('#pallet_id').val(data.id);
            $('#box_tested_full').html(data.new_box_count);
            $('#box_count_to_inspect').val(data.box_count_to_inspect);

            var row = "";

            _QAInspection.getLotNo({
                _token: _QAInspection.token,
                pallet_id: data.id
            }, function(response) {
                row += '<tr id="r'+data.id+'_child_tr">'+
                            '<td></td>'+
                            '<td colspan="3" id="r'+data.id+'_child_td"></td>'+
                        '</tr>';

                $("#r"+data.id).after(row);
                var table = '<table class="table table-sm" style="width:100%;">';
                $.each(response, function(i,x) {
                    table += '<tr><td>'+x.lot_no+'</td></tr>';
                });
                table += '</table>';
                
                $('#r'+data.id+'_child_td').html(table);
            });

            $('#box_id').val('');
            $('#box_qr').val('');
            $('#box_count').html(0);

            $('#btn_transfer').prop('disabled', false);
            $('#btn_disposition').prop('disabled', false);
            $('#inspqection_sheet_qr').prop('readonly', true);
            
            _QAInspection.statusMsg('','clear');
            _QAInspection.$tbl_boxes.ajax.reload();

        })
        .on('deselect', function ( e, dt, type, indexes ) {
            var rowData = $('#tbl_obas').DataTable().rows( indexes ).data().toArray();
            var data = rowData[0];

            $('#r'+data.id+'_child_tr').remove();

            $('#pallet_id').val('');
            $('#box_tested_full').html(0);
            $('#box_count_to_inspect').val('');
            $('#inspqection_sheet_qr').val('');
            $('#inspqection_sheet_qr').prop('readonly', true);

            $('#box_id').val('');
            $('#box_qr').val('');
            $('#box_count').html(0);
            _QAInspection.$tbl_boxes.ajax.reload();
            $('#box_tested').html(0);

            $('#btn_transfer').prop('disabled', true);
            $('#btn_disposition').prop('disabled', true);
        });

        // $('#tbl_obas tbody').on('change', '.check_box', function() {
        //     var checked = $(this).is(':checked');
        //     $('.check_box').not(this).prop('checked', false);
        //     $('#btn_transfer').prop('disabled', true);
        //     $('#btn_disposition').prop('disabled', true);
        //     if (checked) {
        //         $('#btn_transfer').prop('disabled', false);
        //         $('#btn_disposition').prop('disabled', false);
        //         $('#inspqection_sheet_qr').prop('readonly', true);
        //     } else {
        //         $('#btn_transfer').prop('disabled', true);
        //         $('#btn_disposition').prop('disabled', true);
        //     }
        // });

        _QAInspection.$tbl_boxes.on('select', function ( e, dt, type, indexes ) {
            var rowData = _QAInspection.$tbl_boxes.rows( indexes ).data().toArray();
            var data = rowData[0];

            $('#box_id').val('');
            $('#box_qr').val(data.box_qr);
            $('#box_id').val(data.id);

            $('#inspqection_sheet_qr').prop('readonly', false);
            $('#btn_transfer').prop('disabled', true);
            $('#btn_disposition').prop('disabled', true);

            if (data.box_qr_judgement < 0) {
                $('#inspqection_sheet_qr').focus();
            } else {
                $('#scan_serial').focus();
            }

            $('#btn_good').prop('disabled', false);
            $('#btn_notgood').prop('disabled', false);
            $('#scan_serial').prop('readonly', false);

            _QAInspection.statusMsg('','clear');
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#inspqection_sheet_qr').val('');
            $('#box_qr').val('');
            $('#box_id').val('');

            $('#box_count').html(0);

            $('#inspqection_sheet_qr').prop('readonly', true);
            $('#inspqection_sheet_qr').focus();
            $('#btn_transfer').prop('disabled', false);
            $('#btn_disposition').prop('disabled', false);

            $('#btn_good').prop('disabled', true);
            $('#btn_notgood').prop('disabled', true);
            $('#scan_serial').prop('readonly', true);
        });
        
        // $('#tbl_boxes tbody').on('change', '.check_box', function() {
        //     var checked = $(this).is(':checked');
        //     $('.check_box').not(this).prop('checked', false);

        //     if (checked) {
        //         $('#inspqection_sheet_qr').prop('readonly', false);
        //         $('#inspqection_sheet_qr').focus();
        //         $('#btn_transfer').prop('disabled', true);
        //         $('#btn_disposition').prop('disabled', true);
        //     } else {
        //         $('#inspqection_sheet_qr').prop('readonly', true);
        //     }
        // });

        $('#btn_good').on('click', function() {
            $('.check_box').prop('checked', false);
            $('#inspqection_sheet_qr').val('');
            $('#inspqection_sheet_qr').prop('readonly', true);
            $('#scan_serial').prop('readonly', true);
            $('#btn_good').prop('disabled', true);
            $('#btn_notgood').prop('disabled', true);
        });

        $('#btn_transfer').on('click', function() {
            var chkArray = [];
            var table = $('#tbl_obas').DataTable();
            var cnt = 0;

            for (var x = 0; x < table.context[0].aoData.length; x++) {
                var DataRow = table.context[0].aoData[x];
                if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                    var status = $(DataRow.anCells[2]).html();
                    if (status == "Good") {
                        chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                    }
                    cnt++;
                }
            }            

            if (chkArray.length > 0) {
                var msg = "Do you want to transfer this Pallet to Warehouse?";

                if (cnt > 1) {
                    msg = "Do you want to transfer these Pallets to Warehouse?";
                }
                _QAInspection.msg = msg;
                _QAInspection.confirmAction(msg).then(function(approve) {
                    if (approve)
                    _QAInspection.transferTo({
                            _token: _QAInspection.token,
                            ids: chkArray
                        });
                });
            } else {
                _QAInspection.showWarning("Please select at least 1 Pallet with a 'Good' status.");
            }
        });

        $('#inspqection_sheet_qr').on('keypress', function(e) {
            var inspection_qr = $(this).val();

            if (e.keyCode == 13) {
                var rowData = _QAInspection.$tbl_boxes.rows({selected:  true}).data().toArray();
                var data = rowData[0];
                var row_index = _QAInspection.$tbl_boxes.rows({selected:  true}).indexes();

                _QAInspection.scanInspectionSheet({
                    _token: _QAInspection.token,
                    hs_qrs: inspection_qr,
                    box_id: data.id,
                    box_qr: data.box_qr,
                    pallet_id: $('#pallet_id').val(),
                    inspector: $('#inspector').val(),
                    row_index: row_index[0]
                });
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