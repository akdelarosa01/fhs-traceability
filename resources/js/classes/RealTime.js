/*****************************************
A. Name: Real Time Script
B. Synopsis: Real Time Script
***********************************************/
"use strict";

(function() {
    const RealTime = function() {
        return new RealTime.init();
    }
    RealTime.init = function() {
        $D.init.call(this);
        this.$tbl_obas = "";
        this.token = $("meta[name=csrf-token]").attr("content");
    }
    RealTime.prototype = {
        init: function() {},
        initOBAdataTable: function() {
            var self = this;
			if (!$.fn.DataTable.isDataTable('#tbl_obas')) {
				self.$tbl_obas = $('#tbl_obas').DataTable({
					scrollY: "400px",
                    processing: true,
                    searching: false, 
                    paging: false, 
                    info: false,
                    sorting: false,
                    StateSave: true,
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
                        var data = this.fnGetData();
                        var data_count = data.length;
                        $('#oba_count').html(data_count);
                    },
                }).on('page.dt', function() {
                
				});
			}
        },
        timeSince: function(date) {
            date = new Date(date);

            var seconds = Math.floor((new Date() - date) / 1000);
          
            var interval = seconds / 31536000;
          
            if (interval > 1) {
              return Math.floor(interval) + " years";
            }
            interval = seconds / 2592000;
            if (interval > 1) {
              return Math.floor(interval) + " months";
            }
            interval = seconds / 86400;
            if (interval > 1) {
              return Math.floor(interval) + " days";
            }
            interval = seconds / 3600;
            if (interval > 1) {
              return Math.floor(interval) + " hours";
            }
            interval = seconds / 60;
            if (interval > 1) {
              return Math.floor(interval) + " minutes";
            }
            return Math.floor(seconds) + " seconds";
        }
    }
    RealTime.init.prototype = $.extend(RealTime.prototype, $D.init.prototype);
    RealTime.init.prototype = RealTime.prototype;
    return window.RealTime = window.$R = RealTime;
})();
