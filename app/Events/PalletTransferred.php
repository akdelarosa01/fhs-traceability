<?php

namespace App\Events;

use App\Common\Helpers;
use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class PalletTransferred implements ShouldBroadcast
{
    use SerializesModels;

    public $_content;
    public $_pallet;
    public $_recepients;
    public $_current_user;
    public $_noti_count;
    protected $_helpers;
    

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($content,$pallet,$recepients,$url)
    {
        $this->_helpers = new Helpers;

        $this->_content = $content;
        $this->_pallet = $pallet;
        $this->_recepients = $recepients;
        $this->_current_user = Auth::user()->id;

        foreach ($this->_recepients as $key => $recepient) {
            Notification::create([
                'noti_type' => "pallet_transferred",
                'from' => $this->_current_user,
                'to' => $recepient->user_id,
                'title' => $content['title'],
                'message' => $content['message'],
                'url' => $url,
            ]);
        }
        
        $this->_noti_count = Notification::whereNull('read_at')->where('to',$this->_current_user)->count();
    }

    public function broadcastAs()
    {
        return 'pallet.transferred';
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn(): Channel
    {
        return new Channel('pallet-transferred');
    }
}
