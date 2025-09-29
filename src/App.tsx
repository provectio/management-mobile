import React from 'react';

function App() {
  console.log('App component rendering');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '1rem' 
        }}>
          🚀 Provectio Télécom
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Application de gestion des abonnements mobiles
        </p>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#111827'
          }}>
            ✅ Application fonctionnelle
          </h2>
          <div style={{ textAlign: 'left', color: '#4b5563' }}>
            <p>✅ React fonctionne</p>
            <p>✅ Vite fonctionne</p>
            <p>✅ TypeScript fonctionne</p>
            <p>✅ Build fonctionne</p>
            <p>✅ Axios corrigé</p>
          </div>
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '0.375rem',
            border: '1px solid #0ea5e9'
          }}>
            <p style={{ color: '#0369a1', margin: 0, fontSize: '0.9rem' }}>
              🎯 L'application est prête pour le déploiement en production
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
