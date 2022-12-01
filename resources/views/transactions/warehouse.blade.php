@push('styles')
	<link href="{{ asset('css/transactions/warehouse.css') }}" rel="stylesheet">
@endpush

@section('title')
Warehouse
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Warehouse</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">

		<div class="row mb-2">
			<div class="col-4">
				<form action="/transactions/warehouse/start-shipment" method="post" id="frm_whs_details">
					@csrf
					{{-- <input type="hidden" class="clear" id="pallet_id" name="pallet_id" value="">
					<input type="hidden" class="clear" id="transaction_id" name="transaction_id" value=""> --}}
					<input type="hidden" class="clear" id="model_id" name="model_id" value="">
					<input type="hidden" class="clear" id="model" name="model" value="">
					{{-- <input type="hidden" class="clear" id="pallet_qr" name="pallet_qr" value="">
					<input type="hidden" class="clear" id="hs_qty" name="hs_qty" value=""> --}}

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

					<div class="row">
						<div class="col-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Warehouse PIC</span>
								</div>
								<input type="text" class="form-control form-control-sm clear" id="warehouse_pic" name="warehouse_pic" placeholder="Warehouse PIC" autocomplete="off" value="{{Auth::user()->firstname
									.' '.Auth::user()->lastname}}">
								<div id="warehouse_pic_feedback"></div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Date & Time</span>
								</div>
								<input type="text" class="form-control form-control-sm" id="present_date_time" name="present_date_time" autocomplete="off" readonly>
								<div id="present_date_time_feedback"></div>
							</div>
						</div>
					</div>
				</form>
			</div>

			<div class="col-8">
				<div class="row">
					<div class="col-12">
						<div class="input-group input-group-lg mb-2">
							<div class="input-group-prepend">
								<button class="btn btn-success read-only" type="button" id="btn_start_shipment">Start Shipment</button>
							</div>
							<input type="hidden" class="" id="pallet_id" name="pallet_id"/>
							<input type="text" class="form-control form-control-lg" placeholder="Scan Pallet QR" aria-describedby="btn_start_shipment" id="scan_pallet_qr" name="scan_pallet_qr" autocomplete="off" readonly>
							<div id="pallet_qr_feedback"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row mb-2">
			<div class="offset-8 col-4" style="font-size: 14px;">
				<strong>Status message: </strong>
				<span id="status_msg"></span>
			</div>
		</div>

		<div class="row">
			<div class="col-3">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						<table class="table table-sm table-hover" id="tbl_hs_models" style="width: 100%">
							<thead>
								<th width="10px"></th>
								<th>Model Count: <span id="model_count">0</span></th>
							</thead>
						</table>
					</div>
				</div>

				<div class="row">
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-blue align-middle read-only" id="btn_transfer" disabled>
							<i class="fa fa-arrow-right"></i> Transfer To
						</button>
					</div>
				</div>
			</div>

			<div class="col-5">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						<table class="table table-sm table-white" id="tbl_pallets" style="width: 100%">
							<thead>
								<th style="width: 10px;"></th>
								<th>Available Pallet: <span id="available_pallet">0</span></th>
								<th>Status</th>
								<th>On Track</th>
							</thead>
						</table>
					</div>
				</div>

				<div class="row">
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-blue read-only" id="btn_sort_by" disabled>
							<i class="fa fa-sort"></i> Sort By
						</button>
					</div>
				</div>
			</div>

			<div class="col-4">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						
						<table class="table table-sm table-hover" id="tbl_shipments" style="width: 100%">
							<thead>
								<th>Real-time shipped Pallet: <span id="shipped_pallet_count">0</span></th>
							</thead>
						</table>
					</div>
				</div>

				<div class="row">
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2" id="save_div">
						<button type="button" class="btn btn-sm btn-block btn-secondary" id="btn_close_shipment" disabled>
							<i class="fa fa-truck"></i> Close Shipment
						</button>
					</div>
				</div>
			</div>
		</div>
		
	</div>
</div>

<div class="modal fade" id="modal_transfer_to" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-sm">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h4 class="modal-title" id="modal_form_title">Pallet Transfer</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<input type="hidden" id="transfer_pallet_id" class="clear">
				<h3 class="text-center mb-3">Transfer pallet to?</h3>
				<div class="row">
					<div class="col-md-12">
						<button type="button" id="btn_transfer_qa" class="btn btn-sm btn-block btn-flat btn-primary">Q.A.</button>
					</div>

					{{-- <div class="col-md-6">
						<button type="button" id="btn_transfer_warehouse" class="btn btn-sm btn-block btn-flat btn-info">WAREHOUSE</button>
					</div> --}}
				</div>
			</div>
		</div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/transactions/warehouse.js') }}" defer></script>
@endpush
