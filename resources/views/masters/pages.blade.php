@push('styles')
	<link href="{{ asset('css/masters/page.css') }}" rel="stylesheet">
@endpush

@section('title')
Page Master
@endsection

@extends('layouts.app')

@section('content')

<div class="row mb-3 justify-content-center">
	<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-1">
		<button class="btn btn-sm btn-success btn-block read-only" id="btn_add_pages">
			<i class="fa fa-user-plus"></i> Add Page
		</button>
	</div>

	<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-1">
		<button class="btn btn-sm btn-danger btn-block read-only" id="btn_delete_pages">
			<i class="fa fa-user-times"></i> Delete Page
		</button>
	</div>
</div>

<div class="panel panel-inverse">

	<div class="panel-heading">
		<h4 class="panel-title">Pages</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">
		<div class="row">
			<div class="col-12">
				<table class="table table-sm table-striped table-hover table-bordered tbl-no-wrap" id="tbl_pages" style="width: 100%;">
					<thead>
						<th width="15px">
							<input type="checkbox" class="check_all_pages"/>
						</th>
						<th width="30px"></th>
						<th>Page Name</th>
						<th>Page Label</th>
						<th>URL</th>
						<th>Has Sub</th>
						<th>Parent Menu</th>
						<th>Parent Name</th>
						<th>Parent Order</th>
						<th>Order</th>
						<th>Icon</th>
						<th>Added By</th>
						<th>Update Date</th>
					</thead>
				</table>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modal_pages" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title" id="modal_form_title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>

			<form action="/masters/page/save-page" method="post" id="frm_pages">
				@csrf
				<input type="hidden" class="clear" id="id" name="id">
				<div class="modal-body">
					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Page Name</span>
						</div>
						<input type="text" class="form-control form-control-sm clear read-only" id="page_name" name="page_name" placeholder="Page Name" autocomplete="off">
						<div id="page_name_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Page Labels</span>
						</div>
						<input type="text" class="form-control form-control-sm clear read-only" id="page_label" name="page_label" placeholder="Page Labels" autocomplete="off">
						<div id="page_label_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">URL</span>
						</div>
						<input type="text" class="form-control form-control-sm clear read-only" id="url" name="url" placeholder="URL" autocomplete="off">
						<div id="url_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Parent Menu</span>
						</div>
						<input type="text" class="form-control form-control-sm clear read-only" id="parent_menu" name="parent_menu" placeholder="Parent Menu" autocomplete="off">
						<div id="parent_menu_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Parent Name</span>
						</div>
						<input type="text" class="form-control form-control-sm clear read-only" id="parent_name" name="parent_name" placeholder="Parent Name" autocomplete="off">
						<div id="parent_name_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Parent Order</span>
						</div>
						<input type="number" class="form-control form-control-sm clear read-only" id="parent_order" name="parent_order" placeholder="Parent Order" autocomplete="off">
						<div id="parent_order_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Order</span>
						</div>
						<input type="number" class="form-control form-control-sm clear read-only" id="order" name="order" placeholder="Order" autocomplete="off">
						<div id="order_feedback"></div>
					</div>
					
					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Icon</span>
						</div>
						<input type="text" class="form-control form-control-sm clear read-only" id="icon" name="icon" placeholder="Icon" autocomplete="off">
						<div id="icon_feedback"></div>
					</div>

					<div class="form-group row m-b-10">
						<div class="col-md-9">
							<div class="checkbox checkbox-css">
								<input type="checkbox" id="has_sub" name="has_sub" value="1"/>
								<label for="has_sub">Has Sub?</label>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer justify-content-between">
					<button type="button" class="btn btn-default" data-dismiss="modal">
						<i class="fa fa-times"></i> Close
					</button>
					<button type="submit" class="btn btn-primary read-only" id="btn_save_user">
						<i class="fa fa-save"></i> Save
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

@endsection

@push('scripts')
	<script src="{{ asset('js/masters/page.js') }}" defer></script>
@endpush
