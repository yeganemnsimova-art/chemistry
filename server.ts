import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_CATEGORIES = [
  'Kimyəvi reaksiyalar',
  'Elementlər və dövri sistem',
  'Məhlullar',
  'Turşular və əsaslar',
  'Üzvi kimya',
  'Gündəlik həyatda kimya',
];

const ALLOWED_DIFFICULTIES = ['Başlanğıc', 'Orta', 'Ekspert'];

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    const ai = getGeminiClient();
    res.json({
      ok: true,
      aiAvailable: Boolean(ai),
    });
  });

  app.post('/api/cases/generate', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Süni intellekt xidməti hazırda konfiqurasiya edilməyib. Demo rejimindəki hazır hadisələrdən istifadə edə bilərsiniz.',
        aiUnavailable: true,
      });
      return;
    }

    const rawCategory = typeof req.body?.category === 'string' ? req.body.category.trim() : '';
    const rawDifficulty = typeof req.body?.difficulty === 'string' ? req.body.difficulty.trim() : '';
    const customFocus = typeof req.body?.customFocus === 'string' ? req.body.customFocus.trim().slice(0, 140) : '';

    const category = ALLOWED_CATEGORIES.includes(rawCategory)
      ? rawCategory
      : ALLOWED_CATEGORIES[0];
    const difficulty = ALLOWED_DIFFICULTIES.includes(rawDifficulty)
      ? rawDifficulty
      : 'Orta';

    const xpMap: Record<string, number> = {
      'Başlanğıc': 100,
      'Orta': 150,
      'Ekspert': 220,
    };

    const prompt = `Sən "ChemQuest — Kimya Detektivi" oyunu üçün peşəkar kimya müəllimi və detektiv oyun ustasısan (Game Master).
Aşağıdakı parametrlərə uyğun olaraq tam orijinal, elmi cəhətdən 100% düzgün, təhlükəsiz (heç bir təhlükəli real-həyat qarışığı təklif etməyən) və maraqlı kimya sirri hadisəsi yarat.
Bütün mətnlər təbii, səlis və qrammatik cəhətdən düzgün Azərbaycan dilində olmalıdır.

Kateqoriya: ${category}
Çətinlik səviyyəsi: ${difficulty}
${customFocus ? `Əlavə mövzu istəyi: ${customFocus}` : ''}

Tələblər:
1. Hadisənin cəlbedici detektiv süjeti (storyline) olsun — laboratoriya sirri, itmiş qeydlər, naməlum maddə və s.
2. 3-5 ədəd məntiqi ipucu (clues) ver.
3. 3-4 ədəd interaktiv laboratoriya təcrübəsi (experiments) yarat. Hər təcrübənin düymə adı (actionLabel: məsələn "İndikator əlavə et", "Məhlulu analiz et", "Reaksiya müşahidə et", "Alov sınağı apar"), vizual effekti (visualEffect: yalnız "color_shift", "bubbling", "precipitate", "flame", "ph_scan", "conductivity" dəyərlərindən biri), 3 sınaq şüşəsi üçün əvvəlki və sonrakı hex rəng kodları (vesselColorsBefore və vesselColorsAfter - hər biri 3 hex rəng), qab etiketləri (vesselLabels - 3 qısa ad, məs. ["Qab A", "Qab B", "Qab C"]), müşahidə (observation), elmi izah (scientificReasoning) və ölçü göstəricisi (measuredMetric) olsun.
4. 2 mərhələli sual-cavab (stages) olsun. Hər mərhələdə 4 variant (options), düzgün cavab indeksi (correctIndex: 0-3), səmimi elmi izah (explanation) və cavabı birbaşa demədən istiqamətləndirən 2 mərhələli ipucu (progressiveHints) olsun.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'Cavabı yalnız tələb olunan JSON sxemində qaytar. Bütün elmi faktlar və kimyəvi reaksiyalar dəqiq və təhlükəsiz məktəb/universitet kimyasına uyğun olmalıdır. Bütün mətn Azərbaycan dilində olmalıdır.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              storyline: { type: Type.STRING },
              estimatedMinutes: { type: Type.INTEGER },
              clues: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              experiments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    actionLabel: { type: Type.STRING },
                    reagentName: { type: Type.STRING },
                    visualEffect: { type: Type.STRING },
                    vesselColorsBefore: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    vesselColorsAfter: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    vesselLabels: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    observation: { type: Type.STRING },
                    scientificReasoning: { type: Type.STRING },
                    measuredMetric: { type: Type.STRING },
                  },
                  required: [
                    'id',
                    'actionLabel',
                    'reagentName',
                    'visualEffect',
                    'vesselColorsBefore',
                    'vesselColorsAfter',
                    'vesselLabels',
                    'observation',
                    'scientificReasoning',
                    'measuredMetric',
                  ],
                },
              },
              stages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    progressiveHints: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    xpBonus: { type: Type.INTEGER },
                  },
                  required: [
                    'id',
                    'title',
                    'question',
                    'options',
                    'correctIndex',
                    'explanation',
                    'progressiveHints',
                    'xpBonus',
                  ],
                },
              },
            },
            required: ['title', 'storyline', 'estimatedMinutes', 'clues', 'experiments', 'stages'],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);

      const allowedEffects = new Set([
        'color_shift',
        'bubbling',
        'precipitate',
        'flame',
        'ph_scan',
        'conductivity',
      ]);

      const normalizedExperiments = Array.isArray(parsed.experiments)
        ? parsed.experiments.slice(0, 4).map((exp: Record<string, unknown>, idx: number) => ({
            id: typeof exp.id === 'string' && exp.id ? exp.id : `exp-${idx + 1}`,
            actionLabel: typeof exp.actionLabel === 'string' ? exp.actionLabel : `Təcrübə ${idx + 1}`,
            reagentName: typeof exp.reagentName === 'string' ? exp.reagentName : 'Analitik reaktiv',
            visualEffect:
              typeof exp.visualEffect === 'string' && allowedEffects.has(exp.visualEffect)
                ? exp.visualEffect
                : 'color_shift',
            vesselColorsBefore:
              Array.isArray(exp.vesselColorsBefore) && exp.vesselColorsBefore.length === 3
                ? exp.vesselColorsBefore.map(String)
                : ['#94A3B8', '#94A3B8', '#94A3B8'],
            vesselColorsAfter:
              Array.isArray(exp.vesselColorsAfter) && exp.vesselColorsAfter.length === 3
                ? exp.vesselColorsAfter.map(String)
                : ['#22D3EE', '#A855F7', '#38BDF8'],
            vesselLabels:
              Array.isArray(exp.vesselLabels) && exp.vesselLabels.length === 3
                ? exp.vesselLabels.map(String)
                : ['Qab A', 'Qab B', 'Qab C'],
            observation: typeof exp.observation === 'string' ? exp.observation : 'Müşahidə qeydə alındı.',
            scientificReasoning:
              typeof exp.scientificReasoning === 'string'
                ? exp.scientificReasoning
                : 'Reaksiya nəticəsində maddənin xassələri müəyyən edildi.',
            measuredMetric: typeof exp.measuredMetric === 'string' ? exp.measuredMetric : 'Analiz tamamlandı',
          }))
        : [];

      const normalizedStages = Array.isArray(parsed.stages)
        ? parsed.stages.slice(0, 3).map((st: Record<string, unknown>, idx: number) => {
            const opts = Array.isArray(st.options) ? st.options.map(String).slice(0, 4) : [];
            const rawCorrect = typeof st.correctIndex === 'number' ? st.correctIndex : 0;
            const correctIndex = Math.max(0, Math.min(opts.length - 1, rawCorrect));
            return {
              id: typeof st.id === 'string' && st.id ? st.id : `stage-${idx + 1}`,
              title: typeof st.title === 'string' ? st.title : `Mərhələ ${idx + 1}`,
              question: typeof st.question === 'string' ? st.question : 'Düzgün nəticəni seçin.',
              options: opts.length >= 2 ? opts : ['Variant A', 'Variant B', 'Variant C', 'Variant D'],
              correctIndex,
              explanation: typeof st.explanation === 'string' ? st.explanation : 'Elmi izah əlavə edildi.',
              progressiveHints:
                Array.isArray(st.progressiveHints) && st.progressiveHints.length > 0
                  ? st.progressiveHints.map(String)
                  : ['Təcrübə nəticələrini yenidən müqayisə edin.'],
              xpBonus: typeof st.xpBonus === 'number' ? Math.min(80, Math.max(20, st.xpBonus)) : 40,
            };
          })
        : [];

      const generatedCase = {
        id: `ai-${Date.now()}`,
        title: typeof parsed.title === 'string' ? parsed.title : 'Süni İntellekt Kimya Sirri',
        category,
        difficulty,
        xpReward: xpMap[difficulty] ?? 150,
        estimatedMinutes:
          typeof parsed.estimatedMinutes === 'number'
            ? Math.min(15, Math.max(3, parsed.estimatedMinutes))
            : 5,
        storyline: typeof parsed.storyline === 'string' ? parsed.storyline : '',
        clues: Array.isArray(parsed.clues) ? parsed.clues.map(String).slice(0, 5) : [],
        experiments: normalizedExperiments,
        stages: normalizedStages,
        isAiGenerated: true,
      };

      res.json({ mysteryCase: generatedCase });
    } catch (error) {
      console.error('Gemini case generation error:', error);
      res.status(502).json({
        error: 'Hadisə yaradılarkən süni intellekt xidmətində xəta baş verdi. Zəhmət olmasa bir daha sınayın.',
      });
    }
  });

  app.post('/api/cases/hint', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Süni intellekt xidməti əlçatan deyil.',
        aiUnavailable: true,
      });
      return;
    }

    const storyline = typeof req.body?.storyline === 'string' ? req.body.storyline.slice(0, 1200) : '';
    const question = typeof req.body?.question === 'string' ? req.body.question.slice(0, 600) : '';
    const experimentsRun = Array.isArray(req.body?.experimentsRun)
      ? req.body.experimentsRun.map(String).slice(0, 6)
      : [];
    const hintStep = typeof req.body?.hintStep === 'number' ? req.body.hintStep : 1;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Detektivə mərhələli ipucu ver. Düzgün cavabı BİRBAŞA DEMƏ, onu düşündür və istiqamətləndir.
Hadisə: ${storyline}
Cari sual: ${question}
Aparılmış təcrübələr: ${experimentsRun.length > 0 ? experimentsRun.join(', ') : 'Hələ heç bir təcrübə aparılmayıb'}
İpucu səviyyəsi: ${hintStep} (1 = yüngül istiqamət, 2 = daha konkret elmi ipucu).
Qısa, səmimi, 2-3 cümləlik Azərbaycan dilində cavab yaz.`,
      });

      res.json({ hint: (response.text ?? '').trim() });
    } catch (error) {
      console.error('Gemini hint error:', error);
      res.status(502).json({ error: 'İpucu alınarkən xəta baş verdi.' });
    }
  });

  app.post('/api/cases/evaluate-reasoning', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Süni intellekt xidməti əlçatan deyil.',
        aiUnavailable: true,
      });
      return;
    }

    const question = typeof req.body?.question === 'string' ? req.body.question.slice(0, 600) : '';
    const selectedOption = typeof req.body?.selectedOption === 'string' ? req.body.selectedOption.slice(0, 300) : '';
    const correctOption = typeof req.body?.correctOption === 'string' ? req.body.correctOption.slice(0, 300) : '';
    const isCorrect = Boolean(req.body?.isCorrect);
    const userReasoning = typeof req.body?.userReasoning === 'string' ? req.body.userReasoning.slice(0, 600) : '';
    const scientificExplanation =
      typeof req.body?.scientificExplanation === 'string' ? req.body.scientificExplanation.slice(0, 800) : '';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Sən mehriban və ruhlandırıcı Kimya Detektivi Oyun Ustasısan.
