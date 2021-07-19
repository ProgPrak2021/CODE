import sys
project_home = u'D:\User\Programming_Projects\CODE-DaWeSys\Database_communication\safeBrowsing\app\wsgi.py'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

from app import create_app
application = create_app()
