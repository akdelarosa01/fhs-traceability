<div class="modal fade" id="modal_authentication" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog ">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Checking Authorization</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
                <form action="/authenticate" method="post" id="frm_authenticate">
                    @csrf
                    <input type="hidden" id="authentication_type" name="authentication_type" class="clear" value="">
                    <input type="hidden" id="auth_id" name="auth_id" class="clear" value="">
                    <div class="row auth">
                        <div class="col-12">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">User Name</span>
                                </div>
                                <input type="text" class="form-control form-control-sm clear" id="username" name="username" placeholder="User Name" autocomplete="off" required>
                                <div id="username_feedback"></div>
                            </div>
                        </div>
                    </div>
    
                    <div class="row auth">
                        <div class="col-12">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Password</span>
                                </div>
                                <input type="password" class="form-control form-control-sm clear" id="password" name="password" placeholder="Password" autocomplete="off" required>
                                <div id="password_feedback"></div>
                            </div>
                        </div>
                    </div>
    
                    <div class="row auth">
                        <div class="offset-sm-8 col-sm-4 col-xs-12">
                            <button type="submit" class="btn btn-sm btn-primary btn-block" id="btn_auth">
                                <i class="fa fa-unlock"></i> Authenticate
                            </button>
                        </div>
                    </div>
                </form>
			</div>
		</div>
	</div>
</div>

<div id="loading_modal" class="modal loading_modal" data-backdrop="static">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <img src="../../../images/ajax-loader.gif" height="100" class="block-centered">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="iziModalError" style="max-height:72px;"></div>