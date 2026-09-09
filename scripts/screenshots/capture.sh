#!/usr/bin/env bash
# Captures the README screenshots from a real browser window on a real screen.
#
# Method, and why each part matters:
#
#   * The window is captured on screen with `screencapture -l<windowid>`, so the image keeps
#     the macOS window shadow, the rounded corners and the material behind them. Rendering
#     the same page into an offscreen bitmap loses all three, and raising the scale factor
#     does not bring them back.
#   * `-o` is never passed: that is the flag that strips the shadow.
#   * The capture inherits the scale of the display it runs on, so it must run on a Retina
#     display. On a 1x monitor the result is silently half resolution.
#   * The window is activated immediately before the shot. An inactive window is captured
#     with a grey traffic light and dimmed controls.
#   * The window size is fixed here rather than inherited from whoever runs this, so the
#     result is reproducible on another machine.
#   * A dedicated browser instance with its own throwaway profile is launched, so only this
#     script's own window can be captured and none of the operator's windows or data are
#     touched. The browser cannot print its own window id, so the id is read from the window
#     server and narrowed to this instance's process — never guessed from a window list.
#   * The published image is lossless WebP: identical pixels, the shadow's alpha preserved,
#     and roughly 70% fewer bytes than PNG.
#   * Published width is capped at twice the widest slot the image is displayed in, because a
#     capture at display scale is only correctly sized if something renders it at half these
#     pixels.
set -euo pipefail

URL="${1:-https://linguae.martonpaulo.com/}"
OUTPUT_DIRECTORY="${2:-public/uploads}"

BROWSER="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
WINDOW_WIDTH=1280
WINDOW_HEIGHT=860
# The README renders these at 900 CSS pixels at most, so 1800 is the useful ceiling.
PUBLISHED_WIDTH=1800
SETTLE_SECONDS=6

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROFILE="$(mktemp -d "${TMPDIR:-/tmp}/catalogue-screenshot-XXXXXX")"
STAGING="$(mktemp -d "${TMPDIR:-/tmp}/catalogue-capture-XXXXXX")"
BROWSER_PID=""

cleanup() {
  [ -n "${BROWSER_PID}" ] && kill "${BROWSER_PID}" 2>/dev/null || true
  rm -rf "${PROFILE}" "${STAGING}"
}
trap cleanup EXIT

require_retina() {
  if ! system_profiler SPDisplaysDataType 2>/dev/null | grep -qi retina; then
    echo "Refusing to capture: no Retina display found, the result would be half resolution." >&2
    exit 1
  fi
}

# Seeds the throwaway profile so the browser's own first-run notices never appear over the
# page. This touches only the temporary profile this script created.
seed_profile() {
  mkdir -p "${PROFILE}"
  cat > "${PROFILE}/Local State" <<'JSON'
{
  "brave": {
    "p3a": { "notice_acknowledged": true, "enabled": false },
    "stats": { "reporting_enabled": false },
    "rewards": { "inline_tip_buttons_enabled": false }
  },
  "browser": { "enabled_labs_experiments": [] }
}
JSON
}

capture() {
  local path="$1" name="$2"

  "${BROWSER}" \
    --user-data-dir="${PROFILE}" \
    --no-first-run \
    --no-default-browser-check \
    --disable-features=Translate,PrivacySandboxSettings4 \
    --window-size="${WINDOW_WIDTH},${WINDOW_HEIGHT}" \
    --window-position=80,80 \
    --app="${URL}${path}" >/dev/null 2>&1 &
  BROWSER_PID=$!

  # Let the page load and the window settle before asking the window server for its id.
  sleep "${SETTLE_SECONDS}"

  local window_id
  window_id="$(swift "${HERE}/window-id.swift" "${BROWSER_PID}")"

  # Reactivate after the run loop has settled, so the traffic light is drawn active.
  osascript -e 'tell application "System Events" to set frontmost of (first process whose unix id is '"${BROWSER_PID}"') to true'
  sleep 1

  screencapture -x -t png -l"${window_id}" "${STAGING}/${name}.png"

  kill "${BROWSER_PID}" 2>/dev/null || true
  wait "${BROWSER_PID}" 2>/dev/null || true
  BROWSER_PID=""

  local source="${STAGING}/${name}.png"
  local width
  width="$(sips -g pixelWidth "${source}" | awk '/pixelWidth/ {print $2}')"
  echo "  captured ${name}: ${width}px wide"

  if [ "${width}" -gt "${PUBLISHED_WIDTH}" ]; then
    sips --resampleWidth "${PUBLISHED_WIDTH}" "${source}" --out "${source}" >/dev/null
  fi

  mkdir -p "${OUTPUT_DIRECTORY}"
  cwebp -lossless -alpha_q 100 -quiet "${source}" -o "${OUTPUT_DIRECTORY}/${name}.webp"
  echo "  wrote ${OUTPUT_DIRECTORY}/${name}.webp ($(du -h "${OUTPUT_DIRECTORY}/${name}.webp" | cut -f1))"
}

require_retina
seed_profile
echo "Capturing ${URL}"
capture "" "catalogue"
capture "por/" "language-detail"
