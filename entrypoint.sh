#!/bin/sh

# Starts varnish
varnishd -a :3030 -f /etc/varnish/default.vcl -s malloc,1g &


echo "----------------------------------------------"
echo ""
echo "SERVING CACHED PROJECT ON http://localhost:3030."
echo ""
echo "----------------------------------------------"

# Starts Website
npm start
