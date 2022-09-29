@push('styles')
	<link href="{{ asset('css/transactions/qa_inspection.css') }}" rel="stylesheet">
	<style>
		.check_box, .check_pallet {
			width: 20px;
			height: 20px;
		}
		.btn_notmatch {
			display: none;
			border: none;
			width: 7vw;
		}
		.btn_match {
			display: none;
			border: none;
			width: 7vw;
		}
		.disabled {
			pointer-events: none;
		}
		.remarks_input {
			border: none;
			border-radius: 0px;
		}
		.tooltip-inner {
			width: 200px;
			height: 50px; 
			padding:4px;
		}
	</style>
@endpush

@section('title')
Q.A. Inspection
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Q.A. Inspection</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">
		
		<div class="row mb-3">
			<div class="col-4">
				<input type="hidden" class="clear" id="id" name="id" value="">

				<div class="row">
					<div class="col-12">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Inspector</span>
							</div>
							<input type="hidden" class="clear" id="box_qr" name="box_qr"/>
							<input type="hidden" class="clear" id="pallet_id" name="pallet_id"/>
							<input type="hidden" class="clear" id="pallet_row_index" name="pallet_row_index"/>
							{{-- <input type="hidden" class="clear" id="box_id" name="box_id"/> --}}
							<input type="hidden" class="clear" id="inspection_sheet_count" name="inspection_sheet_count" value="0">
							<input type="hidden" class="clear" id="hs_count_per_box" name="hs_count_per_box" value="0">
							<input type="text" class="form-control form-control-sm clear" id="inspector" name="inspector" placeholder="" value="{{Auth::user()->firstname
							.' '.Auth::user()->lastname}}" autocomplete="off">
							<div id="inspector_feedback"></div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-12">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Date & Time</span>
							</div>
							<input type="text" class="form-control form-control-sm clear" id="date_and_time" name="date_and_time" placeholder="Date & Time" autocomplete="off" readonly>
							<div id="date_and_time_feedback"></div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-12">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Box to Inspect</span>
							</div>
							<input type="number" step="1" class="form-control form-control-sm clear" id="box_count_to_inspect" name="box_count_to_inspect" placeholder="Box Count to Inspect" autocomplete="off">
							<div class="input-group-append">
								<button type="button" class="btn btn-sm btn-blue btn-block" id="btn_set_new_box_count_to_inspect">Set New Box Count to Inspect</button>
							</div>
							<div id="box_count_to_inspect_feedback"></div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-12">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Shift</span>
							</div>
							<select class="form-control form-control-sm select-clear" name="shift" id="shift">
								<option value="@if(Session::has('shift')){{Session::get('shift')}}@endif">
									<?php
										if (Session::has('shift')) {
											switch (Session::get('shift')) {
												case 'DS':
													echo 'Day Shift';
													break;
												
												default:
													echo 'Night Shift';
													break;
											}
										}

									?>
								</option>
								<option value="DS">Day Shift</option>
								<option value="NS">Night Shift</option>
							</select>
							<div class="input-group-append">
								<button type="button" class="btn btn-sm btn-blue btn-block" id="btn_set_shift">Set Shift</button>
							</div>
							<div id="shift_feedback"></div>
						</div>
					</div>
				</div>

			</div>

			<div class="col-4">
				<button class="btn btn-sm btn-block btn-green" id="btn_box_inspection" style="height: 68px">Box Inspection</button>
			</div>
		</div>
		
		<div class="row">
			<div class="col-4">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						<table class="table table-sm table-hover" id="tbl_obas" style="width: 100%;">
							<thead>
								<th style="width: 10px;"></th>
								<th>Pallet for OBA: <span id="oba_count">0</span></th>
								<th>Status</th>
								<th>On Track</th>
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
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-red read-only" id="btn_disposition" disabled>
							<i class="fa fa-plus"></i> Pallet Disposition
						</button>
					</div>
				</div>
			</div>
			<div class="col-4">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						<table class="table table-sm table-hover" id="tbl_boxes" style="width: 100%;">
							<thead>
								<th style="width: 10px;"></th>
								<th>Box ID tested: <span id="box_tested">0</span> / <span id="box_tested_full">0</span></th>
								<th>QA Remarks</th>
								<th>Prod. Remarks</th>
							</thead>
						</table>
					</div>
				</div>
			</div>
			<div class="col-4">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						<table class="table table-sm table-hover" id="tbl_affected_serials" style="width: 100%">
							<thead>
								<th>Affected Serial No.</th>
								<th></th>
							</thead>
						</table>
					</div>
				</div>
				<div class="row">
					{{-- <div class="col-md-6 col-sm-6 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-purple read-only" id="update_serial" disabled>
							<i class="fa fa-pen"></i> Update
						</button>
					</div> --}}
					{{-- <div class="col-md-6 col-sm-6 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-blue read-only" id="delete_serial" disabled>
							<i class="fa fa-trash"></i> Delete
						</button>
					</div> --}}
				</div>
			</div>
		</div>
		
	</div>
