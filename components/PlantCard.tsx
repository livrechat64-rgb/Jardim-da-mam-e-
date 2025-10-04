
import React from 'react';
import { Plant, PlantHealthStatus } from '../types';
import { CLASSIFICATION_STYLES } from '../constants';

interface PlantCardProps {
    plant: Plant;
    onDelete: () => void;
    onImageClick: (url: string) => void;
}

const healthIndicatorStyles: Record<PlantHealthStatus, { dot: string; text: string; }> = {
    'Healthy': { dot: 'bg-green-500', text: 'Saudável' },
    'Needs Attention': { dot: 'bg-yellow-400', text: 'Requer Atenção' },
    'Critical': { dot: 'bg-red-500', text: 'Crítico' },
};

const PlantCard: React.FC<PlantCardProps> = ({ plant, onDelete, onImageClick }) => {
    const healthInfo = healthIndicatorStyles[plant.health || 'Healthy'];

    const classificationColors: Record<string, string> = {
        'Sol Pleno': 'bg-green-500',
        'Meia Sombra': 'bg-yellow-500',
        'Sombra': 'bg-gray-500',
        'Rega Frequente': 'bg-blue-500',
        'Rega Moderada': 'bg-blue-300',
        'Pet-Friendly': 'bg-red-500'
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden border border-green-200 shadow-lg transition-transform hover:scale-105 flex flex-col">
            <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                    src={plant.imageUrl || `https://picsum.photos/seed/${plant.id}/400/300`}
                    alt={plant.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${plant.id}/400/300`; }}
                    onClick={() => plant.imageUrl && onImageClick(plant.imageUrl)}
                />
                {plant.imageUrl && <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">Clique para ampliar</div>}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center mb-1">
                    <span 
                        className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 border-2 border-white shadow-sm ${healthInfo.dot}`}
                        title={`Status: ${healthInfo.text}`}
                        aria-label={`Status: ${healthInfo.text}`}
                    ></span>
                    <h3 className="text-xl font-bold text-green-800 truncate" title={plant.name}>{plant.name}</h3>
                </div>
                <p className="text-sm text-gray-500 italic mb-3">{plant.species || 'Espécie Desconhecida'}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    {plant.classifications.map(tag => (
                        <span key={tag} className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${classificationColors[tag] || 'bg-gray-400'}`}>{tag}</span>
                    ))}
                </div>
                <p className="text-gray-700 text-sm mb-4 flex-grow">{plant.notes || 'Sem observações.'}</p>
                <div className="flex justify-end space-x-2 mt-auto pt-2 border-t border-gray-100">
                    <button onClick={onDelete} className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlantCard;
