export interface AnimalAvatar {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
}

export const animalAvatars: AnimalAvatar[] = [
  { id: 'fox', name: 'Fox', emoji: '🦊', gradient: 'from-orange-400 to-red-500' },
  { id: 'owl', name: 'Owl', emoji: '🦉', gradient: 'from-amber-600 to-yellow-700' },
  { id: 'cat', name: 'Cat', emoji: '🐱', gradient: 'from-orange-300 to-amber-400' },
  { id: 'dog', name: 'Dog', emoji: '🐶', gradient: 'from-yellow-400 to-orange-400' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', gradient: 'from-pink-300 to-rose-400' },
  { id: 'panda', name: 'Panda', emoji: '🐼', gradient: 'from-gray-400 to-gray-600' },
  { id: 'koala', name: 'Koala', emoji: '🐨', gradient: 'from-gray-400 to-blue-400' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', gradient: 'from-gray-700 to-blue-900' },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', gradient: 'from-purple-400 to-pink-500' },
  { id: 'dragon', name: 'Dragon', emoji: '🐲', gradient: 'from-green-500 to-emerald-600' },
];

export function getAnimalAvatar(id: string): AnimalAvatar | undefined {
  return animalAvatars.find(a => a.id === id);
}
