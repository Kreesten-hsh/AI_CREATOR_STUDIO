#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Script d'optimisation système & anti-freeze pour Linux Mint
# Conçu spécialement pour disque dur mécanique (HDD 5400 RPM) et processeur dual-core
# ==============================================================================

if [ "$EUID" -ne 0 ]; then
  echo "Erreur : Ce script doit être exécuté avec les privilèges administrateur :"
  echo "  sudo bash optimiser_systeme.sh"
  exit 1
fi

echo "============================================================"
echo "  DÉBUT DES OPTIMISATIONS SYSTÈME & ANTI-FREEZE"
echo "============================================================"

# --- 1. Nettoyage du cache APT ---
echo -e "\n[1/5] Nettoyage des paquets APT archivés..."
apt-get clean
echo "Cache APT vidé (/var/cache/apt/archives)."

# --- 2. Nettoyage des journaux systemd ---
echo -e "\n[2/5] Nettoyage des journaux système (conservation max 7j et 50 Mo)..."
journalctl --vacuum-size=50M --vacuum-time=7d
echo "Journaux système nettoyés."

# --- 3. Suppression des vieux noyaux inutilisés ---
echo -e "\n[3/5] Nettoyage des anciens noyaux Linux obsolètes..."
CURRENT_KERNEL=$(uname -r)
echo "Noyau actuellement actif (préservé) : $CURRENT_KERNEL"

DEPRECATED_KERNELS=(
  "linux-image-7.0.0-31-generic"
  "linux-modules-7.0.0-31-generic"
  "linux-image-7.0.0-38-generic"
  "linux-modules-7.0.0-38-generic"
)

for pkg in "${DEPRECATED_KERNELS[@]}"; do
  if dpkg -l "$pkg" &>/dev/null; then
    echo "Suppression du paquet $pkg..."
    apt-get purge -y "$pkg" || true
  fi
done

# Nettoyage des répertoires de modules orphelins
rm -rf /usr/lib/modules/7.0.0-31-generic /usr/lib/modules/7.0.0-38-generic 2>/dev/null || true

# Mise à jour du menu de démarrage GRUB
if command -v update-grub &>/dev/null; then
  echo "Mise à jour de GRUB..."
  update-grub
fi
echo "Nettoyage des anciens noyaux terminé."

# --- 4. Activation de l'I/O Scheduler BFQ (Budget Fair Queueing) ---
echo -e "\n[4/5] Configuration de l'ordonnanceur I/O anti-freeze (BFQ)..."
modprobe bfq 2>/dev/null || true

if [ -f /sys/block/sda/queue/scheduler ]; then
  echo bfq > /sys/block/sda/queue/scheduler
  echo "Ordonnanceur actif sur /dev/sda : $(cat /sys/block/sda/queue/scheduler)"
fi

# Rendre BFQ persistant à chaque démarrage via une règle UDEV
cat << 'EOF' > /etc/udev/rules.d/60-ioschedulers.rules
# Appliquer l'ordonnanceur BFQ sur tous les disques durs rotatifs (HDD) pour fluidifier le bureau
ACTION=="add|change", KERNEL=="sd[a-z]", ATTR{queue/rotational}=="1", ATTR{queue/scheduler}="bfq"
EOF
echo "Règle UDEV créée dans /etc/udev/rules.d/60-ioschedulers.rules"

# --- 5. Optimisation du Dirty Writeback mémoire ---
echo -e "\n[5/5] Configuration de la gestion mémoire anti-freeze (Dirty Writeback)..."
# Écriture par petits blocs au lieu d'accumuler 1 Go de writes
sysctl -w vm.dirty_background_bytes=16777216
sysctl -w vm.dirty_bytes=33554432
sysctl -w vm.vfs_cache_pressure=50

# Rendre permanent après redémarrage
cat << 'EOF' > /etc/sysctl.d/99-anti-freeze.conf
# Optimisation anti-freeze pour disque mécanique (HDD 5400 RPM)
# Évite que Linux sature le disque avec des rafales d'écritures géantes
vm.dirty_background_bytes = 16777216
vm.dirty_bytes = 33554432
vm.vfs_cache_pressure = 50
EOF
echo "Configuration persistante enregistrée dans /etc/sysctl.d/99-anti-freeze.conf"

echo -e "\n============================================================"
echo "  TOUTES LES ÉTAPES ONT ÉTÉ APPLIQUÉES AVEC SUCCÈS !"
echo "============================================================"
df -h /
