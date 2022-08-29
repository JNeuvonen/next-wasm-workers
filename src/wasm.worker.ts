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

  const vec = [];
  for (let i = 0; i < height * width; i++) {
    const randNr = Math.random();

    if (randNr < 0.4) {
      vec.push(1);
    } else {
      vec.push(0);
    }
  }

  //@ts-ignore
  universe = Universe.new(width, height, vec);
}

async function tick() {
  if (universe) {
    if (!gamePaused) {
      universe.tick();
      ctx.postMessage({
        type: 'gameStateUpdate',
        data: universe.render(),
      });
    }
  }
}

async function getCellCount() {
  if (universe) {
    ctx.postMessage({
      type: 'cellCountUpdate',
      data: universe.get_alive_cell_count(),
    });
  }
}

async function pauseAndPlayGame() {
  gamePaused = !gamePaused;
}

async function reSizeGame(width: number, height: number) {
  const vec = [];
  for (let i = 0; i < height * width; i++) {
    const randNr = Math.random();

    if (randNr < 0.4) {
      vec.push(1);
    } else {
      vec.push(0);
    }
  }

  //@ts-ignore
  universe?.resize_game(width, height, vec);
}

ctx.addEventListener('message', (evt) => {
  switch (evt.data.type) {
    case 'start':
      startGameOfLife(evt.data.width, evt.data.height);
      return;

    case 'pauseAndPlay':
      pauseAndPlayGame();
      return;

    case 'getCellCount':
      getCellCount();
      return;

    case 'reSizeGame':
      reSizeGame(evt.data.width, evt.data.height);
      return;

    case 'tick':
      tick();
      return;
  }
});
