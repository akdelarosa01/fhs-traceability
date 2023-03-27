@push('styles')
	<link href="{{ asset('css/reports/shipment_data_query.css') }}" rel="stylesheet">
    <style>
        .dataTables_wrapper {
            width: 100%;
        }
    </style>
@endpush

@section('title')
Shipment Data Query
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Shipment Data Query</h4>
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
                                    <option value="destination">Destination</option>
                                    <option value="pallet_no">Pallet Number</option>
                                    <option value="model_code">Model Code</option>
                                    <option value="truck_plate_no">Truck Plate No.</option>
                                    <option value="shipping_seal_no">Shipping Seal No.</option>
                                    <option value="peza_seal_no">PEZA Seal No.</option>
                                    <option value="control_no">Control Number</option>
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

                        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Shipment Date From</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="shipment_date_from" name="shipment_date_from">
                                <div id="shipment_date_from_feedback"></div>
                            </div>
                        </div>

                        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-append">
                                    <span class="input-group-text">Shipment Date To</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="shipment_date_to" name="shipment_date_to">
								<div id="shipment_date_to_feedback"></div>
							</div>
						</div>

                        

                        
					</div>

                    <div class="row">
                        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Create Date From</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="create_date_from" name="create_date_from">
                                <div id="create_date_from_feedback"></div>
                            </div>
                        </div>

                        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-xs-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-append">
                                    <span class="input-group-text">Create Date To</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="create_date_to" name="create_date_to">
								<div id="create_date_to_feedback"></div>
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

                        <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <button type="button" class="btn btn-sm btn-primary btn-block" id="btn_search">
                                <i class="fa fa-search"></i> Search
                            </button>
                        </div>
                        
                        <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <button type="button" class="btn btn-sm btn-green btn-block" id="btn_export">
                                <i class="fa fa-file-excel"></i> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="row">
            <div class="col-md-12">
                <table class="table table-sm display nowrap" id="tbl_data_search" style="width: 100%"></table>
            </div>
        </div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/reports/shipment_data_query.js') }}" defer></script>
@endpush