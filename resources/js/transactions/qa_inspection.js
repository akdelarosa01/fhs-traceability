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
            var pageScrollPos = "";
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
                        selector: 'td:not(:last-child)'
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
                            data: 'box_qr', name: 'box_qr', searchable: false, orderable: false, width: '200px'
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
                            data: function(data) {
                                var box_judgement = parseInt(data.box_judgement);
                                var remarks = (data.remarks == null)? "" : data.remarks;
                                switch (box_judgement) {
                                    case 0:
                                        return '<button type="button" class="btn btn-sm btn-block btn-flat btn-danger box_ng" data-toggle="tooltip" data-placement="top" title="'+remarks+'">NG</button>';
                                    case 1:
                                        return '<button type="button" class="btn btn-sm btn-block btn-flat btn-success" title="'+remarks+'">GOOD</button>';
                                    default:
                                        return '';
                                }
                                
                            }, name: 'box_judgement', searchable: false, orderable: false, className: 'text-center align-middle'   
                        },
                        { 
                            data: 'prod_remarks', name: 'prod_remarks', searchable: false, orderable: false
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

                self.$tbl_boxes.row(param.row_index).data(response.box_data).draw();
                 
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

                var next_row = param.row_index+1;
                self.$tbl_boxes.row(next_row).select();

                var box_count = self.$tbl_boxes.rows().count();
                var all_data = self.$tbl_boxes.rows().data();
                var inspection_sheet_count = 0;

                $.each(all_data, function(i,x) {
                    if (x.box_qr_judgement > -1) {
                        inspection_sheet_count++;
                    }
                });

                console.log(inspection_sheet_count);
                console.log(box_count);

                if (inspection_sheet_count == box_count) {
                    $('#btn_good').prop('disabled', false);
                    $('#btn_notgood').prop('disabled', false);
                    $('#scan_serial').prop('readonly', false);
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
        },
        boxJudgment: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/box-judgment";
            self.sendData().then(function() {
                var response = self.responseData;
                console.log(response);

                self.$tbl_boxes.row(param.row_index).data(response).draw();
            });
        },
        setBoxNGRemarks: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/set-box-ng-remarks";
            self.sendData().then(function() {
                var response = self.responseData;

                self.$tbl_boxes.row(param.box_row_index).data(response).draw();
                $('#modal_box_ng_reason').modal('hide');
            });
        },
        scanHSSerial: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/scan-hs-serial";
            self.sendData().then(function() {
                var response = self.responseData;
                $('#scan_serial').val('');
                self.$tbl_affected_serials.row.add(response).order([0,'desc']).draw();
            });
        },
        palletDisposition: function (param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/set-disposition";
            self.sendData().then(function() {
                var response = self.responseData;
                $('#tbl_obas').DataTable().row(param.row_index).data(response).draw();
                $('#modal_disposition').modal('hide');
            });
        },
        TransferTo: function (param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/transfer-to";
            self.sendData().then(function() {
                $('#tbl_obas').DataTable().row(param.row_index).remove().draw();
                $('#modal_transfer_to').modal('hide');
            });
        },
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

        $('#box_ng_reason').select2({
            allowClear: true,
            placeholder: 'Select Box NG Reason',
            theme: 'bootstrap4',
            width: 'auto',
            ajax: {
                url: "/transactions/qa-inspection/get-box-ng-remarks",
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

        $('#pallet_disposition').select2({
            allowClear: true,
            placeholder: 'Select Pallet Disposition',
            theme: 'bootstrap4',
            width: 'auto',
            ajax: {
                url: "/transactions/qa-inspection/get-dispositions",
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

        $('#disposition_reason').select2({
            allowClear: true,
            placeholder: 'Select Reason',
            theme: 'bootstrap4',
            width: 'auto',
            ajax: {
                url: "/transactions/qa-inspection/get-disposition-reasons",
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
                        disposition_id: $('#pallet_disposition').val()
                    };
                },
                processResults: function(data) {
                    return {
                        results: data
                    };
                },
            }
        }).val(null).trigger('change.select2');
        
        $('#tbl_obas').DataTable().on('select', function ( e, dt, type, indexes ) {
            var rowData = $('#tbl_obas').DataTable().rows( indexes ).data().toArray();
            var data = rowData[0];
            
            $('#pallet_id').val(data.id);
            $('#box_tested_full').html(data.box_count_to_inspect);
            $('#box_count_to_inspect').val(data.box_count_to_inspect);
            $('#inspection_sheet_count').val(data.inspection_sheet_count);

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
            _QAInspection.$tbl_affected_serials.ajax.reload();

        })
        .on('deselect', function ( e, dt, type, indexes ) {
            var rowData = $('#tbl_obas').DataTable().rows( indexes ).data().toArray();
            var data = rowData[0];

            $('#r'+data.id+'_child_tr').remove();

            $('#pallet_id').val('');
            $('#box_tested_full').html(0);
            $('#box_count_to_inspect').val('');
            $('#inspqection_sheet_qr').val('');
            $('#inspection_sheet_count').val(0);
            $('#inspqection_sheet_qr').prop('readonly', true);

            $('#box_id').val('');
            $('#box_qr').val('');
            $('#box_count').html(0);
            _QAInspection.$tbl_boxes.ajax.reload();
            _QAInspection.$tbl_affected_serials.ajax.reload();
            $('#box_tested').html(0);

            $('#btn_transfer').prop('disabled', true);
            $('#btn_disposition').prop('disabled', true);
        });

        _QAInspection.$tbl_boxes.on('select', function ( e, dt, type, indexes ) {
            var rowData = _QAInspection.$tbl_boxes.rows( indexes ).data().toArray();
            var data = rowData[0];
            var box_count = _QAInspection.$tbl_boxes.data().count();
            var all_data = _QAInspection.$tbl_boxes.rows().data();

            $('#box_id').val('');
            $('#box_qr').val(data.box_qr);
            $('#box_id').val(data.id);
            $('#box_count').html(box_count);
            $('#hs_count_per_box').val(data.hs_count_per_box);

            $('#inspqection_sheet_qr').prop('readonly', false);
            $('#btn_transfer').prop('disabled', true);
            $('#btn_disposition').prop('disabled', true);

            var box_qr_judgement = parseInt(data.box_qr_judgement);
            if (box_qr_judgement < 0) {
                $('#inspqection_sheet_qr').focus();
            } else {
                $('#scan_serial').focus();
            }

            var inspection_sheet_count = 0;

            $.each(all_data, function(i,x) {
                if (x.box_qr_judgement > -1) {
                    inspection_sheet_count++;
                }
            });

            if (inspection_sheet_count == box_count) {
                $('#btn_good').prop('disabled', false);
                $('#btn_notgood').prop('disabled', false);
                $('#scan_serial').prop('readonly', false);
            }

            var box_judgement = parseInt(data.box_judgement);
            if (box_judgement > -1) {
                $('#btn_good').prop('disabled', true);
                $('#btn_notgood').prop('disabled', true);
                // $('#scan_serial').prop('readonly', true);
            }

            var box_tested = parseFloat($('#box_tested').html());
            var box_tested_full = parseFloat($('#box_tested_full').html());

            if (box_tested == box_tested_full) {
                $('#btn_good').prop('disabled', true);
                $('#btn_notgood').prop('disabled', true);
                // $('#scan_serial').prop('readonly', true);
                // $('#inspqection_sheet_qr').prop('readonly', true);

                _QAInspection.swMsg("Random Box inspection is done. Please judge the Pallet now.","warning");
            }

            _QAInspection.$tbl_affected_serials.ajax.reload();

            _QAInspection.statusMsg('','clear');
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#inspqection_sheet_qr').val('');
            $('#box_qr').val('');
            $('#box_id').val('');

            $('#box_count').html(0);
            $('#hs_count_per_box').val(0);

            $('#inspqection_sheet_qr').prop('readonly', true);
            $('#inspqection_sheet_qr').focus();
            $('#btn_transfer').prop('disabled', false);
            $('#btn_disposition').prop('disabled', false);

            $('#btn_good').prop('disabled', true);
            $('#btn_notgood').prop('disabled', true);
            $('#scan_serial').prop('readonly', true);

            _QAInspection.$tbl_affected_serials.ajax.reload();
        });

        $('#btn_good').on('click', function() {
            var rowData = _QAInspection.$tbl_boxes.rows({selected:  true}).data().toArray();
            var data = rowData[0];
            var row_index = _QAInspection.$tbl_boxes.rows({selected:  true}).indexes();

            var box_tested = parseFloat($('#box_tested').html());
            var box_tested_full = parseFloat($('#box_tested_full').html());

            if (box_tested == box_tested_full) {
                _QAInspection.swMsg("Maximum box inspection per pallet has already met.","warning");
            } else {
                _QAInspection.boxJudgment({
                    _token: _QAInspection.token,
                    box_id: data.id,
                    qa_id: data.qa_id,
                    judgment: 1,
                    row_index: row_index[0]
                });
            }
        });

        $('#btn_notgood').on('click', function() {
            var rowData = _QAInspection.$tbl_boxes.rows({selected:  true}).data().toArray();
            var data = rowData[0];
            var row_index = _QAInspection.$tbl_boxes.rows({selected:  true}).indexes();

            _QAInspection.boxJudgment({
                _token: _QAInspection.token,
                box_id: data.id,
                qa_id: data.qa_id,
                judgment: 0,
                row_index: row_index[0]
            });
        });

        $('#tbl_boxes tbody').on('click', '.box_ng', function() {
            var data = _QAInspection.$tbl_boxes.row($(this).parents('tr')).data();
            var index = _QAInspection.$tbl_boxes.row($(this).parents('tr')).index();

            $('#box_ng_id').val(data.id);
            $('#box_ng_qa_id').val(data.qa_id);
            $('#box_row_index').val(index);
            $('#modal_box_ng_reason').modal('show');
        });

        $('#btn_save_box_ng_reason').on('click', function() {
            var box_id = $('#box_ng_id').val();
            var box_ng_qa_id = $('#box_ng_qa_id').val();
            var box_row_index = $('#box_row_index').val();
            var box_ng_reason = $('#box_ng_reason').val();

            if (box_ng_reason == null || box_ng_reason == "") {
                _QAInspection.swMsg("Please provide a Reason.","warning");
            } else {
                _QAInspection.setBoxNGRemarks({
                    _token: _QAInspection.token,
                    box_id: box_id,
                    box_ng_qa_id: box_ng_qa_id,
                    box_row_index: box_row_index,
                    box_ng_reason: box_ng_reason
                });
            }
            
        });

        var hs_count = 0;
        $('#inspqection_sheet_qr').on('keypress', function(e) {
            var delayInMilliseconds = 1000; //1 second
            var inspection_qr = $(this).val();

            if (e.keyCode == 13) {
                inspection_qr += (e.key == 'Enter')? '': e.key;
                hs_count += 1;
                e.preventDefault();
            }

            var hs_count_per_box = $('#hs_count_per_box').val();

            if (hs_count_per_box == hs_count) {
                console.log(inspection_qr);
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

                hs_count = 0;
            }
        });

        $('#scan_serial').on('keypress', function(e) {
            var hs_serial = $(this).val();

            if (e.keyCode == 13) {
                var rowData = _QAInspection.$tbl_boxes.rows({selected:  true}).data().toArray();
                var data = rowData[0];

                _QAInspection.scanHSSerial({
                    _token: _QAInspection.token,
                    hs_serial: hs_serial,
                    box_id: data.id,
                    pallet_id: $('#pallet_id').val()
                });
                e.preventDefault();
            }
        });

        $('#pallet_disposition').on('select2:select', function(e) {
            var data = e.params.data;
            switch (data.text) {
                case "FOR REWORK":
                    $('#div_disposition_reason').show();
                    $('#div_hold_lot').hide();
                    break;
                case "HOLD PALLET":
                    $('#div_disposition_reason').show();
                    $('#div_hold_lot').hide();
                    break;
                case "HOLD LOT":
                    $('#div_disposition_reason').show();
                    $('#div_hold_lot').show();
                    break;
                default:
                    $('#div_disposition_reason').hide();
                    $('#div_hold_lot').hide();
                    break;
            }
        });

        $('#btn_disposition').on('click', function() {
            $('#lot_no').select2({
                allowClear: true,
                placeholder: 'Select Lot',
                theme: 'bootstrap4',
                width: 'auto',
                ajax: {
                    url: "/transactions/qa-inspection/get-pallet-lot",
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
                            pallet_id: $('#pallet_id').val()
                        };
                    },
                    processResults: function(data) {
                        return {
                            results: data
                        };
                    },
                }
            }).val(null).trigger('change.select2');
            
            $('#div_disposition_reason').hide();
            $('#div_hold_lot').hide();
            $('#modal_disposition').modal('show');
        });

        $('#btn_save_disposition').on('click', function() {
            var row_index = $('#tbl_obas').DataTable().rows({selected:  true}).indexes();
            var pallet_disposition = $('#pallet_disposition').val();
            var lot_no = $('#lot_no').val();
            var disposition_reason = $('#disposition_reason').val();

            if (pallet_disposition == null || pallet_disposition == "") {
                _QAInspection.swMsg("Please provide a Disposition.","warning");
            } else {
                _QAInspection.palletDisposition({
                    _token: _QAInspection.token,
                    pallet_id: $('#pallet_id').val(),
                    pallet_disposition: parseInt(pallet_disposition),
                    row_index: row_index[0],
                    disposition_reason: disposition_reason,
                    lot_no: (lot_no.length > 0)? lot_no : []
                });
            }
        });

        $('#btn_transfer').on('click', function() {
            var row_data = $('#tbl_obas').DataTable().rows({selected:  true}).data();
            var data = row_data[0];

            $('#transfer_pallet_id').val(data.id);
            $('#modal_transfer_to').modal('show');
        });

        $('#btn_transfer_production').on('click', function() {
            var row_data = $('#tbl_obas').DataTable().rows({selected:  true}).data();
            var row_indexes = $('#tbl_obas').DataTable().rows({selected:  true}).indexes();
            var data = row_data[0];
            var index = row_indexes[0];

            _QAInspection.TransferTo({
                _token: _QAInspection.token,
                pallet_id: data.id,
                pallet_location: 'PRODUCTION',
                row_index: index
            });
            $('#modal_transfer_to').modal('show');
        });

        $('#btn_transfer_warehouse').on('click', function() {
            var row_data = $('#tbl_obas').DataTable().rows({selected:  true}).data();
            var row_indexes = $('#tbl_obas').DataTable().rows({selected:  true}).indexes();
            var data = row_data[0];
            var index = row_indexes[0];

            _QAInspection.TransferTo({
                _token: _QAInspection.token,
                pallet_id: data.id,
                pallet_location: 'WAREHOUSE',
                row_index: index
            });
        });
        
	});

})();

window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };