#!/usr/bin/env bash
# install.sh - installs the skills and plugins listed in setup/skills.md and setup/plugins.md.
# Third-party skills and plugins come straight from their authors' repos.
# Only my own skills are copied, from ../skills in this repo.
#
#   ./install.sh --dry-run                 print every command, run nothing
#   ./install.sh                           ask before each group
#   ./install.sh --yes --skip variants     install everything except the prototype variants
#
# Groups: core, when-needed, variants
set -u

DRY_RUN=0; YES=0; SKIP=""
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --yes|-y) YES=1 ;;
    --skip) shift; SKIP="${1:-}" ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

HERE="$(cd "$(dirname "$0")" && pwd)"
ADD="npx --yes skills add"
FLAGS="-g -a claude-code -y"
GROUPS_ALL="core when-needed variants"

# Copies one of my own skills into ~/.claude/skills. Never overwrites an existing folder.
copy_my_skill() {
  dst="$HOME/.claude/skills/$1"
  if [ -e "$dst" ]; then echo "  skipped: $dst already exists"; return 0; fi
  mkdir -p "$HOME/.claude/skills" && cp -R "$HERE/../skills/$1" "$dst" && echo "  copied to $dst"
}

group_commands() {
  case "$1" in
    core) cat <<EOF
claude plugin install caveman --marketplace JuliusBrussee/caveman
claude plugin install ponytail --marketplace DietrichGebert/ponytail
claude plugin install frontend-design --marketplace anthropics/claude-plugins-official
$ADD obra/superpowers --skill verification-before-completion $FLAGS
$ADD emilkowalski/skills --skill emil-design-eng --skill animate --skill apple-design --skill mobile-native --skill review-animations --skill prototype $FLAGS
$ADD Nutlope/hallmark --skill hallmark $FLAGS
copy_my_skill decision-toolkit
EOF
    ;;
    when-needed) cat <<EOF
claude plugin install design --marketplace anthropics/knowledge-work-plugins
claude plugin install ralph-loop --marketplace anthropics/claude-plugins-official
$ADD jakubkrehel/skills --skill better-interface --skill better-layout --skill better-colors --skill better-typography --skill better-ui --skill better-accessibility --skill better-writing --skill better-motion --skill interface-review $FLAGS
$ADD emilkowalski/skills --skill break-ui --skill animation-performance $FLAGS
$ADD getsentry/skills --skill find-bugs --skill security-review $FLAGS
$ADD mattpocock/skills --skill grill-me --skill grilling $FLAGS
$ADD MengTo/Skills --skill audit-ai-design-slop --skill no-ai-design-slop $FLAGS
$ADD FeedHive/ai-slop-detector --skill ai-slop-detector $FLAGS
copy_my_skill interactive-learning
EOF
    ;;
    variants) cat <<EOF
$ADD Leonxlnx/taste-skill --skill design-taste-frontend $FLAGS
$ADD Leonxlnx/taste-skill-classics --skill minimalist-ui --skill industrial-brutalist-ui --skill high-end-visual-design --skill stitch-design-taste $FLAGS
$ADD Leonxlnx/imagegen-skills --skill imagegen-frontend-web $FLAGS
$ADD MengTo/Skills --skill build-awwwards-quality-sites $FLAGS
$ADD arhamhi/oxfords --skill oxfords $FLAGS
EOF
    ;;
  esac
}

for s in $(echo "$SKIP" | tr ',' ' '); do
  case " $GROUPS_ALL " in *" $s "*) ;; *) echo "Unknown group '$s'. Use: $GROUPS_ALL"; exit 1 ;; esac
done
if [ "$DRY_RUN" -eq 0 ]; then
  for tool in claude npx; do
    command -v "$tool" >/dev/null 2>&1 || { echo "'$tool' not found. See setup/README.md, step 0."; exit 1; }
  done
fi

FAILED=""
for name in $GROUPS_ALL; do
  case ",$SKIP," in *",$name,"*) printf '\n# %s (skipped)\n' "$name"; continue ;; esac
  if [ "$DRY_RUN" -eq 0 ] && [ "$YES" -eq 0 ]; then
    printf '\nInstall group %s? [y/N] ' "$name"
    read -r answer
    case "$answer" in y|Y|yes|YES) ;; *) echo "# $name (skipped)"; continue ;; esac
  fi
  printf '\n# %s\n' "$name"
  while IFS= read -r cmd; do
    echo "> $cmd"
    [ "$DRY_RUN" -eq 1 ] && continue
    eval "$cmd" </dev/null || FAILED="$FAILED
  $cmd"
  done <<EOF
$(group_commands "$name")
EOF
done

if [ "$DRY_RUN" -eq 1 ]; then printf '\nDry run: nothing was installed.\n'; exit 0; fi
if [ -n "$FAILED" ]; then
  printf '\nThese commands failed. Run them by hand to see why:%s\n' "$FAILED"
  exit 1
fi
printf '\nDone. Start a new Claude Code session so it picks everything up.\n'
