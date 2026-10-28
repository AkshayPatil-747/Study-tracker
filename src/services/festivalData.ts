import { Festival } from '../types';

// Pre-verified Indian National Holidays & Major Religious Festivals (2024 to 2032)
// Accounts for verified lunar and solar calendar dates
const VERIFIED_FESTIVALS_MAP: Record<string, Omit<Festival, 'date'>[]> = {
  // 2024
  '2024-01-15': [{ name: 'Makar Sankranti / Pongal', category: 'major_festival', description: 'Harvest festival dedicated to the Sun God Surya', color: '#f59e0b', icon: '🪁' }],
  '2024-01-26': [{ name: 'Republic Day', category: 'national_holiday', description: 'National holiday celebrating the Indian Constitution', color: '#ef4444', icon: '🇮🇳' }],
  '2024-03-08': [{ name: 'Maha Shivratri', category: 'major_festival', description: 'Great night of Lord Shiva honoring spiritual vigilance', color: '#8b5cf6', icon: '🔱' }],
  '2024-03-25': [{ name: 'Holi', category: 'major_festival', description: 'The vibrant festival of colours and triumph of good', color: '#ec4899', icon: '🎨' }],
  '2024-03-29': [{ name: 'Good Friday', category: 'major_festival', description: 'Christian observance commemorating the crucifixion of Jesus', color: '#6366f1', icon: '✝️' }],
  '2024-04-11': [{ name: 'Eid ul-Fitr', category: 'major_festival', description: 'Islamic festival marking the end of the blessed month of Ramadan', color: '#10b981', icon: '🌙' }],
  '2024-04-17': [{ name: 'Ram Navami', category: 'major_festival', description: 'Celebration of the birth of Lord Rama', color: '#f59e0b', icon: '🏹' }],
  '2024-04-21': [{ name: 'Mahavir Jayanti', category: 'major_festival', description: 'Birth anniversary of Bhagwan Mahavira in Jainism', color: '#eab308', icon: '🪔' }],
  '2024-05-23': [{ name: 'Buddha Purnima', category: 'major_festival', description: 'Commemoration of Gautama Buddha\'s birth, enlightenment and passing', color: '#eab308', icon: '☸️' }],
  '2024-06-17': [{ name: 'Bakrid / Eid al-Adha', category: 'major_festival', description: 'Feast of the Sacrifice celebrated in Islam', color: '#10b981', icon: '🌙' }],
  '2024-08-15': [{ name: 'Independence Day', category: 'national_holiday', description: 'National holiday celebrating India\'s independence (1947)', color: '#ef4444', icon: '🇮🇳' }],
  '2024-08-19': [{ name: 'Raksha Bandhan', category: 'major_festival', description: 'Sacred knot of love and protection between brothers and sisters', color: '#ec4899', icon: '🧵' }],
  '2024-08-26': [{ name: 'Krishna Janmashtami', category: 'major_festival', description: 'Grand celebration of the birth of Lord Krishna', color: '#3b82f6', icon: '🦚' }],
  '2024-09-07': [{ name: 'Ganesh Chaturthi', category: 'major_festival', description: 'Welcoming Lord Ganesha, the remover of obstacles', color: '#f97316', icon: '🐘' }],
  '2024-10-02': [{ name: 'Mahatma Gandhi Jayanti', category: 'national_holiday', description: 'National holiday honoring the Father of the Nation', color: '#ef4444', icon: '🇮🇳' }],
  '2024-10-03': [{ name: 'Navratri Starts', category: 'major_festival', description: 'Nine nights of divine feminine energy and devotion', color: '#ec4899', icon: '🌸' }],
  '2024-10-12': [{ name: 'Dussehra / Vijayadashami', category: 'major_festival', description: 'Triumph of righteousness over evil (Ravana & Mahishasura)', color: '#f59e0b', icon: '🏹' }],
  '2024-10-20': [{ name: 'Karwa Chauth', category: 'regional_festival', description: 'Fasting and prayer for the longevity of spouses', color: '#f43f5e', icon: '🌕' }],
  '2024-10-31': [{ name: 'Diwali / Deepavali', category: 'major_festival', description: 'The supreme festival of lights, joy, and prosperity', color: '#f59e0b', icon: '🪔' }],
  '2024-11-03': [{ name: 'Bhai Dooj', category: 'major_festival', description: 'Celebrating the pious bond between siblings', color: '#f97316', icon: '✨' }],
  '2024-11-15': [{ name: 'Guru Nanak Jayanti', category: 'major_festival', description: 'Birth celebration of the first Sikh Guru, Guru Nanak Dev Ji', color: '#eab308', icon: '☬' }],
  '2024-12-25': [{ name: 'Christmas', category: 'major_festival', description: 'Celebration of the nativity of Jesus Christ', color: '#10b981', icon: '🎄' }],

  // 2025
  '2025-01-14': [{ name: 'Makar Sankranti / Pongal', category: 'major_festival', description: 'Harvest festival dedicated to Surya Deva', color: '#f59e0b', icon: '🪁' }],
  '2025-01-26': [{ name: 'Republic Day', category: 'national_holiday', description: 'Celebrating the Constitution of India', color: '#ef4444', icon: '🇮🇳' }],
  '2025-02-26': [{ name: 'Maha Shivratri', category: 'major_festival', description: 'Night of Shiva awakening spiritual inner power', color: '#8b5cf6', icon: '🔱' }],
  '2025-03-14': [{ name: 'Holi', category: 'major_festival', description: 'Festival of colors and joyous renewal', color: '#ec4899', icon: '🎨' }],
  '2025-03-31': [{ name: 'Eid ul-Fitr', category: 'major_festival', description: 'Eid celebration concluding Ramadan', color: '#10b981', icon: '🌙' }],
  '2025-04-06': [{ name: 'Ram Navami', category: 'major_festival', description: 'Birth anniversary of Lord Shri Ram', color: '#f59e0b', icon: '🏹' }],
  '2025-04-10': [{ name: 'Mahavir Jayanti', category: 'major_festival', description: 'Birth celebrations of Tirthankara Mahavira', color: '#eab308', icon: '🪔' }],
  '2025-04-18': [{ name: 'Good Friday', category: 'major_festival', description: 'Holy Friday observance in Christianity', color: '#6366f1', icon: '✝️' }],
  '2025-05-12': [{ name: 'Buddha Purnima', category: 'major_festival', description: 'Enlightenment of the Buddha', color: '#eab308', icon: '☸️' }],
  '2025-06-07': [{ name: 'Bakrid / Eid al-Adha', category: 'major_festival', description: 'Festival of faith and sacrifice', color: '#10b981', icon: '🌙' }],
  '2025-08-09': [{ name: 'Raksha Bandhan', category: 'major_festival', description: 'Bond of affection and protection', color: '#ec4899', icon: '🧵' }],
  '2025-08-15': [{ name: 'Independence Day', category: 'national_holiday', description: 'National holiday commemorating Indian Independence', color: '#ef4444', icon: '🇮🇳' }],
  '2025-08-16': [{ name: 'Krishna Janmashtami', category: 'major_festival', description: 'Birthday of Lord Krishna', color: '#3b82f6', icon: '🦚' }],
  '2025-08-27': [{ name: 'Ganesh Chaturthi', category: 'major_festival', description: 'Ganesh Utsav celebrations', color: '#f97316', icon: '🐘' }],
  '2025-09-22': [{ name: 'Navratri Starts', category: 'major_festival', description: 'Shubh Shardiya Navratri worship', color: '#ec4899', icon: '🌸' }],
  '2025-10-02': [
    { name: 'Mahatma Gandhi Jayanti', category: 'national_holiday', description: 'Birth anniversary of Mahatma Gandhi', color: '#ef4444', icon: '🇮🇳' },
    { name: 'Dussehra / Vijayadashami', category: 'major_festival', description: 'Victory of good over evil', color: '#f59e0b', icon: '🏹' }
  ],
  '2025-10-10': [{ name: 'Karwa Chauth', category: 'regional_festival', description: 'Fasting and prayer for marital harmony', color: '#f43f5e', icon: '🌕' }],
  '2025-10-20': [{ name: 'Diwali / Deepavali', category: 'major_festival', description: 'Festival of illuminating lights and Lakshmi Puja', color: '#f59e0b', icon: '🪔' }],
  '2025-10-22': [{ name: 'Bhai Dooj', category: 'major_festival', description: 'Siblings celebration day', color: '#f97316', icon: '✨' }],
  '2025-11-05': [{ name: 'Guru Nanak Jayanti', category: 'major_festival', description: 'Prakash Utsav of Sri Guru Nanak Dev Ji', color: '#eab308', icon: '☬' }],
  '2025-12-25': [{ name: 'Christmas', category: 'major_festival', description: 'Celebrating the holy birth of Jesus Christ', color: '#10b981', icon: '🎄' }],

  // 2026
  '2026-01-14': [{ name: 'Makar Sankranti / Pongal', category: 'major_festival', description: 'Sun transition into Capricorn harvest festival', color: '#f59e0b', icon: '🪁' }],
  '2026-01-26': [{ name: 'Republic Day', category: 'national_holiday', description: '77th Republic Day of India', color: '#ef4444', icon: '🇮🇳' }],
  '2026-02-15': [{ name: 'Maha Shivratri', category: 'major_festival', description: 'Solemn festival in veneration of Shiva', color: '#8b5cf6', icon: '🔱' }],
  '2026-03-03': [{ name: 'Holi', category: 'major_festival', description: 'Joyous festive celebration of vibrant powder colours', color: '#ec4899', icon: '🎨' }],
  '2026-03-20': [{ name: 'Eid ul-Fitr', category: 'major_festival', description: 'Islamic holiday concluding the holy fast of Ramadan', color: '#10b981', icon: '🌙' }],
  '2026-03-27': [{ name: 'Ram Navami', category: 'major_festival', description: 'Festival celebrating the descent of Lord Rama', color: '#f59e0b', icon: '🏹' }],
  '2026-03-31': [{ name: 'Mahavir Jayanti', category: 'major_festival', description: 'Celebration of Jain ideals of Ahimsa and truth', color: '#eab308', icon: '🪔' }],
  '2026-04-03': [{ name: 'Good Friday', category: 'major_festival', description: 'Christian sacred day of remembrance', color: '#6366f1', icon: '✝️' }],
  '2026-05-01': [{ name: 'Buddha Purnima', category: 'major_festival', description: 'Honoring Lord Buddha’s wisdom and Nirvana', color: '#eab308', icon: '☸️' }],
  '2026-05-27': [{ name: 'Bakrid / Eid al-Adha', category: 'major_festival', description: 'Festival of sacrifice and charity', color: '#10b981', icon: '🌙' }],
  '2026-08-15': [{ name: 'Independence Day', category: 'national_holiday', description: 'Honoring India’s sovereignty and freedom fighters', color: '#ef4444', icon: '🇮🇳' }],
  '2026-08-28': [{ name: 'Raksha Bandhan', category: 'major_festival', description: 'Celebration of love and family support', color: '#ec4899', icon: '🧵' }],
  '2026-09-04': [{ name: 'Krishna Janmashtami', category: 'major_festival', description: 'Birthday of Lord Krishna with Dahi Handi festivities', color: '#3b82f6', icon: '🦚' }],
  '2026-09-14': [{ name: 'Ganesh Chaturthi', category: 'major_festival', description: 'Grand celebrations welcoming Lord Ganesha', color: '#f97316', icon: '🐘' }],
  '2026-10-02': [{ name: 'Mahatma Gandhi Jayanti', category: 'national_holiday', description: 'Remembering Mahatma Gandhi\'s principles of Non-Violence', color: '#ef4444', icon: '🇮🇳' }],
  '2026-10-11': [{ name: 'Navratri Starts', category: 'major_festival', description: 'Navratri festivities celebrating Maa Durga', color: '#ec4899', icon: '🌸' }],
  '2026-10-20': [{ name: 'Dussehra / Vijayadashami', category: 'major_festival', description: 'Auspicious victory day of Dharma', color: '#f59e0b', icon: '🏹' }],
  '2026-10-29': [{ name: 'Karwa Chauth', category: 'regional_festival', description: 'Fasting tradition under the moonlight', color: '#f43f5e', icon: '🌕' }],
  '2026-11-08': [{ name: 'Diwali / Deepavali', category: 'major_festival', description: 'Festival of Lights, fireworks, and sweet treats', color: '#f59e0b', icon: '🪔' }],
  '2026-11-10': [{ name: 'Bhai Dooj', category: 'major_festival', description: 'Affectionate gathering of sisters and brothers', color: '#f97316', icon: '✨' }],
  '2026-11-24': [{ name: 'Guru Nanak Jayanti', category: 'major_festival', description: 'Gurpurab celebrating Sri Guru Nanak Dev Ji', color: '#eab308', icon: '☬' }],
  '2026-12-25': [{ name: 'Christmas', category: 'major_festival', description: 'Christmas joy, carols, and gifts', color: '#10b981', icon: '🎄' }],

  // 2027
  '2027-01-14': [{ name: 'Makar Sankranti / Pongal', category: 'major_festival', description: 'Harvest festival and Uttarayan kite celebrations', color: '#f59e0b', icon: '🪁' }],
  '2027-01-26': [{ name: 'Republic Day', category: 'national_holiday', description: 'National Republic Day parade and honor', color: '#ef4444', icon: '🇮🇳' }],
  '2027-03-06': [{ name: 'Maha Shivratri', category: 'major_festival', description: 'Spiritual night devoted to Lord Shiva', color: '#8b5cf6', icon: '🔱' }],
  '2027-03-10': [{ name: 'Eid ul-Fitr', category: 'major_festival', description: 'Celebrating the conclusion of the holy month', color: '#10b981', icon: '🌙' }],
  '2027-03-22': [{ name: 'Holi', category: 'major_festival', description: 'Color festival of happiness, music, and joy', color: '#ec4899', icon: '🎨' }],
  '2027-03-26': [{ name: 'Good Friday', category: 'major_festival', description: 'Christian sacred commemoration', color: '#6366f1', icon: '✝️' }],
  '2027-04-15': [{ name: 'Ram Navami', category: 'major_festival', description: 'Celebration of Lord Shri Rama’s appearance', color: '#f59e0b', icon: '🏹' }],
  '2027-04-19': [{ name: 'Mahavir Jayanti', category: 'major_festival', description: 'Jain festival of peace and non-violence', color: '#eab308', icon: '🪔' }],
  '2027-05-17': [{ name: 'Bakrid / Eid al-Adha', category: 'major_festival', description: 'Feast of devotion and prayer', color: '#10b981', icon: '🌙' }],
  '2027-05-20': [{ name: 'Buddha Purnima', category: 'major_festival', description: 'Birth and enlightenment of Buddha', color: '#eab308', icon: '☸️' }],
  '2027-08-15': [{ name: 'Independence Day', category: 'national_holiday', description: 'Indian Independence Day celebration', color: '#ef4444', icon: '🇮🇳' }],
  '2027-08-17': [{ name: 'Raksha Bandhan', category: 'major_festival', description: 'Siblings festival celebrating loyalty & care', color: '#ec4899', icon: '🧵' }],
  '2027-08-25': [{ name: 'Krishna Janmashtami', category: 'major_festival', description: 'Midnight celebration of Krishna’s birth', color: '#3b82f6', icon: '🦚' }],
  '2027-09-04': [{ name: 'Ganesh Chaturthi', category: 'major_festival', description: 'Welcoming Ganpati Bappa with devotion', color: '#f97316', icon: '🐘' }],
  '2027-09-30': [{ name: 'Navratri Starts', category: 'major_festival', description: 'Sharad Navratri celebration begins', color: '#ec4899', icon: '🌸' }],
  '2027-10-02': [{ name: 'Mahatma Gandhi Jayanti', category: 'national_holiday', description: 'International Day of Non-Violence & Gandhi Jayanti', color: '#ef4444', icon: '🇮🇳' }],
  '2027-10-09': [{ name: 'Dussehra / Vijayadashami', category: 'major_festival', description: 'Celebration of truth vanquishing falsehood', color: '#f59e0b', icon: '🏹' }],
  '2027-10-18': [{ name: 'Karwa Chauth', category: 'regional_festival', description: 'Traditional night festival of marital devotion', color: '#f43f5e', icon: '🌕' }],
  '2027-10-29': [{ name: 'Diwali / Deepavali', category: 'major_festival', description: 'Glorious festival of diyas and celebrations', color: '#f59e0b', icon: '🪔' }],
  '2027-10-31': [{ name: 'Bhai Dooj', category: 'major_festival', description: 'Bhai Tika and blessing ceremonies', color: '#f97316', icon: '✨' }],
  '2027-11-14': [{ name: 'Guru Nanak Jayanti', category: 'major_festival', description: 'Gurpurab celebrating universal oneness', color: '#eab308', icon: '☬' }],
  '2027-12-25': [{ name: 'Christmas', category: 'major_festival', description: 'Joyous Christmas festive holiday', color: '#10b981', icon: '🎄' }],

  // 2028 (Leap Year)
  '2028-01-14': [{ name: 'Makar Sankranti / Pongal', category: 'major_festival', description: 'Harvest joy across India', color: '#f59e0b', icon: '🪁' }],
  '2028-01-26': [{ name: 'Republic Day', category: 'national_holiday', description: 'National Republic Day holiday', color: '#ef4444', icon: '🇮🇳' }],
  '2028-02-23': [{ name: 'Maha Shivratri', category: 'major_festival', description: 'Sacred vigil of Shiva', color: '#8b5cf6', icon: '🔱' }],
  '2028-02-27': [{ name: 'Eid ul-Fitr', category: 'major_festival', description: 'Eid celebrations across communities', color: '#10b981', icon: '🌙' }],
  '2028-03-11': [{ name: 'Holi', category: 'major_festival', description: 'Colors of spring and togetherness', color: '#ec4899', icon: '🎨' }],
  '2028-04-03': [{ name: 'Ram Navami', category: 'major_festival', description: 'Divine advent of Lord Ram', color: '#f59e0b', icon: '🏹' }],
  '2028-04-07': [{ name: 'Mahavir Jayanti', category: 'major_festival', description: 'Jain festival of spiritual victory', color: '#eab308', icon: '🪔' }],
  '2028-04-14': [{ name: 'Good Friday', category: 'major_festival', description: 'Christian sacred holiday', color: '#6366f1', icon: '✝️' }],
  '2028-05-05': [{ name: 'Bakrid / Eid al-Adha', category: 'major_festival', description: 'Feast of devotion and sacrifice', color: '#10b981', icon: '🌙' }],
  '2028-05-08': [{ name: 'Buddha Purnima', category: 'major_festival', description: 'Enlightenment day of the Buddha', color: '#eab308', icon: '☸️' }],
  '2028-08-05': [{ name: 'Raksha Bandhan', category: 'major_festival', description: 'Rakhi thread festival', color: '#ec4899', icon: '🧵' }],
  '2028-08-13': [{ name: 'Krishna Janmashtami', category: 'major_festival', description: 'Festive songs and fast for Lord Krishna', color: '#3b82f6', icon: '🦚' }],
  '2028-08-15': [{ name: 'Independence Day', category: 'national_holiday', description: 'Independence Day of India', color: '#ef4444', icon: '🇮🇳' }],
  '2028-08-24': [{ name: 'Ganesh Chaturthi', category: 'major_festival', description: 'Arrival of Vighnaharta Ganesha', color: '#f97316', icon: '🐘' }],
  '2028-09-19': [{ name: 'Navratri Starts', category: 'major_festival', description: 'Nine nights of divine music and Dandiya', color: '#ec4899', icon: '🌸' }],
  '2028-09-28': [{ name: 'Dussehra / Vijayadashami', category: 'major_festival', description: 'Victory day celebrating good over evil', color: '#f59e0b', icon: '🏹' }],
  '2028-10-02': [{ name: 'Mahatma Gandhi Jayanti', category: 'national_holiday', description: 'Tribute to Mahatma Gandhi', color: '#ef4444', icon: '🇮🇳' }],
  '2028-10-06': [{ name: 'Karwa Chauth', category: 'regional_festival', description: 'Fasting rituals under the moon', color: '#f43f5e', icon: '🌕' }],
  '2028-10-17': [{ name: 'Diwali / Deepavali', category: 'major_festival', description: 'Illuminated earthen lamps and Lakshmi blessings', color: '#f59e0b', icon: '🪔' }],
  '2028-10-19': [{ name: 'Bhai Dooj', category: 'major_festival', description: 'Auspicious celebrations of brotherly bond', color: '#f97316', icon: '✨' }],
  '2028-11-02': [{ name: 'Guru Nanak Jayanti', category: 'major_festival', description: 'Prakash Purab of Sri Guru Nanak Dev', color: '#eab308', icon: '☬' }],
  '2028-12-25': [{ name: 'Christmas', category: 'major_festival', description: 'Christmas peace and good cheer', color: '#10b981', icon: '🎄' }],

  // 2029
  '2029-01-14': [{ name: 'Makar Sankranti / Pongal', category: 'major_festival', description: 'Harvest and Sun festival', color: '#f59e0b', icon: '🪁' }],
  '2029-01-26': [{ name: 'Republic Day', category: 'national_holiday', description: 'National Republic Day observance', color: '#ef4444', icon: '🇮🇳' }],
  '2029-02-12': [{ name: 'Maha Shivratri', category: 'major_festival', description: 'Night of Shiva’s meditation', color: '#8b5cf6', icon: '🔱' }],
  '2029-02-15': [{ name: 'Eid ul-Fitr', category: 'major_festival', description: 'Feast marking Ramadan conclusion', color: '#10b981', icon: '🌙' }],
  '2029-03-01': [{ name: 'Holi', category: 'major_festival', description: 'Festival of joyous vibrant hues', color: '#ec4899', icon: '🎨' }],
  '2029-03-23': [{ name: 'Ram Navami', category: 'major_festival', description: 'Appearance of Maryada Purushottam Rama', color: '#f59e0b', icon: '🏹' }],
  '2029-03-28': [{ name: 'Mahavir Jayanti', category: 'major_festival', description: 'Jain birth anniversary of Mahavira', color: '#eab308', icon: '🪔' }],
  '2029-03-30': [{ name: 'Good Friday', category: 'major_festival', description: 'Commemoration of the Passion of Christ', color: '#6366f1', icon: '✝️' }],
  '2029-04-24': [{ name: 'Bakrid / Eid al-Adha', category: 'major_festival', description: 'Islamic holiday of piety and devotion', color: '#10b981', icon: '🌙' }],
  '2029-05-28': [{ name: 'Buddha Purnima', category: 'major_festival', description: 'Vesak day celebration of Lord Buddha', color: '#eab308', icon: '☸️' }],
  '2029-08-15': [{ name: 'Independence Day', category: 'national_holiday', description: 'India’s National Independence Day', color: '#ef4444', icon: '🇮🇳' }],
  '2029-08-24': [{ name: 'Raksha Bandhan', category: 'major_festival', description: 'Sibling bonding and festive joy', color: '#ec4899', icon: '🧵' }],
  '2029-09-01': [{ name: 'Krishna Janmashtami', category: 'major_festival', description: 'Celebrations of Sri Krishna’s birth', color: '#3b82f6', icon: '🦚' }],
  '2029-09-12': [{ name: 'Ganesh Chaturthi', category: 'major_festival', description: 'Welcoming the beloved elephant-headed deity', color: '#f97316', icon: '🐘' }],
  '2029-10-02': [{ name: 'Mahatma Gandhi Jayanti', category: 'national_holiday', description: 'National tribute to Mahatma Gandhi', color: '#ef4444', icon: '🇮🇳' }],
  '2029-10-08': [{ name: 'Navratri Starts', category: 'major_festival', description: 'Sharad Navratri celebration commences', color: '#ec4899', icon: '🌸' }],
  '2029-10-17': [{ name: 'Dussehra / Vijayadashami', category: 'major_festival', description: 'Effigy burning and victory processions', color: '#f59e0b', icon: '🏹' }],
  '2029-10-26': [{ name: 'Karwa Chauth', category: 'regional_festival', description: 'Traditional moonlit fast', color: '#f43f5e', icon: '🌕' }],
  '2029-11-05': [{ name: 'Diwali / Deepavali', category: 'major_festival', description: 'Festival of light, prosperity, and joy', color: '#f59e0b', icon: '🪔' }],
  '2029-11-07': [{ name: 'Bhai Dooj', category: 'major_festival', description: 'Siblings celebration with sweets and prayers', color: '#f97316', icon: '✨' }],
  '2029-11-21': [{ name: 'Guru Nanak Jayanti', category: 'major_festival', description: 'Celebrations honoring Guru Nanak Dev Ji', color: '#eab308', icon: '☬' }],
  '2029-12-25': [{ name: 'Christmas', category: 'major_festival', description: 'Christmas festive celebrations', color: '#10b981', icon: '🎄' }],

  // 2030
  '2030-01-14': [{ name: 'Makar Sankranti / Pongal', category: 'major_festival', description: 'Solar harvest transition', color: '#f59e0b', icon: '🪁' }],
  '2030-01-26': [{ name: 'Republic Day', category: 'national_holiday', description: 'Celebrating the Constitution of India', color: '#ef4444', icon: '🇮🇳' }],
  '2030-02-05': [{ name: 'Eid ul-Fitr', category: 'major_festival', description: 'Eid feast marking Ramadan end', color: '#10b981', icon: '🌙' }],
  '2030-03-03': [{ name: 'Maha Shivratri', category: 'major_festival', description: 'Night of Shiva prayer and introspection', color: '#8b5cf6', icon: '🔱' }],
  '2030-03-19': [{ name: 'Holi', category: 'major_festival', description: 'Holi festival of colors and spring vibrancy', color: '#ec4899', icon: '🎨' }],
  '2030-04-12': [{ name: 'Ram Navami', category: 'major_festival', description: 'Auspicious birth of Lord Rama', color: '#f59e0b', icon: '🏹' }],
  '2030-04-13': [{ name: 'Bakrid / Eid al-Adha', category: 'major_festival', description: 'Sacred feast of remembrance', color: '#10b981', icon: '🌙' }],
  '2030-04-19': [{ name: 'Good Friday', category: 'major_festival', description: 'Sacred Friday of Christian faith', color: '#6366f1', icon: '✝️' }],
  '2030-05-17': [{ name: 'Buddha Purnima', category: 'major_festival', description: 'Gautama Buddha Purnima', color: '#eab308', icon: '☸️' }],
  '2030-08-13': [{ name: 'Raksha Bandhan', category: 'major_festival', description: 'Sweet festival of brother-sister bond', color: '#ec4899', icon: '🧵' }],
  '2030-08-15': [{ name: 'Independence Day', category: 'national_holiday', description: 'National Independence Day', color: '#ef4444', icon: '🇮🇳' }],
  '2030-08-21': [{ name: 'Krishna Janmashtami', category: 'major_festival', description: 'Joyful celebrations of Lord Krishna', color: '#3b82f6', icon: '🦚' }],
  '2030-09-01': [{ name: 'Ganesh Chaturthi', category: 'major_festival', description: 'Auspicious Ganesh Mahotsav begins', color: '#f97316', icon: '🐘' }],
  '2030-09-27': [{ name: 'Navratri Starts', category: 'major_festival', description: 'Devotion to Durga Mata', color: '#ec4899', icon: '🌸' }],
  '2030-10-02': [{ name: 'Mahatma Gandhi Jayanti', category: 'national_holiday', description: 'Remembering Mahatma Gandhi', color: '#ef4444', icon: '🇮🇳' }],
  '2030-10-06': [{ name: 'Dussehra / Vijayadashami', category: 'major_festival', description: 'Victory day processions', color: '#f59e0b', icon: '🏹' }],
  '2030-10-16': [{ name: 'Karwa Chauth', category: 'regional_festival', description: 'Fasting rituals for partner\'s longevity', color: '#f43f5e', icon: '🌕' }],
  '2030-10-26': [{ name: 'Diwali / Deepavali', category: 'major_festival', description: 'Festival of lights, prosperity, and crackers', color: '#f59e0b', icon: '🪔' }],
  '2030-10-28': [{ name: 'Bhai Dooj', category: 'major_festival', description: 'Siblings celebration with tikka and sweets', color: '#f97316', icon: '✨' }],
  '2030-11-10': [{ name: 'Guru Nanak Jayanti', category: 'major_festival', description: 'Birth anniversary of Guru Nanak Dev Ji', color: '#eab308', icon: '☬' }],
  '2030-12-25': [{ name: 'Christmas', category: 'major_festival', description: 'Joyous celebrations of Christmas', color: '#10b981', icon: '🎄' }],

  // 2031
  '2031-01-14': [{ name: 'Makar Sankranti / Pongal', category: 'major_festival', description: 'Harvest festival across India', color: '#f59e0b', icon: '🪁' }],
  '2031-01-26': [{ name: 'Republic Day', category: 'national_holiday', description: 'National Republic Day honoring the Constitution', color: '#ef4444', icon: '🇮🇳' }],
  '2031-03-08': [{ name: 'Holi', category: 'major_festival', description: 'Festival of vibrant colors', color: '#ec4899', icon: '🎨' }],
  '2031-08-15': [{ name: 'Independence Day', category: 'national_holiday', description: 'Commemorating India\'s Independence', color: '#ef4444', icon: '🇮🇳' }],
  '2031-10-02': [{ name: 'Mahatma Gandhi Jayanti', category: 'national_holiday', description: 'Honoring Mahatma Gandhi', color: '#ef4444', icon: '🇮🇳' }],
  '2031-11-14': [{ name: 'Diwali / Deepavali', category: 'major_festival', description: 'Festival of Lights and joy', color: '#f59e0b', icon: '🪔' }],
  '2031-12-25': [{ name: 'Christmas', category: 'major_festival', description: 'Nativity of Christ celebration', color: '#10b981', icon: '🎄' }],

  // 2032
  '2032-01-14': [{ name: 'Makar Sankranti / Pongal', category: 'major_festival', description: 'Harvest and Sun festival', color: '#f59e0b', icon: '🪁' }],
  '2032-01-26': [{ name: 'Republic Day', category: 'national_holiday', description: 'Republic Day parade and constitution day', color: '#ef4444', icon: '🇮🇳' }],
  '2032-03-26': [{ name: 'Holi', category: 'major_festival', description: 'Holi color festivities', color: '#ec4899', icon: '🎨' }],
  '2032-08-15': [{ name: 'Independence Day', category: 'national_holiday', description: 'Celebrating freedom and unity', color: '#ef4444', icon: '🇮🇳' }],
  '2032-10-02': [{ name: 'Mahatma Gandhi Jayanti', category: 'national_holiday', description: 'Gandhi Jayanti', color: '#ef4444', icon: '🇮🇳' }],
  '2032-11-02': [{ name: 'Diwali / Deepavali', category: 'major_festival', description: 'Grand festival of sparkling diyas', color: '#f59e0b', icon: '🪔' }],
  '2032-12-25': [{ name: 'Christmas', category: 'major_festival', description: 'Christmas celebrations worldwide', color: '#10b981', icon: '🎄' }],
};

