@push('styles')
	<link href="{{ asset('css/masters/qa_disposition.css') }}" rel="stylesheet">
@endpush

@section('title')
Q.A. Disposition Master
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Q.A. Dispositions</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">
		<form action="/masters/qa-disposition/save-disposition" method="post" id="frm_dispositions">
			@csrf
			<input type="hidden" class="clear" id="id" name="id" value="">

			<div class="row mb-3 justify-content-center">
				<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-1">
					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text">Disposition</span>
						</div>
						<input type="text" class="form-control form-control-sm clear" id="disposition" name="disposition" placeholder="Disposition" autocomplete="off">
						<div id="disposition_feedback"></div>
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-1">
					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text">Color</span>
						</div>
						<input type="text" class="form-control form-control-sm clear" id="color_hex" name="color_hex" placeholder="Color" autocomplete="off">
						<span class="input-group-append">
							<span class="input-group-text colorpicker-input-addon"><i></i></span>
						  </span>
						<div id="color_hex_feedback"></div>
					</div>
				</div>
				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-xs-1">
					<button type="submit" class="btn btn-sm btn-success btn-block" id="btn_save_dispositions">
						<i class="fa fa-save"></i> Save Disposition
					</button>
				</div>
			
				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-xs-1">
					<button type="button" class="btn btn-sm btn-danger btn-block" id="btn_delete_dispositions">
						<i class="fa fa-user-times"></i> Delete Disposition
					</button>
				</div>
			</div>
		</form>
		

		<div class="row justify-content-center">
			<div class="col-xl-8 col-lg-8 col-md-10 col-sm-12 col-xs-12">
				<table class="table table-sm table-striped table-hover table-bordered" id="tbl_dispositions" style="width: 100%;">
					<thead>
						<tr>
							<th width="15px">
								<input type="checkbox" class="check_all_dispositions"/>
							</th>
							<th width="30px"></th>
							<th>Disposition</th>
							<th>Color</th>
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
	<script src="{{ asset('js/masters/qa_disposition.js') }}" defer></script>
@endpush
