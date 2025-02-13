@push('styles')
	<link href="{{ asset('css/masters/users.css') }}" rel="stylesheet">
@endpush

@section('title')
Users Master
@endsection

@extends('layouts.app')

@section('content')

<div class="row mb-1 justify-content-center">
	<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12 mb-2">
		<button class="btn btn-sm btn-success btn-block read-only" id="btn_add_users">
			<i class="fa fa-user-plus"></i> Add User
		</button>
	</div>

	<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12 mb-2">
		<button class="btn btn-sm btn-danger btn-block read-only" id="btn_delete_users">
			<i class="fa fa-user-times"></i> Delete User
		</button>
	</div>

	<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12 mb-2">
		<button class="btn btn-sm btn-primary btn-block" id="btn_user_access">
			<i class="fa fa-file-circle-plus"></i> Page Access
		</button>
	</div>
</div>

<div class="panel panel-inverse">

	<div class="panel-heading">
		<h4 class="panel-title">Users</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">
		<div class="row">
			<div class="col-12">
				<table class="table table-sm table-striped table-hover table-bordered" id="tbl_users" style="width: 100%;">
					<thead>
						<th width="15px">
							<input type="checkbox" class="check_all_users"/>
						</th>
						<th width="30px"></th>
						<th>Username</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
						<th>Added By</th>
						<th>Update Date</th>
					</thead>
				</table>
			</div>
		</div>
	</div>
</div>




<div class="modal fade" id="modal_users" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title" id="modal_form_title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>

			<form action="/masters/users/save-user" method="post" id="frm_users">
				@csrf
				<input type="hidden" class="clear" id="id" name="id" value="">
				<div class="modal-body">
					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Username</span>
						</div>
						<input type="text" class="form-control form-control-sm clear read-only" id="username" name="username" placeholder="Username" autocomplete="off">
						<div id="username_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">First Name</span>
						</div>
						<input type="text" class="form-control form-control-sm clear read-only" id="firstname" name="firstname" placeholder="First Name" autocomplete="off">
						<div id="firstname_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Last Name</span>
						</div>
						<input type="text" class="form-control form-control-sm clear read-only" id="lastname" name="lastname" placeholder="Last Name" autocomplete="off">
						<div id="lastname_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Email Address</span>
						</div>
						<input type="email" class="form-control form-control-sm clear read-only" id="email" name="email" placeholder="Email Address" autocomplete="off">
						<div id="email_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Password</span>
						</div>
						<input type="password" class="form-control form-control-sm clear read-only" id="password" name="password" placeholder="Password" autocomplete="off">
						<div id="password_feedback"></div>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Confirm Password</span>
						</div>
						<input type="password" class="form-control form-control-sm clear read-only" id="password_confirmation" name="password_confirmation" placeholder="Confirm Password" autocomplete="off">
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

<div class="modal fade" id="modal_user_access" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Access</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>

			<form action="" method="post" id="frm_access">
				@csrf
				<input type="hidden" class="clear" id="user_id" name="user_id" value="">
				<div class="modal-body">
					<div class="table-responsive">
						<table class="table table-sm table-striped table-hover table-bordered" id="tbl_pages">
							<thead>
								<th colspan="2">Module Name</th>
								<th class="text-center">Authorize</th>
								<th class="text-center">Read Only</th>
								<th class="text-center">Read & Write</th>
								<th class="text-center">Delete</th>
							</thead>
							<tbody></tbody>
						</table>
					</div>
					
				</div>
				<div class="modal-footer justify-content-between">
					<button type="button" class="btn btn-default" data-dismiss="modal">
						<i class="fa fa-times"></i> Close
					</button>
					<button type="button" class="btn btn-primary read-only" id="btn_save_user_access">
						<i class="fa fa-save"></i> Save
					</button>
				</div>
			</form>
		</div>
	</div>
</div>



@endsection

@push('scripts')
	<script src="{{ asset('js/masters/users.js') }}" defer></script>
@endpush


{{-- <form>
	<div class="card-body">
		<div class="form-group">
			<label for="exampleInputEmail1">Email address</label>
			<input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
		</div>
		<div class="form-group">
			<label for="exampleInputPassword1">Password</label>
			<input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
		</div>
		<div class="form-group">
			<label for="exampleInputFile">File input</label>
			<div class="input-group">
				<div class="custom-file">
					<input type="file" class="custom-file-input" id="exampleInputFile">
					<label class="custom-file-label" for="exampleInputFile">Choose file</label>
				</div>
				<div class="input-group-append">
					<span class="input-group-text">Upload</span>
				</div>
			</div>
		</div>
		<div class="form-check">
			<input type="checkbox" class="form-check-input" id="exampleCheck1">
			<label class="form-check-label" for="exampleCheck1">Check me out</label>
		</div>
	</div>
	<!-- /.card-body -->

	<div class="card-footer">
		<button type="submit" class="btn btn-primary">Submit</button>
	</div>
</form> --}}