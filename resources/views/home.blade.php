@push('styles')
	<link href="{{ asset('css/home.css') }}" rel="stylesheet">
@endpush

@section('title')
Home
@endsection

@extends('layouts.app')

@section('content')

{{-- <div class="content-header">
	<div class="container-fluid">
		<div class="row mb-1">
			<div class="col-sm-6">
				<h1 class="m-0">Home</h1>
			</div>
		</div>
	</div>
</div> --}}

<div class="content pt-3">
	<div class="container-fluid">
		<div class="row" id="HomeMenu">

			

		</div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/home.js') }}" defer></script>
@endpush
