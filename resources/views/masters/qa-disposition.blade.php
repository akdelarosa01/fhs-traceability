@push('styles')
	<link href="{{ asset('css/masters/qa_disposition.css') }}" rel="stylesheet">
@endpush

@section('title')
Q.A. Disposition Master
@endsection

@extends('layouts.app')

@section('content')

<div class="content-header">
	<div class="container-fluid">
		<div class="row mb-1">
			<div class="col-sm-6">
				<h1 class="m-0">Q.A. Disposition Master</h1>
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
	<script src="{{ asset('js/masters/qa_disposition.js') }}" defer></script>
@endpush
