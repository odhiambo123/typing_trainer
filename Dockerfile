FROM nginx:alpine
# Copy all project files into the Nginx web directory
COPY . /usr/share/nginx/html
# Standard port for web traffic
EXPOSE 80