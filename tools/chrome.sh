#!/bin/zsh
# Start a private headless Chrome on DevTools port $1 (each builder uses its own port).
PORT=${1:?port}; SP=${TMPDIR:-/tmp}/mv-chrome-$PORT
/usr/bin/pkill -f "remote-debugging-port=$PORT"; /bin/sleep 1
/bin/rm -rf $SP; /bin/mkdir -p $SP
("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --autoplay-policy=no-user-gesture-required --remote-debugging-port=$PORT --user-data-dir=$SP about:blank >/dev/null 2>&1 &)
for i in {1..40}; do /usr/bin/curl -s http://127.0.0.1:$PORT/json >/dev/null 2>&1 && exit 0; /bin/sleep 0.5; done
echo "chrome did not start"; exit 1
