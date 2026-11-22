import { CaseCategory, MysteryCase } from '../types/chemquest';

export const CASE_CATEGORIES: {
  name: CaseCategory;
  shortDesc: string;
  formulaTag: string;
}[] = [
  {
    name: 'Kimyəvi reaksiyalar',
    shortDesc: 'Qaz ayrılması, çöküntü və əvəzetmə reaksiyalarını izləyin.',
    formulaTag: 'A + B → C + D',
  },
  {
    name: 'Elementlər və dövri sistem',
    shortDesc: 'Alov sınağı, valentlik və dövri qanunlarla elementləri tanıyın.',
    formulaTag: 'Z = p⁺',
  },
  {
    name: 'Məhlullar',
    shortDesc: 'Qatılıq, həllolma və elektrik keçiriciliyi sirlərini açın.',
    formulaTag: 'C = n / V',
  },
  {
    name: 'Turşular və əsaslar',
    shortDesc: 'İndikatorlar və pH şkalası ilə naməlum məhlulları ayırd edin.',
    formulaTag: 'pH = -lg[H⁺]',
  },
  {
    name: 'Üzvi kimya',
    shortDesc: 'Funksional qruplar və karbohidrogenlərin izi ilə gedin.',
    formulaTag: 'R-COOH',
  },
  {
    name: 'Gündəlik həyatda kimya',
    shortDesc: 'Məişətdə və təbiətdə baş verən görünməz kimyəvi prosesləri araşdırın.',
    formulaTag: 'H₂O · NaHCO₃',
  },
];

