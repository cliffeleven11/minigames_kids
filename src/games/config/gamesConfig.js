/**
 * Game Configurations
 * Berisi konfigurasi semua game yang tersedia di aplikasi
 * Dirancang khusus untuk anak PAUD (0-5 tahun)
 */

export const GAMES_CONFIG = {
  counting_fruits: {
    id: 'counting_fruits',
    name: 'Hitung Buah 🍎',
    description: 'Hitung jumlah buah dengan benar',
    category: 'counting',
    difficulty: 'easy',
    ageRange: '2-5',
    icon: '🍎',
    duration: 120, // seconds
    questions: 10,
    colorful: true,
    sounds: true,
    rewards: {
      correct: 10,
      wrongAttempt: 0,
      completion: 50
    }
  },

  find_match_animals: {
    id: 'find_match_animals',
    name: 'Pasang Hewan 🦁',
    description: 'Pasangkan hewan dengan pasangannya',
    category: 'matching',
    difficulty: 'easy',
    ageRange: '2-5',
    icon: '🦁',
    duration: 150,
    questions: 8,
    colorful: true,
    sounds: true,
    rewards: {
      correct: 15,
      wrongAttempt: 0,
      completion: 50
    }
  },

  maze_rabbit: {
    id: 'maze_rabbit',
    name: 'Maze Kelinci 🐰',
    description: 'Bantu kelinci keluar dari labirin',
    category: 'puzzle',
    difficulty: 'medium',
    ageRange: '3-5',
    icon: '🐰',
    duration: 180,
    questions: 5,
    colorful: true,
    sounds: true,
    rewards: {
      correct: 20,
      wrongAttempt: 0,
      completion: 50
    }
  },

  color_learn: {
    id: 'color_learn',
    name: 'Belajar Warna 🌈',
    description: 'Pelajari dan identifikasi warna-warna',
    category: 'learning',
    difficulty: 'easy',
    ageRange: '2-4',
    icon: '🌈',
    duration: 100,
    questions: 10,
    colorful: true,
    sounds: true,
    rewards: {
      correct: 10,
      wrongAttempt: 0,
      completion: 40
    }
  },

  shape_recognition: {
    id: 'shape_recognition',
    name: 'Kenal Bentuk 🟠',
    description: 'Kenali berbagai bentuk geometri',
    category: 'learning',
    difficulty: 'easy',
    ageRange: '3-5',
    icon: '🟠',
    duration: 120,
    questions: 8,
    colorful: true,
    sounds: true,
    rewards: {
      correct: 10,
      wrongAttempt: 0,
      completion: 45
    }
  },

  alphabet_quiz: {
    id: 'alphabet_quiz',
    name: 'Kuis Huruf A-Z 🔤',
    description: 'Pelajari huruf dan suaranya',
    category: 'learning',
    difficulty: 'medium',
    ageRange: '3-5',
    icon: '🔤',
    duration: 150,
    questions: 15,
    colorful: true,
    sounds: true,
    rewards: {
      correct: 8,
      wrongAttempt: 0,
      completion: 50
    }
  },

  memory_pairs: {
    id: 'memory_pairs',
    name: 'Memory Pairs 🧠',
    description: 'Pasangkan kartu yang sama',
    category: 'memory',
    difficulty: 'easy',
    ageRange: '3-6',
    icon: '🧠',
    duration: 120,
    questions: 6,
    colorful: true,
    sounds: true,
    rewards: {
      correct: 12,
      wrongAttempt: 0,
      completion: 60
    }
  }
};

/**
 * Game Pertanyaan Contoh
 * Untuk setiap game dengan pertanyaan dinamis
 */
export const GAME_QUESTIONS = {
  counting_fruits: [
    {
      id: 1,
      type: 'count',
      title: 'Berapa banyak apel?',
      emoji: '🍎',
      count: 3,
      options: [1, 3, 5],
      hint: 'Hitung satu per satu'
    },
    {
      id: 2,
      type: 'count',
      title: 'Berapa banyak pisang?',
      emoji: '🍌',
      count: 2,
      options: [2, 3, 4],
      hint: 'Ada dua buah'
    },
    {
      id: 3,
      type: 'count',
      title: 'Berapa banyak strawberry?',
      emoji: '🍓',
      count: 4,
      options: [3, 4, 5],
      hint: 'Hitung dengan jari'
    },
    {
      id: 4,
      type: 'count',
      title: 'Berapa banyak anggur?',
      emoji: '🍇',
      count: 5,
      options: [4, 5, 6],
      hint: 'Ada lima buah'
    },
    {
      id: 5,
      type: 'count',
      title: 'Berapa banyak jeruk?',
      emoji: '🍊',
      count: 1,
      options: [1, 2, 3],
      hint: 'Hanya satu'
    }
  ],

  find_match_animals: [
    {
      id: 1,
      type: 'matching',
      pairs: [
        { emoji: '🐱', name: 'Kucing', match: 'kucing' },
        { emoji: '🐶', name: 'Anjing', match: 'anjing' },
        { emoji: '🐭', name: 'Tikus', match: 'tikus' },
        { emoji: '🐹', name: 'Hamster', match: 'hamster' }
      ]
    }
  ],

  color_learn: [
    {
      id: 1,
      type: 'color',
      title: 'Mana warna merah?',
      question: 'Pilih kotak berwarna merah',
      color: 'red',
      options: [
        { color: 'red', label: 'Merah' },
        { color: 'blue', label: 'Biru' },
        { color: 'green', label: 'Hijau' }
      ]
    },
    {
      id: 2,
      type: 'color',
      title: 'Mana warna biru?',
      question: 'Pilih kotak berwarna biru',
      color: 'blue',
      options: [
        { color: 'yellow', label: 'Kuning' },
        { color: 'blue', label: 'Biru' },
        { color: 'red', label: 'Merah' }
      ]
    }
  ]
};

/**
 * Konfigurasi Game untuk Pengembangan Anak
 * Berdasarkan teori Piaget dan perkembangan kognitif anak
 */
export const CHILD_DEVELOPMENT_FEATURES = {
  age_2_3: {
    name: 'Bayi - Toddler (2-3 tahun)',
    characteristics: ['Sensory play', 'Large objects', 'Bright colors', 'Simple sounds'],
    games: ['color_learn'],
    gameFeatures: {
      complexity: 'minimal',
      interaction: 'touch-based',
      duration: 60, // seconds
      soundVolume: 0.6
    }
  },
  age_3_4: {
    name: 'Toddler - Preschool (3-4 tahun)',
    characteristics: ['Pattern recognition', 'Basic counting', 'Simple matching', 'Sound awareness'],
    games: ['counting_fruits', 'shape_recognition', 'color_learn'],
    gameFeatures: {
      complexity: 'simple',
      interaction: 'touch & click',
      duration: 120,
      soundVolume: 0.7
    }
  },
  age_4_5: {
    name: 'Preschool - Early Kindergarten (4-5 tahun)',
    characteristics: ['Problem solving', 'Memory building', 'Language development', 'Fine motor skills'],
    games: ['find_match_animals', 'maze_rabbit', 'alphabet_quiz'],
    gameFeatures: {
      complexity: 'moderate',
      interaction: 'full interaction',
      duration: 150,
      soundVolume: 0.8
    }
  }
};

export default GAMES_CONFIG;
