@push('styles')
	<link href="{{ asset('css/masters/users.css') }}" rel="stylesheet">
@endpush

@section('title')
Users Master
@endsection

@extends('layouts.app')

@section('content')

<div class="content pt-3">
	<div class="container-fluid">
		<div class="row mb-3">
			<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-1">
				<button class="btn btn-sm btn-success btn-block" id="btn_add_users">
					<i class="fa fa-user-plus"></i> Add User
				</button>
			</div>

			<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-1">
				<button class="btn btn-sm btn-info btn-block">
					<i class="fa fa-user-pen"></i> Edit User
				</button>
			</div>

			<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-1">
				<button class="btn btn-sm btn-danger btn-block">
					<i class="fa fa-user-times"></i> Delete User
				</button>
			</div>

			<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-1">
				<button class="btn btn-sm btn-primary btn-block">
					<i class="fa fa-file-circle-plus"></i> Page Access
				</button>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<table class="table table-sm table-striped table-hover" id="tbl_users">
					<thead>
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
				<input type="hidden" class="clear" id="id">
				<div class="modal-body">
					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Username</span>
						</div>
						<input type="text" class="form-control form-control-sm clear" id="username" name="username" placeholder="Username" autocomplete="off">
						<span class="invalid-feedback" role="alert">
							<strong id="username_err"></strong>
						</span>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">First Name</span>
						</div>
						<input type="text" class="form-control form-control-sm clear" id="firstname" name="firstname" placeholder="First Name" autocomplete="off">
						<span class="invalid-feedback" role="alert">
							<strong id="firstname_err"></strong>
						</span>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Last Name</span>
						</div>
						<input type="text" class="form-control form-control-sm clear" id="lastname" name="lastname" placeholder="Last Name" autocomplete="off">
						<span class="invalid-feedback" role="alert">
							<strong id="lastname_err"></strong>
						</span>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Email Address</span>
						</div>
						<input type="email" class="form-control form-control-sm clear" id="email" name="email" placeholder="Email Address" autocomplete="off">
						<span class="invalid-feedback" role="alert">
							<strong id="email_err"></strong>
						</span>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Password</span>
						</div>
						<input type="password" class="form-control form-control-sm clear" id="password" name="password" placeholder="Password" autocomplete="off">
						<span class="invalid-feedback" role="alert">
							<strong id="password_err"></strong>
						</span>
					</div>

					<div class="input-group input-group-sm mb-2">
						<div class="input-group-prepend">
							<span class="input-group-text" style="min-width: 125px;">Confirm Password</span>
						</div>
						<input type="password" class="form-control form-control-sm clear" id="confirm_password" name="confirm_password" placeholder="Confirm Password" autocomplete="off">
					</div>
				</div>
				<div class="modal-footer justify-content-between">
					<button type="button" class="btn btn-default" data-dismiss="modal">
						<i class="fa fa-times"></i> Close
					</button>
					<button type="submit" class="btn btn-primary" id="btn_save_user">
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