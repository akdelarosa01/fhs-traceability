

<div id="sidebar" class="sidebar">
	<input type="hidden" id="hdnMenu" value="{{ $pages }}" data-currurl="{{ $current_url }}" />
	<div data-scrollbar="true" data-height="100%">
		<ul class="nav" id="menuBar">

			<li><a href="javascript:;" class="sidebar-minify-btn" data-click="sidebar-minify"><i class="fa fa-angle-double-left"></i></a></li>

			<li class="nav-header">Menu</li>

			<li class="@if(str_contains($current_url,'/home')) {{'active'}} @endif">
				<a href="/home">
					<i class="fas fa-home"></i>
					<span>Home</span>
				</a>
			</li>
			
		</ul>
	</div>
</div>
<div class="sidebar-bg"></div>