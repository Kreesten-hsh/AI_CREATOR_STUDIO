#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Script d'optimisation système, nettoyage profond (+12 Go) & anti-freeze
# Conçu pour Linux Mint 22.3 sur Dell Vostro 15 3568 (HDD 5400 RPM + ZRAM)
# ==============================================================================

if [ "$EUID" -ne 0 ]; then
  echo "Erreur : Ce script doit être exécuté avec les privilèges administrateur :"
  echo "  sudo bash $0"
  exit 1
fi

echo "============================================================"
echo "  DÉBUT DU NETTOYAGE SYSTÈME & OPTIMISATIONS"
echo "============================================================"

# --- 1. Nettoyage du cache APT et journaux systemd ---
echo -e "\n[1/5] Nettoyage du cache APT et des journaux système..."
apt-get clean
journalctl --vacuum-size=50M --vacuum-time=7d
echo "Cache APT et journaux nettoyés."

# --- 2. Réduction du /swapfile de 8 Go à 2 Go (+6 Go libérés) ---
echo -e "\n[2/5] Réduction du fichier /swapfile à 2 Go (ZRAM actif en parallèle)..."
if [ -f /swapfile ]; then
  CURRENT_SWAP_SIZE=$(stat -c%s /swapfile)
  # Si supérieur à 2.5 Go (~2600000000 octets), on le réduit à 2 Go
  if [ "$CURRENT_SWAP_SIZE" -gt 2600000000 ]; then
    swapoff /swapfile || true
    dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo "/swapfile réduit à 2 Go avec succès."
  else
    echo "/swapfile fait déjà <= 2 Go, aucune modification nécessaire."
  fi
else
  echo "Aucun /swapfile trouvé, étape ignorée."
fi

# --- 3. Désinstallation complète de Snap (snap-store + snapd) (+5,5 Go libérés) ---
echo -e "\n[3/5] Suppression de snap-store et snapd..."
if command -v snap &>/dev/null || dpkg -l snapd &>/dev/null; then
  systemctl stop snapd.socket snapd.service 2>/dev/null || true
  apt-get purge -y snapd gnome-software-plugin-snap 2>/dev/null || true
  apt-get autoremove -y --purge
  rm -rf /snap /var/snap /var/lib/snapd /var/cache/snapd /home/hasashi/snap 2>/dev/null || true
  echo "Snap et ses images ont été supprimés."
else
  echo "Snap est déjà absent du système."
fi

# --- 4. Vérification I/O Scheduler BFQ ---
echo -e "\n[4/5] Vérification de l'ordonnanceur I/O anti-freeze (BFQ)..."
modprobe bfq 2>/dev/null || true
if [ -f /sys/block/sda/queue/scheduler ]; then
  echo bfq > /sys/block/sda/queue/scheduler
  echo "Ordonnanceur actif sur /dev/sda : $(cat /sys/block/sda/queue/scheduler)"
fi

cat << 'EOF' > /etc/udev/rules.d/60-ioschedulers.rules
ACTION=="add|change", KERNEL=="sd[a-z]", ATTR{queue/rotational}=="1", ATTR{queue/scheduler}="bfq"
EOF

# --- 5. Vérification Dirty Writeback mémoire ---
echo -e "\n[5/5] Vérification du Dirty Writeback anti-freeze..."
sysctl -w vm.dirty_background_bytes=16777216
sysctl -w vm.dirty_bytes=33554432
sysctl -w vm.vfs_cache_pressure=50

cat << 'EOF' > /etc/sysctl.d/99-anti-freeze.conf
vm.dirty_background_bytes = 16777216
vm.dirty_bytes = 33554432
vm.vfs_cache_pressure = 50
EOF

echo -e "\n============================================================"
echo "  OPÉRATIONS TERMINÉES AVEC SUCCÈS !"
echo "============================================================"
df -hT /dev/sda6
swapon --show
