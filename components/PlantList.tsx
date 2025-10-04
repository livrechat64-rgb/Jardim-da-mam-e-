
import React from 'react';
import { Plant } from '../types';
import PlantCard from './PlantCard';
import Spinner from './Spinner';

interface PlantListProps {
    plants: Plant[];
    loading: boolean;
    onDelete: (plant: Plant) => void;
    onImageClick: (url: string) => void;
}

const PlantList: React.FC<PlantListProps> = ({ plants, loading, onDelete, onImageClick }) => {
    return (
        <section>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Minhas Plantas</h2>
            {loading && (
                 <div className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                        <Spinner />
                        <p className="text-gray-500 animate-pulse">Carregando plantas...</p>
                    </div>
                </div>
            )}
            {!loading && plants.length === 0 && (
                <p className="text-gray-500 col-span-full text-center py-8">Nenhuma planta adicionada ainda. Adicione a primeira!</p>
            )}
            {!loading && plants.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plants.map(plant => (
                        <PlantCard 
                            key={plant.id} 
                            plant={plant} 
                            onDelete={() => onDelete(plant)} 
                            onImageClick={onImageClick}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PlantList;
