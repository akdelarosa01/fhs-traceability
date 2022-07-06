@push('styles')
	<link href="{{ asset('css/masters/box_pallet_model_matrix.css') }}" rel="stylesheet">
@endpush

@section('title')
Box Pallet Model Matrix
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Box Pallet Model Matrix</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">
		

		<div class="row mb-3">
			<div class="col-4">
				<form action="/masters/model-matrix/save-model" method="post" id="frm_models">
					@csrf
					<input type="hidden" class="clear" id="id" name="id" value="">

					<div class="row">
						<div class="col-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Model</span>
								</div>
								<input type="text" class="form-control form-control-sm clear" id="model" name="model" placeholder="Model" autocomplete="off">
								<div id="model_feedback"></div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Model Name</span>
								</div>
								<input type="text" class="form-control form-control-sm clear" id="model_name" name="model_name" placeholder="Model Name" autocomplete="off">
								<div id="model_name_feedback"></div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Box per Pallet</span>
								</div>
								<input type="number" step="1" class="form-control form-control-sm clear" id="box_count_per_pallet" name="box_count_per_pallet" placeholder="Box Count per Pallet" autocomplete="off">
								<div id="box_count_per_pallet_feedback"></div>
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
								<div id="box_count_to_inspect_feedback"></div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
							<button type="submit" class="btn btn-sm btn-success btn-block" id="btn_save_models">
								<i class="fa fa-save"></i> Save Model
							</button>
						</div>
					
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
							<button type="button" class="btn btn-sm btn-danger btn-block" id="btn_delete_models">
								<i class="fa fa-user-times"></i> Delete Model
							</button>
						</div>
					</div>
				</form>
			</div>
			
			<div class="col-8">
				<table class="table table-sm table-striped table-hover table-bordered" id="tbl_models" style="width: 100%;">
					<thead>
						<tr>
							<th width="15px">
								<input type="checkbox" class="check_all_models"/>
							</th>
							<th width="30px"></th>
							<th>Model</th>
							<th>Model Name</th>
							<th>Box count per Pallet</th>
							<th>Box count to Inspect</th>
							<th>Added By</th>
							<th>Update Date</th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
		
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/masters/box_pallet_model_matrix.js') }}" defer></script>
@endpush
