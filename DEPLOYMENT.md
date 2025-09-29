# 🚀 Déploiement Provectio Télécom

## 📋 Prérequis

- Docker 20.10+
- Docker Compose 2.0+
- Git

## 🔧 Déploiement local

### 1. Cloner le repository
```bash
git clone <votre-repo-github>
cd provectio-mobile
```

### 2. Configuration des variables d'environnement
```bash
cp env.example .env.local
# Éditer .env.local avec vos vraies valeurs
```

### 3. Déploiement
```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Déploiement en mode développement
./deploy.sh dev

# Déploiement en mode production
./deploy.sh prod
```

## 🌐 Accès à l'application

- **URL** : http://localhost:3015
- **Port** : 3015
- **Environnement** : Production

## 🐳 Commandes Docker utiles

### Gestion des conteneurs
```bash
# Voir les conteneurs en cours
docker-compose ps

# Voir les logs
docker-compose logs -f

# Redémarrer l'application
docker-compose restart

# Arrêter l'application
docker-compose down

# Mise à jour de l'application
docker-compose pull
docker-compose up -d
```

### Maintenance
```bash
# Nettoyer les images inutilisées
docker system prune -f

# Voir l'utilisation des ressources
docker stats

# Accéder au conteneur
docker-compose exec provectio-telecom sh
```

## 🔒 Sécurité

### Variables d'environnement
- Ne jamais commiter les fichiers `.env*`
- Utiliser des secrets Docker pour la production
- Changer les mots de passe par défaut

### Configuration Nginx
- Headers de sécurité configurés
- Compression Gzip activée
- Cache des assets statiques
- Proxy pour l'API Networth

## 📊 Monitoring

### Health Check
L'application inclut un health check automatique :
- **Intervalle** : 30 secondes
- **Timeout** : 10 secondes
- **Retries** : 3 tentatives

### Logs
```bash
# Logs de l'application
docker-compose logs provectio-telecom

# Logs Nginx
docker-compose exec provectio-telecom tail -f /var/log/nginx/access.log
docker-compose exec provectio-telecom tail -f /var/log/nginx/error.log
```

## 🚨 Dépannage

### L'application ne démarre pas
```bash
# Vérifier les logs
docker-compose logs

# Vérifier les ports
netstat -tulpn | grep 3015

# Redémarrer Docker
sudo systemctl restart docker
```

### Problème de permissions
```bash
# Donner les permissions au script
chmod +x deploy.sh

# Vérifier les permissions Docker
sudo usermod -aG docker $USER
```

### Problème de mémoire
```bash
# Augmenter la mémoire Docker
# Éditer /etc/docker/daemon.json
{
  "default-ulimits": {
    "memlock": {
      "Hard": -1,
      "Name": "memlock",
      "Soft": -1
    }
  }
}
```

## 🔄 Mise à jour

### Mise à jour de l'application
```bash
# Récupérer les dernières modifications
git pull origin main

# Reconstruire et redéployer
./deploy.sh prod
```

### Mise à jour de Docker
```bash
# Mettre à jour Docker
sudo apt update
sudo apt upgrade docker.io docker-compose

# Redémarrer Docker
sudo systemctl restart docker
```

## 📞 Support

Pour toute question ou problème :
- Vérifier les logs : `docker-compose logs`
- Consulter la documentation : `README.md`
- Créer une issue sur GitHub
