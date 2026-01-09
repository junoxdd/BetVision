
import React from 'react';

interface ErrorAlertProps {
    message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
    return (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative my-8" role="alert">
            <strong className="font-bold">Ocorreu um Erro! </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
};

export default ErrorAlert;
