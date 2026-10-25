#!/bin/bash
# BlackCrown auto deploy: pulls each configured repo when GitHub is ahead,
# then runs that repo's post step. Config: /etc/blackcrown-deploy.conf
# One repo per line:  user|/absolute/repo/path|post command (optional)
CONF=/etc/blackcrown-deploy.conf
[ -f "$CONF" ] || exit 0
while IFS='|' read -r user dir post; do
  case "$user" in ''|\#*) continue;; esac
  [ -d "$dir/.git" ] || continue
  runuser -u "$user" -- git -C "$dir" fetch -q origin 2>/dev/null || continue
  L=$(runuser -u "$user" -- git -C "$dir" rev-parse @ 2>/dev/null)
  R=$(runuser -u "$user" -- git -C "$dir" rev-parse @{u} 2>/dev/null)
  [ -n "$L" ] && [ -n "$R" ] && [ "$L" != "$R" ] || continue
  if runuser -u "$user" -- git -C "$dir" pull -q --rebase --autostash; then
    logger -t blackcrown-deploy "pulled $dir ($R)"
    if [ -n "$post" ]; then
      bash -c "$post" && logger -t blackcrown-deploy "post ok: $dir" \
        || logger -t blackcrown-deploy "POST FAILED: $dir"
    fi
  else
    logger -t blackcrown-deploy "PULL FAILED: $dir"
  fi
done < "$CONF"
