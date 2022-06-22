<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'FHS Traceability System') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback" rel="stylesheet">

    @stack('styles')
    
</head>
<body class="hold-transition sidebar-mini">
    <div class="wrapper">
        @include('includes.header')
        @include('includes.sidebar')

        <div class="content-wrapper">
            @yield('content')
        </div>

        <footer class="main-footer">
            <div class="float-right d-none d-sm-inline">FHS Traceability System</div>
            <strong>Copyright &copy; 2022 <a href="#">FTL</a>.</strong> All rights reserved.
          </footer>
    </div>

    @stack('scripts')
</body>
</html>
