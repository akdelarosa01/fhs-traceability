

    





<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        :root{--blue:#348fe2;--indigo:#8753de;--purple:#727cb6;--pink:#fb5597;--red:#ff5b57;--orange:#f59c1a;--yellow:#ffd900;--green:#32a932;--teal:#00acac;--cyan:#49b6d6;--white:#FFFFFF;--gray:#6c757d;--gray-dark:#343a40;--black:#000000;--dark:#2d353c;--dark-darker:#1a2229;--lime:#90ca4b;--light:#f2f3f4;--silver:#b6c2c9;--muted:#627884;--aqua:#49b6d6;--gray-100:#f8f9fa;--gray-200:#e9ecef;--gray-300:#dee2e6;--gray-400:#ced4da;--gray-500:#adb5bd;--gray-600:#6c757d;--gray-700:#495057;--gray-800:#343a40;--gray-900:#2d353c;--primary:#00acac;--secondary:#6c757d;--success:#00acac;--info:#49b6d6;--warning:#f59c1a;--danger:#ff5b57;--light:#f2f3f4;--dark:#2d353c;--inverse:#2d353c;--black:#000000;--white:#FFFFFF;--grey:#b6c2c9;--muted:#b6c2c9;--silver:#b6c2c9;--lime:#90ca4b;--aqua:#49b6d6;--breakpoint-xxs:0;--breakpoint-xs:360px;--breakpoint-sm:576px;--breakpoint-md:768px;--breakpoint-lg:992px;--breakpoint-xl:1200px;--breakpoint-xxl:1660px;--breakpoint-xxxl:1900px;--font-family-sans-serif:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-family-monospace:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}*,::after,::before{box-sizing:border-box}html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}body{margin:0;font-family:"Open Sans",sans-serif;font-size:.75rem;font-weight:400;line-height:1.5;color:#333;text-align:left;background-color:#dee2e6}[tabindex="-1"]:focus:not(:focus-visible){outline:0!important}hr{box-sizing:content-box;height:0;overflow:visible}h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:8px}p{margin-top:0;margin-bottom:15px}abbr[data-original-title],abbr[title]{text-decoration:underline;text-decoration:underline dotted;cursor:help;border-bottom:0;text-decoration-skip-ink:none}address{margin-bottom:1rem;font-style:normal;line-height:inherit}dl,ol,ul{margin-top:0;margin-bottom:1rem}ol ol,ol ul,ul ol,ul ul{margin-bottom:0}dt{font-weight:700}dd{margin-bottom:.5rem;margin-left:0}blockquote{margin:0 0 1rem}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}a{color:#348fe2;text-decoration:none;background-color:transparent}a:hover{color:#1968b0;text-decoration:underline}a:not([href]):not([class]){color:inherit;text-decoration:none}a:not([href]):not([class]):hover{color:inherit;text-decoration:none}code,kbd,pre,samp{font-family:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}pre{margin-top:0;margin-bottom:1rem;overflow:auto;-ms-overflow-style:scrollbar}figure{margin:0 0 1rem}img{vertical-align:middle;border-style:none}svg{overflow:hidden;vertical-align:middle}table{border-collapse:collapse}caption{padding-top:8px;padding-bottom:8px;color:#6c757d;text-align:left;caption-side:bottom}th{text-align:inherit;text-align:-webkit-match-parent}label{display:inline-block;margin-bottom:.5rem}button{border-radius:0}
        /* .row{display:flex;flex-wrap:wrap;margin-right:-15px;margin-left:-15px} */
        .row{display:block;margin-right:-15px;margin-left:-15px}
        h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:8px}
       @page{
            table{
                margin-top:500px;
            }
       }
        /* .header {
            position: fixed;
            top:10px;
            height: 100px;
        } */
        .footer {
            position: fixed;
            bottom:-80px;
            right:10px;
            text-align: right;
            font-size: 12px;
            height: 100px;
        }

        tr:nth-of-type(20n) {
            page-break-after: always;
        }
        .col-6{display:inline-block;max-width:50%}
        .col-7{display:inline-block;max-width:58.33333%}
        .col-3{display:inline-block;max-width:25%}
        .col-9{display:inline-block;max-width:75%}
        .col-10{display:inline-block;max-width:83.33333%}
        .col-12{display:inline-block;max-width:100%}
        .justify-content-center{justify-content:center!important}
        .mt-3{margin-top: 16px;}
        .mt-5{margin-top: 25px;}
        .mb-5{margin-bottom:48px;}
        .mt-2{margin-top:18px;}
        .align-self-start{align-self:flex-start!important}
        img{vertical-align:middle;border-style:none}
        img{
            height: 120px;
            width: auto;
        }
        label{
            font-size: 12px;
            font-weight: bolder;
        }
        .input_users{
             height: 20px;
             font-size: 12px;
             box-sizing: border-box;
             border: none;
             border-bottom: 2px solid black;
        }
        textarea{
            font-size: 12px;
            border:solid 2px black;
            resize: none;
            overflow:hidden;
        }
        tr:nth-child(even) {
            background-color: #bbbbbb;
          }
        tr:nth-child(add) {
            background-color: #dadada;
        }
        
        th{
            background-color: black;
            color: white;
        }
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
         
        td, th {
            border: 1px solid black;
            font-size: 10px;
            text-align: center;
            padding: 4px;
        }
        body{
            -webkit-print-color-adjust:exact !important;
            print-color-adjust:exact !important;
            background-color: white;
            /* margin-top: 425px */
        }
        td{
            height: 10px;
        }
        .pagenum:before {
         content: counter(page);
         }
    </style>
