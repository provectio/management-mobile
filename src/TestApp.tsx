import React from 'react';

function TestApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '1rem' 
        }}>
          Provectio Télécom - Test
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem' 
        }}>
          L'application fonctionne correctement !
        </p>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem' 
          }}>
            État de l'application
          </h2>
          <div style={{ textAlign: 'left' }}>
            <p>✅ React fonctionne</p>
            <p>✅ Vite fonctionne</p>
            <p>✅ TypeScript fonctionne</p>
            <p>✅ Build fonctionne</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestApp;
