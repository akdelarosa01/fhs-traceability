<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>FTL Traceability</title>
</head>
<body>

    
                <?php
                $sql = "";
                switch ($search_type) {
                    case 'box_no':
                ?>
                    <table style="border: 1px solid black">
                        <thead>
                            <tr>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;" colspan="2">Box-Pallet Entry Date</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;" colspan="2">Box ID</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Box Judgment</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Model</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Model Name</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;"colspan="2">Pallet ID</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Orig. Box Count / Pallet</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Box Count / Broken Pallet</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Pallet Status</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Pallet Location</th>
                            </tr>
                        </thead>
                        <tbody>
                <?php
                        foreach ($data as $key => $d) {
                ?>
                            <tr>
                                <td style="border: 1px solid black; background-color: #B0DAFF;" colspan="2">{{ $d->created_at }}</td>
                                <td style="border: 1px solid black; background-color: #B0DAFF;" colspan="2">{{ $d->box_qr }}</td>
                                <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $d->box_judgement }}</td>
                                <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $d->model }}</td>
                                <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $d->model_name }}</td>
                                <td style="border: 1px solid black; background-color: #B0DAFF;" colspan="2">{{ $d->pallet_qr }}</td>
                                <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $d->box_count_per_pallet }}</td>
                                <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $d->broken_pallet_qty }}</td>
                                <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $d->pallet_status }}</td>
                                <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $d->pallet_location }}</td>
                            </tr>

                            <?php

                                $sql = "SELECT distinct hs.c1 as date_scanned, ";
                                $sql .= "       hs.c4 as hs_serial, ";
                                $sql .= "       hs.c2 as production_line, ";
                                $sql .= "       hs.c6 as operator, ";
                                $sql .= "       hs.c8 as work_order, ";
                                $sql .= "       g.GreaseBatchNo as grease_batch, ";
                                $sql .= "       g.ContainerNo as grease_no, ";
                                $sql .= "       ins.c7 as rca_value, ";
                                $sql .= "       ins.c12 as rca_judgment, ";
                                $sql .= "       IFNULL(bb.OldBarcode,'') as old_barcode, ";
                                $sql .= "       IFNULL(bb.ProcessType,'') as process_type, ";
                                $sql .= "       IFNULL(bb.DateTransfer,'') as B2B_date  ";
                                $sql .= "FROM furukawa.pallet_box_pallet_dtls as pb ";
                                $sql .= "join furukawa.tinspectionsheetprintdata as insp ";
                                $sql .= "on pb.box_qr = insp.BoxSerialNo ";
                                $sql .= "join formal.barcode as hs on hs.c9 = insp.lot_no and hs.c7 = insp.test_result ";
                                $sql .= "left join furukawa.tgreasehs as g on g.SerialNo = hs.c4 ";
                                $sql .= "left join formal.thermal as ins on ins.c28 = hs.c4 ";
                                $sql .= "left join furukawa.barcode_to_barcode as bb on bb.NewBarcode = hs.c4 "; 
                                $sql .= "where pb.is_deleted <> 1 ";
                                $sql .= "AND pb.pallet_id = ".$d->pallet_id."  ";
                                $sql .= "and pb.id = ".$d->box_id;

                                $hs = DB::select(DB::raw($sql));
                            ?>

                                <tr>
                                    <th style="border: 1px solid black; background-color: #F7F5EB;"></th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">HS Serial No.</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Scanned Date</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Production Line</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Operator</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Work Order</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Grease Batch</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Container No.</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">RCA Value</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">RCA Judgment</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">B2B Old Barcode</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">B2B Process Type</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">B2B Date</th>
                                </tr>
                <?php
                                foreach ($hs as $key => $h) {
                                        $h_cnt = $key+1;
                                        ?>
                                            <tr>
                                                <td style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">{{ $h_cnt }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->hs_serial }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->date_scanned }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->production_line }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->operator }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->work_order }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->grease_batch }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->grease_no }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->rca_value }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->rca_judgment }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->old_barcode }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->process_type }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->B2B_date }}</td>
                                            </tr>
                                        <?php
                                    }
                        }
                ?>
                        </tbody>
                    </table>

                <?php
                        break;

                    case 'hs_serial':
                ?>
                    <table style="border: 1px solid black">
                        <thead>
                            <tr>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Box-Pallet Entry Date</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">HS Serial</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Model</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Model Name</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Box ID</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Box Judgment</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Pallet ID</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Orig. Box Count / Pallet</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Box Count / Broken Pallet</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Pallet Status</th>
                                <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Pallet Location</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                <?php
                            foreach ($data as $key => $d) {
                ?>
                                <tr>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->created_at }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->HS_Serial }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->model }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->model_name }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->box_qr }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->box_judgement }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->pallet_qr }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->box_count_per_pallet }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->broken_pallet_qty }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->pallet_status }}</td>
                                    <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $d->pallet_location }}</td>
                                </tr>
                <?php
                            }
                ?>
                        </tbody>
                    </table>

                <?php
                        break;
                    
                    default:
                ?>
                    <table style="border: 1px solid black">
                        <thead>
                            <tr>
                                <th style="border: 1px solid black; background-color: #FEFF86;" colspan="2">Box-Pallet Entry Date</th>
                                <th style="border: 1px solid black; background-color: #FEFF86;" colspan="3">Pallet ID</th>
                                <th style="border: 1px solid black; background-color: #FEFF86;" colspan="2">Model</th>
                                <th style="border: 1px solid black; background-color: #FEFF86;" colspan="2">Model Name</th>
                                <th style="border: 1px solid black; background-color: #FEFF86;">Orig. Box Count / Pallet</th>
                                <th style="border: 1px solid black; background-color: #FEFF86;">Box Count / Broken Pallet</th>
                                <th style="border: 1px solid black; background-color: #FEFF86;" colspan="2">Pallet Status</th>
                                <th style="border: 1px solid black; background-color: #FEFF86;" colspan="2">Pallet Location</th>
                            </tr>
                        </thead>
                        <tbody>

                <?php
                        foreach ($data as $key => $d) {
                ?>
                            <tr>
                                <td style="border: 1px solid black; background-color: #FEFF86;" colspan="2">{{ $d->created_at }}</td>
                                <td style="border: 1px solid black; background-color: #FEFF86;" colspan="3">{{ $d->pallet_qr }}</td>
                                <td style="border: 1px solid black; background-color: #FEFF86;" colspan="2">{{ $d->model }}</td>
                                <td style="border: 1px solid black; background-color: #FEFF86;" colspan="2">{{ $d->model_name }}</td>
                                <td style="border: 1px solid black; background-color: #FEFF86;">{{ $d->box_count_per_pallet }}</td>
                                <td style="border: 1px solid black; background-color: #FEFF86;">{{ $d->broken_pallet_qty }}</td>
                                <td style="border: 1px solid black; background-color: #FEFF86;" colspan="2">{{ $d->pallet_status }}</td>
                                <td style="border: 1px solid black; background-color: #FEFF86;" colspan="2">{{ $d->pallet_location }}</td>
                            </tr>
                <?php

                            $sql = "SELECT DISTINCT pb.id as box_id, ";
                            $sql .= "   pb.pallet_id as pallet_id, ";
                            $sql .= "   pb.model_id as model_id, ";
                            $sql .= "   pb.box_qr as box_qr, ";
                            $sql .= "   pb.remarks as prod_remarks, ";
                            $sql .= "   IFNULL(pb.box_judgment, -1) AS box_judgement, ";
                            $sql .= "   i.production_date, ";
                            $sql .= "   i.lot_no, ";
                            $sql .= "   i.cust_part_no, ";
                            $sql .= "   i.fec_part_no, ";
                            $sql .= "   i.qty, ";
                            $sql .= "   i.weight ";
                            $sql .= "FROM pallet_box_pallet_dtls as pb ";
                            $sql .= "left join tinspectionsheetprintdata as i ";
                            $sql .= "on i.BoxSerialNo = pb.box_qr ";
                            $sql .= "where pb.is_deleted <> 1 ";
                            $sql .= "AND pb.pallet_id = ".$d->pallet_id;

                            $boxes = \DB::connection('mysql')->select(DB::raw($sql));
                            ?>
                                    
                                <tr>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;"></th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;"></th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;" colspan="3">Box ID</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;" colspan="2">Qty / Box</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;" colspan="2">Wt. / Box</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Production Date</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Lot No</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;"colspan="2">Customer PN</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">FEC PN</th>
                                    <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">Judgment</th>
                                </tr>

                            <?php

                            foreach ($boxes as $key => $b) {
                                $b_cnt = $key+1;
                                ?>
                                    <tr>
                                        <th style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;"></th>
                                        <td style="border: 1px solid black; font-weight: 700; background-color: #B0DAFF;">{{ $b_cnt }}</td>
                                        <td style="border: 1px solid black; background-color: #B0DAFF;" colspan="3">{{ $b->box_qr }}</td>
                                        <td style="border: 1px solid black; background-color: #B0DAFF;" colspan="2">{{ $b->qty }}</td>
                                        <td style="border: 1px solid black; background-color: #B0DAFF;" colspan="2">{{ $b->weight }}</td>
                                        <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $b->production_date }}</td>
                                        <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $b->lot_no }}</td>
                                        <td style="border: 1px solid black; background-color: #B0DAFF;" colspan="2">{{ $b->cust_part_no }}</td>
                                        <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $b->fec_part_no }}</td>
                                        <td style="border: 1px solid black; background-color: #B0DAFF;">{{ $b->box_judgement }}</td>
                                    </tr>

                                    <?php

                                    $sql = "SELECT distinct hs.c1 as date_scanned, ";
                                    $sql .= "       hs.c4 as hs_serial, ";
                                    $sql .= "       hs.c2 as production_line, ";
                                    $sql .= "       hs.c6 as operator, ";
                                    $sql .= "       hs.c8 as work_order, ";
                                    $sql .= "       g.GreaseBatchNo as grease_batch, ";
                                    $sql .= "       g.ContainerNo as grease_no, ";
                                    $sql .= "       ins.c7 as rca_value, ";
                                    $sql .= "       ins.c12 as rca_judgment, ";
                                    $sql .= "       IFNULL(bb.OldBarcode,'') as old_barcode, ";
                                    $sql .= "       IFNULL(bb.ProcessType,'') as process_type, ";
                                    $sql .= "       IFNULL(bb.DateTransfer,'') as B2B_date  ";
                                    $sql .= "FROM furukawa.pallet_box_pallet_dtls as pb ";
                                    $sql .= "join furukawa.tinspectionsheetprintdata as insp ";
                                    $sql .= "on pb.box_qr = insp.BoxSerialNo ";
                                    $sql .= "join formal.barcode as hs on hs.c9 = insp.lot_no and hs.c7 = insp.test_result ";
                                    $sql .= "left join furukawa.tgreasehs as g on g.SerialNo = hs.c4 ";
                                    $sql .= "left join formal.thermal as ins on ins.c28 = hs.c4 ";
                                    $sql .= "left join furukawa.barcode_to_barcode as bb on bb.NewBarcode = hs.c4 "; 
                                    $sql .= "where pb.is_deleted <> 1 ";
                                    $sql .= "AND pb.pallet_id = ".$d->pallet_id."  ";
                                    $sql .= "and pb.id = ".$b->box_id;

                                    $hs = DB::select(DB::raw($sql));
                                    ?>
                                    
                                        <tr>
                                            <th style="border: 1px solid black; background-color: #F7F5EB;"></th>
                                            <th style="border: 1px solid black; background-color: #F7F5EB;"></th>
                                            <th style="border: 1px solid black; background-color: #F7F5EB;"></th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">HS Serial No.</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Scanned Date</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Production Line</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Operator</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Work Order</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Grease Batch</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">Container No.</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">RCA Value</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">RCA Judgment</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">B2B Old Barcode</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">B2B Process Type</th>
                                            <th style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">B2B Date</th>
                                        </tr>

                                    <?php

                                    foreach ($hs as $key => $h) {
                                        $h_cnt = $key+1;
                                        ?>
                                            <tr>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;"></td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;"></td>
                                                <td style="border: 1px solid black; font-weight: 700; background-color: #F7F5EB;">{{ $h_cnt }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->hs_serial }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->date_scanned }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->production_line }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->operator }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->work_order }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->grease_batch }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->grease_no }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->rca_value }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->rca_judgment }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->old_barcode }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->process_type }}</td>
                                                <td style="border: 1px solid black; background-color: #F7F5EB;">{{ $h->B2B_date }}</td>
                                            </tr>
                                        <?php
                                    }
                            }
                        }
                ?>
                        </tbody>
                    </table>

                <?php
                        break;
                }
                ?>
            
                
        
</body>
</html>