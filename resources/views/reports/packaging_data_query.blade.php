@push('styles')
	<link href="{{ asset('css/reports/packaging_data_query.css') }}" rel="stylesheet">
    <style>
        .dataTables_wrapper {
            width: 100%;
        }
    </style>
@endpush

@section('title')
Packaging Data Query
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Packaging Data Query</h4>
		<div class="panel-heading-btn">
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
			<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>
		</div>
	</div>
	<div class="panel-body">
        <form id="frm_search">
            <div class="row mb-2">
                <div class="col-md-12">
					<div class="row">
						<div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Search Type</span>
								</div>
								<select name="search_type" id="search_type" class="form-control clear-select">
                                    <option value=""></option>
                                    <option value="box_no">Box No.</option>
                                    <option value="work_order">Work Order</option>
                                    <option value="machine_no">Machine No.</option>
                                    <option value="model_code">Model Code</option>
                                    <option value="hs_serial">H.S. Serial</option>
                                    <option value="operator">Operator</option>
                                    <option value="leader_in_charge">Leader In Charge</option>
                                    <option value="lot_no">Lot Number</option>
                                </select>
								<div id="search_type_feedback"></div>
							</div>
						</div>

                        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Search Value</span>
								</div>
								<input type="text" class="form-control form-control-sm clear normal" id="search_value" name="search_value" placeholder="Search Value" autocomplete="off">
								<div id="search_value_feedback"></div>
							</div>
						</div>

                        <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12 col-xs-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Max count</span>
								</div>
								<input type="number" class="form-control form-control-sm clear" id="max_count" name="max_count" placeholder="Max Data Count" autocomplete="off" value="50">
								<div id="max_count_feedback"></div>
							</div>
						</div>

                        
					</div>

                    <div class="row">
                        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Packaging Date From</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="packaging_date_from" name="packaging_date_from">
                                <div id="packaging_date_from_feedback"></div>
                            </div>
                        </div>

                        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-append">
                                    <span class="input-group-text">Packaging Date To</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="packaging_date_to" name="packaging_date_to">
								<div id="packaging_date_to_feedback"></div>
							</div>
						</div>

                        <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <button type="button" class="btn btn-sm btn-primary btn-block" id="btn_search">
                                <i class="fa fa-search"></i> Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="row">
            <div class="col-md-12">
                <table class="table table-sm table-hover table-striped display nowrap" id="tbl_data_search" style="width: 100%"></table>
            </div>
        </div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/reports/packaging_data_query.js') }}" defer></script>
@endpush