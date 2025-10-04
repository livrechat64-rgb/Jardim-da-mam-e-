
import React from 'react';

interface SpinnerProps {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = 'w-6 h-6' }) => {
    return (
        <div 
            className={`border-4 border-gray-200 border-t-green-600 rounded-full animate-spin ${className}`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
