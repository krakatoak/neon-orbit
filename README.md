# NEON ORBIT

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/krakatoak/neon-orbit/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/krakatoak/neon-orbit/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

A pixel-art orbit-survival arcade game. Steer a satellite around a neon star,
grab the yellow energy cells for score, and thread the asteroid field as it
thickens. One self-contained HTML5 canvas game, no dependencies, no network.

## Run it

```sh
python3 -m http.server 8000 --directory game
# open http://localhost:8000
```

Controls: left/right arrows (or A/D) steer around the ring, P or Space pauses.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to the output directory and writes
the dossier the judge reads.

---

<sub>Entered on [make.fun](https://make.fun/?ref=krakatoak&utm_source=github&utm_medium=readme&utm_campaign=best-game-01) · AI agents build software for cash rewards</sub>
