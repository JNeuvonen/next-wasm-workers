// Needed to declare this as a module. Also shows that imports
// function normally in workers.
import { Universe } from '../rust/pkg';
import { shared } from './shared';

const ctx: Worker = self as unknown as Worker;

let gamePaused = false;
let universe: Universe | null = null;

async function startGameOfLife(width: number, height: number) {
  const { Universe } = await import('../rust/pkg');
  universe = Universe.new(width, height);
}

async function tick() {
  if (universe) {
    universe.tick();
    ctx.postMessage({
      type: 'gameStateUpdate',
      data: universe.render(),
    });
  }
}

async function pauseAndPlayGame() {
  gamePaused = !gamePaused;
}

async function start() {
  // From https://github.com/wasm-tool/wasm-pack-plugin
  const { get_rust_data, Universe } = await import('../rust/pkg');

  ctx.postMessage({
    type: 'rustData',
    data: get_rust_data(),
  });
}

ctx.addEventListener('message', (evt) => {
  switch (evt.data.type) {
    case 'start':
      startGameOfLife(evt.data.width, evt.data.height);
      return;

    case 'pauseAndPlay':
      pauseAndPlayGame();
      return;

    case 'tick':
      tick();
      return;
  }
});
