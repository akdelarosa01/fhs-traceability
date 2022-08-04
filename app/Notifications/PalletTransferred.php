<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PalletTransferred extends Notification
{
    use Queueable;

    private $details;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($details)
    {
        $this->details = $details;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'id' => $this->details->id,
            'model_id' => $this->details->model_id,
            'transaction_id' => $this->details->transaction_id,
            'pallet_status' => $this->details->pallet_status,
            'pallet_qr' => $this->details->pallet_qr,
            'new_box_count' => $this->details->new_box_count,
            'pallet_location' => $this->details->pallet_location,
            'is_printed' => $this->details->is_printed,
            'box_count_to_inspect' => $this->details->box_count_to_inspect,
            'created_at' => $this->details->created_at,
            'updated_at' => $this->details->updated_at,
        ];
    }
}
