"use strict";

(function() {
    const ShipmentDataQuery = function() {
        return new ShipmentDataQuery.init();
    }
    ShipmentDataQuery.init = function() {
        $D.init.call(this);
        this.$tbl_data_search = "";
        this.id = 0;
        this.token = $("meta[name=csrf-token]").attr("content");
        this.read_only = $("meta[name=read-only]").attr("content");
        this.authorize = $("meta[name=authorize]").attr("content");
    }
    ShipmentDataQuery.prototype = {
        permission: function() {
            var self = this;
            $('.read-only').each(function(i,x) {
                $state = (self.read_only == 1)? true : false;
                $(x).prop('disabled',$state);
            });
        },
        drawDatatables: function() {
            var self = this;
            if (!$.fn.DataTable.isDataTable('#tbl_data_search')) {
                self.$tbl_data_search = $('#tbl_data_search').DataTable({
                    processing: true,
                    scrollY: 500,
                    scrollX: true,
                    scrollCollapse: true,
                    paging: false,
                    lengthChange: false,
                    fixedHeader: {
                        header: true,
                    },
                    dom: 'Bfrtip',
                    buttons: [
                        'csv', 'excel'
                    ],
                    rowGroup: {
                        dataSrc: 1
                    },
                    ajax: {
                        url: "/reports/shipment-data-query/generate-data",
                        dataType: "JSON",
                        data: function(d) {
                            d._token = self.token;
                            d.search_type = $('#search_type').val();
                            d.search_value = $('#search_value').val();
                            d.max_count = $('#max_count').val();
                            d.shipment_date_from = $('#shipment_date_from').val();
                            d.shipment_date_to = $('#shipment_date_to').val();
                        },
                        error: function(response) {
                            console.log(response);
                        }
                    },
                    deferRender: true,
                    language: {
                        aria: {
                            sortAscending: ": activate to sort column ascending",
                            sortDescending: ": activate to sort column descending"
                        },
                        emptyTable: "No data available in table",
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
                    //pageLength: 10,
                    order: [
                        [0, "desc"]
                    ],
                    columns: [
                        { data: 'ship_date', name: 'ship_date', title: "Shipped Date" },
                        { data: 'control_no', name: 'control_no', title: "Control No." },
                        { data: 'model', name: 'model', title: "Model" },
                        { data: 'total_ship_qty', name: 'total_ship_qty', title: "Total Ship Qty" },
                        { data: 'pallet_qty', name: 'pallet_qty', title: "Pallet Qty" },
                        { data: 'destination', name: 'destination', title: "Destination" },
                        { data: 'truck_plate_no', name: 'truck_plate_no', title: "Truck Plate No." },
                        { data: 'shipping_seal_no', name: 'shipping_seal_no', title: "Shipping Seal No." },
                        { data: 'peza_seal_no', name: 'peza_seal_no', title: "PEZA Seal No." },
                        { data: 'shipper', name: 'shipper', title: "Shipper" },
                        { data: 'qc_pic', name: 'qc_pic', title: "QC PIC" },
                        { data: function(x) {
                            var shipment_status = parseInt(x.shipment_status);

                            switch (shipment_status) {
                                case 4:
                                    return 'DELETED';
                                case 3:
                                    return 'SHIPPED';
                                case 2:
                                    return 'CANCELLED';
                                case 1:
                                    return 'COMPLETED';
                                case 0:
                                    return 'INCOMPLETE';
                                default:
                                    return '';
                            }
                        }, name: 'shipment_status', title: "Status" },
                        { data: 'pallet_qr', name: 'pallet_qr', title: "Pallet No." },
                        { data: 'box_qty', name: 'box_qty', title: "Box Qty" },
                        { data: 'hs_qty', name: 'hs_qty', title: "HS Qty" }
                    ],
                    rowCallback: function(row, data) {
                    },
                    createdRow: function(row, data, dataIndex) {
                    },
                    initComplete: function() {
                    },
                    fnDrawCallback: function() {
                        //$("#tbl_data_search").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                    },
                }).on('page.dt', function() {
                });

                self.$tbl_data_search.buttons().container().appendTo( '#tbl_data_search_wrapper .col-md-6:eq(0)' );
            }
            return this;
        },
    }
    ShipmentDataQuery.init.prototype = $.extend(ShipmentDataQuery.prototype, $D.init.prototype);
    ShipmentDataQuery.init.prototype = ShipmentDataQuery.prototype;

    $(document).ready(function() {
        var _ShipmentDataQuery = ShipmentDataQuery();
        _ShipmentDataQuery.permission();
        _ShipmentDataQuery.drawDatatables();

        $('.dataTables_scrollBody').on('scroll', function() {
            _ShipmentDataQuery.$tbl_data_search.fixedHeader.adjust();
        });

        $('#shipment_date_from').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#shipment_date_to').attr('min', e.currentTarget.value);
        });

        $('#shipment_date_to').on('change', function(e) {
            console.log(e.currentTarget.value);
            $('#shipment_date_from').attr('max', e.currentTarget.value);
        });

        $('#btn_search').on('click', function() {
            
            var search_type = ($('#search_type').val() == "" || $('#search_type').val() == null)? "" : $('#search_type').val();
            var search_value = ($('#search_value').val() == "" || $('#search_value').val() == null)? "" : $('#search_type').val();
            if (search_type !== "" && search_value == "") {
                _ShipmentDataQuery.swMsg("Please Provide a the type of data to search","warning");
            } else {
                _ShipmentDataQuery.$tbl_data_search.ajax.reload(false);
            }
            
        });

        $('#btn_export').on('click', function() {
            var link = '/reports/shipment-data-query/download-excel?_token='+ _ShipmentDataQuery.token;
            window.location.href = link;
        });
    });
})();


window.history.forward();

function noBack() {
    window.history.forward();
}
setTimeout("noBack()", 0);
window.onunload = function() { null };