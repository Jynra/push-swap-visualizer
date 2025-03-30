FROM python:3-alpine

# Créer un répertoire pour l'application
WORKDIR /push_swap_visualizer

# Copier tous les fichiers de l'application
COPY index.html .
COPY css/ ./css/
COPY js/ ./js/

# Exposer le port 9428
EXPOSE 9428

# Lancer un serveur HTTP simple
CMD ["python", "-m", "http.server", "9428"]