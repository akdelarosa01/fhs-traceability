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

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .sourceMaps()
    .scripts([
        "public/js/app.js",
        "resources/js/masters/users.js"
    ], "public/js/masters/users.js")
    .styles([
        "public/css/app.css",
    ], "public/css/masters/users.css")
    .scripts([
        "public/js/app.js",
        "resources/js/masters/page.js"
    ], "public/js/masters/page.js")
    .styles([
        "public/css/app.css",
    ], "public/css/masters/page.css")
    .scripts([
        "public/js/app.js",
        "resources/js/masters/customer.js"
    ], "public/js/masters/customer.js")
    .styles([
        "public/css/app.css",
    ], "public/css/masters/customer.css")
    .scripts([
        "public/js/app.js",
        "resources/js/masters/qa_disposition.js"
    ], "public/js/masters/qa_disposition.js")
    .styles([
        "public/css/app.css",
    ], "public/css/masters/qa_disposition.css")
    .scripts([
        "public/js/app.js",
        "resources/js/masters/disposition_reasons.js"
    ], "public/js/masters/disposition_reasons.js")
    .styles([
        "public/css/app.css",
    ], "public/css/masters/disposition_reasons.css")
    .scripts([
        "public/js/app.js",
        "resources/js/masters/box_pallet_model_matrix.js"
    ], "public/js/masters/box_pallet_model_matrix.js")
    .styles([
        "public/css/app.css",
    ], "public/css/masters/box_pallet_model_matrix.css")

    .scripts([
        "public/js/app.js",
        "resources/js/reports/pallet_tracking_history.js"
    ], "public/js/reports/pallet_tracking_history.js")
    .styles([
        "public/css/app.css",
    ], "public/css/reports/pallet_tracking_history.css")
    .scripts([
        "public/js/app.js",
        "resources/js/reports/shipping_records.js"
    ], "public/js/reports/shipping_records.js")
    .styles([
        "public/css/app.css",
    ], "public/css/reports/shipping_records.css")

    .scripts([
        "public/js/app.js",
        "resources/js/transactions/box_and_pallet_application.js"
    ], "public/js/transactions/box_and_pallet_application.js")
    .styles([
        "public/css/app.css",
    ], "public/css/transactions/box_and_pallet_application.css")
    .scripts([
        "public/js/app.js",
        "resources/js/transactions/qa_inspection.js"
    ], "public/js/transactions/qa_inspection.js")
    .styles([
        "public/css/app.css",
    ], "public/css/transactions/qa_inspection.css");