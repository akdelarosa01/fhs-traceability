@push('styles')
	<link href="{{ asset('css/transactions/warehouse.css') }}" rel="stylesheet">
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
			<div class="col-8">
				<form id="frm_search">
					<div class="row mb-2">
						<div class="col-md-12">
							<div class="row">
								<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
									<div class="input-group input-group-sm mb-2">
										<div class="input-group-prepend">
											<span class="input-group-text">Search Type</span>
										</div>
										<select name="search_type" id="search_type" class="form-control clear-select">
											<option value=""></option>
	
											<option value="model">Model</option>
											<option value="pallet_qr">Pallet ID</option>
											<option value="box_count_per_pallet">Box Count / Pallet</option>
											<option value="pallet_status">Status</option>
											<option value="shipment_status">Shipment Status</option>
										</select>
										<div id="search_type_feedback"></div>
									</div>
								</div>
		
								<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
									<div class="input-group input-group-sm mb-2">
										<div class="input-group-prepend">
											<span class="input-group-text">Search Value</span>
										</div>
										<input type="text" class="form-control form-control-sm clear normal" id="search_value" name="search_value" placeholder="Search Value" autocomplete="off">
										<div id="search_value_feedback"></div>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
									<div class="input-group input-group-sm mb-2">
										<div class="input-group-prepend">
											<span class="input-group-text">Update Date From</span>
										</div>
										<input type="date" class="form-control form-control-sm clear" id="update_date_from" name="update_date_from">
										<div id="update_date_from_feedback"></div>
									</div>
								</div>
		
								<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
									<div class="input-group input-group-sm mb-2">
										<div class="input-group-append">
											<span class="input-group-text">Update Date To</span>
										</div>
										<input type="date" class="form-control form-control-sm clear" id="update_date_to" name="update_date_to">
										<div id="update_date_to_feedback"></div>
									</div>
								</div>
							</div>
							<div class="row">
		
								<div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">
									<div class="input-group input-group-sm mb-2">
										<div class="input-group-prepend">
											<span class="input-group-text">Max count</span>
										</div>
										<input type="number" class="form-control form-control-sm clear" id="max_count" name="max_count" placeholder="Max Data Count" autocomplete="off" value="50">
										<div id="max_count_feedback"></div>
									</div>
								</div>
		
								<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-12">
									<button type="button" class="btn btn-sm btn-primary btn-block" id="btn_search">
										<i class="fa fa-search"></i> Search
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div class="col-4">
				<button type="button" class="btn btn-sm btn-green btn-block" id="btn_shipment">
					<i class="fa fa-truck"></i> Send to Shipment
				</button>
				<button type="button" class="btn btn-sm btn-blue btn-block" id="btn_qa">
					<i class="fa fa-search"></i> Send to QA
				</button>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<table class="table table-sm table-compact" id="tbl_pallets">
					<thead>
						<th width="20px"></th>
						<th width="20px"></th>
						<th>Model</th>
						<th>Pallet ID</th>
						<th>Box Count / Pallet</th>
						<th>Status</th>
						<th>Location</th>
						<th>Update Date</th>
						<th>Shipment Status</th>
					</thead>
				</table>
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
