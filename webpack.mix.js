const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

const layoutCSS = [
    "resources/css/default/app.min.css",
    "resources/plugins/gritter/css/jquery.gritter.css",
    "resources/plugins/datatables.net-bs4/css/dataTables.bootstrap4.min.css",
    "resources/plugins/datatables.net-select-bs4/css/select.bootstrap4.min.css",
    "public/css/app.css"
];

const layoutJS = [
    "public/js/app.js",
    "resources/js/app.min.js",
    "resources/plugins/moment/min/moment.min.js",
    "resources/plugins/slimscroll/jquery.slimscroll.min.js",
    "resources/js/theme/default.min.js",
    "resources/plugins/gritter/js/jquery.gritter.js",
    "resources/plugins/datatables.net/js/jquery.dataTables.min.js",
    "resources/plugins/datatables.net-bs4/js/dataTables.bootstrap4.min.js",
    "resources/plugins/datatables.net-select/js/dataTables.select.min.js",
    "resources/plugins/datatables.net-select-bs4/js/select.bootstrap4.min.js",
    "resources/js/menu.js"
];

const TrxJS = [
    "resources/plugins/iziToast/dist/js/iziToast.min.js",
    "resources/plugins/iziModal/js/iziModal.js",
    "resources/plugins/Parsleyjs/dist/parsley.min.js",
    "resources/plugins/gritter/js/jquery.gritter.js",
    "resources/plugins/sweetalert2/dist/sweetalert2.all.min.js",
    "resources/js/classes/Message.js",
    "resources/js/classes/Formatter.js",
    "resources/js/classes/CustomUI.js",
    "resources/js/classes/Data.js",
    "resources/js/classes/RealTime.js",
    "resources/js/classes/Notification.js"
];

const TrxCSS = [
    "resources/plugins/iziToast/dist/css/iziToast.min.css",
    "resources/plugins/iziModal/css/iziModal.css",
    "resources/plugins/Parsleyjs/src/parsley.min.css",
    "resources/plugins/gritter/css/jquery.gritter.css",
    "resources/plugins/sweetalert2/dist/sweetalert2.min.css"
];


mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .sourceMaps()
    .scripts(layoutJS, "public/js/theme.js")
    .styles(layoutCSS, "public/css/theme.css")
    .scripts(TrxJS, "public/js/trx.js")
    .styles(TrxCSS, "public/css/trx.css")

    .scripts([
        "public/js/theme.js",
        // "public/js/trx.js",
    ], "public/js/auth.js")
    .styles([
        "public/css/theme.css",
        // "public/css/trx.css",
    ], "public/css/auth.css")

    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/home.js"
    ], "public/js/home.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/home.css")


    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/masters/users.js"
    ], "public/js/masters/users.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/masters/users.css")
    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/masters/page.js"
    ], "public/js/masters/page.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/masters/page.css")
    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/masters/customer.js"
    ], "public/js/masters/customer.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/masters/customer.css")
    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/plugins/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js",
        "resources/js/masters/qa_disposition.js"
    ], "public/js/masters/qa_disposition.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
        "resources/plugins/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css",
    ], "public/css/masters/qa_disposition.css")
    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/plugins/select2/dist/js/select2.full.min.js",
        "resources/js/masters/disposition_reasons.js"
    ], "public/js/masters/disposition_reasons.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
        "resources/plugins/select2/dist/css/select2.min.css",
        "resources/plugins/select2/dist/css/select2-bootstrap4.css",
    ], "public/css/masters/disposition_reasons.css")
    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/masters/box_pallet_model_matrix.js"
    ], "public/js/masters/box_pallet_model_matrix.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/masters/box_pallet_model_matrix.css")
    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/masters/box_ng_reasons.js"
    ], "public/js/masters/box_ng_reasons.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/masters/box_ng_reasons.css")

    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/reports/pallet_tracking_history.js"
    ], "public/js/reports/pallet_tracking_history.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/reports/pallet_tracking_history.css")
    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/reports/shipping_records.js"
    ], "public/js/reports/shipping_records.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/reports/shipping_records.css")

    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/plugins/select2/dist/js/select2.full.min.js",
        "resources/js/transactions/box_and_pallet_application.js",
        "resources/plugins/qrcodejs/qrcode.min.js",
    ], "public/js/transactions/box_and_pallet_application.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
        "resources/plugins/select2/dist/css/select2.min.css",
        "resources/plugins/select2/dist/css/select2-bootstrap4.css"
    ], "public/css/transactions/box_and_pallet_application.css")
    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/transactions/qa_inspection.js"
    ], "public/js/transactions/qa_inspection.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/transactions/qa_inspection.css")
    .scripts([
        "public/js/theme.js",
        "public/js/trx.js",
        "resources/js/transactions/warehouse.js"
    ], "public/js/transactions/warehouse.js")
    .styles([
        "public/css/theme.css",
        "public/css/trx.css",
    ], "public/css/transactions/warehouse.css");