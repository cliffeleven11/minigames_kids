import { v4 as uuidv4 } from 'uuid';

const FRUITS = ['🍎','🍌','🍇','🍊','🍓','🍍','🍐','🍒'];
const ANIMAL_DATA = [
  { id: 'monkey', animal: '🐒', food: '🍌' },
  { id: 'cat', animal: '🐱', food: '🐟' },
  { id: 'rabbit', animal: '🐰', food: '🥕' },
  { id: 'dog', animal: '🐶', food: '🦴' },
  { id: 'cow', animal: '🐮', food: '🌿' }
];

export function generateCountingFruitsQuestions(count = 5) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const emoji = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    const answer = Math.floor(Math.random() * 9) + 1; // 1-9
    const options = new Set([answer]);
    while (options.size < 3) {
      options.add(Math.floor(Math.random() * 10) + 1);
    }

    const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

    questions.push({
      id: uuidv4(),
      type: 'counting_fruits',
      emoji,
      answer,
      options: shuffled,
      title: `Berapa banyak ${emoji}?`
    });
  }
  return questions;
}

export function generateFindMatchAnimalsQuestion() {
  // Returns full set of pairs (animals and shuffled foods)
  const items = JSON.parse(JSON.stringify(ANIMAL_DATA));
  const animals = items.map(it => ({ id: it.id, emoji: it.animal }));
  const foods = items.map(it => ({ id: it.id, emoji: it.food }));
  // Shuffle foods
  foods.sort(() => Math.random() - 0.5);

  return {
    id: uuidv4(),
    type: 'find_match_animals',
    animals,
    foods
  };
}

export function generateMazeRabbitQuestion() {
  // Basic static maze for now, can extend to random mazes
  const mazeLayout = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,0,0,1,1,3,1],
    [1,1,1,1,1,1,1,1,1,1]
  ];

  return {
    id: uuidv4(),
    type: 'maze_rabbit',
    layout: mazeLayout,
    start: { x: 1, y: 1 },
    finishValue: 3
  };
}

// New generators: shapes, alphabet, memory pairs
export function generateShapeQuestions(count = 6) {
  const SHAPES = [
    { id: 'circle', name: 'Lingkaran', emoji: '⚪' },
    { id: 'square', name: 'Persegi', emoji: '⬛' },
    { id: 'triangle', name: 'Segitiga', emoji: '🔺' },
    { id: 'star', name: 'Bintang', emoji: '⭐' },
    { id: 'heart', name: 'Hati', emoji: '❤️' },
    { id: 'oval', name: 'Oval', emoji: '🟠' }
  ];

  const questions = [];
  for (let i = 0; i < count; i++) {
    const correct = SHAPES[i % SHAPES.length];
    const options = [correct];
    while (options.length < 3) {
      const candidate = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      if (!options.find(o => o.id === candidate.id)) options.push(candidate);
    }
    options.sort(() => Math.random() - 0.5);
    questions.push({ id: uuidv4(), type: 'shape', title: `Pilih bentuk ${correct.name}`, shape: correct, options });
  }
  return questions;
}

export function generateAlphabetQuestions(count = 15) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const questions = [];
  for (let i = 0; i < count; i++) {
    const correct = letters[Math.floor(Math.random() * letters.length)];
    const options = new Set([correct]);
    while (options.size < 3) {
      options.add(letters[Math.floor(Math.random() * letters.length)]);
    }
    const shuffled = Array.from(options).sort(() => Math.random() - 0.5);
    questions.push({ id: uuidv4(), type: 'alphabet', title: `Pilih huruf ${correct}`, letter: correct, options: shuffled });
  }
  return questions;
}

export function generateMemoryPairsQuestion(pairs = 6) {
  const POOLS = ['🐶','🐱','🐵','🐰','🐻','🦊','🐼','🐯','🦁','🐸','🐷'];
  const selected = POOLS.slice(0, pairs);
  const cards = [];
  selected.forEach((emoji) => {
    cards.push({ id: uuidv4(), emoji });
    cards.push({ id: uuidv4(), emoji });
  });
  cards.sort(() => Math.random() - 0.5);
  return { id: uuidv4(), type: 'memory_pairs', cards };
}

export default {
  generateCountingFruitsQuestions,
  generateFindMatchAnimalsQuestion,
  generateMazeRabbitQuestion,
  generateShapeQuestions,
  generateAlphabetQuestions,
  generateMemoryPairsQuestion
};