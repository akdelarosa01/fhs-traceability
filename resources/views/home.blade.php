@push('styles')
	<link href="{{ asset('css/home.css') }}" rel="stylesheet">
@endpush

@section('title')
Home
@endsection

@extends('layouts.app')

@section('content')

	<div class="row" id="HomeMenu"></div>
@endsection

@push('scripts')
	<script src="{{ asset('js/home.js') }}" defer></script>
@endpush
