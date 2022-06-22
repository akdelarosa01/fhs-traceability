@push('styles')
	<link href="{{ asset('css/app.css') }}" rel="stylesheet">
@endpush

@extends('layouts.app')

@section('content')

<div class="content-header">
	<div class="container-fluid">
		<div class="row mb-1">
			<div class="col-sm-6">
				<h1 class="m-0">Starter Page</h1>
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
	<script src="{{ asset('js/app.js') }}" defer></script>
@endpush
