#!/bin/bash

# Script de déploiement pour Provectio Télécom
# Usage: ./deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}

echo "🚀 Déploiement de Provectio Télécom en mode: $ENVIRONMENT"

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Construire l'image
echo "🔨 Construction de l'image Docker..."
docker build -t provectio-telecom:latest .

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose -f docker-compose.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Démarrer selon l'environnement
if [ "$ENVIRONMENT" = "prod" ]; then
    echo "🏭 Démarrage en mode production..."
    docker-compose -f docker-compose.prod.yml up -d
else
    echo "🔧 Démarrage en mode développement..."
    docker-compose up -d
fi

# Vérifier le statut
echo "⏳ Attente du démarrage..."
sleep 10

# Test de santé
if curl -f http://localhost:3015 > /dev/null 2>&1; then
    echo "✅ Application déployée avec succès!"
    echo "🌐 Accessible sur: http://localhost:3015"
    echo "📊 Statut des conteneurs:"
    docker-compose ps
else
    echo "❌ L'application n'est pas accessible. Vérifiez les logs:"
    docker-compose logs
    exit 1
fi