</div>

<div class="modal fade" id="modal_box_inspection" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog mdl-full">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h4 class="modal-title">Box Inspection</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-4">
						<div class="row">
							<div class="col-12">
								<table class="table table-bordered table-light table-striped" style="width: 100%">
									<tbody>
										<tr>
											<th class="p-5">OBA Process Date:</th>
											<td class="p-5"><input type="text" readonly class="form-control-plaintext" id="b_oba_process_date" /></td>
										</tr>
			
										<tr>
											<th class="p-5">Box ID:</th>
											<td class="p-5"><input type="text" readonly class="form-control-plaintext" id="b_box_id" /></td>
										</tr>
			
										<tr>
											<th class="p-5">Date Manufactured:</th>
											<td class="p-5"><input type="text" readonly class="form-control-plaintext" id="b_date_manufactured" /></td>
										</tr>
			
										<tr>
											<th class="p-5">Date Expired:</th>
											<td class="p-5"><input type="text" readonly class="form-control-plaintext" id="b_date_expired" /></td>
										</tr>
			
										<tr>
											<th class="p-5">Customer P/N:</th>
											<td class="p-5"><input type="text" readonly class="form-control-plaintext" id="b_customer_part_no" /></td>
										</tr>
			
										<tr>
											<th class="p-5">Lot Number:</th>
											<td class="p-5"><input type="text" readonly class="form-control-plaintext" id="b_lot_no" /></td>
										</tr>
			
										<tr>
											<th class="p-5">Production Line No.:</th>
											<td class="p-5"><input type="text" readonly class="form-control-plaintext" id="b_prod_line_no" /></td>
										</tr>
		
										<tr>
											<th class="p-5">Carton Label No.:</th>
											<td class="p-5"><input type="text" readonly class="form-control-plaintext" id="b_carton_label_no" /></td>
										</tr>
		
										<tr>
											<th class="p-5">Qty per Box:</th>
											<td class="p-5"><input type="text" readonly class="form-control-plaintext" id="b_qty_per_box" /></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<div class="row">
							<div class="col-12">
								<table class="table table-bordered table-light table-striped" style="width: 100%" id="tbl_hs_history">
									<thead>
										<tr>
											<th colspan="2" class="justify-content-center">Heat Sink History</th>
										</tr>
										<tr>
											<th class="justify-content-center">Old Serial No.</th>
											<th class="justify-content-center">New Seial No.</th>
										</tr>
									</thead>
								</table>
							</div>
						</div>
						
					</div>

					<div class="col-8">

						<div class="row mb-2">
							<div class="col-6">
								<div class="row">
									<div class="col-sm-12">
										<h5 for="b_qr_inspection_sheet">Scan QR Inspection Sheet: </h5>
										<textarea name="b_qr_inspection_sheet" id="b_qr_inspection_sheet" rows="4" class="form-control fomr-control-sm" style="resize:none"></textarea>
									</div>
								</div>
							</div>
		
							<div class="col-6">
								<div class="row mb-2">
									<div class="col-sm-12">
										<h5 for="b_oba_serial_no">Scan OBA Serial No.: </h5>
										<input type="text" name="b_oba_serial_no" id="b_oba_serial_no" rows="6" class="form-control fomr-control-sm" />
										<div id="hs_serial_feedback"></div>
									</div>
								</div>
								<div class="row">
									<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-6 mb-2">
										<button type="button" class="btn btn-lg btn-block btn-green align-middle read-only" id="btn_good" >
											<i class="fa fa-thumbs-up"></i> Good
										</button>
									</div>
									<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-6 mb-2">
										<button type="button" class="btn btn-lg btn-block btn-red read-only" id="btn_notgood"  data-toggle="modal" data-target="#modal_not_good" >
											<i class="fa fa-thumbs-down"></i> NG
										</button>
									</div>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-5" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
								<table class="table table-sm table-hover" id="tbl_inpection_sheet_serial" style="width: 100%">
									<thead>
										<th>QR Inspection Sheet S/N <span id="box_judgment" class="pull-right"></span></th>
									</thead>
								</table>
							</div>

							<div class="col-7" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
								<table class="table table-sm table-hover" id="tbl_hs_serials_oba" style="width: 100%">
									<thead>
										<th></th>
										<th>Serial Number <span id="hs_scanned_count">0</span> / <span id="hs_total_count">0</span></th>
										<th>QA Judgment</th>
									</thead>
								</table>
							</div>
						</div>
						
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
  
