FROM python:3-alpine

# Créer un répertoire pour l'application
WORKDIR /push_swap_visualizer

# Copier le fichier HTML
COPY index.html .

# Exposer le port 9428
EXPOSE 9428

# Lancer un serveur HTTP simple
CMD ["python", "-m", "http.server", "9428"]