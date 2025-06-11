
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
                        container.innerHTML = `<ul>` +
                            data.result.map(r => `<li><strong>${r.name}</strong>: <a href="'/pbi-connecter/view/dashboard/${r.id}'" class="btn btn-primary">View</a></li>`).join('') + '</ul>';
                    })
                    .catch(() => {
                        this.el.querySelector('#dashbiard-list').innerHTML = '<p>Error loading dashboards.</p>';
                    });
            });
        }
    });

    publicWidget.registry.DashboardFrame = publicWidget.Widget.extend({
        selector: '.s_powerbi_dashboard',
        start: function () {
            const el = this.el;
            const reportContainer = el.querySelector('#reportContainer');
            const token = el.dataset.token;
            const embedUrl = el.dataset.embedUrl;
            const reportId = el.dataset.reportId;
            const filters_visible = el.dataset.filters_visible === 'True' ? true : false;

            setTimeout(function () {
                try {
                    if (!reportContainer || typeof powerbi === 'undefined') {
                        console.error("Power BI embed хийхэд шаардлагатай элемент, эсвэл powerbi client ачаалагдаагүй байна.");
                        return;
                    }

                    var models = window['powerbi-client'].models;


                    var embedConfig = {
                        type: 'report',
                        // uniqueId:this.state.data.report_id,
                        id: reportId,
                        accessToken: token,
                        embedUrl: embedUrl,
                        permissions: models.Permissions.All,
                        tokenType: models.TokenType.Aad,
                        settings: {
                            panes: {
                                filters: {
                                    visible: filters_visible
                                }
                            },
                            allowFullScreen: true
                        }

                    };
                    // console.log(embedConfig);

                    var report = powerbi.embed(reportContainer, embedConfig);
                    // console.log("report объект", report);
                    report.on("loaded", function () {
                        console.log("Dashboard loaded");
                        const btn = document.querySelector('#pbiFullscreenBtn');
                        if (btn) {
                            btn.onclick = function () {
                                console.log("Fullscreen товч дарагдлаа");
                                report.fullscreen();
                            };
                        }
                    });
                    report.on("error", function (event) {
                        console.error("Power BI Embed Error", event.detail);
                    });
                } catch (e) {
                    console.error("Power BI Embed Error:", e);
                }
            }, 0);
        }
    });

});
