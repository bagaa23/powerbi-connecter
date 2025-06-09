
odoo.define('powerbi-connecter.user_records_snippet', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');

    
    publicWidget.registry.UserDashboardSnippet = publicWidget.Widget.extend({
        selector: '.s_pbi_dashboard',
        start: function () {
            return this._super.apply(this, arguments).then(() => {
                fetch('/pbi-connecter/mybi/dashboards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({})
                })
                .then(response => response.json())
                .then(data => {
                    const container = this.el.querySelector('#dashbiard-list');
                    if (!data.result) {
                        container.innerHTML = '<p>No records found.</p>';
                        return;
                    }
                    container.innerHTML = `<ul><a t-att-href="'/pbi-connecter/view/dashboard/%s' % ${ r.id }" class="btn btn-primary">View</a>`+
                    data.result.map(r => `<li><strong>${r.name}</strong>: ${r.report_id}</li>`).join('') + '</ul>';
                })
                .catch(() => {
                    this.el.querySelector('#dashbiard-list').innerHTML = '<p>Error loading dashboards.</p>';
                });
            });
        }
    });

});