export const PRELOADED_CASES: MysteryCase[] = [
  {
    id: 'case-three-solutions',
    title: 'Üç Rəngsiz Məhlulun Sirri',
    category: 'Turşular və əsaslar',
    difficulty: 'Başlanğıc',
    xpReward: 120,
    estimatedMinutes: 4,
    storyline:
      'Gecə növbəsindən sonra mərkəzi laboratoriyada 3 eyni şüşə qab tapılıb: Qab A, Qab B və Qab C. Hər üçünün içində şəffaf, rəngsiz məhlul var, lakin etiketlər tamamilə silinib. Qeydlərə görə onlardan biri xlorid turşusu (HCl), biri natrium hidroksid (NaOH — qələvi), digəri isə neytral xörək duzu məhluludur (NaCl). Detektiv kimi təcrübələr apararaq hər qabın kimliyini müəyyən edin.',
    clues: [
      'Bütün məhlullar otaq temperaturunda şəffaf və qoxusuz görünür, lakin kimyəvi xassələri kəskin fərqlənir.',
      'Fenolftalein indikatoru yalnız pH > 8.2 olan qələvi mühitdə moruğu-çəhrayı rəng verir.',
      'Turşular karbonat duzları (məsələn, çay sodası) ilə qarşılıqlı təsirdə olduqda CO₂ qazı ayıraraq köpüklənir.',
    ],
    experiments: [
      {
        id: 'exp-phenol',
        actionLabel: 'İndikator əlavə et',
        reagentName: 'Fenolftalein (C₂₀H₁₄O₄)',
        visualEffect: 'color_shift',
        vesselColorsBefore: ['#CBD5E1', '#CBD5E1', '#CBD5E1'],
        vesselColorsAfter: ['#CBD5E1', '#EC4899', '#CBD5E1'],
        vesselLabels: ['Qab A', 'Qab B', 'Qab C'],
        observation:
          'Qab A və Qab C rəngsiz qaldı. Yalnız Qab B-də məhlul dərhal parlaq moruğu-çəhrayı rəngə boyandı.',
        scientificReasoning:
          'Fenolftalein turş və neytral mühitdə rəngsiz qalır, qələvi mühitdə isə OH⁻ ionlarının təsiri ilə strukturunu dəyişərək çəhrayı rəng alır.',
        measuredMetric: 'Qab B: Moruğu-çəhrayı (Qələvi təsdiqləndi)',
      },
      {
        id: 'exp-ph',
        actionLabel: 'Məhlulu analiz et',
        reagentName: 'Rəqəmsal pH sensoru',
        visualEffect: 'ph_scan',
        vesselColorsBefore: ['#CBD5E1', '#EC4899', '#CBD5E1'],
        vesselColorsAfter: ['#F43F5E', '#A855F7', '#22D3EE'],
        vesselLabels: ['Qab A (pH 1.2)', 'Qab B (pH 13.1)', 'Qab C (pH 7.0)'],
        observation:
          'Sensor Qab A üçün 1.2, Qab B üçün 13.1, Qab C üçün isə tam 7.0 pH dəyərini qeydə aldı.',
        scientificReasoning:
          'pH < 7 turş mühiti (HCl), pH > 7 qələvi mühiti (NaOH), pH = 7 isə tam neytral mühiti (NaCl məhlulu) göstərir.',
        measuredMetric: 'pH: A = 1.2 · B = 13.1 · C = 7.0',
      },
      {
        id: 'exp-soda',
        actionLabel: 'Reaksiya müşahidə et',
        reagentName: 'Çay sodası məhlulu (NaHCO₃)',
        visualEffect: 'bubbling',
        vesselColorsBefore: ['#CBD5E1', '#CBD5E1', '#CBD5E1'],
        vesselColorsAfter: ['#38BDF8', '#CBD5E1', '#CBD5E1'],
        vesselLabels: ['Qab A (CO₂↑)', 'Qab B', 'Qab C'],
        observation:
          'Qab A-ya çay sodası əlavə etdikdə intensiv qaz qabarcıqları ayrıldı; Qab B və Qab C-də qaz çıxmadı.',
        scientificReasoning:
          'HCl + NaHCO₃ → NaCl + H₂O + CO₂↑ reaksiyası yalnız turşu olan Qab A-da karbon qazı ayrılmasına səbəb olur.',
        measuredMetric: 'Qab A: İntensiv CO₂ qazı ayrıldı',
      },
    ],
    stages: [
      {
        id: 'st-1',
        title: 'Mərhələ 1: Qələvinin müəyyən edilməsi',
        question: 'Aparılan təcrübələrə əsasən hansı qabın tərkibində natrium hidroksid (NaOH) var?',
        options: [
          'Qab A — çünki soda ilə qaz ayırdı',
          'Qab B — çünki fenolftaleini çəhrayıya boyadı və pH-ı 13.1 oldu',
          'Qab C — çünki pH göstəricisi 7.0-dır',
          'Heç biri — hər üçü neytral sudur',
        ],
        correctIndex: 1,
        explanation:
          'Doğrudur! Fenolftalein yalnız qələvi mühitdə moruğu-çəhrayı rəng alır və pH 13.1 güclü qələvi (NaOH) göstəricisidir.',
        progressiveHints: [
          'İndikator əlavə et təcrübəsinin nəticəsinə baxın: hansı qabda rəng kəskin dəyişdi?',
          'Qələvilər pH > 7 dəyərinə malik olur və fenolftaleini çəhrayı rəngə çevirir.',
        ],
        xpBonus: 30,
      },
      {
        id: 'st-2',
        title: 'Mərhələ 2: Turşu və neytral məhlulun fərqləndirilməsi',
        question: 'Qab A və Qab C haqqında düzgün nəticə hansıdır?',
        options: [
          'Qab A xörək duzu (NaCl), Qab C isə xlorid turşusudur (HCl)',
          'Hər iki qab xlorid turşusudur',
          'Qab A xlorid turşusu (HCl), Qab C isə neytral NaCl məhluludur',
          'Qab A və Qab C-ni ayırmaq mümkün deyil',
        ],
        correctIndex: 2,
        explanation:
          'Əla təhlil! Qab A-nın pH-ı 1.2-dir və karbonatla CO₂ qazı ayırır (HCl). Qab C-nin pH-ı 7.0-dır və indikatoru dəyişmir (neytral NaCl).',
        progressiveHints: [
          'Reaksiya müşahidə et düyməsini sıxıb çay sodasının hansı qabla köpükləndiyini yoxlayın.',
          'pH = 1.2 güclü turşu, pH = 7.0 isə neytral duz məhluludur.',
        ],
        xpBonus: 40,
      },
    ],
  },
  {
    id: 'case-flame-metal',
    title: 'Naməlum Metalın Alov İzi',
    category: 'Elementlər və dövri sistem',
    difficulty: 'Orta',
    xpReward: 150,
    estimatedMinutes: 5,
    storyline:
      'Muzey laboratoriyasındakı qədim sikkə nümunəsinin əvəzinə oxşar gümüşü metal parçaları qoyulub. Hadisə yerində 3 fərqli duz nümunəsi tapılıb: Nümunə X, Nümunə Y və Nümunə Z. Bilirik ki, saxta əvəzetmədə natrium (Na), mis (Cu) və ya kalium (K) birləşməsindən istifadə olunub. Spektral alov sınağı ilə hansı qabda hansı elementin olduğunu tapın.',
    clues: [
      'Qələvi metallar və bəzi keçid metalları qızdırıldıqda elektronları həyəcanlanır və xarakterik rəngli işıq buraxır.',
      'Natrium (Na) duzları alovu parlaq sarı-narıncı rəngə boyayır.',
      'Mis (Cu) birləşmələri alova zümrüdü yaşıl-mavi rəng verir.',
    ],
    experiments: [
      {
        id: 'exp-flame',
        actionLabel: 'Alov sınağı apar',
        reagentName: 'Qaz lampası alovu',
        visualEffect: 'flame',
        vesselColorsBefore: ['#94A3B8', '#94A3B8', '#94A3B8'],
        vesselColorsAfter: ['#FACC15', '#10B981', '#A855F7'],
        vesselLabels: ['Nümunə X', 'Nümunə Y', 'Nümunə Z'],
        observation:
          'Nümunə X parlaq sarı, Nümunə Y yaşıl-mavi, Nümunə Z isə açıq bənövşəyi alov verdi.',
        scientificReasoning:
          'Hər kimyəvi elementin atomlarındakı elektron enerji səviyyələri unikaldır. Həyəcanlanmış elektronlar əsas hala qayıdarkən elementə məxsus dalğa uzunluğunda foton şüalandırır.',
        measuredMetric: 'X: 589 nm (Sarı) · Y: 510 nm (Yaşıl) · Z: 404 nm (Bənövşəyi)',
      },
      {
        id: 'exp-solution',
        actionLabel: 'Məhlulu analiz et',
        reagentName: 'Suda həllolma və rəng testi',
        visualEffect: 'color_shift',
        vesselColorsBefore: ['#94A3B8', '#94A3B8', '#94A3B8'],
        vesselColorsAfter: ['#E2E8F0', '#06B6D4', '#E2E8F0'],
        vesselLabels: ['Nümunə X', 'Nümunə Y', 'Nümunə Z'],
        observation:
          'Nümunə X və Z suda rəngsiz məhlul əmələ gətirdi, Nümunə Y isə açıq mavi-firuzəyi rəngli məhlul yaratdı.',
        scientificReasoning:
          'Mis(II) kationları (Cu²⁺) sulu məhlulda su molekulları ilə kompleks əmələ gətirərək xarakterik mavi rəng yaradır. Natrium və kalium ionları rəngsiz məhlul verir.',
        measuredMetric: 'Nümunə Y: [Cu(H₂O)₆]²⁺ mavi rəng',
      },
    ],
    stages: [
      {
        id: 'st-flame-1',
        title: 'Mərhələ 1: Spektral rəng uyğunlaşdırması',
        question: '589 nm dalğa uzunluğunda parlaq sarı alov verən Nümunə X hansı elementi ehtiva edir?',
        options: ['Kalium (K)', 'Mis (Cu)', 'Natrium (Na)', 'Kalsium (Ca)'],
        correctIndex: 2,
        explanation:
          'Dəqiq cavab! Natrium D-xətti adlanan 589 nm şüalanma alova parlaq sarı rəng verir.',
        progressiveHints: [
          'İpucular siyahısında sarı-narıncı alov verən qələvi metalı yoxlayın.',
          'Mətbəx duzunu (NaCl) alova tutduqda da eyni sarı alov müşahidə olunur.',
        ],
        xpBonus: 40,
      },
      {
        id: 'st-flame-2',
        title: 'Mərhələ 2: Dövri sistemdə yerləşmə',
        question: 'Bənövşəyi alov verən Nümunə Z (Kalium, K) dövri sistemin hansı qrupunda yerləşir?',
        options: [
          'IA qrupu — Qələvi metallar',
          'VIIA qrupu — Halogenlər',
          'VIIIA qrupu — Təsirsiz qazlar',
          'IB qrupu — Keçid metalları',
        ],
        correctIndex: 0,
        explanation:
          'Mükəmməl! Kalium (Z=19) 4-cü dövr, IA qrupunda yerləşən aktiv qələvi metaldır və xarici elektron təbəqəsində 1 valent elektronu var.',
        progressiveHints: [
          'Kaliumun elektron konfiqurasiyası ...4s¹ ilə bitir.',
          'Natrium ilə eyni şaquli sütunda yerləşən metallar qrupunu seçin.',
        ],
        xpBonus: 50,
      },
    ],
  },
  {
    id: 'case-hidden-reaction',
    title: 'Məxfi Laboratoriyada Qaz Sızması',
    category: 'Kimyəvi reaksiyalar',
    difficulty: 'Başlanğıc',
    xpReward: 110,
    estimatedMinutes: 4,
    storyline:
      'Məktəb laboratoriyasında şagirdlərin təcrübəsindən sonra qapalı şüşə qabda təzyiq artıb və qabın dibində ağ çöküntü görünüb. Müəllim içəridə hansı qazın toplandığını və məhlulda hansı reaksiyanın getdiyini təhlükəsiz şəkildə müəyyən etməyinizi xahiş edir.',
    clues: [
      'Şüşə qabda rəngsiz, iysiz və yanmayan bir qaz toplanıb.',
      'Qaz əhəng suyundan (Ca(OH)₂) keçirildikdə məhlul bulanır və ağ çöküntü verir.',
      'Qaz yanan kibrit çöpünü dərhal söndürür.',
    ],
    experiments: [
      {
        id: 'exp-limewater',
        actionLabel: 'Əhəng suyu ilə yoxla',
        reagentName: 'Kalsium hidroksid məhlulu Ca(OH)₂',
        visualEffect: 'precipitate',
        vesselColorsBefore: ['#E2E8F0', '#E2E8F0', '#CBD5E1'],
        vesselColorsAfter: ['#F8FAFC', '#F1F5F9', '#E2E8F0'],
        vesselLabels: ['Əhəng suyu', 'Qaz kanalı', 'Referens su'],
        observation:
          'Qaz əhəng suyuna daxil olan kimi şəffaf məhlul süd rənginə bulanır və dibə ağ CaCO₃ çöküntüsü enir.',
        scientificReasoning:
          'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O reaksiyası karbon dioksid qazının klassik keyfiyyət reaksiyasıdır.',
        measuredMetric: 'Ağ CaCO₃ çöküntüsü əmələ gəldi',
      },
      {
        id: 'exp-gas-density',
        actionLabel: 'Qaz sıxlığını ölç',
        reagentName: 'Qaz sıxlıq sensoru',
        visualEffect: 'bubbling',
        vesselColorsBefore: ['#94A3B8', '#94A3B8', '#94A3B8'],
        vesselColorsAfter: ['#38BDF8', '#22D3EE', '#94A3B8'],
        vesselLabels: ['Toplanmış qaz', 'Hava (M=29)', 'Hidrogen (M=2)'],
        observation:
          'Toplanmış qazın molyar kütləsi 44 q/mol ölçüldü — bu, havadan təxminən 1.5 dəfə ağırdır.',
        scientificReasoning:
          'Karbon dioksidin (CO₂) molyar kütləsi 12 + 2×16 = 44 q/mol olduğu üçün havadan ağırdır və qabın aşağı hissəsində toplanır.',
        measuredMetric: 'M = 44 q/mol (Havadan 1.52× ağır)',
      },
    ],
    stages: [
      {
        id: 'st-react-1',
        title: 'Mərhələ 1: Qazın kimliyi',
        question: 'Əhəng suyunu bulandıran və molyar kütləsi 44 q/mol olan qaz hansıdır?',
        options: [
          'Hidrogen (H₂)',
          'Oksigen (O₂)',
          'Karbon dioksid (CO₂)',
          'Azot (N₂)',
        ],
        correctIndex: 2,
        explanation:
          'Doğrudur! Karbon dioksid (CO₂) havadan ağırdır (44 q/mol), yanmanı dəstəkləmir və əhəng suyunda CaCO₃ çöküntüsü yaradır.',
        progressiveHints: [
          'Molyar kütləsi 44 q/mol olan molekulu hesablayın: C(12) + 2×O(16) = 44.',
          'Qazlı içkilərdə də mövcud olan bu qaz əhəng suyunu ağardır.',
        ],
        xpBonus: 30,
      },
    ],
  },
  {
    id: 'case-saturated-solution',
    title: 'Doymuş Məhlul Paradoksu',
    category: 'Məhlullar',
    difficulty: 'Orta',
    xpReward: 160,
    estimatedMinutes: 5,
    storyline:
      'İki laborator stəkanında tam şəffaf sulu məhlul var: Stəkan 1 və Stəkan 2. Birində xörək duzu (NaCl), digərində isə saxaroza (şəkər — C₁₂H₂₂O₁₁) həll edilib. Dadına baxmaq laboratoriya qaydalarına görə qəti qadağandır! Detektiv kimi fiziki-kimyəvi cihazlarla onları ayırd edin.',
    clues: [
      'İon birləşmələri suda həll olduqda müsbət və mənfi ionlara dissosiasiya edir.',
      'Kovalent quruluşlu üzvi molekullar (məsələn, şəkər) suda molekul şəklində qalır və ion əmələ gətirmir.',
      'Məhlulun elektrik cərəyanını keçirməsi sərbəst hərəkət edən ionların mövcudluğundan asılıdır.',
    ],
    experiments: [
      {
        id: 'exp-cond',
        actionLabel: 'Keçiriciliyi yoxla',
        reagentName: 'Elektrik keçiricilik sensoru',
        visualEffect: 'conductivity',
        vesselColorsBefore: ['#BAE6FD', '#BAE6FD', '#CBD5E1'],
        vesselColorsAfter: ['#22D3EE', '#64748B', '#94A3B8'],
        vesselLabels: ['Stəkan 1 (Güclü)', 'Stəkan 2 (Keçirmir)', 'Saf su'],
        observation:
          'Stəkan 1-ə elektrodlar salındıqda lampa parlaq yandı (18.4 mS/sm). Stəkan 2-də isə cərəyan demək olar ki, axmadı (0.01 mS/sm).',
        scientificReasoning:
          'NaCl suda Na⁺ və Cl⁻ ionlarına ayrıldığı üçün güclü elektrolitdir. Şəkər isə qeyri-elektrolit olduğundan elektrik cərəyanını keçirmir.',
        measuredMetric: 'Stəkan 1: 18.4 mS/sm · Stəkan 2: 0.01 mS/sm',
      },
      {
        id: 'exp-temp',
        actionLabel: 'Məhlulu analiz et',
        reagentName: 'Gümüş nitrat damcısı (AgNO₃)',
        visualEffect: 'precipitate',
        vesselColorsBefore: ['#BAE6FD', '#BAE6FD', '#CBD5E1'],
        vesselColorsAfter: ['#F8FAFC', '#BAE6FD', '#CBD5E1'],
        vesselLabels: ['Stəkan 1 (AgCl↓)', 'Stəkan 2', 'Referens'],
        observation:
          'Stəkan 1-ə 2 damcı AgNO₃ əlavə etdikdə dərhal ağ kəsmikvari AgCl çöküntüsü yarandı. Stəkan 2 şəffaf qaldı.',
        scientificReasoning:
          'Ag⁺ + Cl⁻ → AgCl↓ reaksiyası məhlulda xlorid ionlarının (Cl⁻) olduğunu sübut edir.',
        measuredMetric: 'Stəkan 1: Ağ AgCl çöküntüsü',
      },
    ],
    stages: [
      {
        id: 'st-sol-1',
        title: 'Mərhələ 1: Elektrolit təyini',
        question: 'Stəkan 1-də elektrik cərəyanının keçməsinə səbəb nədir?',
        options: [
          'Şəkər molekullarının yüksək kütləsi',
          'NaCl-in suda Na⁺ və Cl⁻ ionlarına dissosiasiya etməsi',
          'Suyun temperaturunun yüksək olması',
          'Oksigen qazının suda həll olması',
        ],
        correctIndex: 1,
        explanation:
          'Tamamilə düzgündür! İon rabitəli duzlar suda sərbəst Na⁺ və Cl⁻ ionlarına ayrılır və elektrik yükünü daşıyır.',
        progressiveHints: [
          'Elektrolitlər məhlulda nəyə parçalanır?',
          'Xörək duzunun kimyəvi formulu NaCl-dir.',
        ],
        xpBonus: 40,
      },
      {
        id: 'st-sol-2',
        title: 'Mərhələ 2: Xlorid ionunun sübutu',
        question: 'AgNO₃ məhlulu ilə ağ çöküntü verən maddə hansı stəkandadır?',
        options: [
          'Stəkan 2 — Şəkər məhlulu',
          'Hər iki stəkanda',
          'Stəkan 1 — Xörək duzu (NaCl) məhlulu',
          'Heç birində',
        ],
        correctIndex: 2,
        explanation:
          'Afərin! Gümüş nitrat xlorid ionları ilə suda həll olmayan ağ AgCl çöküntüsü əmələ gətirir.',
        progressiveHints: [
          'Məhlulu analiz et təcrübəsində ağ çöküntünün hansı stəkanda yarandığına baxın.',
        ],
        xpBonus: 40,
      },
    ],
  },
  {
    id: 'case-organic-ester',
    title: 'Ətirşah Laboratoriyasındakı Saxta Efir',
    category: 'Üzvi kimya',
    difficulty: 'Ekspert',
    xpReward: 220,
    estimatedMinutes: 6,
    storyline:
      'Parfümeriya laboratoriyasından gələn 3 rəngsiz üzvi maye nümunəsi (Nümunə E, Nümunə F, Nümunə G) qarışdırılıb. Onlardan biri doymamış karbohidrogen (heksen), biri karbon turşusu (sirkə turşusu), digəri isə xoş ətirli mürəkkəb efirdir (etilasetat). Analitik sınaqlarla hər birini dəqiq ayırd edin.',
    clues: [
      'Doymamış karbohidrogenlər (ikiqat C=C rabitəli alkenlər) qırmızı-qəhvəyi bromlu suyu dərhal rəngsizləşdirir.',
      'Karbon turşuları (-COOH) aktiv karbonat duzları ilə CO₂ qazı ayırır və pH-ı turş olur.',
      'Mürəkkəb efirlər (-COO-) neytrala yaxındır, bromlu suyu rəngsizləşdirmir və meyvə ətrinə malikdir.',
    ],
    experiments: [
      {
        id: 'exp-bromine',
        actionLabel: 'Bromlu su əlavə et',
        reagentName: 'Bromlu su (Br₂ / H₂O)',
        visualEffect: 'color_shift',
        vesselColorsBefore: ['#D97706', '#D97706', '#D97706'],
        vesselColorsAfter: ['#E2E8F0', '#D97706', '#D97706'],
        vesselLabels: ['Nümunə E', 'Nümunə F', 'Nümunə G'],
        observation:
          'Nümunə E-yə narıncı-qəhvəyi bromlu su əlavə etdikdə rəng dərhal itdi və məhlul şəffaflaşdı. Digərlərində rəng qaldı.',
        scientificReasoning:
          'Alkenlərdəki pi (π) rabitəsi qırılaraq brom molekullarını özünə birləşdirir (elektrofil birləşmə reaksiyası).',
        measuredMetric: 'Nümunə E: İkiqat C=C rabitəsi təsdiqləndi',
      },
      {
        id: 'exp-carbonate',
        actionLabel: 'Reaksiya müşahidə et',
        reagentName: 'Natrium karbonat (Na₂CO₃)',
        visualEffect: 'bubbling',
        vesselColorsBefore: ['#CBD5E1', '#CBD5E1', '#CBD5E1'],
        vesselColorsAfter: ['#CBD5E1', '#38BDF8', '#CBD5E1'],
        vesselLabels: ['Nümunə E', 'Nümunə F (CO₂↑)', 'Nümunə G'],
        observation:
          'Yalnız Nümunə F-də qaz qabarcıqları çıxdı. Nümunə G reaksiyaya girmədi və armud ətri verdi.',
        scientificReasoning:
          '2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂↑ reaksiyası yalnız karboksil (-COOH) qrupu daşıyan üzvi turşularda baş verir.',
        measuredMetric: 'Nümunə F: -COOH qrupu təsdiqləndi',
      },
    ],
    stages: [
      {
        id: 'st-org-1',
        title: 'Mərhələ 1: Doymamış birləşmənin tapılması',
        question: 'Bromlu suyu rəngsizləşdirən Nümunə E hansı üzvi sinfə aiddir?',
        options: [
          'Karbon turşusu',
          'Alken (doymamış karbohidrogen)',
          'Mürəkkəb efir',
          'Doymuş alkan',
        ],
        correctIndex: 1,
        explanation:
          'Əla! C=C ikiqat rabitəsinə malik alkenlər bromlu su ilə birləşmə reaksiyasına girərək onu rəngsizləşdirir.',
        progressiveHints: [
          'Hansı sinif birləşmələrdə ikiqat rabitə (C=C) olur?',
        ],
        xpBonus: 60,
      },
      {
        id: 'st-org-2',
        title: 'Mərhələ 2: Efir və turşunun fərqləndirilməsi',
        question: 'Nümunə F və Nümunə G üzrə düzgün uyğunluq hansıdır?',
        options: [
          'Nümunə F etilasetat (efir), Nümunə G sirkə turşusudur',
          'Nümunə F sirkə turşusu (CH₃COOH), Nümunə G etilasetat (mürəkkəb efir)',
          'Hər ikisi spirtdir',
          'Nümunə G heksendir',
        ],
        correctIndex: 1,
        explanation:
          'Ekspert səviyyəli dəqiqlik! Karbonatla CO₂ ayıran Nümunə F sirkə turşusu, neytral qalıb meyvə ətri verən Nümunə G isə etilasetatdır.',
        progressiveHints: [
          'Sirkə turşusu soda/karbonatla köpüklənərək CO₂ ayırır.',
        ],
        xpBonus: 70,
      },
    ],
  },
  {
    id: 'case-kitchen-apple',
    title: 'Mətbəxdəki Görünməz Reaksiya',
    category: 'Gündəlik həyatda kimya',
    difficulty: 'Başlanğıc',
    xpReward: 100,
    estimatedMinutes: 3,
    storyline:
      'Kulinariya yarışmasında aşpazın kəsdiyi almalar 15 dəqiqə ərzində qəhvəyi rəngə dönüb, lakin qonşu masadakı almalar tam təzə və ağ qalıb. Masalardan birində limon şirəsi, digərində isə adi su qabı tapılıb. Bu gündəlik kimyəvi hadisənin səbəbini aydınlaşdırın.',
    clues: [
      'Almanın hüceyrələri kəsildikdə polifenol oksidaza fermenti hava oksigeni (O₂) ilə təmasa girir.',
      'Askorbin turşusu (C vitamini) və limon turşusu pH-ı aşağı salır və antioksidant təsir göstərir.',
    ],
    experiments: [
      {
        id: 'exp-oxid',
        actionLabel: 'Məhlulu analiz et',
        reagentName: 'Səthi pH və oksidləşmə testi',
        visualEffect: 'ph_scan',
        vesselColorsBefore: ['#FDE68A', '#FDE68A', '#FDE68A'],
        vesselColorsAfter: ['#92400E', '#FEF08A', '#D97706'],
        vesselLabels: ['Açıq hava', 'Limon şirəsi (pH 2.3)', 'Adi su (pH 7.0)'],
        observation:
          'Açıq havada və adi suda qalan nümunələr qaraldı, limon şirəsi çəkilmiş nümunə isə parlaq sarı-ağ qaldı.',
        scientificReasoning:
          'Turş mühit (pH < 3) fermentin aktivliyini dayandırır, C vitamini isə oksigeni özünə bağlayaraq almadakı polifenolların oksidləşməsinin qarşısını alır.',
        measuredMetric: 'Limon mühiti: pH 2.3 (Oksidləşmə dayandı)',
      },
    ],
    stages: [
      {
        id: 'st-kit-1',
        title: 'Mərhələ 1: Qaralmanın kimyəvi mexanizmi',
        question: 'Kəsilmiş almanın qəhvəyi rəng almasının əsas səbəbi nədir?',
        options: [
          'Suyun buxarlanması',
          'Hava oksigeni (O₂) ilə fermentativ oksidləşmə reaksiyası',
          'Almanın içindəki nişastanın əriməsi',
          'Karbon qazının udulması',
        ],
        correctIndex: 1,
        explanation:
          'Düzgündür! Hava oksigeni ilə baş verən oksidləşmə reaksiyası nəticəsində melaninəbənzər qəhvəyi piqmentlər yaranır; limon turşusu və C vitamini bu prosesi ləngidir.',
        progressiveHints: [
          'Havadakı hansı qaz maddələrin oksidləşməsinə səbəb olur?',
        ],
        xpBonus: 30,
      },
    ],
  },
  {
    id: 'case-periodic-isotopes',
    title: 'Olimpiada Şüşəsindəki Sirli Element',
    category: 'Elementlər və dövri sistem',
    difficulty: 'Ekspert',
    xpReward: 210,
    estimatedMinutes: 6,
    storyline:
      'Kimya olimpiadasının final mərhələsində naməlum A elementi haqqında məlumatlar təqdim edilib. Elementin 3 elektron təbəqəsi var, xarici təbəqəsində 7 elektron yerləşir və otaq temperaturunda sarımtıl-yaşıl zəhərli olmayan simulyasiya olunmuş qaz əlamətləri göstərir (real laboratoriyada qapalı ampulada saxlanılır). Onun duz məhlulu gümüş nitratla ağ çöküntü verir.',
    clues: [
      'Elektron təbəqələrinin sayı dövr nömrəsinə bərabərdir (3-cü dövr).',
      'Xarici təbəqədəki 7 elektron VIIA qrupunu (halogenlər) göstərir.',
      'Natriumla birləşdikdə məişətdə hər gün istifadə olunan ağ kristal duz əmələ gətirir.',
    ],
    experiments: [
      {
        id: 'exp-ag',
        actionLabel: 'İndikator əlavə et',
        reagentName: 'AgNO₃ və nişasta-yodid kağızı',
        visualEffect: 'precipitate',
        vesselColorsBefore: ['#CBD5E1', '#CBD5E1', '#CBD5E1'],
        vesselColorsAfter: ['#F8FAFC', '#312E81', '#CBD5E1'],
        vesselLabels: ['Ag⁺ sınağı (Ağ)', 'Oksidləşmə testi', 'Referens'],
        observation:
          'A elementinin anionu Ag⁺ ionları ilə işıqda qaralan ağ çöküntü verdi.',
        scientificReasoning:
          '3-cü dövr, VIIA qrupunda yerləşən element Xlordur (Cl, Z=17). Onun konfiqurasiyası 1s² 2s² 2p⁶ 3s² 3p⁵ şəklindədir.',
        measuredMetric: 'Z = 17 · Ar = 35.45 · Cl⁻ təsdiqləndi',
      },
    ],
    stages: [
      {
        id: 'st-iso-1',
        title: 'Mərhələ 1: Elektron quruluşundan elementin tapılması',
        question: '3 elektron təbəqəsi və xarici təbəqədə 7 elektronu olan element hansıdır?',
        options: ['Flüor (F, Z=9)', 'Xlor (Cl, Z=17)', 'Brom (Br, Z=35)', 'Kükürd (S, Z=16)'],
        correctIndex: 1,
        explanation:
          'Mükəmməl hesablama! 2 + 8 + 7 = 17 elektron. Bu, 3-cü dövr VIIA qrupunun elementi olan Xlordur (Cl).',
        progressiveHints: [
          'Təbəqələr üzrə elektronları toplayın: 1-ci təbəqədə 2, 2-ci təbəqədə 8, 3-cü təbəqədə 7.',
        ],
        xpBonus: 60,
      },
    ],
  },
];

export function getDailyMysteryCase(allCases: MysteryCase[] = PRELOADED_CASES): MysteryCase {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % allCases.length;
  return {
    ...allCases[index],
    isDaily: true,
    xpReward: allCases[index].xpReward + 50,
  };
}
