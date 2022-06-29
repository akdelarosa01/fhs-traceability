@push('styles')
	<link href="{{ asset('css/auth.css') }}" rel="stylesheet">
@endpush

@section('title')
Login
@endsection

@extends('layouts.auth')

@section('content')
<div class="login-content">
    <form action="{{ route('login') }}" method="POST" class="margin-bottom-0">
        @csrf
        <div class="form-group m-b-20">
            <input type="text" class="form-control form-control-lg inverse-mode @error('username') is-invalid @enderror" placeholder="{{ __('Username') }}" name="username" value="{{ old('username') }}" required autocomplete="username" autofocus />
            @error('username')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>
        <div class="form-group m-b-20">
            <input type="password" class="form-control form-control-lg inverse-mode @error('password') is-invalid @enderror" placeholder="{{ __('password') }}" name="password" required/>
            @error('password')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>
        <div class="checkbox checkbox-css m-b-20">
            <input type="checkbox" id="remember_checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}/>
            <label for="remember_checkbox">
                Remember Me
            </label>
        </div>
        <div class="login-buttons">
            <button type="submit" class="btn btn-success btn-block btn-lg">{{ __('Login') }}</button>
        </div>
    </form>
</div>

@if (Route::has('password.request'))
{{-- <p class="mb-1">
    <a class="btn btn-link" href="{{ route('password.request') }}">
        {{ __('Forgot Your Password?') }}
    </a>
</p> --}}
@endif
@endsection

@push('scripts')
	<script src="{{ asset('js/auth.js') }}" defer></script>
@endpush
