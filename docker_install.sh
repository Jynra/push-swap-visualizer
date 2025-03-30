# Delete old container
# docker rm push-swap-viz

# Delete old image
# docker rmi push-swap-visualizer

# Construire l'image
docker build -t push-swap-visualizer .

# Exécuter le conteneur
docker run -d -p 9428:9428 -v ./:/push_swap_visualizer --name push-swap-viz push-swap-visualizer