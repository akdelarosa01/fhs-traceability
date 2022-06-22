<aside class="main-sidebar sidebar-dark-primary elevation-4">

	<!-- Brand Logo -->
	<a href="{{ url('/') }}" class="brand-link text-center">
		<span class="brand-text font-weight-light">FHS Traceability</span>
	</a>

	<!-- Sidebar -->
	<div class="sidebar">
		<input type="hidden" id="hdnMenu" value="{{ $pages }}" data-currurl="{{ $current_url }}" />
		<!-- Sidebar Menu -->
		<nav class="mt-2">
			<ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false" id="menuBar">
				<li class="nav-item @if(str_contains($current_url,'/home')) {{'active'}} @endif">
					<a href="/home" class="nav-link @if(str_contains($current_url,'/home')) {{'active'}} @endif">
						<i class="nav-icon fas fa-home"></i>
						<p>Home</p>
					</a>
				</li>
			</ul>
		</nav>
		<!-- /.sidebar-menu -->
	</div>
	<!-- /.sidebar -->
</aside>