</head>
<body>
    <div class="header" >
        <div style="margin-bottom:0px" class="row">
            <div class="col-3">
                <img src="{{url('/images/ftl.png')}}" alt="Image"/>
            </div>
            <div style="line-height:20px;text-align: left" class="col-9">
                <div class="col-12"><h1 style="font-size:20px">FURUKAWA ELECTRIC THERMAL MANAGEMENT SOLUTIONS AND PRODUCTS LAGUNA INC.</h1></div>
                <div class="col-12"><p>Unit 9,10, 13,14 Metrococo Export Corp. Bldng 1,105 Industry Road,Phase 1, Laguna Technopark Brgy. Don Jose Santa Rosa Laguna</p></div>
            </div>
        </div>
        <hr style="margin-top:0;margin-bottom:0">
        <h2 style="text-align: center;margin-bottom:20px">SYSTEM REPORT</h2>
        
        <div class="row">
            <div class="col-6">
                <label style="margin-left:80px" for="model">Model:</label>
                <input style="width:200px"class="input_users"name="model" type="text" value="{{$shipment->model}}">
            </div>
            <div class="col-6">
                <label style="margin-left:23px">Container Number:</label>
                <input style="width:200px" class="input_users"name="container_no" type="text" value="{{$shipment->container_no}}">
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-6">
                <label style="margin-left:35px" for="shipment_qty">Shipment Qty:</label>
                <input style="width:200px" class="input_users"name="shipment_qty" type="text" value="{{$shipment->ship_qty}}">
            </div>
            <div class="col-6">
                <label style="margin-left:14px" for="truck_plate_no">Truck Plate Number:</label>
                <input style="width:200px" class="input_users"name="truck_plate_no" type="text" value="{{$shipment->truck_plate_no}}">
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-6">
                <label style="margin-left:20px" for="control_no">Control Number:</label>
                <input style="width:200px" class="input_users"name="control_no" type="text" value="{{$shipment->control_no}}">
            </div>
            <div class="col-6">
                <label for="Shippng_seal_no">Shipping Seal Number:</label>
                <input style="width:200px" class="input_users"name="Shippng_seal_no" type="text" value="{{$shipment->shipping_seal_no}}">
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-6">
                <label style="margin-left:20px" for="incoive_no">Invoice Number:</label>
                <input style="width:200px" class="input_users"name="incoive_no" type="text" value="{{$shipment->invoice_no}}">
            </div>
            <div class="col-6">
                <label style="margin-left:20px" for="peza_seal_no">PEZA Seal Number:</label>
                <input style="width:200px" class="input_users" name="peza_seal_no" type="text" value="{{$shipment->peza_seal_no}}">
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-12">
                <label style="margin-left:45px" for="destination"><b>Destination:</b></label>
                <input style="width:350px" name="destination" class="input_users" type="text" value="{{$shipment->destination}}">
            </div>
        </div>
    </div>

    <span class="footer pagenum"></span>
    <main>
        <table style="margin-top:20px">
            <thead>
              <tr>
                <th style="width:250px" scope="col">Pallet ID:</th>
                <th style="width:50px" scope="col">Box Qty</th>
                <th style="width:50px" scope="col">HS Qty</th>
                <th scope="col">Scan Status</th>
                <th scope="col">Verified By</th>
              </tr>
            </thead>
            <tbody>
                @foreach($shipment_details as $detail)
                <tr>
                  <td>{{$detail->pallet_qr}}</td>
                  <td>{{$detail->box_qty}}</td>
                  <td>{{$detail->hs_qty}}</td>
                  <td>ON LOAD {{$detail->created_at}}</td>
                  <td><input style="height:12px;display:inline-block;margin-bottom:0.2em"type="checkbox"> QA Inspection on Duty</td>
                </tr>
                @endforeach
                @for ($i=0;$i<20-(count($shipment_details)%20);$i++)
                {{-- @for ($i=count($shipment_details)-1;$i<39;$i++) --}}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                @endfor
            </tbody>
        </table>
        
    <table>
        <tr style="background-color:white ">
                <td style="width:250px">TOTAL</td>
                <td style="width:50px">{{$shipment->box_qty}}</td>
                <td style="width:50px">{{$shipment->ship_qty}}</td>
                <td style="width:166px">{{$shipment->pallet_qty}} OUT OF {{$shipment->pallet_qty}}</td>
                <td>COMPLETE</td>
              </tr>
    </table>

        <div class="row mt-5">
            <div style="margin-left:30px" class="col-3">
                <h5 style="text-align:center;margin-bottom:30px;margin-left:60px" >Prepared By:</h5>
                <hr style="width:100%;background-color:black;margin-left:30px">
                <h5 style="text-align:center;margin-left:60px" >{{$shipment->shipper}}</h5>
            </div>
            <div style="margin-left:20px"class="col-3">
                <h5 style="text-align:center;margin-bottom:30px;margin-left:60px" >Checked By:</h5>
                <hr style="width:100%;background-color:black;margin-left:30px">
                <h5 style="text-align:center;margin-left:60px" >Manager On Duty</h5>
            </div>
            <div style="margin-left:20px" class="col-3">
                <h5 style="text-align:center;margin-bottom:30px;margin-left:60px" >Verified By:</h5>
                <hr style="width:100%;background-color:black;margin-left:30px">
                <h5 style="text-align:center;margin-left:60px" >QC SV on Duty</h5>
            </div>
            <div style="margin-left:20px" class="col-3">
                <h5 style="text-align:center;margin-bottom:30px;margin-left:60px" >Acknowledge By:</h5>
                <hr style="width:100%;background-color:black;margin-left:30px">
                <h5 style="text-align:center;margin-left:60px" >Impex PIC</h5>
            </div>
        </div>
    </main>
    
</body>
</html>

@push('scripts')
	<script src="{{ asset('js/export.js') }}" defer></script>
@endpush