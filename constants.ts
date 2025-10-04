
import { Classification } from './types';

export const CLASSIFICATIONS: Classification[] = [
    'Sol Pleno',
    'Meia Sombra',
    'Sombra',
    'Rega Frequente',
    'Rega Moderada',
    'Pet-Friendly'
];

export const CLASSIFICATION_STYLES: Record<Classification, { bg: string; text: string; ring: string }> = {
    'Sol Pleno': { bg: 'bg-green-100', text: 'text-green-800', ring: 'focus:ring-green-500' },
    'Meia Sombra': { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'focus:ring-yellow-500' },
    'Sombra': { bg: 'bg-gray-200', text: 'text-gray-800', ring: 'focus:ring-gray-500' },
    'Rega Frequente': { bg: 'bg-blue-100', text: 'text-blue-800', ring: 'focus:ring-blue-500' },
    'Rega Moderada': { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'focus:ring-blue-300' },
    'Pet-Friendly': { bg: 'bg-red-100', text: 'text-red-800', ring: 'focus:ring-red-500' }
};
