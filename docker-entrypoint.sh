#!/bin/sh
# Writes the runtime configuration the app loads on start-up (/config.json), then runs nginx.
#
#   OAUTH_ISSUER     OIDC issuer URL
#   OAUTH_CLIENT_ID  OIDC client id
#
# Unset or empty variables are left out, so the app keeps its compiled-in value for them.
set -eu

CONFIG_FILE="${CONFIG_FILE:-/usr/share/nginx/html/config.json}"

json_escape() {
    printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

{
    printf '{'
    separator=''
    if [ -n "${OAUTH_ISSUER:-}" ]; then
        printf '"issuer":"%s"' "$(json_escape "$OAUTH_ISSUER")"
        separator=','
    fi
    if [ -n "${OAUTH_CLIENT_ID:-}" ]; then
        printf '%s"clientId":"%s"' "$separator" "$(json_escape "$OAUTH_CLIENT_ID")"
    fi
    printf '}\n'
} >"$CONFIG_FILE"

exec nginx -c /etc/nginx/nginx.conf "$@"
