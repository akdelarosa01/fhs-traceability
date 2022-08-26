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
							<input type="hidden" class="clear" id="box_id" name="box_id"/>
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
							<input type="number" step="1" class="form-control form-control-sm clear" id="box_count_to_inspect" name="box_count_to_inspect" placeholder="Box Count to Inspect" autocomplete="off" readonly>
							<div id="box_count_to_inspect_feedback"></div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="col-4">
				<div class="row">
					<div class="col-12">
						<textarea name="inspqection_sheet_qr" class="form-control form-control-lg clear" id="inspqection_sheet_qr" rows="5" placeholder="Scan Inspection Sheet QR here..." style="resize:none;" readonly></textarea>
					</div>
				</div>
			</div>
			
			<div class="col-4">
				<div class="row mb-3">
					<div class="col-12">
						<input type="text" class="form-control form-control-lg clear read-only" id="scan_serial" name="scan_serial" placeholder="Scan Serial number here..." autocomplete="off" readonly>
						<div id="scan_serial_feedback"></div>
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
			<div class="col-3">
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
  
<div class="modal fade" id="modal_box_ng_reason" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h4 class="modal-title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<h3 class="text-center">Box No Good Reason</h3>
				<div class="row">
					<div class="col-md-12">
						<div class="form-group">
							<input type="hidden" name="box_ng_id" id="box_ng_id" />
							<input type="hidden" name="box_ng_qa_id" id="box_ng_qa_id" />
							<input type="hidden" name="box_row_index" id="box_row_index" />
							<select class="form-control form-control-sm" id="box_ng_reason" name="box_ng_reason"></select>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-center border-0">
				<button type="button" class="btn btn-primary" id="btn_save_box_ng_reason">
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
