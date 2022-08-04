<?php

namespace App\Listeners;

use App\Events\PalletTransferred;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendTransferNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\PalletTransferred  $event
     * @return void
     */
    public function handle(PalletTransferred $event)
    {
        //
    }
}
