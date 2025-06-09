

odoo.define('powerbi.pbi_report', function (require) {
    "use strict";

    var FormRenderer = require('web.FormRenderer');

    // FormRenderer-г өргөтгөж, өөрийн логикийг нэмэх
    FormRenderer.include({
        _renderView: async function () {
            await this._super.apply(this, arguments);

            console.log("Form View Rendered!");

            if (!this.state.model in ["pbi.report", "pbi.dashboard"]) {
                console.log("worong!");
                return;
            }
            var models = window['powerbi-client'].models;
            var filters_visible = this.state.data.filters_visible ? this.state.data.filters_visible : false;

            var embedConfig = {
                type: 'report',
                // uniqueId:this.state.data.report_id,
                id: this.state.data.report_id,
                accessToken: this.state.data.access_token,
                embedUrl: this.state.data.embedurl,
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
            console.log(embedConfig);
            var reportContainer = this.$el.find('#reportContainer')
            if (reportContainer.length) {
                const fullBtn = $(`
                    <button type="button" class="btn btn-secondary mb-2" id="pbiFullscreenBtn" style="float:right;">
                        ⛶ Fullscreen
                    </button>
                `);

                // Тайлангийн container-ын урд эсвэл хойно нэмэх
                reportContainer.before(fullBtn);

                $('#pbiFullscreenBtn').on('click', function () {
                    console.log("Fullscreen товч дарагдлаа");
                    report.fullscreen();
                });
                var report = powerbi.embed(reportContainer[0], embedConfig);
                // Тайлан амжилттай оруулсныг шалгах
                report.on('loaded', function () {
                    console.log('Power BI тайлан амжилттай ачаалагдлаа!');
                });

                report.on('error', function (event) {
                    console.error('Power BI тайланг ачаалахад алдаа гарлаа:', event.detail);
                });



                // var header_div = this.$el.find('div[class="o_cp_bottom"]');
                // if (header_div) header_div.hide();
            }


        },
    });
});