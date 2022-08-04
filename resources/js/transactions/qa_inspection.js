"use strict";

(function() {
    const QAInspection = function() {
        return new QAInspection.init();
    }
	QAInspection.init = function() {
		$D.init.call(this);
        $F.init.call(this);
        $R.init.call(this);
        //this.$tbl_obas = "";
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
                        $('.dataTables_scrollBody').css('height','400px');
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
                        selector: '#checker',
                        
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
                            data: function(data) {
                                return '<input type="checkbox" id="checker" class="check_box" value="'+data.id+'"/>';
                            }, name: 'id', searchable: false, orderable: false, width: '10px', className: 'text-center align-middle' 
                        },
                        { 
                            data: function(data) {
                                return '<h5 class="font-weight-normal m-0">'+data.box_qr+'</h5>';
                            }, name: 'box_qr', searchable: false, orderable: false,  className: 'text-center align-middle' 
                        },
                        { 
                            data: function(data) {

                                switch (data.box_qr_judgement) {
                                    case 0:
                                        return '<span class="badge badge-danger p-8">NOT MATCH</span>';
                                    case 1:
                                        return '<span class="badge badge-success p-8">MATCH</span>';
                                    default:
                                        return '<span class=""></span>';
                                }
                                
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
                        $('.dataTables_scrollBody').css('height','400px');
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
		scanInspection: function(param) {
            var self = this;
            self.submitType = "POST";
            self.jsonData = param;
            self.formAction = "/transactions/qa-inspection/check-hs-serial";
            self.sendData().then(function() {

                 self.$tbl_boxes.ajax.reload();
                
                // var sample = $('#tbl_obas').DataTable().row(this).data();
                // console.log(sample);

                // var chkArray = [];
                // var table = $('#tbl_obas').DataTable();
                // var cnt = 0;

                // for (var x = 0; x < table.context[0].aoData.length; x++) {
                //     var DataRow = table.context[0].aoData[x];
                //     if (DataRow.anCells !== null && DataRow.anCells[0].firstChild.checked == true) {
                //         chkArray.push(table.context[0].aoData[x].anCells[0].firstChild.value)
                //         cnt++;
                //     }
                // }
                // console.log(cnt);

                 var response = self.responseData;
                // $('#btn_good').prop('disabled', false);
                // $('#btn_notgood').prop('disabled', false);
                // console.log(response.matched);
                if (response.matched == 1)  {
                    console.log("trrrrrrrrruuuuuuu");
                    $('.check_box').prop('checked', false);
                    $('#inspqection_sheet_qr').val('');
                    $('#inspqection_sheet_qr').prop('readonly', true);
                    $('#scan_serial').prop('readonly', true);
                    $('#match').css('display', 'block');
                }
                else {
                    $('.check_box').prop('checked', false);
                    $('#inspqection_sheet_qr').val('');
                    $('#inspqection_sheet_qr').prop('readonly', true);
                    $('#scan_serial').prop('readonly', false);
                    $('#not-match').css('display', 'block');
                    console.log("false");
                }
            });
        }
	}
	QAInspection.init.prototype = $.extend(QAInspection.prototype, $D.init.prototype, $F.init.prototype, $R.init.prototype);
   
	$(document).ready(function() {
		var _QAInspection = QAInspection();
        _QAInspection.permission();
        _QAInspection.RunDateTime();
        _QAInspection.drawOBADatatables();
        _QAInspection.drawBoxesDatatables();
        
        $('#tbl_obas').DataTable().on('select', function ( e, dt, type, indexes ) {
            var rowData = $('#tbl_obas').DataTable().rows( indexes ).data().toArray();
            var data = rowData[0];
            // console.log(data);
            $('#pallet_id').val(data.id);
            $('#box_tested_full').html(data.new_box_count);
            $('#box_count_to_inspect').val(data.box_count_to_inspect);
            
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

                _QAInspection.scanInspection({
                    _token: _QAInspection.token,
                    hs_qrs: inspection_qr,
                    box_id: data.id,
                    box_qr: data.box_qr,
                    pallet_id: $('#pallet_id').val(),
                    created_date: $('#date_and_time').val()
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