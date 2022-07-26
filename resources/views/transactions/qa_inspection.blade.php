@push('styles')
	<link href="{{ asset('css/transactions/qa_inspection.css') }}" rel="stylesheet">
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

				<div class="row">
					<div class="col-12">
						<div class="input-group input-group-sm mb-2">
							<div class="input-group-prepend">
								<span class="input-group-text">Scan Serial Here:</span>
							</div>
							<input type="text" class="form-control form-control-sm clear" id="scan_serial" name="scan_serial" placeholder="Scan Serial number here..." autocomplete="off" readonly>
							<div id="scan_serial_feedback"></div>
						</div>
					</div>
				</div>

				{{-- <div class="row">
					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<button type="submit" class="btn btn-sm btn-success btn-block" id="btn_save_obas">
							<i class="fa fa-save"></i> Save Model
						</button>
					</div>
				
					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<button type="button" class="btn btn-sm btn-danger btn-block" id="btn_delete_obas">
							<i class="fa fa-user-times"></i> Delete Model
						</button>
					</div>
				</div> --}}
			</div>
			
			<div class="col-4">
				<div class="row">
					<div class="col-12">
						<textarea name="inspqection_sheet_qr" class="form-control form-control-sm clear" id="inspqection_sheet_qr" rows="8" placeholder="Scan Inspection Sheet QR here..." style="resize:none;" readonly></textarea>
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
						<button type="button" class="btn btn-sm btn-block btn-blue align-middle" id="btn_transfer">
							<i class="fa fa-arrow-right"></i> Transfer To
						</button>
					</div>
					<div class="col-md-4 col-sm-4 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-red" id="btn_disposition">
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
						<button type="button" class="btn btn-sm btn-block btn-purple" id="update_serial">
							<i class="fa fa-pen"></i> Update
						</button>
					</div>
					<div class="col-md-6 col-sm-6 col-xs-12 mb-2">
						<button type="button" class="btn btn-sm btn-block btn-blue" id="delete_serial">
							<i class="fa fa-trash"></i> Delete
						</button>
					</div>
				</div>
			</div>
		</div>
		
	</div>
</div>



<div class="modal fade" id="btn_disposition" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
								<p id="prv_lot_no"></p>
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
@endsection

@push('scripts')
	<script src="{{ asset('js/transactions/qa_inspection.js') }}" defer></script>
@endpush
