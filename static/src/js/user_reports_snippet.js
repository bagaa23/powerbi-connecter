
odoo.define('powerbi-connecter.user_reports_snippt', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');

    publicWidget.registry.UserReportSnippet = publicWidget.Widget.extend({
        selector: '.s_pbi_report',
        start: function () {
            return this._super.apply(this, arguments).then(() => {
                fetch('/pbi-connecter/mybi/reports', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({})
                })
                .then(response => response.json())
                .then(data => {
                    const container = this.el.querySelector('#report-list');
                    if (!data.result) {
                        container.innerHTML = '<p>No records found.</p>';
                        return;
                    }
                    container.innerHTML = '<ul>' + data.result.map(r => `<li><strong>${r.name}</strong>: ${r.report_id}</li>`).join('') + '</ul>';
                })
                .catch(() => {
                    this.el.querySelector('#report-list').innerHTML = '<p>Error loading reports.</p>';
                });
            });
        }
    });
});
