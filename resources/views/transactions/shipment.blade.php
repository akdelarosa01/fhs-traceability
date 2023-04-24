@push('styles')
	<link href="{{ asset('css/transactions/shipment.css') }}" rel="stylesheet">
	<style>
		.check_pallet {
			width: 20px;
			height: 20px;
		}
		.disabled {
			pointer-events: none;
		}
		.remarks_input {
			border: none;
			border-radius: 0px;
		}
	</style>
@endpush

@section('title')
Shipment
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Shipment</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">

        <div class="row mb-2 justify-content-center">
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <button type="button" class="btn btn-sm btn-block btn-success mb-2" id="btn_create_shipment">
                    <i class="fa fa-plus"></i> Create Shipment
                </button>
            </div>
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <button type="button" class="btn btn-sm btn-block btn-danger mb-2" id="btn_cancel_shipment" disabled>
                    <i class="fa fa-times"></i> Cancel Shipment
                </button>
            </div>
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <button type="button" class="btn btn-sm btn-block btn-primary mb-2" id="btn_finish_shipment" disabled>
                    <i class="fa fa-truck"></i> Finish Shipment
                </button>
            </div>
        </div>

		<div class="row mb-2">
			<div class="col-12">
                <table class="table table-sm table-light table-bordered" id="tbl_shipments" style="width: 100%">
                    <thead>
                        <th width="10px"></th>
                        <th width="10px"></th>
                        <th>Control No.</th>
                        <th>Model</th>
                        <th>Status</th>
                        <th>Target Ship Qty.</th>
                        <th>Total Ship Qty.</th>
                        <th>Destination</th>
                        <th>Shipped By</th>
                        <th>Date Shipped</th>
                        <th width="10px"></th>
                    </thead>
                </table>
            </div>
		</div>
		
	</div>
</div>

