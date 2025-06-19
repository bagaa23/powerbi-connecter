# -*- coding: utf-8 -*-
import logging
from odoo import api,fields, models
from odoo.exceptions import UserError, ValidationError
import requests
import msal

_logger = logging.getLogger(__name__)

class PbiConnect(models.Model):
    _name = 'pbi.connect'
    _description = "power bi connection"
    app_id = fields.Char(string="APP ID")
    tenant_id = fields.Char(string="tenant id")
    username = fields.Char(string="Username")
    password = fields.Char(string="Password")
    

    is_connect = fields.Boolean(string="Status") 
    access_id = fields.Char()
    workspace_ids = fields.One2many('pbi.workspace', 'connection_id', string='workspace', copy=True, readonly=True)

    @api.model
    def connect(self):
        if self.id==False:
            records = self.search([('is_connect','=',True)])
            if records:
                self = records[0]
            
        if self.id==False:
            _logger.exception('do not have connected config')
            return
        atuthority_url = 'https://login.microsoftonline.com/' + self.tenant_id
        scopes = ['https://analysis.windows.net/powerbi/api/.default']
        
        try:
            client = msal.PublicClientApplication(self.app_id,authority=atuthority_url)
            
            response = client.acquire_token_by_username_password(username=self.username,password=self.password,scopes=scopes)
            if (response.get('access_token')==None):
                _logger.exception(response.get('error_description'))
                self.is_connect = False
                return
            self.access_id = response.get('access_token')

            self.is_connect = True
        except (UserError, ValidationError):
            self.is_connect = False
            _logger.exception(UserError)

    def connect_manual(self):
        _logger.info('start connect_manual')
        if self.id==False:
            self = self.search([('is_connect','=',True)])[0]
        if self.id==False:
            _logger.exception('do not have connected config')
            return
        atuthority_url = 'https://login.microsoftonline.com/' + self.tenant_id
        scopes = ['https://analysis.windows.net/powerbi/api/.default']
        
        try:
            
            client = msal.PublicClientApplication(self.app_id,authority=atuthority_url)
            
            response = client.acquire_token_by_username_password(username=self.username,password=self.password,scopes=scopes)
            if (response.get('access_token')==None):
                _logger.exception(response.get('error_description'))
                self.is_connect = False
                return
            self.access_id = response.get('access_token')

            self.is_connect = True
        except (UserError, ValidationError):
            self.is_connect = False
            _logger.exception(UserError)

    
    def get_workspaces(self):
        if self.id==False:
            self = self.search([('is_connect','=',True)])[0]
        if self.id==False:
            _logger.exception('do not have connected config')
            return
        
        endpoint = 'https://api.powerbi.com/v1.0/myorg/groups'
        headers = {
            'Authorization': f'Bearer ' + str(self.access_id)
        }

        try:
            ws = self.env['pbi.workspace']
            response_request = requests.get(endpoint,headers=headers)
            if response_request.status_code==200:
                result = response_request.json()
                for item in result['value']:
                    try:
                        dup = ws.search([('workspace_id','=',item['id'])])
                        if len(dup)==0:
                            ws.create({
                                'name':item['name'],
                                'workspace_id':item['id'],
                                'connection_id':self.id
                            })
                    except Exception as e:
                        _logger.info(e)
                   

        except (UserError, ValidationError):
            
            _logger.exception(UserError)
    
    
        
        

        
        




    