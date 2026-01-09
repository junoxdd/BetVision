
// Dados brutos como seriam capturados pelo motor de busca
export interface RawGameData {
    id: string;
    league: string; 
    teamA: string;
    teamB: string;
    scoreA: number;
    scoreB: number;
    minute: number;
    currentOdd: number;
    startTime?: string; // Ex: "21:45"
    status: 'live' | 'pre-live';
}

// A sugestão da IA após análise e validação
export interface AiSuggestion {
    suggestion: string;
    analysis: string;
    confidence: 'S' | 'A' | 'B';
    source_links: {
        title: string;
        url: string;
    }[];
    h2h_summary: string;
    team_form: {
        teamA: string[];
        teamB: string[];
    };
}

// O objeto de jogo completo
export interface Game extends RawGameData {
    aiSuggestion: AiSuggestion;
}

export interface MultiplaBet {
    gameId: string;
    teams: string;
    suggestion: string;
    odd: number;
}

export interface Multipla {
    id: string;
    bets: MultiplaBet[];
    totalOdd: number;
    analysis: string;
}
