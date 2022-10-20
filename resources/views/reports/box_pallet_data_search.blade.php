@push('styles')
	<link href="{{ asset('css/reports/box_pallet_data_search.css') }}" rel="stylesheet">
@endpush

@section('title')
Box and Pallet Data Search
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Box and Pallet Data Search</h4>
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
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Search Type</span>
								</div>
								<select name="search_type" id="search_type" class="form-control clear-select">
                                    <option value=""></option>
                                    <option value="model">Model</option>
                                    <option value="pallet_qr">Pallet ID</option>
                                    <option value="box_id">Box ID</option>
                                    <option value="cust_part_no">Customer Part No.</option>
                                    <option value="hs_serial">HS Serial Number</option>
                                    <option value="grease_batch">Grease Batch Number</option>
                                    <option value="grease_no">Brease Bin Number</option>
                                    <option value="rca_value">RCA Value</option>
                                    <option value="rca_judgment">RCA Judgment</option>
                                    <option value="lot_no">Lot Number</option>
                                </select>
								<div id="search_type_feedback"></div>
							</div>
						</div>

                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Search Value</span>
								</div>
								<input type="text" class="form-control form-control-sm clear" id="search_value" name="search_value" placeholder="Search Value" autocomplete="off">
								<div id="search_value_feedback"></div>
							</div>
						</div>

                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Shipping Date From</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="shipping_date_from" name="shipping_date_from">
                                <div id="shipping_date_from_feedback"></div>
                            </div>
                        </div>

                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-append">
                                    <span class="input-group-text">Shipping Date To</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="shipping_date_to" name="shipping_date_to">
								<div id="shipping_date_to_feedback"></div>
							</div>
						</div>

                        {{-- <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-12">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">File Type</span>
								</div>
								<select name="file_type" id="file_type" class="form-control clear-select">
                                    <option value="excel">Excel</option>
                                    <option value="csv">CSV</option>
                                    <option value="excel_csv">Excel & CSV</option>
                                </select>
								<div id="file_type_feedback"></div>
							</div>
						</div> --}}
					</div>

                    <div class="row">
                        

                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Production Date From</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="prodction_date_from" name="prodction_date_from">
                                <div id="prodction_date_from_feedback"></div>
                            </div>
                        </div>

                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-append">
                                    <span class="input-group-text">Production Date To</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="production_Date_to" name="production_Date_to">
								<div id="production_Date_to_feedback"></div>
							</div>
						</div>

                        <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Max count</span>
								</div>
								<input type="number" class="form-control form-control-sm clear" id="max_count" name="max_count" placeholder="Max Data Count" autocomplete="off" value="50">
								<div id="max_count_feedback"></div>
							</div>
						</div>

                        <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <button type="button" class="btn btn-sm btn-primary btn-block" id="btn_search">
                                <i class="fa fa-search"></i> Search
                            </button>
                        </div>
                    </div>

                    {{-- <div class="row justify-content-center">
                        

                        <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <button type="button" class="btn btn-sm btn-primary btn-block" id="btn_search">
                                <i class="fa fa-search"></i> Search
                            </button>
                        </div>
                    
                        <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <button type="button" class="btn btn-sm btn-success btn-block read-only" id="btn_export">
                                <i class="fa fa-download"></i> Export Report
                            </button>
                        </div>
                    </div> --}}
                </div>
            </div>
        </form>

        <div class="row">
            <div class="col-md-12">
                <table class="table table-sm table-hover table-bordered table-striped" id="tbl_data_search" style="width: 100%">
                    <thead class="thead-dark">
                        <th>Shipping Date</th>
                        <th>Destination</th>
                        <th>Production Date</th>
                        <th>Model</th>
                        <th>Pallet ID</th>
                        <th>Box ID</th>
                        <th>CPN</th>
                        <th>S/N</th>
                        <th>QA Judgment</th>
                        <th>Grease Batch</th>
                        <th>Grease Bin</th>
                        <th>RCA Value</th>
                        <th>RCA Judgment</th>
                        <th>Lot Number</th>
                    </thead>
                </table>
            </div>
        </div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/reports/box_pallet_data_search.js') }}" defer></script>
@endpush