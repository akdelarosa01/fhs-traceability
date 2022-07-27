"use strict";

(function() {
    const QAInspection = function() {
        return new QAInspection.init();
    }
	QAInspection.init = function() {
		$D.init.call(this);
        $F.init.call(this);
        this.$tbl_obas = "";
        this.$tbl_boxes = "";
        this.$tbl_affected_serials = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
	}
	QAInspection.prototype = {
		init: function() {},
		

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
		drawOBADatatables: function() {
			var self = this;
			if (!$.fn.DataTable.isDataTable('#tbl_obas')) {
				self.$tbl_obas = $('#tbl_obas').DataTable({
					scrollY: "400px",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    select: {
                        style: 'os',
                        selector: 'td:not(:first-child)'
                    },
					ajax: {
                        url: "/transactions/qa-inspection/get-pallets",
                        dataType: "JSON",
                        error: function(response) {
                            console.log(response);
                        }
                    },
					language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No Pallet was created.",
                        info: "Showing _START_ to _END_ of _TOTAL_ records",
                        infoEmpty: "No records found",
                        infoFiltered: "(filtered1 from _MAX_ total records)",
                        lengthMenu: "Show _MENU_",
                        search: "Search:",
                        zeroRecords: "No matching records found"
                    },
                    deferRender: true,
					columns: [
                        { 
                            data: function(data) {
                                return '<input type="checkbox" id="checkbox" class="check_box" value="'+data.id+'"/>';
                            }, name: 'id', searchable: false, orderable: false, target: 0 , width: '10px', className: 'text-center align-middle' 
                        },
                        {
                            data: function(data) {
                                return '<span>'+data.pallet_qr+'</span><br>' +
								        '<small>'+data.updated_at+'</small>';
                            }, name: 'pallet_qr', searchable: false, orderable: false 
                        },
                        { data: function(data) {
                                return '<p class="btn-success py-2 my-0">'+data.pallet_location+'</p>';
                            }, name: 'pallet_location', searchable: false, orderable: false, className: 'text-center align-middle'
                        },
						{ data: function(data) {
                                return '<span></span>';
                            }, name: 'pallet_status', searchable: false, orderable: false, className: 'text-center align-middle'  
                        }
						
					],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {
                       
                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
                        $('.dataTables_scrollBody, .slimScrollDiv').css('height','400px');
                    },
                    fnDrawCallback: function() {
                        // $("#tbl_pallets").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                        var data = this.fnGetData();
                        var data_count = data.length;
                        $('#oba_count').html(data_count);
                    },
                }).on('page.dt', function() {
                
				});
			}
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
                    select: {
                        style: 'os',
                        selector: 'td:first-child',
                        
                    },
                    ajax: {
                        url: "/transactions/qa-inspection/get-boxes",
                        dataType: "JSON",
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
                            data: function(data) {
                                return '<input type="checkbox" id="checkbox" class="check_box" value="'+data.id+'"/>';
                            }, name: 'id', searchable: false, orderable: false, width: '10px', className: 'text-center align-middle' 
                        },
                        { 
                            data: function(data) {
                                return '<h5 class="font-weight-normal">'+data.box_qr+'</h5>';
                            }, name: 'box_qr', searchable: false, orderable: false,  className: 'text-center align-middle' 
                        },
                        { 
                            data: function() {
                                return '<p></p>';
                            }, name: 'inspection', searchable: false, orderable: false, width: '10px', className: 'text-center align-middle' 
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
                        
                        $(dataRow[0].cells[3]).css('background-color', '#a3a3a3');
                        $(dataRow[0].cells[3]).css('color', '#000000');

                    },
                    initComplete: function() {
                        $('.dataTables_scrollBody').slimscroll();
                        $('.dataTables_scrollBody, .slimScrollDiv').css('height','400px');
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
        // getUser: function(data) {
        //     var self = this;
        //     self.submitType = "Get";
        //     self.jsonData = {
        //         new_box_count: $('#inspector').val(data.Last_name)
        //     };
        //     self.formAction = "/transactions/qa-inspection/get-user";
        // },
		scanInspection: function(param) {
            var self = this;
            self.submitType = "GET";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/check-hs-serial";
            self.sendData().then(function() {
               
                if (data.matched == true)  {
                    console.log("eto na");
                }
                $('#scan_serial').prop('readonly', false);
                $('#btn_good').prop('disabled', false);
                $('#btn_notgood').prop('disabled', false);

                // $('#save_div').hide();
                // $('#preview_div').show();

                // self.$tbl_boxes.ajax.reload();
            });
        }
	}
	QAInspection.init.prototype = $.extend(QAInspection.prototype, $D.init.prototype, $F.init.prototype);
   
	$(document).ready(function() {
		
		var _QAInspection = QAInspection();
        _QAInspection.RunDateTime();
        _QAInspection.drawOBADatatables();
        _QAInspection.drawBoxesDatatables();
        
        _QAInspection.$tbl_obas.on('select', function ( e, dt, type, indexes ) {
            var rowData = _QAInspection.$tbl_obas.rows( indexes ).data().toArray();
            var data = rowData[0];
            $('#pallet_id').val(data.id);
            $('#box_tested_full').html(data.new_box_count);
            $('#box_count_to_inspect').val(data.new_box_count);
            
            _QAInspection.statusMsg('','clear');
            _QAInspection.$tbl_boxes.ajax.reload();

        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#pallet_id').val('');
            $('#box_tested_full').html(0);
            $('#box_count_to_inspect').val('');
            $('#inspqection_sheet_qr').val('');
            $('#inspqection_sheet_qr').prop('readonly', true);
            _QAInspection.$tbl_boxes.ajax.reload();
            $('#box_tested').html(0);
        });
        $('#tbl_obas tbody').on('change', '.check_box', function() {
            var checked = $(this).is(':checked');
            $('.check_box').not(this).prop('checked', false);
            $('#btn_transfer').prop('disabled', true);
            $('#btn_disposition').prop('disabled', true);
            if (checked) {
                $('#btn_transfer').prop('disabled', false);
                $('#btn_disposition').prop('disabled', false);
                $('#inspqection_sheet_qr').prop('readonly', true);
            } else {
                $('#btn_transfer').prop('disabled', true);
                $('#btn_disposition').prop('disabled', true);
            }
        });


        _QAInspection.$tbl_boxes.on('select', function ( e, dt, type, indexes ) {
            var rowData = _QAInspection.$tbl_boxes.rows( indexes ).data().toArray();
            var data = rowData[0];            
            $('#box_qr').val(data.box_qr);

            _QAInspection.statusMsg('','clear');
        })
        .on('deselect', function ( e, dt, type, indexes ) {
            $('#inspqection_sheet_qr').val('');
            $('#box_qr').val('');

            $('#box_count').html(0);
        });
        
        $('#tbl_boxes tbody').on('change', '.check_box', function() {
            var checked = $(this).is(':checked');
            $('.check_box').not(this).prop('checked', false);

            if (checked) {
                $('#inspqection_sheet_qr').prop('readonly', false);
                $('#inspqection_sheet_qr').focus();
                $('#btn_transfer').prop('disabled', true);
                $('#btn_disposition').prop('disabled', true);
            } else {
                $('#inspqection_sheet_qr').prop('readonly', true);
            }
        });

        $('#btn_transfer').on('click', function() {
            var chkArray = [];
            var table = _QAInspection.$tbl_obas;
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

        $('#inspqection_sheet_qr').on('change', function() {
            var inspection_qr = $(this).val();

            var rowData = _QAInspection.$tbl_boxes.rows({selected:  true}).data().toArray();
            var data = rowData[0];

            //console.log(data);

            _QAInspection.scanInspection({
                _token: _QAInspection.token,
                hs_qrs: inspection_qr,
                box_id: data.id,
                box_qr: data.box_qr
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