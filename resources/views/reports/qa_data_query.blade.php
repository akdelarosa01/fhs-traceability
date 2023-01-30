@push('styles')
	<link href="{{ asset('css/reports/qa_data_query.css') }}" rel="stylesheet">
@endpush

@section('title')
Q.A. Data Query
@endsection

@extends('layouts.app')

@section('content')

<div class="panel panel-inverse">
	<div class="panel-heading">
		<h4 class="panel-title">Q.A. Data Query</h4>
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
                                    <option value="shift">Shift</option>
                                    <option value="box_label">Box Label</option>
                                    <option value="model_code">Model Code</option>
                                    <option value="model_name">Model Name</option>
                                    <option value="pallet_label">Pallet No.</option>
                                    <option value="cutomer_pn">Customer Part Number</option>
                                    <option value="lot_no">Lot Number</option>
                                    <option value="prod_line_no">Prod. Line Number</option>
                                </select>
								<div id="search_type_feedback"></div>
							</div>
						</div>

                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-prepend">
									<span class="input-group-text">Search Value</span>
								</div>
								<input type="text" class="form-control form-control-sm clear normal" id="search_value" name="search_value" placeholder="Search Value" autocomplete="off">
                                <select class="form-control form-control-sm clear shift" style="display:none;">
                                    <option value="DS">Day Shift</option>
                                    <option value="NS">Night Shift</option>
                                </select>
								<div id="search_value_feedback"></div>
							</div>
						</div>

                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">OBA Date From</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="oba_date_from" name="oba_date_from">
                                <div id="oba_date_from_feedback"></div>
                            </div>
                        </div>

                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-append">
                                    <span class="input-group-text">OBA Date To</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="oba_date_to" name="oba_date_to">
								<div id="oba_date_to_feedback"></div>
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
                                    <span class="input-group-text">Expiration Date From</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="exp_date_from" name="exp_date_from">
                                <div id="exp_date_from_feedback"></div>
                            </div>
                        </div>

                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3">
							<div class="input-group input-group-sm mb-2">
								<div class="input-group-append">
                                    <span class="input-group-text">Expiration Date To</span>
                                </div>
                                <input type="date" class="form-control form-control-sm clear" id="exp_Date_to" name="exp_Date_to">
								<div id="exp_Date_to_feedback"></div>
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

                        <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <button type="button" class="btn btn-sm btn-success btn-block read-only" id="btn_export">
                                <i class="fa fa-download"></i> Export Report
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
                        <th>Date</th>
                        <th>Shift</th>
                        <th>Box Label</th>
                        <th>Model</th>
                        <th>Model Name</th>
                        <th>Manufacture Date</th>
                        <th>Expired Date</th>
                        <th>Pallet No.</th>
                        <th>Customer P/N</th>
                        <th>Lot No.</th>
                        <th>Prod. Line No.</th>
                        <th>Box ID</th>
                        <th>Serial No</th>
                        <th>Qty per Box</th>
                        <th>QC In-charge</th>
                        <th>HS History</th>
                        <th>QA Remarks</th>
                        <th>QA Judgment</th>
                        <?php
                            for ($i=1; $i <= 60; $i++) { 
                                echo '<th>Product '.$i.'</th>';
                            }
                        ?>
                    </thead>
                </table>
            </div>
        </div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/reports/qa_data_query.js') }}" defer></script>
@endpush