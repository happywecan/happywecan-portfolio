#!/usr/bin/env bash
set -euo pipefail

cat >/etc/sysctl.d/99-happywecan-conntrack.conf <<'EOF'
# Keep the small production VM from dropping packets when Docker/Nginx traffic
# fills the kernel connection tracking table.
net.netfilter.nf_conntrack_max = 131072
net.netfilter.nf_conntrack_tcp_timeout_established = 600
net.netfilter.nf_conntrack_tcp_timeout_time_wait = 30
net.netfilter.nf_conntrack_tcp_timeout_close_wait = 60
net.netfilter.nf_conntrack_tcp_timeout_fin_wait = 30
net.ipv4.tcp_fin_timeout = 15
net.ipv4.ip_forward = 1
EOF

modprobe nf_conntrack || true
sysctl --system

logger -t happywecan-startup "Applied conntrack sysctl tuning"
