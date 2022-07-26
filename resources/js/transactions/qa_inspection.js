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
                        style: 'single',
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
                                return '<input type="checkbox" class="check_pallet" value="'+data.id+'"/>';
                            }, name: 'id', searchable: false, orderable: false, width: '10px', className: 'align-middle' 
                        },
                        {
                            data: function(data) {
                                return '<span>'+data.pallet_qr+'</span><br>' +
								        '<small>'+data.updated_at+'</small>';
                            }, name: 'pallet_qr', searchable: false, orderable: false 
                        },
                        { data: function(data) {
                                return '<p class="btn-success my-0">'+data.pallet_location+'</p>';
                            }, name: 'pallet_status', searchable: false, orderable: false, className: 'text-center align-middle'
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
                    scrollY: "400px",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
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
                                return '<input type="checkbox" id="checkbox" class="check_pallet" value="'+data.id+'"/>';
                            }, name: 'id', searchable: false, orderable: false, width: '10px', className: 'text-center align-middle' 
                        },
                        { 
                            data: function(data) {
                                return '<h5 class="font-weight-normal">'+data.box_qr+'</h5>';
                            }, name: 'box_qr', searchable: false, orderable: false,  className: 'text-center align-middle' 
                        },
                        { 
                            data: function() {
                                return '<button class="btn-success btn-sm" > Match</button> <button class="btn-danger btn-sm"> Not Match</button>';
                            }, name: 'inspection', searchable: false, orderable: false, width: '10px', className: 'text-center align-middle' 
                        },
                        { data: 'remarks', name: 'remarks', searchable: false, orderable: false, className: 'text-center align-middle'  }
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
        drawSerialsDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_affected_serials')) {
                self.$tbl_boxes = $('#tbl_affected_serials').DataTable({
                    scrollY: "400px",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
                    },
                    ajax: {
                        url: "/transactions/qa-inspection/get-serials",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.box_qr = $('#box_qr').val()
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
                                return '<span> </span>';
                            }, name: 'id', searchable: false, orderable: false, className: 'text-center align-middle' 
                        },
                        
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

            _QAInspection.$tbl_boxes.ajax.reload();
            $('#box_tested').html(0);
        });

        // _QAInspection.$tbl_boxes.on('select', function ( e, dt, type, indexes ) {
        //     var rowData = _QAInspection.$tbl_boxes.rows( indexes ).data().toArray();
        //     var data = rowData[0];

        //     $('#inspqection_sheet_qr').val(data.id);
            
        //     _QAInspection.statusMsg('','clear');
        // })
        // .on('deselect', function ( e, dt, type, indexes ) {
        //     $('#inspqection_sheet_qr').val('');
       

        //     $('#box_count').html(0);
        // });
        


        // $('#tbl_boxes #checkbox').on('click', 'input[type="checkbox"]', function() {      
        //     $('#checkbox').not(this).prop('checked', false); 
        //     console.log("check");     
        // });
        
	});

})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };