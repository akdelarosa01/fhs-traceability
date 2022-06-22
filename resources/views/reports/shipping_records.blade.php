@push('styles')
	<link href="{{ asset('css/reports/shipping_records.css') }}" rel="stylesheet">
@endpush

@section('title')
Shipping Records
@endsection

@extends('layouts.app')

@section('content')

<div class="content-header">
	<div class="container-fluid">
		<div class="row mb-1">
			<div class="col-sm-6">
				<h1 class="m-0">Shipping Records</h1>
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
	<script src="{{ asset('js/reports/shipping_records.js') }}" defer></script>
@endpush
