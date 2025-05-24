

{
    'name': 'BI: Power BI BG',
    'version': '1.0',
    'category': 'Hidden',
    'sequence': 350,
    'summary': "power bi connection",
    'description': " ",  
    'depends': ['base','resource'],
    'data': [
        'security/pbi_security.xml',
        'security/ir.model.access.csv',
        'views/pbi_connect.xml',
        'views/pbi_workspace.xml',
        'views/pbi_report.xml',
        'views/pbi_dashboard.xml',
        'data/service_cron.xml',
        
    ],
    'assets': {
        'web.assets_backend': [
            'powerbi/static/src/css/custom.css',
            'powerbi/static/src/js/powerbi.min.js',   
            'powerbi/static/src/js/powerbireport.js',
                     
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
