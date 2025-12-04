/*
--- Day 4: Printing Department ---

You ride the escalator down to the printing department. They're clearly getting ready for Christmas; they have lots of large rolls of paper everywhere, and there's even a massive printer in the corner (to handle the really big print jobs).

Decorating here will be easy: they can make their own decorations. What you really need is a way to get further into the North Pole base while the elevators are offline.

"Actually, maybe we can help with that," one of the Elves replies when you ask for help. "We're pretty sure there's a cafeteria on the other side of the back wall. If we could break through the wall, you'd be able to keep moving. It's too bad all of our forklifts are so busy moving those big rolls of paper around."

If you can optimize the work the forklifts are doing, maybe they would have time to spare to break through the wall.

The rolls of paper (@) are arranged on a large grid; the Elves even have a helpful diagram (your puzzle input) indicating where everything is located.

For example:

..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.

The forklifts can only access a roll of paper if there are fewer than four rolls of paper in the eight adjacent positions. If you can figure out which rolls of paper the forklifts can access, they'll spend less time looking and more time breaking down the wall to the cafeteria.

In this example, there are 13 rolls of paper that can be accessed by a forklift (marked with x):

..xx.xx@x.
x@@.@.@.@@
@@@@@.x.@@
@.@@@@..@.
x@.@@@@.@x
.@@@@@@@.@
.@.@.@.@@@
x.@@@.@@@@
.@@@@@@@@.
x.x.@@@.x.

Consider your complete diagram of the paper roll locations. How many rolls of paper can be accessed by a forklift?
*/

function addPadding(rawGrid: string[][]): string[][] {
  if (rawGrid.length === 0) return [];

  const width: number = rawGrid[0]?.length as number;

  const paddingRow: string[] = new Array(width + 2).fill('.');

  return [
    [...paddingRow],
    ...rawGrid.map(row => ['.', ...row, '.']),
    [...paddingRow]
  ]
}

function solution(rawGrid: string[][]): number {
  if (!rawGrid.length || !rawGrid[0]?.length) return 0;

  let totalRolls = 0;

  const grid: string[][] = addPadding(rawGrid);
  const rows: number = grid.length as number;
  const cols: number = grid[0]?.length as number;

  // Iterate through the core grid (skipping the padding border)
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {

      // Must be a roll of paper to be removed
      if (grid[r]?.[c] !== '@') continue;
      let rollCount: number = 0;

      // Check all 8 neighbors
      for (let nr = r - 1; nr <= r + 1; nr++) {
        for (let nc = c - 1; nc <= c + 1; nc++) {

          // Skip current cell
          if (nr == r && nc == c) continue;

          // Check for '@'
          if (grid[nr]?.[nc] == '@') rollCount++;
        }
      }
      if (rollCount < 4) {
        totalRolls++;
      }
    }
  }

  return totalRolls;
}

const rawData = [
  "..@@.@@@@.",
  "@@@.@.@.@@",
  "@@@@@.@.@@",
  "@.@@@@..@.",
  "@@.@@@@.@@",
  ".@@@@@@@.@",
  ".@.@.@.@@@",
  "@.@@@.@@@@",
  ".@@@@@@@@.",
  "@.@.@@@.@.",
]

const mockData: string[][] = rawData.map(row => row.split(''));

let output = solution(mockData);
console.log("Test solution 1:", output);

try {
  const file: Bun.BunFile = Bun.file("input.txt");
  if (await file.exists()) {
    const rawText: string = await file.text();
    const inputData: string[][] = rawText.trim().split('\n').map(row => row.split(''));
    output = solution(inputData);
    console.log("Solution 1:", output);
  } else {
    console.error("Error: file input.txt does not exists");
  }
} catch (e) {
  console.error("Unexpected error has occurred:", e);
}

/*
--- Part Two ---

Now, the Elves just need help accessing as much of the paper as they can.

Once a roll of paper can be accessed by a forklift, it can be removed. Once a roll of paper is removed, the forklifts might be able to access more rolls of paper, which they might also be able to remove. How many total rolls of paper could the Elves remove if they keep repeating this process?

Starting with the same example as above, here is one way you could remove as many rolls of paper as possible, using highlighted @ to indicate that a roll of paper is about to be removed, and using x to indicate that a roll of paper was just removed:

Initial state:
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.

Remove 13 rolls of paper:
..xx.xx@x.
x@@.@.@.@@
@@@@@.x.@@
@.@@@@..@.
x@.@@@@.@x
.@@@@@@@.@
.@.@.@.@@@
x.@@@.@@@@
.@@@@@@@@.
x.x.@@@.x.

Remove 12 rolls of paper:
.......x..
.@@.x.x.@x
x@@@@...@@
x.@@@@..x.
.@.@@@@.x.
.x@@@@@@.x
.x.@.@.@@@
..@@@.@@@@
.x@@@@@@@.
....@@@...

Remove 7 rolls of paper:
..........
.x@.....x.
.@@@@...xx
..@@@@....
.x.@@@@...
..@@@@@@..
...@.@.@@x
..@@@.@@@@
..x@@@@@@.
....@@@...

Remove 5 rolls of paper:
..........
..x.......
.x@@@.....
..@@@@....
...@@@@...
..x@@@@@..
...@.@.@@.
..x@@.@@@x
...@@@@@@.
....@@@...

Remove 2 rolls of paper:
..........
..........
..x@@.....
..@@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@x.
....@@@...

Remove 1 roll of paper:
..........
..........
...@@.....
..x@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
...x@.....
...@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
....x.....
...@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
..........
...x@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Stop once no more rolls of paper are accessible by a forklift. In this example, a total of 43 rolls of paper can be removed.

Start with your original diagram. How many rolls of paper in total can be removed by the Elves and their forklifts?
*/

function solution2(rawGrid: string[][], verbose: boolean): number {
  if (!rawGrid.length || !rawGrid[0]?.length) return 0;

  let totalRolls: number = 0;
  let rollsRemovedInRound: number = 0;

  const grid: string[][] = addPadding(rawGrid);
  const rows: number = grid.length as number;
  const cols: number = grid[0]?.length as number;

  // Iterate through the core grid (skipping the padding border)
  do {
    rollsRemovedInRound = 0;
    const toRemove: { r: number, c: number }[] = [];

    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {

        // Must be a roll of paper to be removed
        if (grid[r]?.[c] !== '@') continue;
        let rollCount: number = 0;

        // Check all 8 neighbors
        for (let nr = r - 1; nr <= r + 1; nr++) {
          for (let nc = c - 1; nc <= c + 1; nc++) {

            // Skip current cell
            if (nr == r && nc == c) continue;

            // Check for '@'
            if (grid[nr]?.[nc] == '@') rollCount++;
          }
        }
        if (rollCount < 4) {
          toRemove.push({ r, c })
        }
      }
    }

    // Execute removals
    for (const coords of toRemove) {
      grid[coords.r]![coords.c] = 'x'; // Mark as removed
    }

    rollsRemovedInRound = toRemove.length;
    totalRolls += rollsRemovedInRound;

    if (verbose)
      console.log(`Removed ${rollsRemovedInRound} rolls this round.`)
  } while (rollsRemovedInRound > 0);

  return totalRolls;
}


try {
  const file: Bun.BunFile = Bun.file("input.txt");
  if (await file.exists()) {
    const rawText: string = await file.text();
    const inputData: string[][] = rawText.trim().split('\n').map(row => row.split(''));
    output = solution2(inputData, false);
    console.log("Solution 2:", output);
  } else {
    console.error("Error: file input.txt does not exists");
  }
} catch (e) {
  console.error("Unexpected error has occurred:", e);
}
