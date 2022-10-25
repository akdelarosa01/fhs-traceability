<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
    <meta content="FTL Data Traceability" name="description" />
    <meta content="Arjay Kurt Dela Rosa" name="author" />

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title') | {{ config('app.name', 'FTL Traceability System') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    @stack('styles')
</head>
<body class="pace-top">

    <div id="page-loader" class="fade show">
        <span class="spinner"></span>
    </div>
    
    
    <div id="page-container" class="fade">
        <div class="login login-v1">
            <div class="login-container">
                <div class="login-header">
                    <div class="brand">
                        <span class="logo"></span> <b>FTL</b> Traceability System
                        <small>Box ID system and Production Traceability</small>
                    </div>
                    <div class="icon">
                        <i class="fa fa-lock"></i>
                    </div>
                </div>

                <div class="login-body">
                    @yield('content')
                </div>
            </div>
        </div>
    </div>

    @include('includes.dialog')
    @stack('scripts')
</body>
</html>