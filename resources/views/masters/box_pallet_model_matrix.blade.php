@push('styles')
	<link href="{{ asset('css/masters/box_pallet_model_matrix.css') }}" rel="stylesheet">
@endpush

@section('title')
Box Pallet Model Matrix
@endsection

@extends('layouts.app')

@section('content')

<div class="content-header">
	<div class="container-fluid">
		<div class="row mb-1">
			<div class="col-sm-6">
				<h1 class="m-0">Box Pallet Model Matrix</h1>
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
	<script src="{{ asset('js/masters/box_pallet_model_matrix.js') }}" defer></script>
@endpush
