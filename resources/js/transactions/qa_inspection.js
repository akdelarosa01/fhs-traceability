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
        this.$tbl_inpection_sheet_serial = "";
        this.$tbl_hs_serials_oba = "";
        this.$tbl_hs_history = "";
        this.$tbl_box_history = "";
        this.$tbl_change_judgment_reasons = "";
        this.$tbl_hs_not_detected = "";
        this.box_id = 0;
        this.hs_serial = "";
        this.box_history_hs_serial = "";
        this.qa_judgment = -1;

        this.box_qr_code = "";
        this.pallet_qr_code = "";
        this.prv_box_id_qr = "";
        this.prv_pallet_id_qr = "";
        this.pallet_qr = "";
        this.transaction_id = 0;
        this.model_id = 0;
        this.pallet_id = 0;
        this.running_model = "";

        this.lot_no = "";
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
                $('#b_oba_process_date').val(dateTime);
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
                            if (response.hasOwnProperty('responseJSON')) {
                                var json = response.responseJSON;
                                if (json != undefined) {
                                    self.showError(json.message);
                                }
                            }
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
                        $(dataRow[0].cells[2]).addClass('py-0');
                        
                        var box_judgement = parseInt(data.box_judgement);
                        switch (box_judgement) {
                            case 1:
                                $(dataRow[0].cells[2]).css('background-color', '#00acac');
                                $(dataRow[0].cells[2]).css('color', '#FFFFFF');
                                break;
                            case 0:
                                $(dataRow[0].cells[2]).css('background-color', '#ff5b57');
                                $(dataRow[0].cells[2]).css('color', '#FFFFFF');
                                break;
                            default:
                                $(dataRow[0].cells[2]).css('background-color', '#ced4da');
                                $(dataRow[0].cells[2]).css('color', '#333333');
                                break;
                        }

                        if (data.scan_count == data.hs_count_per_box) {
                            $(dataRow[0].cells[1]).css('background-color', '#372948');
                            $(dataRow[0].cells[1]).css('color', '#FFFFFF');
                        } 
                        else if (data.scan_count > 1 && data.scan_count < data.hs_count_per_box) {
                            $(dataRow[0].cells[1]).css('background-color', '#FFE15D');
                            $(dataRow[0].cells[1]).css('color', '#333333');
                        }
                        else {
                            $(dataRow[0].cells[1]).css('background-color', '#FFFFFF');
                            $(dataRow[0].cells[1]).css('color', '#333333');
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
                        console.log(data);
                        var data_count = data.length;
                        $('#box_count').html(data_count);
                        $('#total_is_count').html(data_count);

                        var inspected = 0;
                        $.each(data, function(i, x) {
                            if (x.box_qr_judgement > -1) {
                                inspected = inspected+1;
                            }
                        });

                        var box_judge = 0;
                        var scanned_is_count = 0;
                        $.each(data, function(i, x) {
                            scanned_is_count += x.scanned;
                            if (x.box_judgement > -1) {
                                box_judge = box_judge+1;
                            }
                        });

                        $('#scanned_is_count').html(scanned_is_count);
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
                            d.box_id = self.box_id;
                            d.pallet_id = $('#pallet_id').val()
                        },
                        error: function(response) {
                            console.log(response);
                            if (response.hasOwnProperty('responseJSON')) {
                                var json = response.responseJSON;
                                if (json != undefined) {
                                    self.showError(json.message);
                                }
                            }
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
                        { 
                            data: function(data) {
                                switch (data.qa_judgment) {
                                    case 1:
                                        return 'GOOD';
                                    case 0:
                                        return data.remarks;//'<button class="btn btn-sm btn-danger disabled" data-toggle="tooltip" data-placement="top" title="'+data.remarks+'">NOT GOOD</button>';
                                    default:
                                        return '';
                                }
                            }, name: 'qa_judgment', searchable: false, orderable: false 
                        },
                    ],
                    rowCallback: function(row, data) {
                        var qa_judgment = parseInt(data.qa_judgment);
                        switch (qa_judgment) {
                            case 1:
                                $(row).addClass('disabled');
                                $(row).css('background-color', '#00acac');
                                $(row).css('color', '#FFFFFF');
                                break;
                            case 0:
                                $(row).addClass('disabled');
                                $(row).css('background-color', '#ff5b57');
                                $(row).css('color', '#FFFFFF');
                                break;
                            default:
                                $(row).css('background-color', '#FFFFFF');
                                $(row).css('color', '#333333');
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

                        $('[data-toggle="tooltip"]').tooltip('toggle');
                    },
                    fnDrawCallback: function() {
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawInspectionSheetSerialDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_inpection_sheet_serial')) {
                self.$tbl_inpection_sheet_serial = $('#tbl_inpection_sheet_serial').DataTable({
                    scrollY: "38vh",
                    processing: true,
                    searching: false, 
                    paging: false,
                    sorting: false,
                    info: false,
                    ajax: {
                        url: "/transactions/qa-inspection/get-inspection-sheet-serials",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.box_id = self.box_id;
                        },
                        error: function(response) {
                            console.log(response);
                            if (response.hasOwnProperty('responseJSON')) {
                                var json = response.responseJSON;
                                if (json != undefined) {
                                    self.showError(json.message);
                                }
                            }
                        }
                    },
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No Inspection Sheet QR was scanned.",
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
                        { 
                            data: 'prod_date', name: 'prod_date', searchable: false, orderable: false 
                        },
                        { 
                            data: 'operator', name: 'operator', searchable: false, orderable: false 
                        },
                        { 
                            data: 'work_order', name: 'work_order', searchable: false, orderable: false 
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
                        var data = this.fnGetData();
                        var data_count = data.length;
                        var b_qty_per_box = ($('#b_qty_per_box').val() == "")? 0 : parseInt($('#b_qty_per_box').val());

                        if (b_qty_per_box == data_count) {
                            $('#inspection_sheet_sn_count').html(data_count).css('color','#00acac');
                        } else {
                            $('#inspection_sheet_sn_count').html(data_count).css('color','#ff5b57');
                        }
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawOBAHSSerialsDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_hs_serials_oba')) {
                self.$tbl_hs_serials_oba = $('#tbl_hs_serials_oba').DataTable({
                    scrollY: "38vh",
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
                        selector: 'td:not(:nth-child(4))'
                    },
                    ajax: {
                        url: "/transactions/qa-inspection/get-affected-serial-no",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            console.log(d);
                            d._token = self.token;
                            d.box_id = self.box_id;
                            d.pallet_id = $('#pallet_id').val()
                        },
                        error: function(response) {
                            console.log(response);
                            if (response.hasOwnProperty('responseJSON')) {
                                var json = response.responseJSON;
                                if (json != undefined) {
                                    self.showError(json.message);
                                }
                            }
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
                            data: 'id', render: function() {
                                return '';
                            }, name: 'id', searchable: false, orderable: false, width: '15px'
                        },
                        { 
                            data: 'hs_serial', name: 'hs_serial', searchable: false, orderable: false 
                        },
                        { 
                            data: function(data) {
                                switch (data.qa_judgment) {
                                    case 1:
                                        return 'GOOD';
                                    case 0:
                                        return data.remarks;//'<button class="btn btn-sm btn-danger disabled" data-toggle="tooltip" data-placement="top" title="'+data.remarks+'">NOT GOOD</button>';
                                    default:
                                        return '';
                                }
                            }, name: 'qa_judgment', searchable: false, orderable: false 
                        },
                        { 
                            data: 'id', render: function() {
                                return '<button type="button" class="btn btn-sm btn-info btn_box_history"><i class="fa fa-boxes"></i></button>';
                            }, name: 'id', searchable: false, orderable: false, width: '15px'
                        },
                    ],
                    rowCallback: function(row, data) {
                        var qa_judgment = parseInt(data.qa_judgment);
                        switch (qa_judgment) {
                            case 1:
                                // $(row).addClass('disabled');
                                $(row).css('background-color', '#00acac');
                                $(row).css('color', '#FFFFFF');
                                break;
                            case 0:
                                // $(row).addClass('disabled');
                                $(row).css('background-color', '#ff5b57');
                                $(row).css('color', '#FFFFFF');
                                break;
                            default:
                                $(row).css('background-color', '#FFFFFF');
                                $(row).css('color', '#333333');
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
                    fnDrawCallback: function() {
                        $('[data-toggle="tooltip"]').tooltip('toggle');
                        var data = this.fnGetData();
                        console.log(data);
                        var data_count = data.length;
                        $('#hs_scanned_count').html(data_count);
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawHSHistoryDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_hs_history')) {
                self.$tbl_hs_history = $('#tbl_hs_history').DataTable({
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    ajax: {
                        url: "/transactions/qa-inspection/get-hs-history",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.hs_serial = self.hs_serial;
                            d.lot_no = self.lot_no;
                        },
                        error: function(response) {
                            console.log(response);
                            if (response != undefined) {
                                if (response.hasOwnProperty('responseJSON')) {
                                    var json = response.responseJSON;
                                    if (json != undefined) {
                                        if (json.hasOwnProperty('message')) {
                                            self.showError(json.message);
                                        }
                                    }
                                }
                            }
                        }
                    },
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No History Record.",
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
                            data: 'old_serial', name: 'old_serial', searchable: false, orderable: false 
                        },
                        { 
                            data: 'new_serial', name: 'new_serial', searchable: false, orderable: false 
                        },
                    ],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                    },
                    fnDrawCallback: function() {
                        $('[data-toggle="tooltip"]').tooltip('toggle');
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawBoxHistoryDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_box_history')) {
                self.$tbl_box_history = $('#tbl_box_history').DataTable({
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    ajax: {
                        url: "/transactions/qa-inspection/get-box-history",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.hs_serial = self.box_history_hs_serial;
                        },
                        error: function(response) {
                            console.log(response);
                            if (response != undefined) {
                                if (response.hasOwnProperty('responseJSON')) {
                                    var json = response.responseJSON;
                                    if (json != undefined) {
                                        if (json.hasOwnProperty('message')) {
                                            self.showError(json.message);
                                        }
                                    }
                                }
                            }
                        }
                    },
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No History Record.",
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
                    order: [[4,'desc']],
                    deferRender: true,
                    columns: [
                        { 
                            data: 'pallet_qr', name: 'pallet_qr', searchable: false, orderable: false 
                        },
                        { 
                            data: 'box_qr', name: 'box_qr', searchable: false, orderable: false 
                        },
                        { 
                            data: function(data) {
                                switch (data.qa_judgment) {
                                    case 1:
                                        return 'GOOD';
                                    case 0:
                                        return 'NOT GOOD'
                                    default:
                                        return '';
                                }
                            }, name: 'qa_judgment', searchable: false, orderable: false 
                        },
                        { 
                            data: 'remarks', name: 'remarks', searchable: false, orderable: false 
                        },
                        { 
                            data: 'updated_at', name: 'updated_at', searchable: false, orderable: false 
                        },
                    ],
                    rowCallback: function(row, data) {
                        var qa_judgment = parseInt(data.qa_judgment);
                        switch (qa_judgment) {
                            case 1:
                                $(row).css('background-color', '#00acac');
                                $(row).css('color', '#FFFFFF');
                                break;
                            case 0:
                                $(row).css('background-color', '#ff5b57');
                                $(row).css('color', '#FFFFFF');
                                break;
                            default:
                                $(row).css('background-color', '#FFFFFF');
                                $(row).css('color', '#333333');
                                break;
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                    },
                    fnDrawCallback: function() {
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawChangeJudgmentReasonsDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_change_judgment_reasons')) {
                self.$tbl_change_judgment_reasons = $('#tbl_change_judgment_reasons').DataTable({
                    processing: true,
                    ajax: {
                        url: "/transactions/qa-inspection/get-change-judgment-reasons",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            console.log(d);
                            d._token = self.token;
                            d.box_id = self.box_id;
                        },
                        error: function(response) {
                            console.log(response);
                            if (response != undefined) {
                                if (response.hasOwnProperty('responseJSON')) {
                                    var json = response.responseJSON;
                                    if (json != undefined) {
                                        self.showError(json.message);
                                    }
                                }
                            }
                            
                        }
                    },
                    order: [[7, 'desc']],
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No judgment was changed in this box.",
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
                        { data: 'pallet_qr', name: 'pallet_qr' },
                        { data: 'box_qr', name: 'box_qr' },
                        { data: 'hs_serial', name: 'hs_serial' },
                        { 
                            data: function(data) {
                                switch (data.orig_judgment) {
                                    case 1:
                                        return 'GOOD';
                                    case 0:
                                        return 'NOT GOOD'
                                    default:
                                        return '';
                                }
                            }, name: 'orig_judgment', searchable: false, orderable: false
                        },
                        { 
                            data: function(data) {
                                switch (data.new_judgment) {
                                    case 1:
                                        return 'GOOD';
                                    case 0:
                                        return 'NOT GOOD'
                                    default:
                                        return '';
                                }
                            }, name: 'new_judgment', searchable: false, orderable: false
                        },
                        { data: 'reason', name: 'reason' },
                        { data: 'create_user', name: 'create_user' },
                        { data: 'created_at', name: 'created_at' },
                    ],
                    rowCallback: function(row, data) {
                        var dataRow = $(row);

                        var orig_judgment = parseInt(data.orig_judgment);
                        switch (orig_judgment) {
                            case 1:
                                $(dataRow[0].cells[3]).css('background-color', '#00acac');
                                $(dataRow[0].cells[3]).css('color', '#FFFFFF');
                                break;
                            case 0:
                                $(dataRow[0].cells[3]).css('background-color', '#ff5b57');
                                $(dataRow[0].cells[3]).css('color', '#FFFFFF');
                                break;
                            default:
                                $(dataRow[0].cells[3]).css('background-color', '#FFFFFF');
                                $(dataRow[0].cells[3]).css('color', '#333333');
                                break;
                        }

                        var new_judgment = parseInt(data.new_judgment);
                        switch (new_judgment) {
                            case 1:
                                $(dataRow[0].cells[4]).css('background-color', '#00acac');
                                $(dataRow[0].cells[4]).css('color', '#FFFFFF');
                                break;
                            case 0:
                                $(dataRow[0].cells[4]).css('background-color', '#ff5b57');
                                $(dataRow[0].cells[4]).css('color', '#FFFFFF');
                                break;
                            default:
                                $(dataRow[0].cells[4]).css('background-color', '#FFFFFF');
                                $(dataRow[0].cells[4]).css('color', '#333333');
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
                    fnDrawCallback: function() {
                        $("#tbl_change_judgment_reasons").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                });
            }
            return this;
        },
        drawHSNotDetectedDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_hs_not_detected')) {
                self.$tbl_hs_not_detected = $('#tbl_hs_not_detected').DataTable({
                    processing: true,
                    searching: false, 
                    info: false,
                    sorting: false,
                    lengthChange: false,
                    ajax: {
                        url: "/transactions/qa-inspection/get-not-detected-serials",
                        type: "POST",
                        dataType: "JSON",
                        headers: {
                            'X-CSRF-TOKEN': self.token
                        },
                        data: function(d) {
                            d._token = self.token;
                            d.box_id = self.box_id;
                        },
                        error: function(response) {
                            console.log(response);
                            if (response.hasOwnProperty('responseJSON')) {
                                var json = response.responseJSON;
                                if (json != undefined) {
                                    self.showError(json.message);
                                }
                            }
                        }
                    },
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "All HS Serial Numbers in Inspection sheet are detected.",
                        info: "Showing _START_ to _END_ of _TOTAL_ records",
                        infoEmpty: "No records found",
                        infoFiltered: "(filtered1 from _MAX_ total records)",
                        lengthMenu: "Show _MENU_",
                        search: "Search:",
                        zeroRecords: "All HS Serial Numbers in Inspection sheet are detected.",
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
            self.formAction = "/transactions/qa-inspection/check-inspection-sheet";
            self.sendData().then(function() {
                var response = self.responseData;
                var count = self.$tbl_inpection_sheet_serial.data().count();

                if (count > 0) {
                    self.box_id = param.box_id;
                    self.$tbl_inpection_sheet_serial.ajax.reload();
                    self.$tbl_hs_not_detected.ajax.reload();
                } else {
                    var output_serial = response.output_serial;
                    var not_detected = response.not_detected;
                    var box = response.box;

                    if (output_serial != undefined) {
                        var index = self.$tbl_boxes.row({selected: true}).index();
                    
                        self.$tbl_boxes.row({selected: true}).data(box).draw();
                        self.$tbl_inpection_sheet_serial.rows.add(output_serial).draw();
                        self.$tbl_hs_not_detected.rows.add(not_detected).draw();

                        var nextIndex = index+1;
                        self.$tbl_boxes.row(index).deselect();
                        self.$tbl_boxes.row(nextIndex).select();
                    }
                    
                }
                $('#b_qr_inspection_sheet').val('');
                $('#b_qr_inspection_sheet').focus();
                // $('#b_oba_serial_no').focus();
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
        scanHSSerial: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/scan-hs-serial";
            self.sendData().then(function() {
                var response = self.responseData;
                var error = self.responseError;

                console.log(error);

                if (error.hasOwnProperty('hs_serial')) {
                    $('#b_oba_serial_no').addClass("input-error");
                    $('#b_oba_serial_no').addClass('is-invalid');
                    $('#hs_serial_feedback').addClass('invalid-feedback');
                    $('#hs_serial_feedback').html(error.hs_serial[0])
                    self.responseError = {};
                } else {
                    switch (response.matched) {
                        case true:
                            $('#box_judgment').removeClass("badge badge-pill badge-secondary");
                            $('#box_judgment').removeClass("badge badge-pill badge-danger");
                            $('#box_judgment').addClass("badge badge-pill badge-success");
                            break;
                        case false:
                            $('#box_judgment').removeClass("badge badge-pill badge-success");
                            $('#box_judgment').removeClass("badge badge-pill badge-secondary");
                            $('#box_judgment').addClass("badge badge-pill badge-danger");
                            break;
                    
                        default:
                            $('#box_judgment').removeClass("badge badge-pill badge-danger");
                            $('#box_judgment').removeClass("badge badge-pill badge-success");
                            $('#box_judgment').addClass("badge badge-pill badge-secondary");
                            break;
                    }
                    $('#box_judgment').html(response.matched);
                    if (param.hasOwnProperty('hs_row_index')) {
                        self.$tbl_hs_serials_oba.row(param.hs_row_index).data(response.affected_serials).draw();
                        self.$tbl_hs_serials_oba.row(param.hs_row_index).deselect();

                        if (param.new_judgment > 0) {
                            $('#cr_type').val('NORMAL');
                            $('#cr_reason').val("");
                            $('#modal_change_judgment_reason').modal('hide');
                        } else {
                            $('#hs_ng_type').val('NORMAL');
                            $('#change_jdg_ng_reason_div').hide();
                            $('#modal_hs_ng_reason').modal('hide');
                        }
                    } else {
                        $('#modal_hs_ng_reason').modal('hide');
                        var same = 0;
                        self.$tbl_hs_serials_oba.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
                            var data = this.data();
                            if (data.hs_serial == param.hs_serial) {
                                same++;
                            }
                        } );

                        if (same == 0) {
                            self.$tbl_hs_serials_oba.row.add(response.affected_serials).draw();
                        }
                    }
                    
                    var scanned_hs = self.$tbl_hs_serials_oba.rows().count();
                    $('#hs_scanned_count').html(scanned_hs);

                    if (param.hasOwnProperty('box_index')) {
                        self.$tbl_boxes.row(param.box_index).data(response.box).draw();
                    }
                    
                    self.$tbl_change_judgment_reasons.ajax.reload();
                    self.$tbl_affected_serials.ajax.reload();
                }

                $('#b_oba_serial_no').val('');
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
        getBoxDetails: function(box_qr, box_judgement) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = {
                _token: self.token,
                box_qr: box_qr
            };
            self.formAction = "/transactions/qa-inspection/get-box-details";
            self.sendData().then(function() {
                var response = self.responseData;
                $('#b_box_id').val(box_qr);
                $('#b_date_manufactured').val(response.date_manufactured);
                $('#b_date_expired').val(response.date_expired);
                $('#b_customer_part_no').val(response.cust_part_no);
                $('#b_lot_no').val(response.lot_no);
                $('#b_prod_line_no').val(response.prod_line_no);
                $('#b_carton_label_no').val(response.carton_label_no);
                $('#b_qty_per_box').val(response.qty_per_box);

                $('#hs_total_count').html(response.qty_per_box);

                var hs_scanned_count = self.$tbl_hs_serials_oba.rows().count()
                // $('#hs_scanned_count').html(hs_scanned_count);

                if (response.qty_per_box > hs_scanned_count) {
                    $('#box_judgment').removeClass("badge badge-pill badge-danger");
                    $('#box_judgment').removeClass("badge badge-pill badge-success");
                    $('#box_judgment').addClass("badge badge-pill badge-secondary");
                    $('#box_judgment').html("NOT YET COMPLETE");
                } else if (box_judgement == 'GOOD') {
                    $('#box_judgment').removeClass("badge badge-pill badge-danger");
                    $('#box_judgment').removeClass("badge badge-pill badge-secondary");
                    $('#box_judgment').addClass("badge badge-pill badge-success");
                    $('#box_judgment').html(box_judgement);
                }

                self.$tbl_inpection_sheet_serial.ajax.reload();
                self.$tbl_hs_not_detected.ajax.reload();

                // $('#modal_box_inspection').modal('show');
            });
        },
        setShift: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/set-shift";
            self.sendData().then(function() {
                var response = self.responseData;
                $('#shift').val(response.shift);
                $('meta[name=shift_session]').attr('content',response.shift);
            });
        },
        setNewBoxToInspect: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/set-new-box-to-inspect";
            self.sendData().then(function() {
                var response = self.responseData;
                console.log(response.pallet);
                $('#tbl_obas').DataTable().row({selected: true}).data(response.pallet).draw();
                $('#box_count_to_inspect').val(response.box_count_to_inspect);
                $('#box_tested_full').html(response.box_count_to_inspect);
            });
        },
        boxInspection: function() {
            var self = this;
            var rowData = self.$tbl_boxes.row({selected:  true}).data();
            var data = rowData;

            if (data) {
                $('#b_oba_serial_no').removeClass("input-error");
                $('#b_oba_serial_no').removeClass('is-invalid');
                $('#hs_serial_feedback').removeClass('invalid-feedback');
                $('#hs_serial_feedback').html("");

                self.$tbl_change_judgment_reasons.ajax.reload();

                var box_judgement = (data.box_judgement == 1)? 'GOOD' : 'NOT GOOD';

                self.getBoxDetails(data.box_qr, box_judgement);
            } else {
                self.swMsg("Please select 1 Box ID number.","warning");
            }
        },
        checkAllScannedBox: function(param) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/check-all-scanned-box";
            self.sendData().then(function() {
                var response = self.responseData;
                if (response.is_scanned_all) {
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
                } else {
                    self.swMsg("Please Scan all Inspection Sheet before assigning disposition.","warning");
                }
            });
        },
        printLabel: function(type, printer) {
            var self = this;
            const month = moment().format('MMM');
            var box_qty = 0;
            var box_ids = "";

            if (type == "REPRINT") {
                if ($('#tbl_obas').DataTable().rows({ selected: true }).any()) {
                    self.$tbl_boxes.rows().data().map((row) => {
                        box_qty++;
                        box_ids += row.box_qr+";"+"\r";
                    });

                    self.printPallet({
                        _token: self.token,
                        month: month.toUpperCase(),
                        trans_id: self.transaction_id,
                        model_id: self.model_id,
                        pallet_id: self.pallet_id,
                        model: self.running_model,
                        lot_no: '------',
                        box_qty: box_qty,
                        box_qr: box_ids,
                        pallet_qr: self.pallet_qr,
                        mode: 'reprint',
                        printer: printer
                    });
                } else {
                    self.swMsg("Please select a pallet first.","warning");
                }
            } else {
                var box_count = parseFloat($('#box_count').html());
                var box_count_full = parseFloat($('#box_count_full').html());

                if ($('#tbl_obas').DataTable().rows({ selected: true }).any()) {
                    if (box_count_full > box_count) {
                        self.swMsg("Please scan more Box ID or set this pallet as Broken Pallet.","warning");
                    } else {
                        self.$tbl_boxes.rows().data().map((row) => {
                            box_qty++;
                            box_ids += row.box_qr+";"+"\n";
                        });
            
                        self.printPallet({
                            _token: self.token,
                            month: month.toUpperCase(),
                            trans_id: self.transaction_id,
                            model_id: self.model_id,
                            pallet_id: self.pallet_id,
                            model: self.running_model,
                            lot_no: '------',
                            box_qty: box_qty,
                            box_qr: box_ids,
                            pallet_qr: self.pallet_qr,
                            mode: 'print',
                            printer: printer
                        });
                    }
                } else {
                    self.swMsg("Please select a pallet first.","warning");
                }
            }
        },
        printPallet: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/print-pallet";
            self.sendData().then(function() {
                var response = self.responseData;
                $('#btn_print_preview').prop('disabled',false);
                $('#btn_reprint_pallet').prop('disabled',false);
                $('#btn_print_pallet').prop('disabled',true);
                $('#btn_preview_print').prop('disabled',true);
                self.statusMsg("Pallet was already printed!","success");
                $('#tbl_obas').DataTable().ajax.reload();

                $('#pallet_id').val('');
                $('#pallet_id_qr').val('');
                $('#is_printed').val(0);
                $('#box_per_pallet').val(0);
                $('#box_count_full').html(0);
                $('#box_count').html(0);
                $("#print_type").val("");
                $('#modal_print').modal('hide');

                self.$tbl_boxes.ajax.reload();
            });
        },
        printPreview: function(param) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/print-preview";
            self.sendData().then(function() {
                var response = self.responseData;

                $('#prv_model').html(response.model);
                $('#prv_date').html(response.print_date);
                $('#prv_box_count').html(response.box_qty);
                $('#prv_pallet_id_val').html(response.pallet_qr);
                $('#prv_lot_no').html(response.lot_no);

                self.box_qr_code.clear();
                self.box_qr_code.makeCode(response.box_qr);
                
                self.pallet_qr_code.clear();
                self.pallet_qr_code.makeCode(response.pallet_qr);

                $('#modal_print_preview').modal('show');
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
        _QAInspection.drawInspectionSheetSerialDatatables();
        _QAInspection.drawOBAHSSerialsDatatables();
        _QAInspection.drawHSHistoryDatatables();
        _QAInspection.drawBoxHistoryDatatables();
        _QAInspection.drawChangeJudgmentReasonsDatatables();
        _QAInspection.drawHSNotDetectedDatatables();

        var prv_box_id_qr = document.getElementById('prv_box_id_qr')
        _QAInspection.box_qr_code = new QRCode(prv_box_id_qr, {
            text: "",
            width: 290,
            height: 290,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        var prv_pallet_id_qr = document.getElementById('prv_pallet_id_qr')
        _QAInspection.pallet_qr_code = new QRCode(prv_pallet_id_qr, {
            text: "",
            width: 80,
            height: 80,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        $('#btn_transfer').prop('disabled', true);
        $('#btn_disposition').prop('disabled', true);
        $('#btn_box_inspection').prop('disabled', true);

        $('#hs_ng_reason').select2({
            allowClear: true,
            placeholder: 'Select Heat Sink NG Reason',
            theme: 'bootstrap4',
            width: 'auto',
            ajax: {
                url: "/transactions/qa-inspection/get-hs-ng-remarks",
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
                    var box_tested = parseInt($('#box_tested').html());
                    var box_tested_full = parseInt($('#box_tested_full').html());
                    $.each(data, function(i,x) {
                        if (box_tested_full > box_tested) {
                            if (x.text == 'GOOD') {
                                data[i] = { id: x.id, text: x.text, disabled: true };
                            }
                        }
                    });
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
            var data = $('#tbl_obas').DataTable().row( indexes ).data();
            
            $('#pallet_id').val(data.id);
            $('#box_tested_full').html(data.box_count_to_inspect);
            $('#box_count_to_inspect').val(data.box_count_to_inspect);
            $('#inspection_sheet_count').val(data.inspection_sheet_count);
            $('#pallet_row_index').val(indexes[0]);
            var row = "";

            _QAInspection.getLotNo({
                _token: _QAInspection.token,
                pallet_id: data.id
            }, function(response) {
                row += '<tr id="r'+data.id+'_child_tr">'+
                            '<td></td>'+
                            '<td colspan="3" id="r'+data.id+'_child_td" class="p-0"></td>'+
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
            _QAInspection.pallet_qr = data.pallet_qr;
            _QAInspection.transaction_id = data.transaction_id;
            _QAInspection.model_id = data.model_id;
            _QAInspection.pallet_id = data.id;
            _QAInspection.running_model = data.model;

            // GOOD and REWORK
            if (data.pallet_dispo_status == 2) {
                if (data.is_printed > 0) {
                    $('#btn_print_pallet').prop('disabled', true);
                } else {
                    $('#btn_print_pallet').prop('disabled', false);
                }
                $('#btn_reprint_pallet').prop('disabled', false);
                $('#btn_print_preview').prop('disabled', false);
            } else {
                $('#btn_print_pallet').prop('disabled', true);
                $('#btn_reprint_pallet').prop('disabled', true);
                $('#btn_print_preview').prop('disabled', true);
            }
            
            _QAInspection.statusMsg('','clear');
            _QAInspection.$tbl_boxes.ajax.reload();
            _QAInspection.$tbl_affected_serials.ajax.reload();

        })
        .on('deselect', function ( e, dt, type, indexes ) {
            var data = $('#tbl_obas').DataTable().row( indexes ).data();

            $('#r'+data.id+'_child_tr').remove();

            $('#pallet_id').val('');
            $('#box_tested_full').html(0);
            $('#box_count_to_inspect').val('');
            $('#inspection_sheet_count').val(0);
            $('#pallet_row_index').val('');

            $('#box_id').val('');
            $('#box_qr').val('');
            $('#box_count').html(0);
            _QAInspection.$tbl_boxes.ajax.reload();
            _QAInspection.$tbl_affected_serials.ajax.reload();
            $('#box_tested').html(0);

            _QAInspection.pallet_qr = "";
            _QAInspection.transaction_id = 0;
            _QAInspection.model_id = 0;
            _QAInspection.pallet_id = 0;
            _QAInspection.running_model = "";

            $('#btn_print_pallet').prop('disabled', true);
            $('#btn_reprint_pallet').prop('disabled', true);
            $('#btn_print_preview').prop('disabled', true);

            $('#btn_transfer').prop('disabled', true);
            $('#btn_disposition').prop('disabled', true);
        });

        _QAInspection.$tbl_boxes.on('select', function ( e, dt, type, indexes ) {
            var rowData = _QAInspection.$tbl_boxes.row( indexes ).data();
            var data = rowData;
            var box_count = _QAInspection.$tbl_boxes.data().count();

            $('#box_id').val('');
            $('#box_qr').val(data.box_qr);
            $('#box_id').val(data.id);
            $('#box_count').html(box_count);

            $('#btn_transfer').prop('disabled', true);
            $('#btn_disposition').prop('disabled', true);
            $('#btn_box_inspection').prop('disabled', false);
            
            _QAInspection.box_id = data.id;
            _QAInspection.boxInspection();

            _QAInspection.$tbl_affected_serials.ajax.reload();
            _QAInspection.$tbl_hs_serials_oba.ajax.reload();

            _QAInspection.statusMsg('','clear');
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#inspqection_sheet_qr').val('');
            $('#box_qr').val('');
            $('#box_id').val('');

            _QAInspection.box_id = 0;

            $('#box_count').html(0);
            $('#btn_transfer').prop('disabled', false);
            $('#btn_disposition').prop('disabled', false);

            // $('#btn_good').prop('disabled', true);
            // $('#btn_notgood').prop('disabled', true);
            $('#scan_serial').prop('readonly', true);
            $('#btn_box_inspection').prop('disabled', true);

            _QAInspection.$tbl_affected_serials.ajax.reload();
        });

        _QAInspection.$tbl_hs_serials_oba.on('select', function ( e, dt, type, indexes ) {
            var rowData = _QAInspection.$tbl_hs_serials_oba.row( indexes ).data();
            var data = rowData;

            _QAInspection.hs_serial = data.hs_serial;
            _QAInspection.qa_judgment = data.qa_judgment;
            _QAInspection.lot_no = $('#b_lot_no').val();

            $('#b_oba_serial_no').prop('readonly', true);

            _QAInspection.$tbl_hs_history.ajax.reload();

        })
        .on('deselect', function ( e, dt, type, indexes ) {
            _QAInspection.hs_serial = "";
            _QAInspection.qa_judgment = -1;
            _QAInspection.lot_no = "";
            $('#b_oba_serial_no').prop('readonly', false);
        });

        $('#modal_box_inspection').on('shown.bs.modal', function() {
            $('#b_qr_inspection_sheet').focus();
            _QAInspection.$tbl_inpection_sheet_serial.columns.adjust();
            _QAInspection.$tbl_hs_not_detected.columns.adjust();
            _QAInspection.$tbl_hs_serials_oba.columns.adjust();
        }).on('hide.bs.modal', function () {
            var index = _QAInspection.$tbl_hs_serials_oba.row({selected: true}).index();
            _QAInspection.$tbl_hs_serials_oba.row(index).deselect();
        });

        $('#modal_disposition').on('hide.bs.modal', function () {
            $('#pallet_disposition').val(null).trigger('change');
            $('#disposition_reason').val(null).trigger('change');
            $('#lot_no').val(null).trigger('change');
        });

        $('#btn_box_inspection').on('click', function() {
            var shift = $("meta[name=shift_session]").attr('content');

            if (shift !== "" && shift !== null) {
                // _QAInspection.boxInspection();
                $('#modal_box_inspection').modal('show');
            } else {
                _QAInspection.swMsg("Please select your Shift.", "warning");
            }            
        });

        $('#btn_good').on('click', function() {
            var box_tested = parseInt($('#box_tested').html());
            var box_tested_full = parseInt($('#box_tested_full').html());

            var hs_scanned_count = parseInt($('#hs_scanned_count').html());
            var hs_total_count = parseInt($('#hs_total_count').html());

            var hs_serial = $('#b_oba_serial_no').val();
            var boxData = _QAInspection.$tbl_boxes.row({selected:  true}).data();
            var box_index = _QAInspection.$tbl_boxes.row({selected:  true}).index();
            var selected_hs = _QAInspection.$tbl_hs_serials_oba.row({selected:  true}).count();

            if (selected_hs > 0) {
                var hsData = _QAInspection.$tbl_hs_serials_oba.row({selected:  true}).data();
                var hsIndex = _QAInspection.$tbl_hs_serials_oba.row({selected:  true}).index();
                $('#cr_box_id').val(boxData.id);
                $('#cr_pallet_id').val(boxData.pallet_id);
                $('#cr_hs_serial').val(hsData.hs_serial);
                $('#cr_orig_judgment').val(hsData.qa_judgment);
                $('#cr_hs_id').val(hsData.id);
                $('#cr_index').val(hsIndex);
                $('#cr_new_judgment').val(1);
                $('#cr_type').val('CHANGE');

                $('#modal_change_judgment_reason').modal('show');
            } else {
                if (box_tested_full >= box_tested) {
                    if (hs_total_count > hs_scanned_count) {
                        if (hs_serial != "" && hs_serial != null) {
                            $('#cr_type').val('NORMAL');
                            $('#b_oba_serial_no').removeClass("input-error");
                            $('#b_oba_serial_no').removeClass('is-invalid');
                            $('#hs_serial_feedback').removeClass('invalid-feedback');
                            $('#hs_serial_feedback').html('');
    
                            _QAInspection.scanHSSerial({
                                _token: _QAInspection.token,
                                hs_serial: hs_serial,
                                box_id: boxData.id,
                                pallet_id: $('#pallet_id').val(),
                                judgment: 1,
                                box_index: box_index
                            });
                        } else {
                            _QAInspection.swMsg("Please scan or input an H.S. Serial Number.","warning");
                        }
                    } else {
                        _QAInspection.swMsg("Heat Sink to be scanned has already been completed.","warning");
                    }
                    
                } else {
                    _QAInspection.swMsg("Box to judge is already full. Please adjust a new Box Count to Inspect.", "warning");
                }
            }
        });

        $('#btn_notgood').on('click', function() {
            var box_tested = parseInt($('#box_tested').html());
            var box_tested_full = parseInt($('#box_tested_full').html());

            var hs_serial = $('#b_oba_serial_no').val();
            var boxData = _QAInspection.$tbl_boxes.row({selected:  true}).data();
            var selected_hs = _QAInspection.$tbl_hs_serials_oba.row({selected:  true}).count();

            if (selected_hs > 0) {
                var hsData = _QAInspection.$tbl_hs_serials_oba.row({selected:  true}).data();
                var hsIndex = _QAInspection.$tbl_hs_serials_oba.row({selected:  true}).index();

                $('#hs_ng_id').val(hsData.id);
                $('#hs_ng_box_id').val(boxData.id);
                $('#hs_ng_pallet_id').val(boxData.pallet_id);
                $('#hs_ng_hs_serial').val(hsData.hs_serial);
                $('#hs_row_index').val(hsIndex);
                $('#hs_ng_orig_judgment').val(hsData.qa_judgment);
                $('#hs_ng_new_judgment').val(0);
                $('#hs_ng_reason').val(null).trigger('change');
                $('#hs_ng_cr_reason').val("");
                $('#hs_ng_type').val('CHANGE');

                $('#change_jdg_ng_reason_div').show();

                $('#modal_hs_ng_reason').modal('show');
            } else {
                if (box_tested_full > box_tested) {
                    if (hs_serial != "" && hs_serial != null) {
                        $('#hs_ng_type').val('NORMAL');
                        $('#modal_hs_ng_reason').modal('show');
                        $('#hs_ng_reason').val(null).trigger('change');
                    } else {
                        _QAInspection.swMsg("Please scan or input an H.S. Serial Number.","warning");
                    }
                } else {
                    _QAInspection.swMsg("Box to judge is already full. Please adjust a new Box Count to Inspect.", "warning");
                }
            }
            
        });

        $('#btn_save_hs_ng_reason').on('click', function() {
            var box_tested = parseInt($('#box_tested').html());
            var box_tested_full = parseInt($('#box_tested_full').html());
            var hs_serial = $('#b_oba_serial_no').val();
            var hs_ng_reason = $('#hs_ng_reason').val();

            var hs_scanned_count = parseInt($('#hs_scanned_count').html());
            var hs_total_count = parseInt($('#hs_total_count').html());

            var box_index = _QAInspection.$tbl_boxes.row({selected:  true}).index();

            if (hs_ng_reason == null || hs_ng_reason == "") {
                _QAInspection.swMsg("Please provide a Reason.","warning");
            } else {
                $('#b_oba_serial_no').removeClass("input-error");
                $('#b_oba_serial_no').removeClass('is-invalid');
                $('#hs_serial_feedback').removeClass('invalid-feedback');
                $('#hs_serial_feedback').html('');

                var rowData = _QAInspection.$tbl_boxes.rows({selected:  true}).data().toArray();
                var data = rowData[0];
                var hs_ng_type = $('#hs_ng_type').val();

                if (hs_ng_type == 'NORMAL') {
                    if (box_tested_full > box_tested) {
                        if (hs_total_count > hs_scanned_count) {
                            _QAInspection.scanHSSerial({
                                _token: _QAInspection.token,
                                hs_serial: hs_serial,
                                box_id: data.id,
                                pallet_id: $('#pallet_id').val(),
                                judgment: 0,
                                hs_ng_reason: hs_ng_reason,
                                box_index: box_index
                            });
                            
                        } else {
                            _QAInspection.swMsg("Heat Sink to be scanned has already been completed.","warning");
                        }
                    } else {
                        _QAInspection.swMsg("Box to judge is already full. Please adjust a new Box Count to Inspect.", "warning");
                    }
                    
                } else {
                    var reason = $('#hs_ng_cr_reason').val();
                    if (reason != "") {

                        _QAInspection.scanHSSerial({
                            _token: _QAInspection.token,
                            type: hs_ng_type,
                            hs_id: $('#hs_ng_id').val(),
                            box_id: $('#hs_ng_box_id').val(),
                            pallet_id: $('#hs_ng_pallet_id').val(),
                            hs_serial: $('#hs_ng_hs_serial').val(),
                            orig_judgment: $('#hs_ng_orig_judgment').val(),
                            new_judgment: $('#hs_ng_new_judgment').val(),
                            hs_ng_reason: hs_ng_reason,
                            reason: reason,
                            hs_row_index: $('#hs_row_index').val(),
                            box_index: box_index
                        });
                    } else {
                        _QAInspection.swMsg("Please provide your reason for changing of judgment.","warning");
                    }
                }
            }
        });

        $('#btn_save_cr_reason').on('click', function() {
            var reason = $('#cr_reason').val();
            if (reason != "") {
                var box_index = _QAInspection.$tbl_boxes.row({selected:  true}).index();
                _QAInspection.scanHSSerial({
                    _token: _QAInspection.token,
                    type: $('#cr_type').val(),
                    hs_id: $('#cr_hs_id').val(),
                    box_id: $('#cr_box_id').val(),
                    pallet_id: $('#cr_pallet_id').val(),
                    hs_serial: $('#cr_hs_serial').val(),
                    orig_judgment: $('#cr_orig_judgment').val(),
                    new_judgment: $('#cr_new_judgment').val(),
                    reason: reason,
                    hs_row_index: $('#cr_index').val(),
                    box_index: box_index
                });
            } else {
                _QAInspection.swMsg("Please provide your reason for changing of judgment.","warning");
            }            
        });

        var hs_count = 0;
        var old_inspectionvalue = "";
        var inspection_sheet_qr = "";
        $('#b_qr_inspection_sheet').on('keypress', function(e) {
            var delayInMilliseconds = 2000; //2 second
            inspection_sheet_qr = $(this).val();

            if (e.keyCode == 13) {
                if (e.key == 'Enter') {
                    inspection_sheet_qr += '';

                }
                inspection_sheet_qr += (e.key == 'Enter')? '': e.key;
                hs_count += 1;
                e.preventDefault();

                console.log(inspection_sheet_qr);
            }
            
            setTimeout( function() {
                var inspection_sheet_qr_arr = inspection_sheet_qr.split(';');
                var hs_count_per_box = parseInt($('#b_qty_per_box').val());

                if (hs_count_per_box == hs_count) {
                    console.log(inspection_sheet_qr);
                    var data = _QAInspection.$tbl_boxes.row({selected:  true}).data();
                    var row_index = _QAInspection.$tbl_boxes.rows({selected:  true}).indexes();
        
                    _QAInspection.scanInspectionSheet({
                        _token: _QAInspection.token,
                        pallet_id: $('#pallet_id').val(),
                        box_id: data.id,
                        box_qr: data.box_qr,
                        inspector: $('#inspector').val(),
                        shift: $('#shift').val(),
                        date_manufactured: $('#b_date_manufactured').val(),
                        date_expired: $('#b_date_expired').val(),
                        customer_pn: $('#b_customer_part_no').val(),
                        lot_no: $('#b_lot_no').val(),
                        prod_line_no: $('#b_prod_line_no').val(),
                        carton_no: $('#b_carton_label_no').val(),
                        qty_per_box: $('#b_qty_per_box').val(),
                        inspection_sheet_qr: inspection_sheet_qr,
                        row_index: row_index[0]
                    });

                    hs_count = 0;
                } else {
                    old_inspectionvalue = inspection_sheet_qr;
                }
            }, delayInMilliseconds);

            
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
            var pallet_id = $('#pallet_id').val();
            var param = {
                _token: _QAInspection.token,
                pallet_id: pallet_id
            };

            _QAInspection.checkAllScannedBox(param);
        });

        $('#btn_save_disposition').on('click', function() {
            var row_index = $('#tbl_obas').DataTable().rows({selected:  true}).indexes();
            var pallet_disposition = $('#pallet_disposition').val();
            var lot_no = $('#lot_no').val();
            var disposition_reason = $('#disposition_reason').val();
            var has_NG = 0;

            _QAInspection.$tbl_boxes.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
                var data = this.data();
                if (data.box_judgement == 0) {
                    has_NG++;
                }
            } );

            if (pallet_disposition == null || pallet_disposition == "") {
                _QAInspection.swMsg("Please provide a Disposition.","warning");
            } else if (has_NG > 0 && parseInt(pallet_disposition) == 2) {
                _QAInspection.swMsg("This Pallet cannot be judged as Good. Please check some boxes that are judged as NG","warning");
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

            if (data.pallet_dispo_status == 2) {
                if (data.is_printed > 0) {
                    _QAInspection.TransferTo({
                        _token: _QAInspection.token,
                        pallet_id: data.id,
                        pallet_location: 'WAREHOUSE',
                        row_index: index
                    });
                } else {
                    _QAInspection.swMsg("Please print the Pallet label first.","warning");
                }
            } else {
                _QAInspection.swMsg("Only Pallets with GOOD judgments are allowed to transfer to Warehouse.","warning");
            }

           
        });
        
        $('#btn_set_shift').on('click', function() {
            var selected_data = $('#tbl_obas').DataTable().rows({selected:true}).count();
            if (selected_data > 0) {
                if ($('#shift').val() == "") {
                    _QAInspection.swMsg("Please select your assigned shift.", "warning");
                } else {
                    _QAInspection.setShift({
                        _token: _QAInspection.token,
                        shift: $('#shift').val(),
                    });
                }
                
            } else {
                _QAInspection.swMsg("Please Select a Pallet first.", "warning");
            }
        });

        $('#btn_set_new_box_count_to_inspect').on('click', function() {
            var selected_data = $('#tbl_obas').DataTable().rows({selected:true}).count();
            if (selected_data > 0) {
                if ($('#box_count_to_inspect').val() == "") {
                    _QAInspection.swMsg("Please input new number of Boxes to Inspect", "warning");
                } else {
                    var box_count_to_inspect = parseFloat($('#box_count_to_inspect').val());
                    var scanned_is_count = parseFloat($('#scanned_is_count').html());
                    var total_is_count = parseFloat($('#total_is_count').html());
                    var box_tested = parseFloat($('#box_tested').html());

                    if (box_count_to_inspect < box_tested) {
                        _QAInspection.swMsg("Box to Inspect value is less than the inspected box inside this Pallet. Please set Box to Inspect not less than "+$('#box_tested').html()+" inspected box/es.","warning");
                    } 
                    
                    // else if (box_count_to_inspect < scanned_is_count) {
                    //     _QAInspection.swMsg("Box to Inspect value is less than the scanned box inside this Pallet. Please set Box to Inspect not less than "+$('#scanned_is_count').html()+" scanned box/es.","warning");
                    // } 
                    
                    else if (box_count_to_inspect > total_is_count) {
                        _QAInspection.swMsg("Box to Inspect value is more than the box inside this Pallet. Please set Box to Inspect not more than "+$('#total_is_count').html()+".","warning");
                    } else {
                        _QAInspection.setNewBoxToInspect({
                            _token: _QAInspection.token,
                            pallet_id: $('#pallet_id').val(),
                            box_count_to_inspect: $('#box_count_to_inspect').val(),
                            pallet_row_index: $('#pallet_row_index').val()
                        });
                    }
                }
                
            } else {
                _QAInspection.swMsg("Please Select a Pallet first.", "warning");
            }
            
        });

        $('#tbl_hs_serials_oba').on('click', '.btn_box_history',function() {
            var data = _QAInspection.$tbl_hs_serials_oba.row($(this).parents('tr')).data();
            console.log(data);
            _QAInspection.box_history_hs_serial = data.hs_serial;
            _QAInspection.$tbl_box_history.ajax.reload();

            $('#modal_box_history').modal('show');
        });

        /**
         * Print Events
         */

        $('#btn_print_pallet, #btn_preview_print').on('click', function() {
            $('#print_type').val('PRINT');
            $('#modal_print').modal('show');            
        });

        $('#btn_reprint_pallet').on('click', function() {
            $('#print_type').val('REPRINT');
            $('#modal_print').modal('show');
        });

        $('#btn_print_preview').on('click', function() {
            var pallet_qr = $('#pallet_id_qr').val();
            var pallet_id = $('#pallet_id').val();

            if (pallet_qr != "") {
                const month = moment().format('MMM');

                $('#modal_form_title').html("Print Preview: " + pallet_qr);
                $('#prv_label_title').html(month.toUpperCase() + " FTL PALLET LABEL");

                _QAInspection.printPreview({
                    _token: _QAInspection.token,
                    pallet_id: pallet_id
                });
                
            } else {
                _QAInspection.showWarning("Please click the pallet number to select.");
            }
            
        });

        $('#btn_print_now').on('click', function() {
            var type = $("#print_type").val();
            var printer = $("#printer").val();
            var has_NG = 0;
            var pallet = $('#tbl_obas').DataTable().row({selected: true}).data();

            console.log(pallet);

            _QAInspection.$tbl_boxes.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
                var data = this.data();
                if (data.box_judgement == 0) {
                    has_NG++;
                }
            } );

            if (pallet.pallet_dispo_status == 2 && has_NG > 0) {
                _QAInspection.swMsg("Please check some boxes that are judged as NG","warning");
            } else {
                _QAInspection.printLabel(type,printer);
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