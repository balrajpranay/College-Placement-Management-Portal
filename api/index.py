import os
import sys

# Add project root directory to sys.path so modules (app, db, config, routes, services) import cleanly
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app import app
