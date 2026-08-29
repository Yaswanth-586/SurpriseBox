import { Occasion } from '../types';

export const occasions: Occasion[] = [
  { id: 'birthday', name: 'Birthday', icon: '🎂', default_greeting: 'Happy Birthday! Wishing you a day filled with happiness, laughter, and beautiful memories.', theme: 'birthday', decorative_elements: ['🎈', '🎉', '🎁'] },
  { id: 'anniversary', name: 'Anniversary', icon: '💍', default_greeting: "Happy Anniversary! Celebrating the beautiful journey you've shared together.", theme: 'romantic', decorative_elements: ['❤️', '🥂', '✨'] },
  { id: 'valentines', name: "Valentine's Day", icon: '❤️', default_greeting: "Happy Valentine's Day! You make every moment special.", theme: 'romantic', decorative_elements: ['💖', '🌹', '💌'] },
  { id: 'christmas', name: 'Christmas', icon: '🎄', default_greeting: 'Merry Christmas! May your day be filled with warmth, joy, and love.', theme: 'christmas', decorative_elements: ['❄️', '🎁', '⭐'] },
  { id: 'new_year', name: 'New Year', icon: '🎆', default_greeting: "Happy New Year! Here's to new beginnings and wonderful adventures.", theme: 'magical', decorative_elements: ['🎇', '🥂', '✨'] },
  { id: 'diwali', name: 'Diwali', icon: '🪔', default_greeting: 'Happy Diwali! May the festival of lights bring joy and prosperity.', theme: 'diwali', decorative_elements: ['✨', '🎇', '💮'] },
  { id: 'holi', name: 'Holi', icon: '🌈', default_greeting: 'Happy Holi! May your life be as colorful and joyful as this festival.', theme: 'holi', decorative_elements: ['🎨', '🌸', '✨'] },
  { id: 'ugadi', name: 'Ugadi', icon: '🌸', default_greeting: 'Happy Ugadi! Wishing you a wonderful new beginning.', theme: 'ugadi', decorative_elements: ['🥭', '🌼', '✨'] },
  { id: 'sankranti', name: 'Sankranti', icon: '🪁', default_greeting: 'Happy Sankranti! May this harvest festival bring abundance and happiness.', theme: 'sankranti', decorative_elements: ['🌾', '☀️', '✨'] },
  { id: 'eid', name: 'Eid', icon: '🌙', default_greeting: 'Eid Mubarak! Wishing you peace, happiness, and blessings.', theme: 'eid', decorative_elements: ['⭐', '✨', '🕌'] },
  { id: 'graduation', name: 'Graduation', icon: '🎓', default_greeting: 'Congratulations on your graduation! Your hard work has paid off.', theme: 'graduation', decorative_elements: ['📜', '🎉', '✨'] },
  { id: 'mothers_day', name: "Mother's Day", icon: '👩', default_greeting: "Happy Mother's Day! Thank you for being the amazing person you are.", theme: 'pastel', decorative_elements: ['🌸', '💝', '✨'] },
  { id: 'fathers_day', name: "Father's Day", icon: '👨', default_greeting: "Happy Father's Day! Thank you for everything you do.", theme: 'dark-luxury', decorative_elements: ['⭐', '👔', '✨'] },
  { id: 'friendship_day', name: 'Friendship Day', icon: '🤝', default_greeting: "Happy Friendship Day! Here's to the incredible bond we share.", theme: 'friendship', decorative_elements: ['🌟', '🤗', '✨'] },
  { id: 'wedding', name: 'Wedding', icon: '💐', default_greeting: 'Congratulations on your wedding! Wishing you a lifetime of love and happiness.', theme: 'wedding', decorative_elements: ['🕊️', '💍', '✨'] },
  { id: 'achievement', name: 'Achievement', icon: '🎉', default_greeting: 'Congratulations on your amazing achievement! You deserve this.', theme: 'achievement', decorative_elements: ['🏆', '⭐', '✨'] },
  { id: 'custom', name: 'Custom Occasion', icon: '✨', default_greeting: 'Something special is waiting for you...', theme: 'elegant', decorative_elements: ['✨', '🌟', '💫'] },
];

export function getOccasionById(id: string): Occasion | undefined {
  return occasions.find(o => o.id === id);
}