/**
 * Returns all festivals for a specific date (YYYY-MM-DD).
 * For years beyond pre-computed lookup, guaranteed national holidays and solar festivals are always dynamically produced!
 */
export function getFestivalsForDate(dateStr: string): Festival[] {
  const verified = VERIFIED_FESTIVALS_MAP[dateStr];
  if (verified && verified.length > 0) {
    return verified.map(item => ({ ...item, date: dateStr }));
  }

  // Dynamic fallback for any arbitrary year:
  const parts = dateStr.split('-');
  const year = parts[0];
  const monthDay = `${parts[1]}-${parts[2]}`;

  const dynamicList: Festival[] = [];

  // Fixed National Holidays
  if (monthDay === '01-26') {
    dynamicList.push({
      date: dateStr,
      name: 'Republic Day',
      category: 'national_holiday',
      description: 'National holiday celebrating the Indian Constitution',
      color: '#ef4444',
      icon: '🇮🇳'
    });
  } else if (monthDay === '08-15') {
    dynamicList.push({
      date: dateStr,
      name: 'Independence Day',
      category: 'national_holiday',
      description: 'National holiday celebrating India\'s independence',
      color: '#ef4444',
      icon: '🇮🇳'
    });
  } else if (monthDay === '10-02') {
    dynamicList.push({
      date: dateStr,
      name: 'Mahatma Gandhi Jayanti',
      category: 'national_holiday',
      description: 'National holiday honoring the Father of the Nation',
      color: '#ef4444',
      icon: '🇮🇳'
    });
  } else if (monthDay === '01-14') {
    dynamicList.push({
      date: dateStr,
      name: 'Makar Sankranti / Pongal',
      category: 'major_festival',
      description: 'Solar harvest celebration dedicated to Surya',
      color: '#f59e0b',
      icon: '🪁'
    });
  } else if (monthDay === '12-25') {
    dynamicList.push({
      date: dateStr,
      name: 'Christmas',
      category: 'major_festival',
      description: 'Celebration of the birth of Jesus Christ',
      color: '#10b981',
      icon: '🎄'
    });
  }

  return dynamicList;
}

/**
 * Get all festivals occurring in a specific year
 */
export function getFestivalsForYear(year: number): Festival[] {
  const result: Festival[] = [];
  const yearPrefix = `${year}-`;

  for (const [dateStr, list] of Object.entries(VERIFIED_FESTIVALS_MAP)) {
    if (dateStr.startsWith(yearPrefix)) {
      list.forEach(f => result.push({ ...f, date: dateStr }));
    }
  }

  if (result.length === 0) {
    // Generate the standard fixed holidays for this year
    ['01-14', '01-26', '08-15', '10-02', '12-25'].forEach(md => {
      const fullDate = `${year}-${md}`;
      result.push(...getFestivalsForDate(fullDate));
    });
  }

  return result.sort((a, b) => a.date.localeCompare(b.date));
}
