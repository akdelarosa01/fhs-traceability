<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
    <meta content="FHS Traceability" name="description" />
    <meta content="Arjay Kurt Dela Rosa" name="author" />

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="read-only" content="{{ $read_only }}">
    <meta name="authorize" content="{{ $authorize }}">

    <title>@yield('title') | {{ config('app.name', 'FHS Traceability System') }}</title>

    @stack('styles')
    
</head>
<body>
    {{-- <div id="page-loader" class="fade show"><span class="spinner"></span></div> --}}

    <div id="page-container" class="page-container fade page-sidebar-fixed page-header-fixed">
        @include('includes.header')
        @include('includes.sidebar')

        <div id="content" class="content">
            @yield('content')
        </div>
    </div>

    @stack('modals')
    @include('includes.dialog')
    @stack('scripts')
</body>
</html>
