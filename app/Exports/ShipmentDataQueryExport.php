<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class ShipmentDataQueryExport implements 
    FromView, 
    ShouldAutoSize,
    WithEvents
{
    use Exportable;

    protected $boxes;
    protected $heat_sinks;
    protected $count = 1;

    public function __construct($boxes,$heat_sinks)
    {
        $this->boxes = $boxes;
        $this->heat_sinks = $heat_sinks;
    }

    public function view(): View
    {
        $boxes_collection = collect($this->boxes);
        $heat_sinks_collection = $this->heat_sinks;

        return view('exports.shipment-data-query', [
            'boxes' => $boxes_collection,
            'heat_sinks' => $heat_sinks_collection
        ]);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class    => function(AfterSheet $event) {
                $event->sheet->getStyle("A1:Z1")->applyFromArray([
                    'font' => [
                        'bold' => true
                    ]
                ]);
            },
        ];
        
    }
}
