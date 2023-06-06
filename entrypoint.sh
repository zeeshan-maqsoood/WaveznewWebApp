#!/usr/bin/env bash
set -Ex

function apply_path {

    echo "Check that we have GOOGLE_MAPS_API_KEY vars"
    test -n "$GOOGLE_MAPS_API_KEY"

    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_API_BASE_URL~$API_BASE_URL~g; s~TEMP_GOOGLE_MAPS_API_KEY~$GOOGLE_MAPS_API_KEY~g; s~TEMP_GA_KEY~$NEXT_PUBLIC_GA_ID~g; s~TEMP_GOOGLE_ANALYTICS_CLIENT_KEY~$CLIENT_ID~g; s~TEMP_SESSION_STORAGE_SECRET_KEY~$SESSION_STORAGE_SECRET_KEY~g; s~TEMP_STRIPE_SECRET_KEY~$STRIPE_SECRET_KEY~g; s~TEMP_BACKEND_SOCKET_SECRET_KEY~$BACKEND_SOCKET_SECRET_KEY~g; s~TEMP_SOCKET_BACKEND_URL~$SOCKET_BACKEND_URL~g; s~TEMP_VERIFICATION_URL~$VERIFICATION_URL~g; s~TEMP_CRYPTO_CIPHER~$CRYPTO_CIPHER~g; s~TEMP_SAFARI_WEB_ID~$SAFARI_WEB_ID~g; s~TEMP_APP_ID~$APP_ID~g;"
#    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_GOOGLE_MAPS_API_KEY~$GOOGLE_MAPS_API_KEY~g"
#    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_GA_KEY~$NEXT_PUBLIC_GA_ID~g"
#    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_GOOGLE_ANALYTICS_CLIENT_KEY~$CLIENT_ID~g"
#    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_SESSION_STORAGE_SECRET_KEY~$SESSION_STORAGE_SECRET_KEY~g"
#    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_STRIPE_SECRET_KEY~$STRIPE_SECRET_KEY~g"
#    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_SOCKET_BACKEND_URL~$SOCKET_BACKEND_URL~g"
#    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_BACKEND_SOCKET_SECRET_KEY~$BACKEND_SOCKET_SECRET_KEY~g"
#    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_VERIFICATION_URL~$VERIFICATION_URL~g"
#    find ./.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s~TEMP_CRYPTO_CIPHER~$CRYPTO_CIPHER~g"
}

apply_path
echo "Starting Nextjs"
exec "$@"
