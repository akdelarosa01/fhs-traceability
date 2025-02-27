window._ = require('lodash');

try {
    // window.Popper = require('popper.js').default;
    // window.$ = window.jQuery = require('jquery');

    // require('jquery-ui');
    // require('../plugins/bootstrap/js/bootstrap.bundle');
    // // require('./menu');
    // require('moment');
    // require('select2');
    // require('datatables.net-bs4');
    // require('datatables.net-select');
    // require('tempusdominus-bootstrap-4');
    
    // require('admin-lte');
    

} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'local',
    wsHost: '192.168.4.136',
    wsPort: 6001,
    forceTLS: false,
    disableStats: true
});
