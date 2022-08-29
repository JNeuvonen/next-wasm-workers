mod utils;
use wasm_bindgen::prelude::*;
use web_sys::console::*;
use std::{fmt, cell};


// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[wasm_bindgen]
pub fn greet() {
   
    log_1(&"Hello from Rust".into());
}

#[wasm_bindgen]
pub fn get_rust_data() -> String {
   
    "Test from Rust".into()
}



#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells_alive: u32,
    cells: Vec<Cell>,
}


#[wasm_bindgen]
impl Universe {
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);
                count += self.cells[idx] as u8;
            }
        }
        count
    }



    pub fn tick(&mut self) {
        let mut next = self.cells.clone();
        let mut cells_alive_counter = 0;

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                let next_cell = match (cell, live_neighbors) {
                    (Cell::Alive, x) if x < 2 => Cell::Dead,
                    (Cell::Alive, 2) | (Cell::Alive, 3) => {
                        cells_alive_counter = cells_alive_counter + 1;
                        Cell::Alive
                    },
                    (Cell::Alive, x) if x > 3 => Cell::Dead,
                    (Cell::Dead, 3) => {
                        cells_alive_counter = cells_alive_counter + 1;
                        Cell::Alive
                    },
                    (otherwise, _) => otherwise,
                };


                next[idx] = next_cell;
            }
        }

        self.cells_alive = cells_alive_counter;
        self.cells = next;
    }
    
    pub fn new(w: u32, h: u32, vec: Vec<i32>) -> Universe {
        let width = w;
        let height = h;
        let mut cells_alive = 0;
        
        
        let cells = (0..width * height)
        .map(|i| {
            
                if vec[i as usize] == 1 {
                    cells_alive = cells_alive + 1;
                    Cell::Alive
                } else {
                    Cell::Dead
                }
            })
            .collect();

        Universe {
            width,
            height,
            cells_alive,
            cells,
        }
    }

    pub fn resize_game (&mut self, w: u32, h: u32, vec: Vec<i32>) {
        self.width = w;
        self.height = h;
        let mut cells_arr:Vec<Cell> = vec![]; 
        let mut cells_alive_helper = 0;
        for item in vec.clone() {
            if item == 1 {
                cells_arr.push(Cell::Alive);
                cells_alive_helper += cells_alive_helper;
            } else {
                cells_arr.push(Cell::Dead);
            }
        }

        self.cells = cells_arr;
        self.cells_alive = cells_alive_helper;
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn get_alive_cell_count(&self) -> u32 {
        self.cells_alive
    }

   
}

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell == Cell::Dead { '\u{26AA}' } else { '\u{1F534}' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}