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
		.remarks_input {
			border: none;
			border-radius: 0px;
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
							<input type="hidden" class="clear" id="pallet_id" name="pallet_id"/>
							<input type="hidden" class="clear" id="is_printed" name="is_printed"/>
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
						<table class="table table-sm table-hover" id="tbl_transactions" style="width: 100%">
							<thead>
								<th>Model Count: <span id="model_count">0</span></th>
								<th></th>
							</thead>
						</table>
					</div>
				</div>
			</div>

			<div class="col-5">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						<table class="table table-sm table-hover" id="tbl_pallets" style="width: 100%">
							<thead>
								<th style="width: 10px;"></th>
								<th>Pallet Count: <span id="pallet_count">0</span> / <span id="pallet_count_full">0</span></th>
								<th>Status</th>
								<th>On Track</th>
							</thead>
						</table>
					</div>
				</div>

				<div class="row">
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-blue" id="btn_transfer">
							<i class="fa fa-arrow-right"></i> Transfer To
						</button>
					</div>
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-purple" id="btn_update">
							<i class="fa fa-pen"></i> Update
						</button>
					</div>
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-red" id="btn_broken_pallet">
							<i class="fa fa-star-of-life"></i> Mark as Broken Pallet
						</button>
					</div>
				</div>
			</div>

			<div class="col-4">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						
						<table class="table table-sm table-hover" id="tbl_boxes" style="width: 100%">
							<thead>
								<th>Box Count: </th>
								<th><span id="box_count">0</span> / <span id="box_count_full">30</span></th>
								<th>Remarks</th>
							</thead>
						</table>
					</div>
				</div>

				<div class="row">
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-lime" id="btn_print_preview" disabled>
							<i class="fa fa-eye"></i> Print Preview
						</button>
					</div>
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-blue" id="btn_print_pallet" disabled>
							<i class="fa fa-print"></i> Print Label
						</button>
					</div>
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-aqua" id="btn_reprint_pallet" disabled>
							<i class="fa fa-print"></i> Re-print Label
						</button>
					</div>
				</div>
			</div>
		</div>
		
	</div>
</div>

<div class="modal fade" id="modal_print_preview" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog ">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title" id="modal_form_title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<h3 class="text-center" id="prv_label_title"></h3>
				<div class="row">
					<div class="col-md-8">
						<div id="prv_box_id_qr"></div>
					</div>
					<div class="col-md-4">
						<div class="row">
							<div class="col-md-12">
								<p>Model: <span id="prv_model"></span></p>
								<p>Print Date: <span id="prv_date"></span></p>
								<p>Lot Number: </p>
								<ul>
									<li>Lot Number 1</li>
									<li>Lot Number 2</li>
									<li>Lot Number 3</li>
								</ul>
								<p>Box Qty: <span id="prv_box_count"></span> pcs</p>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div id="prv_pallet_id_qr"></div>
								<p id="prv_pallet_id_val"></p>
							</div>
						</div>
						
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-between">
				<button type="button" class="btn btn-default" data-dismiss="modal">
					<i class="fa fa-times"></i> Close
				</button>
				<button type="button" class="btn btn-primary" id="btn_preview_print">
					<i class="fa fa-print"></i> Print
				</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modal_broken_pallet" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog ">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title" id="modal_form_title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="row auth">
					<div class="col-12">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">User Name</span>
							</div>
							<input type="text" class="form-control form-control-sm clear" id="username" name="username" placeholder="User Name" autocomplete="off">
							<div id="username_feedback"></div>
						</div>
					</div>
				</div>

				<div class="row auth">
					<div class="col-12">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Password</span>
							</div>
							<input type="password" class="form-control form-control-sm clear" id="password" name="password" placeholder="Password" autocomplete="off">
							<div id="password_feedback"></div>
						</div>
					</div>
				</div>

				<div class="row auth">
					<div class="offset-sm-8 col-sm-4 col-xs-12">
						<button type="button" class="btn btn-sm btn-primary btn-block" id="btn_auth">
							<i class="fa fa-unlock"></i> Authenticate
						</button>
					</div>
				</div>

				<hr class="auth"/>

				{{-- <form action="/transactions/box-and-pallet/set-new-box-count" id="frm_new_box_count">
					@csrf --}}
					<div class="row">
						<div class="col-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">New Box Count</span>
								</div>
								<input type="hidden" class="form-control form-control-sm clear" id="broken_pallet_id" name="broken_pallet_id">
								<input type="number" class="form-control form-control-sm clear" id="new_box_count" name="new_box_count" placeholder="New Box Count" autocomplete="off">
								<div id="new_box_count_feedback"></div>
							</div>
						</div>
					</div>
	
					<div class="row">
						<div class="offset-sm-7 col-sm-5 col-xs-12">
							<button type="button" class="btn btn-sm btn-primary btn-block" id="btn_set_new_box_count">
								<i class="fa fa-edit"></i> Set new box count
							</button>
						</div>
					</div>
				{{-- </form> --}}

			</div>
		</div>
	</div>
</div>

@endsection

@push('scripts')
	<script src="{{ asset('js/transactions/box_and_pallet_application.js') }}" defer></script>
@endpush
