export const SHOWCASE_SAMPLES = [
  {
    id: 'tulsi',
    label: 'Tulsi (Holy Basil)',
    badge: 'Medicinal / Ayurvedic',
    preview: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60',
    data: {
      classification: 'real_plant',
      plantName: 'Holy Basil (Tulsi)',
      scientificName: 'Ocimum tenuiflorum',
      hindiName: 'तुलसी (Tulsi)',
      family: 'Lamiaceae (Mint Family)',
      confidence: 'High (98%)',
      isMedicinal: true,
      medicinalCategory: 'High Medicinal Value',
      medicinalBenefits: [
        'Boosts immunity and respiratory health',
        'Rich in antioxidants and adaptogens that lower stress',
        'Relieves cough, cold, and sore throat',
        'Anti-inflammatory and antimicrobial properties'
      ],
      usedParts: ['Leaves', 'Seeds', 'Flowers', 'Roots'],
      traditionalAyurvedicUses: 'Revered in Ayurveda as the "Queen of Herbs". Commonly brewed as Kadha or tea with black pepper and ginger to treat fever and respiratory ailments.',
      medicinalPrecautions: 'Generally safe in dietary amounts. Pregnant women and people on blood-thinning medications should consult a physician before concentrated extract use.',
      isDangerous: false,
      dangerLevel: 'Safe',
      toxicParts: ['None'],
      symptoms: ['None under normal consumption'],
      safetyTips: [
        'Wash fresh leaves thoroughly before brewing',
        'Do not chew raw leaves directly in excess as mercury traces can affect dental enamel (swallow or brew instead)'
      ],
      petSafety: {
        isToxicToDogs: false,
        isToxicToCats: false,
        petRiskLevel: 'Pet Safe',
        petSymptoms: 'Non-toxic to dogs and cats in moderate amounts.'
      },
      generalInfo: 'An aromatic perennial plant native to the Indian subcontinent, cultivated widely for religious, culinary, and medicinal purposes.',
      habitat: 'Native to tropical and subtropical Asia; thrives in warm climates with abundant sunlight.',
      careGuide: {
        sunlight: 'Direct sunlight (4–6 hours daily)',
        watering: 'Moderate watering; keep soil moist but well-drained',
        difficulty: 'Easy'
      },
      disclaimer: 'For educational identification. Always consult a certified Ayurvedic practitioner or medical doctor for health treatments.'
    }
  },
  {
    id: 'aloevera',
    label: 'Aloe Vera',
    badge: 'Topical / Pet Caution',
    preview: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=500&auto=format&fit=crop&q=60',
    data: {
      classification: 'real_plant',
      plantName: 'Aloe Vera',
      scientificName: 'Aloe barbadensis miller',
      hindiName: 'घृतकुमारी (Ghritkumari)',
      family: 'Asphodelaceae',
      confidence: 'High (96%)',
      isMedicinal: true,
      medicinalCategory: 'High Medicinal Value',
      medicinalBenefits: [
        'Soothes sunburns, minor burns, and accelerates skin healing',
        'Deep natural moisturizer with anti-inflammatory properties',
        'Aids digestive digestion when properly prepared'
      ],
      usedParts: ['Inner Gel', 'Leaf Latex (Yellow Sap)'],
      traditionalAyurvedicUses: 'Used for Pitta-pacification, cooling skin therapies, and natural liver tonic.',
      medicinalPrecautions: 'Yellow latex (aloin) beneath skin is a strong laxative and can cause cramping. Do not consume raw latex without medical supervision.',
      isDangerous: false,
      dangerLevel: 'Mildly Toxic',
      toxicParts: ['Yellow aloin latex beneath the outer rind'],
      symptoms: ['Digestive upset or diarrhea if raw yellow sap is ingested in high quantities'],
      safetyTips: [
        'Drain the yellow sap (aloin) by placing cut leaf upright in water for 15 minutes before extracting clear gel',
        'Patch test on forearm before applying to face'
      ],
      petSafety: {
        isToxicToDogs: true,
        isToxicToCats: true,
        petRiskLevel: 'Toxic to Pets',
        petSymptoms: 'Vomiting, diarrhea, lethargy, and tremors in pets if leaves or sap are chewed.'
      },
      generalInfo: 'A succulent plant species celebrated globally for pharmaceutical, cosmetic, and traditional therapeutic formulations.',
      habitat: 'Native to the Arabian Peninsula; thrives in arid and tropical regions.',
      careGuide: {
        sunlight: 'Bright indirect sunlight',
        watering: 'Low; water deeply only when soil is completely dry',
        difficulty: 'Very Easy'
      },
      disclaimer: 'For educational identification. Keep away from pets.'
    }
  },
  {
    id: 'plastic_plant',
    label: 'Plastic Desk Plant',
    badge: 'Artificial / Fake',
    preview: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&auto=format&fit=crop&q=60',
    data: {
      classification: 'plastic_or_toy_plant',
      isArtificial: true,
      artificialType: 'Plastic plant',
      syntheticCues: [
        'Visible molded injection seams along stems',
        'Uniform unnatural glossy finish with no cellular stomata',
        'Fabric leaf undersides with glued wire ribs'
      ],
      artificialNote: 'This is an artificial decorative replica. It has no biological metabolism, produces no oxygen, and contains zero medicinal herbs.',
      detectedObject: 'Artificial Decorative Plant',
      disclaimer: 'Non-biological item. Purely decorative.'
    }
  },
  {
    id: 'coffee_cup',
    label: 'Coffee Mug',
    badge: 'Not a Plant',
    preview: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    data: {
      classification: 'not_a_plant',
      detectedObject: 'Ceramic Coffee Mug',
      nonPlantInstructions: 'This image appears to be a cup/mug, not a botanical specimen. Yeh kisi paudhe ka photo nahi hai. Kripya kisi asali paudhe (leaf, flower, stem) ki photo scan karein.',
      disclaimer: 'Please scan a real plant or herb for botanical identification.'
    }
  }
];

