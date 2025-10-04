import React, { useState, useEffect, useCallback } from 'react';
import { Plant, Classification } from './types';
import PlantForm from './components/PlantForm';
import PlantList from './components/PlantList';
import ConfirmationModal from './components/ConfirmationModal';
import ImageModal from './components/ImageModal';
import { analyzePlantImage, analyzePlantHealth } from './services/geminiService';

// Mock environment variables for demonstration as per original user code structure
// In a real project, these would come from process.env
const MOCK_API_KEY = process.env.API_KEY || ""; // Should be set in the environment
const LOCAL_STORAGE_KEY = 'jardim-da-mamae-plants';

const App: React.FC = () => {
    const [plants, setPlants] = useState<Plant[]>(() => {
        try {
            const savedPlants = localStorage.getItem(LOCAL_STORAGE_KEY);
            return savedPlants ? JSON.parse(savedPlants) : [];
        } catch (error) {
            console.error("Failed to load plants from localStorage", error);
            return [];
        }
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
    const [formStatusMessage, setFormStatusMessage] = useState<string>('');
    
    // Form State
    const [plantName, setPlantName] = useState('');
    const [plantSpecies, setPlantSpecies] = useState('');
    const [plantNotes, setPlantNotes] = useState('');
    const [plantImageUrl, setPlantImageUrl] = useState('');
    const [plantClassifications, setPlantClassifications] = useState<Classification[]>([]);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    // Modal States
    const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

    // Temporary Message State
    const [tempMessage, setTempMessage] = useState<string | null>(null);

    // Effect to save plants to localStorage whenever the state changes
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plants));
        } catch (error) {
            console.error("Failed to save plants to localStorage", error);
        }
    }, [plants]);

    // Effect to handle the initial loading state
    useEffect(() => {
        setLoading(false);
    }, []);

    const showTemporaryMessage = (message: string) => {
        setTempMessage(message);
        setTimeout(() => setTempMessage(null), 3000);
    };

    const resetForm = useCallback(() => {
        setPlantName('');
        setPlantSpecies('');
        setPlantNotes('');
        setPlantImageUrl('');
        setPlantClassifications([]);
        setPhotoPreview(null);
        setPhotoFile(null);
        const fileInput = document.getElementById('plant-photo') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    }, []);

    const handleAddPlant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plantName) {
            showTemporaryMessage('O nome da planta é obrigatório.');
            return;
        }

        setIsFormLoading(true);
        setFormStatusMessage('Analisando saúde da planta...');

        try {
            const healthStatus = await analyzePlantHealth(plantNotes);

            let finalImageUrl = plantImageUrl;
            if (photoFile) {
                setFormStatusMessage('Fazendo upload da imagem...');
                // This is a mock upload. In a real app, you would upload to a service like Firebase Storage.
                // For this example, we will just use the local preview URL if available.
                finalImageUrl = photoPreview || '';
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload
            }

            const newPlant: Omit<Plant, 'id'> = {
                name: plantName,
                species: plantSpecies,
                notes: plantNotes,
                imageUrl: finalImageUrl,
                classifications: plantClassifications,
                createdAt: Date.now(),
                health: healthStatus,
            };
            
            setFormStatusMessage('Adicionando planta...');
            // Mock adding to a database
            const mockAddedPlant: Plant = { ...newPlant, id: `plant-${Date.now()}`};
            setPlants(prevPlants => [mockAddedPlant, ...prevPlants].sort((a, b) => b.createdAt - a.createdAt));

            showTemporaryMessage('Planta adicionada ao Jardim!');
            resetForm();
        } catch (error) {
            console.error("Error adding plant:", error);
            showTemporaryMessage('Erro ao adicionar planta.');
        } finally {
            setIsFormLoading(false);
            setFormStatusMessage('');
        }
    };
    
    const handleDeletePlant = (plantId: string) => {
        // Mock deleting from a database
        setPlants(prevPlants => prevPlants.filter(p => p.id !== plantId));
        showTemporaryMessage('Planta removida com sucesso!');
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    };

    const openDeleteConfirmation = (plant: Plant) => {
        setModalState({
            isOpen: true,
            title: 'Confirma Exclusão?',
            message: `Tem certeza que deseja remover a planta "${plant.name}"?`,
            onConfirm: () => handleDeletePlant(plant.id),
        });
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            setPlantImageUrl('');
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);

            setIsFormLoading(true);
            setFormStatusMessage('Analisando imagem com IA...');

            try {
                if (!MOCK_API_KEY) {
                    throw new Error("API key is not configured.");
                }
                const base64Data = await fileToBase64(file);
                const result = await analyzePlantImage(base64Data, file.type);
                
                setPlantSpecies(result.species);
                setPlantNotes(result.notes);

                setPlantClassifications(current => {
                    const newClassifications = new Set(current);
                    if (result.isToxic === false) {
                        newClassifications.add('Pet-Friendly');
                    } else {
                        newClassifications.delete('Pet-Friendly');
                    }
                    return Array.from(newClassifications);
                });

                showTemporaryMessage('Análise da planta concluída!');
            } catch (error) {
                console.error("Error analyzing image:", error);
                showTemporaryMessage('Erro na análise. Por favor, preencha manually.');
            } finally {
                setIsFormLoading(false);
                setFormStatusMessage('');
            }
        }
    };

    const handleClearPhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        const fileInput = document.getElementById('plant-photo') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    return (
        <div className="container mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-green-200 max-w-4xl my-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-green-800">O Jardim da Mamãe</h1>
                <p className="mt-2 text-lg text-green-600">Uma coleção digital para nossas plantas.</p>
            </header>

            <main>
                <PlantForm
                    onSubmit={handleAddPlant}
                    isLoading={isFormLoading}
                    statusMessage={formStatusMessage}
                    name={plantName} setName={setPlantName}
                    species={plantSpecies} setSpecies={setPlantSpecies}
                    notes={plantNotes} setNotes={setPlantNotes}
                    imageUrl={plantImageUrl} setImageUrl={setPlantImageUrl}
                    classifications={plantClassifications} setClassifications={setPlantClassifications}
                    photoPreview={photoPreview}
                    onPhotoChange={handlePhotoChange}
                    onClearPhoto={handleClearPhoto}
                />
                <PlantList
                    plants={plants}
                    loading={loading}
                    onDelete={openDeleteConfirmation}
                    onImageClick={setImageModalUrl}
                />
            </main>

            <ConfirmationModal
                isOpen={modalState.isOpen}
                title={modalState.title}
                message={modalState.message}
                onConfirm={modalState.onConfirm}
                onCancel={() => setModalState({ ...modalState, isOpen: false })}
            />
            
            <ImageModal
                imageUrl={imageModalUrl}
                onClose={() => setImageModalUrl(null)}
                showTemporaryMessage={showTemporaryMessage}
            />

            {tempMessage && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-full shadow-lg z-50 transition-opacity duration-300 animate-fadeIn">
                    {tempMessage}
                </div>
            )}
        </div>
    );
};

export default App;