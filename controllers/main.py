from odoo import http
from odoo.http import request

class PowerBiConnectorWeb(http.Controller):

    @http.route('/pbi-connecter/mybi/dashboards', type='json', auth='user', csrf=False)
    def get_user_dashboards(self):
        user = request.env.user
        
        dashboards = request.env['pbi.dashboard'].sudo().search([
            ('access_users', 'in', [user.id])
        ])
       
        return [{'id':r.id,'name': r.name, 'report_id': r.report_id} for r in dashboards]
    
    @http.route('/pbi-connecter/mybi/reports', type='json', auth='user', csrf=False)
    def get_user_reports(self):
        user = request.env.user
        
        reports = request.env['pbi.report'].sudo().search([
            ('access_users', 'in', [user.id])
        ])
        
        return [{'id':r.id,'name': r.name, 'report_id': r.report_id} for r in reports]
    
    @http.route('/pbi-connecter/view/dashboard/<int:dashboard_id>', auth='user', website=True)
    def view_dashboard(self, dashboard_id, **kwargs):
        dashboard = request.env['pbi.dashboard'].sudo().browse(dashboard_id)

        # Optional: check if current user has permission
        if request.env.user not in dashboard.access_users:
            return request.not_found()

        return request.render('powerbi-connecter.template_dashboard_view', {
            'dashboard_id': dashboard.id,
            'embed_url': dashboard.embedurl,
            'access_token': dashboard.access_token,
            'report_id': dashboard.report_id,
            'filters_visible':dashboard.filters_visible
        })