
export type PlantHealthStatus = 'Healthy' | 'Needs Attention' | 'Critical';

export type Classification = 'Sol Pleno' | 'Meia Sombra' | 'Sombra' | 'Rega Frequente' | 'Rega Moderada' | 'Pet-Friendly';

export interface Plant {
    id: string;
    name: string;
    species: string;
    notes: string;
    imageUrl: string;
    classifications: Classification[];
    createdAt: number;
    health: PlantHealthStatus;
}

export interface PlantAnalysisResult {
    species: string;
    notes: string;
    isToxic: boolean;
}
