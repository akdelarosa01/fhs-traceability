@push('styles')
	<link href="{{ asset('css/reports/pallet_tracking_history.css') }}" rel="stylesheet">
@endpush

@section('title')
Pallet Tracking History
@endsection

@extends('layouts.app')

@section('content')

<div class="content-header">
	<div class="container-fluid">
		<div class="row mb-1">
			<div class="col-sm-6">
				<h1 class="m-0">Pallet Tracking History</h1>
			</div>
		</div>
	</div>
</div>

<div class="content">
	<div class="container-fluid">
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/reports/pallet_tracking_history.js') }}" defer></script>
@endpush
