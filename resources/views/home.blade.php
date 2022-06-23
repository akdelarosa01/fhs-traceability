@push('styles')
	<link href="{{ asset('css/app.css') }}" rel="stylesheet">
@endpush

@section('title')
Home
@endsection

@extends('layouts.app')

@section('content')

<div class="content-header">
	<div class="container-fluid">
		<div class="row mb-1">
			<div class="col-sm-6">
				<h1 class="m-0">Home</h1>
			</div>
		</div>
	</div>
</div>

<div class="content">
	<div class="container-fluid">
		<div class="row justify-content-center">

			<div class="col-md-3 col-sm-6 col-12">
				<a href="/home" class="info-box">
					<span class="info-box-icon bg-info"><i class="far fa-envelope"></i></span>
					<div class="info-box-content">
						<span class="info-box-text"></span>
						<span class="info-box-number">Home</span>
					</div>
				</a>
			</div>

		</div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ asset('js/app.js') }}" defer></script>
@endpush
