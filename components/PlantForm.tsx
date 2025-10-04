
import React from 'react';
import { Classification } from '../types';
import { CLASSIFICATIONS, CLASSIFICATION_STYLES } from '../constants';
import Spinner from './Spinner';

interface PlantFormProps {
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    statusMessage: string;
    name: string; setName: (val: string) => void;
    species: string; setSpecies: (val: string) => void;
    notes: string; setNotes: (val: string) => void;
    imageUrl: string; setImageUrl: (val: string) => void;
    classifications: Classification[]; setClassifications: (val: Classification[]) => void;
    photoPreview: string | null;
    onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearPhoto: () => void;
}

const PlantForm: React.FC<PlantFormProps> = ({
    onSubmit, isLoading, statusMessage,
    name, setName, species, setSpecies, notes, setNotes, imageUrl, setImageUrl,
    classifications, setClassifications,
    photoPreview, onPhotoChange, onClearPhoto
}) => {

    const handleClassificationChange = (classification: Classification) => {
        setClassifications(
            classifications.includes(classification)
                ? classifications.filter(c => c !== classification)
                : [...classifications, classification]
        );
    };

    return (
        <section className="mb-10">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Adicionar Nova Planta</h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome da planta (ex: Orquídea)" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition" />
                <input type="text" value={species} onChange={e => setSpecies(e.target.value)} placeholder="Espécie (preenchido por IA ou opcional)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition" />
                
                <div className="space-y-2 pt-4 border-t py-4">
                    <h3 className="text-lg font-semibold text-green-700">1. Adicionar Foto da Planta:</h3>
                    <p className="text-sm text-gray-600">Use uma foto para a IA identificar e preencher os campos para você.</p>
                    <input type="file" id="plant-photo" accept="image/*" onChange={onPhotoChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                    
                    {photoPreview && (
                        <div className="mt-2 max-w-xs h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                            <img className="w-full h-full object-cover" src={photoPreview} alt="Preview da imagem" />
                            <button type="button" onClick={onClearPhoto} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700 transition">&times;</button>
                        </div>
                    )}
                </div>

                <div className="space-y-2 pt-4 border-t py-4">
                    <h3 className="text-lg font-semibold text-green-700">2. URL da Foto (Opcional):</h3>
                    <p className="text-sm text-gray-600">Cole um link externo se não for enviar um arquivo.</p>
                    <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition" />
                </div>
                
                <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-semibold text-green-700">3. Observações:</h3>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Cuidados especiais, data de compra, etc." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-none h-24 transition"></textarea>
                </div>
                
                <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-semibold text-green-700">4. Classificações:</h3>
                    <div className="flex flex-wrap gap-2">
                        {CLASSIFICATIONS.map(c => {
                            const style = CLASSIFICATION_STYLES[c];
                            return (
                                <label key={c} className={`flex items-center space-x-2 cursor-pointer ${style.bg} ${style.text} px-3 py-1 rounded-full hover:brightness-95 transition-all`}>
                                    <input type="checkbox" checked={classifications.includes(c)} onChange={() => handleClassificationChange(c)} className={`rounded ${style.text} ${style.ring}`} />
                                    <span>{c}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-green-400 disabled:cursor-not-allowed">
                    {isLoading ? <><Spinner className="w-5 h-5 mr-2" /> {statusMessage || 'Processando...'} </> : 'Adicionar Planta'}
                </button>
            </form>
        </section>
    );
};

export default PlantForm;
