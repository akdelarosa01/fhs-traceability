<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Shipment Tracking List</title>
</head>
<body>
    <table style="border: 1px solid black">
        <thead>
            <tr>
                <th style="border: 1px solid black">Shipment Plan</th>
                <th style="border: 1px solid black">{{ 'Shipment Date (Actual Pick-up)' }}</th>
                <th style="border: 1px solid black">Invoice No.</th>
                <th style="border: 1px solid black">Model Code</th>
                <th style="border: 1px solid black">FTL Pallet No.</th>
                <th style="border: 1px solid black">Customer Pallet No.</th>
                <th style="border: 1px solid black">Lot No.</th>
                <th style="border: 1px solid black">FTL Box No.</th>

                <th style="border: 1px solid black">Customer Carton ID No.</th>
                <th style="border: 1px solid black"></th>
                
                <th style="border: 1px solid black">Pallet Information Sheet</th>

                <th style="border: 1px solid black">Total Ship Qty</th>
                <th style="border: 1px solid black">Pallet Qty</th>
                <th style="border: 1px solid black">Box Qty</th>
                <th style="border: 1px solid black">HS Qty</th>
                <th style="border: 1px solid black">Destination</th>
                <th style="border: 1px solid black">Truck Plate No.</th>
                <th style="border: 1px solid black">Shipping Seal No.</th>
                <th style="border: 1px solid black">PEZA Seal No.</th>

                <th style="border: 1px solid black"></th>
                
                <th style="border: 1px solid black">Packaging Date</th>
                <th style="border: 1px solid black">Serial No.</th>
            </tr>
        </thead>
        <tbody>
                <?php
                    $row = 0;
                    $range = 0;
                ?>
            @foreach($boxes as $d)
                
                <tr>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->ship_plan }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}"></td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->invoice_no }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->model }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->pallet_qr }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}"></td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->lot_no }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->box_qr }}</td>
                    

                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}"></td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}"></td>

                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}"></td>

                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->total_ship_qty }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->pallet_qty }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->box_qty }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->hs_qty }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->destination }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->truck_plate_no }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->shipping_seal_no }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}">{{ $d->peza_seal_no }}</td>
                    <td style="border: 1px solid black" rowspan="{{$d->hs_count}}"></td>

                    <?php
                        // return dd($heat_sinks[0]->box_id);
                        $filtered = array_filter($heat_sinks, function($obj) use ($d){
                            return $obj->box_id === $d->box_id;
                        });

                        $key = array_keys($filtered);
                    ?>

                    <td style="border: 1px solid black">{{$filtered[$key[0]]->prod_date}}</td>
                    <td style="border: 1px solid black">{{$filtered[$key[0]]->hs_serial}}</td>
                    <?php
                        $row++;
                    ?>
                </tr>

                <?php 
                    $box = $d->box_id;
                    $filtered = array_filter($heat_sinks, function($obj) use ($box){
                        return $obj->box_id == $box;
                    });

                    $key = array_keys($filtered);

                    for ($i=0; $i < count($filtered); $i++) {
                        if ($i !== 0) {
                ?>
                            <tr>
                                <td style="border: 1px solid black">@if (isset($filtered[$key[$i]])) {{$filtered[$key[$i]]->prod_date}} @endif</td>
                                <td style="border: 1px solid black">@if (isset($filtered[$key[$i]])) {{$filtered[$key[$i]]->hs_serial}} @endif</td> 
                            </tr>
                <?php
                            $row++;
                        }
                    }
                    
                ?>
                    
            @endforeach

           

            
                
        </tbody>
    </table>
</body>
</html>