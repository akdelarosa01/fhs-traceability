<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class BoxPalletDataQueryExport implements
    FromView, 
    ShouldAutoSize,
    WithEvents
{
    use Exportable;

    protected $data;
    protected $search_type;

    public function __construct($data,$search_type)
    {
        $this->data = $data;
        $this->search_type = $search_type;
    }

    public function view(): View
    {
        $data = $this->data;
        $search_type = $this->search_type;

        return view('exports.box-pallet-data-query', [
            'data' => $data,
            'search_type' => $search_type
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
