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
			<div class="col-4">
			</div>
			<div class="col-4">
			</div>
			<div class="col-4">
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