<div class="modal fade" id="modal_shipment" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog mdl-full">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h4 class="modal-title">Shipment Transaction</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-md-8 col-xs-12">
						<div class="row">
							<div class="col-3">
								<table class="table table-sm table-bordered table-light" id="tbl_models" style="width: 100%">
                                    <thead>
                                        <th width="10px"></th>
                                        <th>Models for Shipment</th>
                                    </thead>
								</table>
							</div>
                            <div class="col-5">

                                <div class="row">
                                    <div class="col-12">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Control No.</span>
                                            </div>
                                            <input type="hidden" class="form-control form-control-sm clear" id="id" name="id">
                                            <input type="text" class="form-control form-control-sm clear" id="control_no" name="control_no" placeholder="Transaction No." autocomplete="off" readonly>
                                            <div id="control_no_feedback"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-12">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Model</span>
                                            </div>
                                            <input type="hidden" class="form-control form-control-sm clear" name="model_id" id="model_id" />
                                            <input type="text" class="form-control form-control-sm clear" id="model" name="model" placeholder="Model" autocomplete="off" readonly>
                                            <div id="model_feedback"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Warehouse PIC</span>
                                            </div>
                                            <input type="text" class="form-control form-control-sm " id="warehouse_pic" name="warehouse_pic" placeholder="Warehouse PIC" autocomplete="off" value="{{Auth::user()->firstname
                                                .' '.Auth::user()->lastname}}">
                                            <div id="warehouse_pic_feedback"></div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">QC PIC</span>
                                            </div>
                                            <input type="text" class="form-control form-control-sm clear" id="qc_pic" name="qc_pic" placeholder="QC PIC" autocomplete="off" value="">
                                            <div id="qc_pic_feedback"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-12">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Destination</span>
                                            </div>
                                            <select name="destination" id="destination" class="form-control clear-select"></select>
                                            <div id="destination_feedback"></div>
                                        </div>
                                    </div>
                                </div>
            
                                {{-- <div class="row">
                                    <div class="col-12">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Date & Time</span>
                                            </div>
                                            <input type="text" class="form-control form-control-sm" id="present_date_time" name="present_date_time" autocomplete="off" readonly>
                                            <div id="present_date_time_feedback"></div>
                                        </div>
                                    </div>
                                </div> --}}

                            </div>
                            <div class="col-4">

                                <div class="row">
                                    <div class="col-12">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Ship Qty.</span>
                                            </div>
                                            <input type="hidden" class="form-control form-control-sm clear" id="hs_qty" name="hs_qty" value="0">
                                            <input type="hidden" class="form-control form-control-sm clear" id="model_hs_qty" name="model_hs_qty" value="0">
                                            <input type="number" class="form-control form-control-sm clear" id="ship_qty" name="ship_qty" placeholder="Target Ship Qty." autocomplete="off">
                                            <div id="ship_qty_feedback"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-12">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Pallet Qty.</span>
                                            </div>
                                            <input type="number" class="form-control form-control-sm clear" id="pallet_qty" name="pallet_qty" placeholder="Pallet Qty." autocomplete="off" readonly>
                                            <div id="pallet_qty_feedback"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-12">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Box Qty.</span>
                                            </div>
                                            <input type="number" class="form-control form-control-sm clear" id="box_qty" name="box_qty" placeholder="Box Qty." autocomplete="off" readonly>
                                            <div id="box_qty_feedback"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-12">
                                        <div class="input-group input-group-sm mb-2">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Broken pcs Qty.</span>
                                            </div>
                                            <input type="number" class="form-control form-control-sm clear" id="broken_pcs_qty" name="broken_pcs_qty" placeholder="Broken pcs Qty." autocomplete="off" readonly>
                                            <div id="broken_pcs_qty_feedback"></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
						</div>

						<div class="row">
							<div class="col-6">
								<table class="table table-sm table-bordered table-light" style="width: 100%" id="tbl_pallets">
									<thead>
                                        <th>Pallets for Model: <span id="selected_model"></span></th>
                                        <th>Box Qty</th>
                                        <th>HS Qty</th>
									</thead>
								</table>
							</div>

                            <div class="col-6">
                                <div class="row mb-2">
                                    <div class="col-12">
                                        <div class="input-group input-group-lg mb-2">
                                            <div class="input-group-prepend">
                                                <button class="btn btn-success read-only" type="button" id="btn_start_scan">Start Scan</button>
                                            </div>
                                            <input type="text" class="form-control form-control-lg" placeholder="Scan Pallet QR" aria-describedby="btn_start_scan" id="pallet_qr" name="pallet_qr" autocomplete="off" readonly>
                                            <div id="pallet_qr_feedback"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-2 justify-content-center">
                                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <button type="button" class="btn btn-sm btn-block btn-success mb-2" id="btn_save_transaction">
                                            <i class="fa fa-save"></i> Save Transaction
                                        </button>
                                    </div>
                                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <button type="button" class="btn btn-sm btn-block btn-danger mb-2" id="btn_delete_transaction">
                                            <i class="fa fa-times"></i> delete Transaction
                                        </button>
                                    </div>
                                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <button type="button" class="btn btn-sm btn-block btn-primary mb-2" id="btn_complete_transaction">
                                            <i class="fa fa-thumbs-up"></i> Complete
                                        </button>
                                    </div>
                                </div>
                            </div>
						</div>
						
					</div>

					<div class="col-md-4 col-xs-12">
                        

                            <div class="row">                             
                                <div class="input-group input-group-sm mb-2">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Invoice No.#</span>
                                    </div>
                                    <input type="text" class="form-control form-control-sm clear" id="invoice_no" name="invoice_no" placeholder="Invoice No.#" autocomplete="off">
                                    <div id="invoice_no_feedback"></div>
                                </div>                                
                            </div>

                            <div class="row">                               
                                <div class="col-6">
                                    <div class="input-group input-group-sm mb-2">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Container No.#</span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm clear" id="container_no" name="container_no" placeholder="Container No.#" autocomplete="off" >
                                        <div id="container_no_feedback"></div>
                                    </div>   
                                </div>
                                <div class="col-6">
                                    <div class="input-group input-group-sm mb-2">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Truck Plate No.#</span>
                                        </div>
                                        <input type="text" oninput="this.value = this.value.toUpperCase()" class="form-control form-control-sm clear" id="truck_plate_no" name="truck_plate_no" placeholder="Truck Plate No.#" autocomplete="off" >
                                        <div id="truck_plate_no_feedback"></div>
                                    </div>       
                                </div>                             
                            </div>

                            <div class="row">                              
                                <div class="input-group input-group-sm mb-2">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Shipping Seal No.#</span>
                                    </div>
                                    <input type="text" class="form-control form-control-sm clear" id="shipping_seal_no" name="shipping_seal_no" placeholder="Shipping Seal No.#" autocomplete="off" >
                                    <div id="shipping_seal_no_feedback"></div>
                                </div>                             
                            </div>

                            <div class="row">                         
                                <div class="input-group input-group-sm mb-2">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Peza Seal No.#</span>
                                    </div>
                                    <input type="text" class="form-control form-control-sm clear" id="peza_seal_no" name="peza_seal_no" placeholder="Peza Seal No.#" autocomplete="off" >
                                    <div id="peza_seal_no_feedback"></div>
                                </div>                               
                            </div>

                        
                        <table class="table table-sm table-bordered table-light" style="width: 100%" id="tbl_shipment_details">
                            <thead>
                                <th style="width: 15px"><button type="button" id="btn_remove_shipment_details" class="btn btn-sm btn-danger"><i class="fa fa-times"></i></button></th>
                                <th>Total Ship Qty: <span id="total_ship_qty">0</span></th>
                                <th>Box Qty</th>
                                <th>HS Qty: </th>
                            </thead>
                        </table>
                    </div>

				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-danger" data-dismiss="modal">
					<i class="fa fa-times"></i> Close
				</button>
			</div>
		</div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/transactions/shipment.js') }}" defer></script>
@endpush
