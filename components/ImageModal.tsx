
import React from 'react';

interface ImageModalProps {
    imageUrl: string | null;
    onClose: () => void;
    showTemporaryMessage: (message: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, showTemporaryMessage }) => {
    if (!imageUrl) return null;

    const shareImage = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Foto do Jardim da Mamãe',
                    url: imageUrl,
                });
            } else {
                copyLink();
                showTemporaryMessage('Link copiado para a área de transferência.');
            }
        } catch (error) {
            console.error("Erro ao compartilhar:", error);
            showTemporaryMessage('Erro ao tentar compartilhar.');
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(imageUrl).then(() => {
            showTemporaryMessage('Link copiado!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showTemporaryMessage('Falha ao copiar o link.');
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
            <div className="relative max-w-4xl max-h-[90vh] mx-auto bg-white rounded-lg p-4 animate-zoomIn" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-3 -right-3 text-white bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-gray-700 z-10">
                    &times;
                </button>
                <img src={imageUrl} alt="Foto ampliada da planta" className="rounded-lg max-h-[75vh] object-contain mx-auto" />
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <button onClick={shareImage} className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Compartilhar
                    </button>
                    <button onClick={copyLink} className="w-full md:w-auto px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                        Copiar Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