Sual: ${question}
İstifadəçinin seçimi: ${selectedOption}
Düzgün cavab: ${correctOption}
Seçim düzgündürmü?: ${isCorrect ? 'Bəli' : 'Xeyr'}
İstifadəçinin yazdığı məntiq: ${userReasoning || 'Yazılmayıb'}
Elmi izah: ${scientificExplanation}

Qayda:
- Əgər istifadəçi səhv edibsə, onu heç vaxt pis hiss etdirmə; nə üçün seçdiyi variantın uyğun gəlmədiyini mehriban, öyrədici şəkildə izah et və düzgün cavabı dərhal açmadan yenidən düşünməyə yönəlt.
- Əgər istifadəçi düzgün seçibsə və məntiqini yazıbsa, onun elmi düşüncəsini qiymətləndir və təbrik et.
- Cavabı 2-4 qısa cümlədə, təbii Azərbaycan dilində yaz.`,
      });

      res.json({ feedback: (response.text ?? '').trim() });
    } catch (error) {
      console.error('Gemini evaluate-reasoning error:', error);
      res.status(502).json({ error: 'Rəy hazırlanarkən xəta baş verdi.' });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output tapılmadı.');
      }
    });
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`ChemQuest server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ChemQuest server:', err);
  process.exit(1);
});
