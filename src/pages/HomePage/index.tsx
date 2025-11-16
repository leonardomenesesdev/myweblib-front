import { Header } from '@/components/Header';
import React from 'react';

const HomePage: React.FC = () => {
    return (
        <>
        <div className="inset-0 bg-linear-to-br from-blue-700 via-blue-800 to-slate-900">
            <Header />
        </div>
        <h1>Seu componente aqui</h1>

        </>

    );
};

export default HomePage;
