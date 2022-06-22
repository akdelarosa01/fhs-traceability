@push('styles')
	<link href="{{ asset('css/transactions/qa_inspection.css') }}" rel="stylesheet">
@endpush

@section('title')
Q.A. Inspection
@endsection

@extends('layouts.app')

@section('content')

<div class="content-header">
	<div class="container-fluid">
		<div class="row mb-1">
			<div class="col-sm-6">
				<h1 class="m-0">Q.A. Inspection</h1>
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
	<script src="{{ asset('js/transactions/qa_inspection.js') }}" defer></script>
@endpush
