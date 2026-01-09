
import { GoogleGenAI, Type } from "@google/genai";
import { RawGameData } from '../types.ts';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisResponse {
    id: string;
    isValid: boolean;
    suggestion: string;
    analysis: string;
    confidence: 'S' | 'A' | 'B';
    h2h_summary: string;
    team_form: {
        teamA: string[];
        teamB: string[];
    };
    sources: { title: string; url: string; }[];
}

export const processInputData = async (input: { 
    type: 'image' | 'text' | 'auto-live' | 'auto-pre-live', 
    value: string 
}): Promise<{ games: RawGameData[], analyses: AnalysisResponse[] }> => {
    const ai = getAI();
    
    // Prompt ultra-rigoroso para evitar alucinações
    let prompt = `
        VOCÊ É UM AGENTE DE EXTRAÇÃO DE DADOS EM TEMPO REAL. 
        PROIBIDO INVENTAR JOGOS, TIMES OU RESULTADOS.

        SUA ÚNICA FONTE DE VERDADE É O GOOGLE SEARCH.
        
        ${input.type === 'auto-live' ? `
            MISSÃO: Localizar jogos de FUTEBOL que estão ocorrendo NESTE EXATO MOMENTO.
            PROCEDIMENTO:
            1. Pesquise por "live football scores now" ou "placar ao vivo betano".
            2. Extraia apenas jogos Reais que tenham PLACAR e MINUTO DE JOGO visíveis.
            3. Ignore jogos virtuais ou e-sports, a menos que especificado.
        ` : input.type === 'auto-pre-live' ? `
            MISSÃO: Localizar jogos de FUTEBOL que começarão HOJE ou AMANHÃ.
            PROCEDIMENTO:
            1. Pesquise por "upcoming football matches today" ou "principais eventos betano".
            2. Extraia a HORA DE INÍCIO real e as ODDS de abertura reais.
            3. Foque em ligas profissionais verídicas.
        ` : `
            MISSÃO: Analisar a imagem/texto fornecida e VALIDAR os dados via busca.
            Se os dados na imagem forem antigos ou fictícios, corrija-os com a realidade atual do Google Search.
        `}

        CRÍTICO: 
        - Se a busca não retornar jogos reais, retorne um JSON com array "results" VAZIO.
        - Não use conhecimento prévio para "estimar" placares.
        - Para cada jogo, você DEVE fornecer o link da fonte no groundingMetadata.

        RETORNE EM JSON.
    `;

    const parts: any[] = [{ text: prompt }];

    if (input.type === 'image') {
        const base64Data = input.value.includes(',') ? input.value.split(',')[1] : input.value;
        parts.push({
            inlineData: { mimeType: "image/jpeg", data: base64Data }
        });
    } else if (input.type === 'text' && input.value !== 'AUTO_TRIGGER') {
        parts.push({ text: input.value });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts },
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        results: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    game: {
                                        type: Type.OBJECT,
                                        properties: {
                                            league: { type: Type.STRING },
                                            teamA: { type: Type.STRING },
                                            teamB: { type: Type.STRING },
                                            scoreA: { type: Type.INTEGER },
                                            scoreB: { type: Type.INTEGER },
                                            minute: { type: Type.INTEGER },
                                            startTime: { type: Type.STRING },
                                            currentOdd: { type: Type.NUMBER },
                                            status: { type: Type.STRING, enum: ['live', 'pre-live'] }
                                        },
                                        required: ["teamA", "teamB", "status"]
                                    },
                                    analysis: {
                                        type: Type.OBJECT,
                                        properties: {
                                            suggestion: { type: Type.STRING },
                                            analysis: { type: Type.STRING },
                                            confidence: { type: Type.STRING },
                                            h2h_summary: { type: Type.STRING },
                                            team_form: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    teamA: { type: Type.ARRAY, items: { type: Type.STRING } },
                                                    teamB: { type: Type.ARRAY, items: { type: Type.STRING } }
                                                }
                                            }
                                        },
                                        required: ["suggestion", "analysis"]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
            title: chunk.web?.title || "Fonte Verificada",
            url: chunk.web?.uri || "#"
        })) || [];

        const rawText = response.text;
        const parsed = JSON.parse(rawText || '{"results":[]}');
        
        // Filtro adicional: Se a IA retornou algo genérico ou sem sentido, descartamos
        const processed = (parsed.results || [])
            .filter((r: any) => r.game.teamA && r.game.teamB && r.game.teamA !== r.game.teamB)
            .map((r: any, idx: number) => {
                const uid = `${r.game.status}-${idx}-${Date.now()}`;
                return {
                    game: {
                        ...r.game,
                        id: uid,
                        scoreA: r.game.scoreA ?? 0,
                        scoreB: r.game.scoreB ?? 0,
                        minute: r.game.minute ?? 0,
                        currentOdd: r.game.currentOdd || 1.85,
                        league: r.game.league || "Global Match"
                    } as RawGameData,
                    analysis: {
                        ...r.analysis,
                        id: uid,
                        isValid: true,
                        sources: sources,
                        confidence: (['S', 'A', 'B'].includes(r.analysis.confidence) ? r.analysis.confidence : 'B')
                    } as AnalysisResponse
                };
            });
        
        return {
            games: processed.map(p => p.game),
            analyses: processed.map(p => p.analysis)
        };
    } catch (error) {
        console.error("AI Service Execution Error:", error);
        throw new Error("Erro de veracidade: Não foi possível confirmar os dados em tempo real. Tente novamente.");
    }
};
