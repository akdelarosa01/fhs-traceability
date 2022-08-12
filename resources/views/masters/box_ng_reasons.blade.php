@push('styles')
	<link href="{{ asset('css/masters/box_ng_reasons.css') }}" rel="stylesheet">
@endpush

@section('title')
Box N.G. Reasons Master
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Box N.G. Reasons</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">
		

		<div class="row mb-3">
			<div class="col-4">
				<form action="/masters/box-ng-reasons/save-reason" method="post" id="frm_reasons">
					@csrf
					<input type="hidden" class="clear" id="id" name="id" value="">

					<div class="row mb-2">
						<div class="col-12">
							<textarea name="reason" id="reason" rows="5" class="form-control form-control-sm clear read-only" placeholder="Reason..." style="resize:none;"></textarea>
							<div id="reason_feedback"></div>
						</div>
					</div>

					<div class="row">
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
							<button type="submit" class="btn btn-sm btn-success btn-block read-only" id="btn_save_reasons">
								<i class="fa fa-save"></i> Save Reason
							</button>
						</div>
					
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
							<button type="button" class="btn btn-sm btn-danger btn-block read-only" id="btn_delete_reasons">
								<i class="fa fa-user-times"></i> Delete Reason
							</button>
						</div>
					</div>
				</form>
			</div>
			
			<div class="col-8">
				<table class="table table-sm table-striped table-hover table-bordered" id="tbl_reasons" style="width: 100%;">
					<thead>
						<tr>
							<th width="15px">
								<input type="checkbox" class="check_all_reasons"/>
							</th>
							<th width="30px"></th>
							<th>Reasons</th>
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
	<script src="{{ asset('js/masters/box_ng_reasons.js') }}" defer></script>
@endpush