<div class="modal fade" id="modal_hs_ng_reason" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h4 class="modal-title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<h3 class="text-center">Heat Sink No Good Reason</h3>
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<input type="hidden" name="hs_ng_id" id="hs_ng_id" />
							<input type="hidden" name="hs_ng_box_id" id="hs_ng_box_id" />
							<input type="hidden" name="hs_row_index" id="hs_row_index" />
							<select class="form-control form-control-sm" id="hs_ng_reason" name="hs_ng_reason"></select>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-center border-0">
				<button type="button" class="btn btn-primary" id="btn_save_hs_ng_reason">
					<i class="fa fa-save"></i> Save
				</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modal_disposition" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h4 class="modal-title" id="modal_form_title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<h3 class="text-center">Pallet Disposition</h3>
				<div class="row">
					<div class="col-md-12">
						<div class="form-group justify-content-center pt-2">
							<select class="form-control" id="pallet_disposition"></select>
						</div>
					</div>
				</div>


				<div id="div_disposition_reason">
					<h3 class="text-center">Reason</h3>
					<div class="row">
						<div class="col-md-12">
							<div class="form-group justify-content-center">
								<select class="form-control" id="disposition_reason"></select>
							</div>
						</div>
					</div>
				</div>
				.
				<div id="div_hold_lot">
					<h3 class="text-center">Lot Number to hold</h3>
					<div class="row">
						<div class="col-md-12">
							<div class="form-group justify-content-center">
								<select class="form-control" id="lot_no" multiple="multiple"></select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-center border-0">
				<button type="button" class="btn btn-primary" id="btn_save_disposition">
					<i class="fa fa-arrow-down-to-arc"></i>Save
				</button>
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
					<div class="col-md-6">
						<button type="button" id="btn_transfer_production" class="btn btn-sm btn-block btn-flat btn-primary">PRODUCTION</button>
					</div>

					<div class="col-md-6">
						<button type="button" id="btn_transfer_warehouse" class="btn btn-sm btn-block btn-flat btn-info">WAREHOUSE</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>



@endsection

@push('scripts')
	<script src="{{ asset('js/transactions/qa_inspection.js') }}" defer></script>
@endpush
