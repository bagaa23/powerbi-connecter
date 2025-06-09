

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
        'views/blocks.xml',
        
    ],
    'images': ['static/description/icon.png'],
    'assets': {
        'web.assets_backend': [
            'powerbi-connecter/static/src/css/custom.css',
            'powerbi-connecter/static/src/js/powerbi.min.js',   
            'powerbi-connecter/static/src/js/powerbireport.js',
                     
        ],
         'web.assets_frontend': [
            'powerbi-connecter/static/src/js/user_records_snippet.js',
            'powerbi-connecter/static/src/js/user_reports_snippet.js',
    ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
