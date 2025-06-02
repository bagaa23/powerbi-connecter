

odoo.define('powerbi.pbi_report', function (require) {
    "use strict";

    var FormRenderer = require('web.FormRenderer');

    // FormRenderer-г өргөтгөж, өөрийн логикийг нэмэх
    FormRenderer.include({
        _renderView: async function () {
            await this._super.apply(this, arguments);

            console.log("Form View Rendered!");

            if (!this.state.model in ["pbi.report", "pbi.dashboard"]) {
                console.log("bish bn");
                return;
            }
            var models = window['powerbi-client'].models;


            var embedConfig = {
                type: 'report',
                // uniqueId:this.state.data.report_id,
                id: this.state.data.report_id,
                accessToken: this.state.data.access_token,
                embedUrl: this.state.data.embedurl,
                permissions: models.Permissions.All,
                tokenType: models.TokenType.Aad

            };
            console.log(embedConfig);
            var reportContainer = this.$el.find('#reportContainer')
            if (reportContainer.length) {
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