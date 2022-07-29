@push('styles')
	<link href="{{ asset('css/transactions/qa_inspection.css') }}" rel="stylesheet">
	<style>
		.check_box {
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
							<input type="text" class="form-control form-control-sm clear" id="inspector" name="inspector" placeholder="" value="Inspector" autocomplete="off">
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
							<input type="number" step="1" class="form-control form-control-sm clear" id="box_count_to_inspect" name="box_count_to_inspect" placeholder="Box Count to Inspect" autocomplete="off" readonly>
							<div id="box_count_to_inspect_feedback"></div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="col-4">
				<div class="row">
					<div class="col-12">
						<textarea name="inspqection_sheet_qr" class="form-control form-control-sm clear" id="inspqection_sheet_qr" rows="8" placeholder="Scan Inspection Sheet QR here..." style="resize:none;" readonly></textarea>
					</div>
				</div>
			</div>
			<div class="col-4 align-self-end">
				<div class="row">
					<div class="col-12">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Scan Serial Here:</span>
							</div>
							<input type="text" class="form-control form-control-sm clear read-only" id="scan_serial" name="scan_serial" placeholder="Scan Serial number here..." autocomplete="off" readonly>
							<div id="scan_serial_feedback"></div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-3 col-sm-3 col-xs-6 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-green align-middle read-only" id="btn_good" >
							<i class="fa fa-thumbs-up"></i> Good
						</button>
					</div>
					<div class="col-md-3 col-sm-3 col-xs-6 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-red read-only" id="btn_notgood"  data-toggle="modal" data-target="#modal_not_good" >
							<i class="fa fa-thumbs-down"></i> NG
						</button>
					</div>

				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-5">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						<table class="table table-sm table-hover" id="tbl_obas" style="width: 100%;">
							<thead>
								<th style="width: 10px;"></th>
								<th>Pallet for OBA: <span id="oba_count">0</span></th>
								<th>On Track</th>
								<th>Status</th>
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
						<button type="button" class="btn btn-sm btn-block btn-red read-only" id="btn_disposition" data-toggle="modal" data-target="#modal_disposition" disabled>
							<i class="fa fa-plus"></i> Pallet Disposition
						</button>
					</div>
				</div>
			</div>
			<div class="col-5">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						<table class="table table-sm table-hover" id="tbl_boxes" style="width: 100%;">
							<thead>
								<th style="width: 10px;"></th>
								<th>Box ID tested: <span id="box_tested">0</span> / <span id="box_tested_full">0</span></th>
								<th>Inspection Sheet QR</th>
								<th>Remarks</th>
							</thead>
						</table>
					</div>
				</div>
			</div>
			<div class="col-2">
				<div class="row mb-2">
					<div class="col-12" style="height: 48vh; max-height: 48vh; border: 1px solid #a7b6c1">
						<table class="table table-sm table-hover" id="tbl_affected_serials" style="width: 100%">
							<thead>
								<th>Affected Serial No.: <span id="affected_serial_count">0</span></th>
							</thead>
						</table>
					</div>			
				</div>
				<div class="row">
					<div class="col-md-6 col-sm-6 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-purple read-only" id="update_serial" disabled>
							<i class="fa fa-pen"></i> Update
						</button>
					</div>
					<div class="col-md-6 col-sm-6 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-blue read-only" id="delete_serial" disabled>
							<i class="fa fa-trash"></i> Delete
						</button>
					</div>
				</div>
			</div>
		</div>
		
	</div>
</div>


  
<div class="modal fade" id="modal_not_good" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-dialog-centered ">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h4 class="modal-title" id="modal_form_title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<h3 class="text-center" id="prv_label_title">Box No Good Reason</h3>
				<div class="row">
					
					<div class="col-md-12">
						<div class="form-group row justify-content-center pt-2">
							<select class="form-control col-sm-8" id="gender" >
								<option class="fw-normal fs-3" selected hidden>Please Select Reason Here</option>
								<option class="fw-light fs-3">Reason 1</option>
								<option class="fw-light fs-3">Reason 2</option>
								<option class="fw-light fs-3">Reason 3</option>
								<option class="fw-light fs-3">Reason 4</option>
								<option >Reason 5</option>
							</select>
						</div>
						
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-center border-0">
				<button type="button" class="btn btn-primary" id="btn_save">
					<i class="fa fa-arrow-down-to-arc"></i>Save
				</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modal_disposition" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-dialog-centered ">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h4 class="modal-title" id="modal_form_title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<h3 class="text-center" id="prv_label_title">Pallet Disposition</h3>
				<div class="row">
					
					<div class="col-md-12">
						<div class="form-group row justify-content-center pt-2">
							<select class="form-control col-sm-8" id="ng_reason" >
								<option class="fw-normal fs-3" selected hidden><h4>Please Select Disposition Here </h4></option>
								<option class="fw-light fs-3"> <h4>Good</h4> </option>
								<option class="fw-light fs-3"><h4>For Rework</h4></option>
								<option class="fw-light fs-3"><h4>Hold Pallet</h4></option>
								<option class="fw-light fs-3"><h4>Hold Lot</h4></option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-center border-0">
				<button type="button" class="btn btn-primary" id="btn_save">
					<i class="fa fa-arrow-down-to-arc"></i>Save
				</button>
			</div>
		</div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/transactions/qa_inspection.js') }}" defer></script>
@endpush
