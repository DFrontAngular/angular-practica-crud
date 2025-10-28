#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  husky_skip_init=1
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $1"
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name hook"

  readonly hook_dir="$(cd "$(dirname "$0")" && pwd -P)"
  readonly husky_dir="$(dirname "$hook_dir")"
  readonly husky_root="$(cd "$husky_dir/.." && pwd -P)"

  if [ "$husky_dir" = "$husky_root/.husky" ]; then
    export husky_root
    export PATH="$husky_root/node_modules/.bin:$PATH"
    . "$husky_dir/$hook_name"
  fi
fi
