#!/usr/bin/env bash
export PYTHONPATH="/home/hasashi/Bureau/AI_CREATOR_STUDIO/.venv/lib/python3.12/site-packages${PYTHONPATH:+:$PYTHONPATH}"
export GRAPHIFY_NO_AUTO_REFRESH=1
exec /usr/bin/python3 "$@"
