<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;


class QADataExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping
{
    use Exportable;

    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return collect($this->data);
    }

    public function map($qa): array
    {
        return [
            $qa->oba_date,
            $qa->shift,
            $qa->box_label,
            $qa->model_code,
            $qa->model_name,
            $qa->date_manufactured,
            $qa->date_expired,
            $qa->pallet_no,
            $qa->cutomer_pn,
            $qa->lot_no,
            $qa->prod_line_no,
            $qa->box_no,
            $qa->serial_nos,
            $qa->qty_per_box,
            $qa->qc_incharge,
            $qa->hs_history,
            $qa->disposition,
            $qa->qa_judgment,
            $qa->product_1,
            $qa->product_2,
            $qa->product_3,
            $qa->product_4,
            $qa->product_5,
            $qa->product_6,
            $qa->product_7,
            $qa->product_8,
            $qa->product_9,
            $qa->product_10,
            $qa->product_11,
            $qa->product_12,
            $qa->product_13,
            $qa->product_14,
            $qa->product_15,
            $qa->product_16,
            $qa->product_17,
            $qa->product_18,
            $qa->product_19,
            $qa->product_20,
            $qa->product_21,
            $qa->product_22,
            $qa->product_23,
            $qa->product_24,
            $qa->product_25,
            $qa->product_26,
            $qa->product_27,
            $qa->product_28,
            $qa->product_29,
            $qa->product_30,
            $qa->product_31,
            $qa->product_32,
            $qa->product_33,
            $qa->product_34,
            $qa->product_35,
            $qa->product_36,
            $qa->product_37,
            $qa->product_38,
            $qa->product_39,
            $qa->product_40,
            $qa->product_41,
            $qa->product_42,
            $qa->product_43,
            $qa->product_44,
            $qa->product_45,
            $qa->product_46,
            $qa->product_47,
            $qa->product_48,
            $qa->product_49,
            $qa->product_50,
            $qa->product_51,
            $qa->product_52,
            $qa->product_53,
            $qa->product_54,
            $qa->product_55,
            $qa->product_56,
            $qa->product_57,
            $qa->product_58,
            $qa->product_59,
            $qa->product_60
        ];
    }

    public function headings(): array
    {
        $columns = [
            "Date",
            "Shift",
            "Box Label",
            "Model",
            "Model Name",
            "Manufacture Date",
            "Expired Date",
            "Pallet No.",
            "Customer P/N",
            "Lot No.",
            "Prod. Line No.",
            "Box ID",
            "Serial No",
            "Qty per Box",
            "QC In-charge",
            "HS History",
            "QA Remarks",
            "QA Judgment",
        ];

        for ($i=1; $i <= 60; $i++) { 
            array_push($columns, 'Product '.$i);
        }

        return $columns;
    }
}