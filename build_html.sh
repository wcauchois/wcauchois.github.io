#!/bin/bash
me_jpg_b64=$(base64 -w 0 < img/me.jpg)
mustache - index.mustache > index.html <<EOF
{
  "me_jpg_b64": "${me_jpg_b64}"
}
EOF
