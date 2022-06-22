@push('styles')
	<link href="{{ asset('css/transactions/box_and_pallet_application.css') }}" rel="stylesheet">
@endpush

@section('title')
Box and Pallet Application
@endsection

@extends('layouts.app')

@section('content')

<div class="content-header">
	<div class="container-fluid">
		<div class="row mb-1">
			<div class="col-sm-6">
				<h1 class="m-0">Box and Pallet Application</h1>
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
	<script src="{{ asset('js/transactions/box_and_pallet_application.js') }}" defer></script>
@endpush
