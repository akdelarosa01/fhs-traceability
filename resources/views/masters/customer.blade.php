@push('styles')
	<link href="{{ asset('css/masters/customer.css') }}" rel="stylesheet">
@endpush

@section('title')
Customer Master
@endsection

@extends('layouts.app')

@section('content')

<div class="row mb-3 justify-content-center">
	<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-1">
		<button class="btn btn-sm btn-success btn-block read-only" id="btn_add_customers">
			<i class="fa fa-user-plus"></i> Add Customer
		</button>
	</div>

	<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-1">
		<button class="btn btn-sm btn-danger btn-block read-only" id="btn_delete_customers">
			<i class="fa fa-user-times"></i> Delete Customer
		</button>
	</div>
</div>

<div class="panel panel-inverse">

	<div class="panel-heading">
		<h4 class="panel-title">Customers</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">
		<div class="row">
			<div class="col-12">
				<table class="table table-sm table-striped table-hover table-bordered" id="tbl_customers" style="width: 100%;">
					<thead>
						<tr>
							<th width="15px" rowspan="2">
								<input type="checkbox" class="check_all_customers"/>
							</th>
							<th width="30px" rowspan="2"></th>
							<th rowspan="2">Customer Name</th>
							<th rowspan="2">Address</th>
							<th colspan="4">Contact #1</th>
							<th colspan="4">Contact #2</th>
							<th rowspan="2">Added By</th>
							<th rowspan="2">Update Date</th>
						</tr>
						<tr>
							<th>Name</th>
							<th>Number</th>
							<th>Extension</th>
							<th>Email Address</th>
							<th>Name</th>
							<th>Number</th>
							<th>Extension</th>
							<th>Email Address</th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</div>




<div class="modal fade" id="modal_customers" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title" id="modal_form_title"></h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>

			<form action="/masters/customers/save-customer" method="post" id="frm_customers">
				@csrf
				<input type="hidden" class="clear" id="id" name="id" value="">
				<div class="modal-body">
					<div class="row">
						<div class="col-md-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text" style="min-width: 125px;">Customer Name</span>
								</div>
								<input type="text" class="form-control form-control-sm clear read-only" id="customer_name" name="customer_name" placeholder="Customer Name" autocomplete="off">
								<div id="customer_name_feedback"></div>
							</div>
		
							<div class="form-group row m-b-10">
								<div class="col-md-12">
									<textarea name="address" id="address" class="form-control form-control-sm clear read-only" style="resize: none;" rows="5" placeholder="Addresss"></textarea>
								</div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-6">
							<h5>Contact Person 1</h5>
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text" style="min-width: 125px;">Name</span>
								</div>
								<input type="text" class="form-control form-control-sm clear read-only" id="contact_person1" name="contact_person1" autocomplete="off">
								<div id="contact_person1_feedback"></div>
							</div>
		
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text" style="min-width: 125px;">Number</span>
								</div>
								<input type="text" class="form-control form-control-sm clear read-only" id="contact_number1" name="contact_number1" autocomplete="off">
								<div id="contact_number1_feedback"></div>
							</div>

							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text" style="min-width: 125px;">Extension</span>
								</div>
								<input type="text" class="form-control form-control-sm clear read-only" id="extension1" name="extension1" autocomplete="off">
								<div id="extension1_feedback"></div>
							</div>
		
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text" style="min-width: 125px;">Email Address</span>
								</div>
								<input type="email" class="form-control form-control-sm clear read-only" id="email1" name="email1" autocomplete="off">
								<div id="email1_feedback"></div>
							</div>
						</div>

						<div class="col-md-6">
							<h5>Contact Person 2</h5>
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text" style="min-width: 125px;">Name</span>
								</div>
								<input type="text" class="form-control form-control-sm clear read-only" id="contact_person2" name="contact_person2" autocomplete="off">
								<div id="contact_person2_feedback"></div>
							</div>
		
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text" style="min-width: 125px;">Number</span>
								</div>
								<input type="text" class="form-control form-control-sm clear read-only" id="contact_number2" name="contact_number2" autocomplete="off">
								<div id="contact_number2_feedback"></div>
							</div>

							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text" style="min-width: 125px;">Extension</span>
								</div>
								<input type="text" class="form-control form-control-sm clear read-only" id="extension2" name="extension2" autocomplete="off">
								<div id="extension2_feedback"></div>
							</div>
		
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text" style="min-width: 125px;">Email Address</span>
								</div>
								<input type="email" class="form-control form-control-sm clear read-only" id="email2" name="email2" autocomplete="off">
								<div id="email2_feedback"></div>
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
	<script src="{{ asset('js/masters/customer.js') }}" defer></script>
@endpush