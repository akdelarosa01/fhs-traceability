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
							<input type="text" class="form-control form-control-sm clear" id="inspector" name="nspector" placeholder="Inspector on duty" autocomplete="off" readonly>
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

		<div class="row mb-3">
			<div class="col-5">
				<table class="table table-sm table-hover" id="tbl_obas" style="width: 100%;">
					<thead>
						<th style="width: 10px;"></th>
						<th>Pallet for OBA: <span id="oba_count">0</span></th>
						<th>Status</th>
						<th>On Track</th>
					</thead>
				</table>
			</div>
			<div class="col-5">
				<table class="table table-sm table-hover" id="tbl_boxes" style="width: 100%;">
					<thead>
						<th style="width: 10px;"></th>
						<th>Box ID tested: <span id="box_tested">0</span> / <span id="box_tested_full">0</span></th>
						<th>Inspection Sheet QR</th>
						<th>Remarks</th>
					</thead>
				</table>
			</div>
			<div class="col-2">
				<table class="table table-sm table-hover" id="tbl_affected_serials" style="width: 100%">
					<thead>
						<th>Affected Serial No.: <span id="affected_serial_count">0</span></th>
					</thead>
				</table>
			</div>
		</div>
		
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/transactions/qa_inspection.js') }}" defer></script>
@endpush
