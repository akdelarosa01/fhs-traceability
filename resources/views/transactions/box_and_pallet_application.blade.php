@push('styles')
	<link href="{{ asset('css/transactions/box_and_pallet_application.css') }}" rel="stylesheet">
	<style>
		.check_pallet {
			width: 20px;
			height: 20px;
		}
		.disabled {
			pointer-events: none;
		}
	</style>
@endpush

@section('title')
Box and Pallet Application
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Box and Pallet Application</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">

		<div class="row mb-2">
			<div class="col-4">
				<form action="/transactions/box-and-pallet/proceed" method="post" id="frm_transactions">
					@csrf
					<input type="hidden" class="clear" id="id" name="id" value="">
					<input type="hidden" class="clear" id="model" name="model" value="">

					<div class="row">
						<div class="col-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Model</span>
								</div>
								<select name="model_id" id="model_id" class="form-control clear-select"></select>
								<div id="model_id_feedback"></div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Target No. of Pallets</span>
								</div>
								<input type="number" class="form-control form-control-sm clear" id="target_no_of_pallet" name="target_no_of_pallet" placeholder="Target No. of Pallets" autocomplete="off">
								<div id="target_no_of_pallet_feedback"></div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Present Date & Time</span>
								</div>
								<input type="text" class="form-control form-control-sm" id="present_date_time" name="present_date_time" autocomplete="off" readonly>
								<div id="present_date_time_feedback"></div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12">
							<button type="button" class="btn btn-sm btn-primary btn-block" id="btn_add_new">
								<i class="fa fa-plus"></i> Add New
							</button>
						</div>

						<div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12">
							<button type="submit" class="btn btn-sm btn-danger btn-block" id="btn_cancel">
								<i class="fa fa-times"></i> Cancel
							</button>
						</div>
					
						<div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12">
							<button type="submit" class="btn btn-sm btn-success btn-block" id="btn_proceed">
								<i class="fa fa-check"></i> Proceed
							</button>
						</div>
					</div>
				</form>
			</div>

			<div class="col-8">
				<div class="row">
					<div class="col-12">
						<div class="input-group input-group-lg mb-2">
							<div class="input-group-prepend">
								<button class="btn btn-success" type="button" id="btn_start_scan">Start Scan</button>
							</div>
							<input type="hidden" class="" id="trans_id" name="trans_id"/>
							<input type="text" class="form-control form-control-lg" placeholder="Scan Box QR" aria-describedby="btn_start_scan" id="box_qr" name="box_qr" autocomplete="off" readonly>
							<div id="box_qr_feedback"></div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-6">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Running Model</span>
							</div>
							<input type="hidden" class="" id="selected_model_id" name="selected_model_id"/>
							<input type="text" class="form-control form-control-sm clear" id="running_model" name="running_model" autocomplete="off" readonly>
						</div>
					</div>

					<div class="col-6">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Target Pallet Count</span>
							</div>
							<input type="number" class="form-control form-control-sm clear" id="target_pallet" name="target_pallet" autocomplete="off" readonly>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-6">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Pallet QR</span>
							</div>
							<input type="hidden" class="" id="pallet_id" name="pallet_id"/>
							<input type="text" class="form-control form-control-sm clear" id="pallet_id_qr" name="pallet_id_qr" autocomplete="off" readonly>
						</div>
					</div>

					<div class="col-6">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Box per Pallet</span>
							</div>
							<input type="number" class="form-control form-control-sm clear" id="box_per_pallet" name="box_per_pallet" autocomplete="off" readonly>
						</div>
					</div>
				</div>
			</div>
			
		</div>

		<div class="row">
			<div class="col-4">
				<table class="table table-sm table-hover" id="tbl_transactions" style="width: 100%">
					<thead>
						<th>Model Count: <span id="model_count">0</span></th>
						<th></th>
					</thead>
				</table>
			</div>

			<div class="col-5">
				<table class="table table-sm table-hover" id="tbl_pallets" style="width: 100%">
					<thead>
						<th style="width: 10px;"></th>
						<th>Pallet Count: <span id="pallet_count">0</span> / <span id="pallet_count_full">0</span></th>
						<th>Status</th>
						<th>On Track</th>
					</thead>
				</table>
			</div>

			<div class="col-3">
				<table class="table table-sm table-hover" id="tbl_boxes" style="width: 100%">
					<thead>
						<th>Box Count: <span id="box_count">0</span> / <span id="box_count_full">30</span></th>
					</thead>
				</table>
			</div>
		</div>
		
	</div>
</div>

@endsection

@push('scripts')
	<script src="{{ asset('js/transactions/box_and_pallet_application.js') }}" defer></script>
@endpush
