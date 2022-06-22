@extends('layouts.auth')

@section('content')
<form method="POST" action="{{ route('login') }}">
    @csrf

    <div class="input-group mb-3">
        <input type="test" class="form-control @error('username') is-invalid @enderror" placeholder="{{ __('Username') }}" name="username" value="{{ old('username') }}" required autocomplete="username" autofocus>
        <div class="input-group-append">
            <div class="input-group-text">
                <span class="fas fa-user"></span>
            </div>
        </div>
        @error('username')
            <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
    </div>

    

    <div class="input-group mb-3">
        <input type="password" class="form-control @error('password') is-invalid @enderror" placeholder="{{ __('password') }}" name="password" required>
        <div class="input-group-append">
            <div class="input-group-text">
                <span class="fas fa-lock"></span>
            </div>
        </div>
        @error('password')
            <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
    </div>

    

    <div class="row">
        <div class="col-8">
            <div class="icheck-primary">
                <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                <label for="remember">{{ __('Remember Me') }} </label>
            </div>
        </div>
        
        <div class="col-4">
            <button type="submit" class="btn btn-primary btn-block">{{ __('Login') }}</button>
        </div>
    </div>
</form>

@if (Route::has('password.request'))
<p class="mb-1">
    <a class="btn btn-link" href="{{ route('password.request') }}">
        {{ __('Forgot Your Password?') }}
    </a>
</p>
@endif
@endsection
