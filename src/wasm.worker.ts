// Needed to declare this as a module. Also shows that imports
// function normally in workers.
//@ts-ignore
import { Universe } from '../rust/pkg';
import { shared } from './shared';

const ctx: Worker = self as unknown as Worker;

let gamePaused = false;
let universe: Universe | null = null;

async function startGameOfLife(width: number, height: number) {
  //@ts-ignore
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