const PRESET_LOCALIZATIONS = {
  hi: {
    tulsi: { label: 'तुलसी (Holy Basil)', badge: 'औषधीय / आयुर्वेदिक' },
    aloevera: { label: 'एलोवेरा (घृतकुमारी)', badge: 'त्वचा / पालतू सावधानी' },
    plastic_plant: { label: 'प्लास्टिक का पौधा', badge: 'कृत्रिम / नकली' },
    coffee_cup: { label: 'कॉफी मग', badge: 'पौधा नहीं है' },
  },
  ur: {
    tulsi: { label: 'تلسی (ہولی باسل)', badge: 'طبی / روایتی جڑی بوٹی' },
    aloevera: { label: 'ایلو ویرا (گھیگوار)', badge: 'جلدی نگہداشت / پالتو احتیاط' },
    plastic_plant: { label: 'پلاسٹک کا مصنوعی پودا', badge: 'مصنوعی / نقلی' },
    coffee_cup: { label: 'کافی مگ', badge: 'پودا نہیں ہے' },
  },
  th: {
    tulsi: { label: 'กะเพรา (Tulsi)', badge: 'สมุนไพร / อายุรเวท' },
    aloevera: { label: 'ว่านหางจระเข้ (Aloe Vera)', badge: 'ทาภายนอก / ระวังเรื่องสัตว์เลี้ยง' },
    plastic_plant: { label: 'ต้นไม้พลาสติกตั้งโต๊ะ', badge: 'ของประดิษฐ์ / ของปลอม' },
    coffee_cup: { label: 'แก้วกาแฟ', badge: 'ไม่ใช่วัตถุพืช' },
  },
  ms: {
    tulsi: { label: 'Tulsi (Selasih Suci)', badge: 'Perubatan / Tradisional' },
    aloevera: { label: 'Lidah Buaya (Aloe Vera)', badge: 'Rawatan Luar / Awas Haiwan' },
    plastic_plant: { label: 'Tumbuhan Plastik Meja', badge: 'Tiruan / Palsu' },
    coffee_cup: { label: 'Cawan Kopi', badge: 'Bukan Tumbuhan' },
  },
  tl: {
    tulsi: { label: 'Tulsi (Banal na Tulsi)', badge: 'Panggamot / Ayurvedic' },
    aloevera: { label: 'Aloe Vera (Sábila)', badge: 'Pampahid / Ingat sa Alaga' },
    plastic_plant: { label: 'Plastik na Halaman', badge: 'Artipisyal / Peke' },
    coffee_cup: { label: 'Tasa ng Kape', badge: 'Hindi Halaman' },
  },
  ko: {
    tulsi: { label: '홀리 바질 (툴시)', badge: '약용 / 아유르베다' },
    aloevera: { label: '알로에 베라', badge: '피부 진정 / 반려동물 주의' },
    plastic_plant: { label: '플라스틱 인조 식물', badge: '인조 / 가짜 식물' },
    coffee_cup: { label: '커피 머그컵', badge: '식물이 아님' },
  },
  ja: {
    tulsi: { label: 'ホーリーバジル (トゥルシー)', badge: '薬用 / アーユルヴェーダ' },
    aloevera: { label: 'アロエベラ', badge: '外用 / ペット注意' },
    plastic_plant: { label: 'プラスチック人工植物', badge: '人工 / フェイク' },
    coffee_cup: { label: 'コーヒーマグカップ', badge: '植物ではありません' },
  },
  es: {
    tulsi: { label: 'Albahaca Sagrada (Tulsi)', badge: 'Medicinal / Ayurvédica' },
    aloevera: { label: 'Aloe Vera (Sábila)', badge: 'Uso tópico / Cuidado mascotas' },
    plastic_plant: { label: 'Planta de Plástico', badge: 'Artificial / Réplica' },
    coffee_cup: { label: 'Taza de Café', badge: 'No es una Planta' },
  },
  fr: {
    tulsi: { label: 'Basilic Sacré (Tulsi)', badge: 'Médicinal / Ayurvédique' },
    aloevera: { label: 'Aloe Vera', badge: 'Usage externe / Attention animaux' },
    plastic_plant: { label: 'Plante Artificielle', badge: 'Artificiel / Déco' },
    coffee_cup: { label: 'Mug à Café', badge: 'Pas une Plante' },
  },
  de: {
    tulsi: { label: 'Indisches Basilikum (Tulsi)', badge: 'Medizinisch / Ayurvedisch' },
    aloevera: { label: 'Echte Aloe (Aloe Vera)', badge: 'Äußerlich / Vorsicht Haustiere' },
    plastic_plant: { label: 'Künstliche Schreibtischpflanze', badge: 'Künstlich / Deko' },
    coffee_cup: { label: 'Kaffeebecher', badge: 'Keine Pflanze' },
  },
  ar: {
    tulsi: { label: 'الريحان المقدس (تولسي)', badge: 'علاجي / أيورفيدي' },
    aloevera: { label: 'الصبار (ألوفيرا)', badge: 'موضعي / تحذير للحيوانات' },
    plastic_plant: { label: 'نبات بلاستيكي للزينة', badge: 'صناعي / غير طبيعي' },
    coffee_cup: { label: 'كوب قهوة', badge: 'ليس نباتاً' },
  },
  ru: {
    tulsi: { label: 'Базилик священный (Тулси)', badge: 'Лечебный / Аюрведа' },
    aloevera: { label: 'Алоэ вера', badge: 'Наружное / Опасно для животных' },
    plastic_plant: { label: 'Искусственное растение', badge: 'Искусственное / Муляж' },
    coffee_cup: { label: 'Кружка кофе', badge: 'Не растение' },
  },
};

export function getShowcaseSamples(language = 'en') {
  const loc = PRESET_LOCALIZATIONS[language];
  if (!loc) return SHOWCASE_SAMPLES;

  return SHOWCASE_SAMPLES.map((sample) => {
    const itemLoc = loc[sample.id];
    if (!itemLoc) return sample;
    return {
      ...sample,
      label: itemLoc.label || sample.label,
      badge: itemLoc.badge || sample.badge,
    };
  });
}

