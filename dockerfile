# Use a lightweight Python image
FROM python:3.11-slim

# Set the working directory for your app
WORKDIR /app

# Install necessary tools: Git, curl, and software-properties-common
RUN apt-get update && apt-get install -y \
    git \
    curl \
    lsb-release \
    ca-certificates \
    libnss3 \
    libasound2 \
    libxss1 \
    libxtst6 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    build-essential

# Install Node.js 22.x (or any version >= 22.14.0) and npm
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Clone the MagicMirror repository into /app/MagicMirror
RUN git clone https://github.com/MichMich/MagicMirror.git /app/MagicMirror

# Set the working directory to MagicMirror folder
WORKDIR /app/MagicMirror

# Install MagicMirror dependencies
RUN npm install --only=production

RUN sed -i 's#electron js/electron.js#electron --no-sandbox js/electron.js#' package.json

RUN pip install --upgrade pip
RUN pip install wheel
RUN npm install node-fetch

# Install additional Python dependencies for your project
RUN pip install paho-mqtt
RUN apt install -y libgl1  
RUN apt install -y libglib2.0-0

# Copy your custom modules (make sure to change the paths if needed)
COPY ./MMM-FaceDetect-MQTT /app/MagicMirror/modules/MMM-FaceDetect-MQTT
COPY ./MMM-JamesScores /app/MagicMirror/modules/MMM-JamesScores


# Install Node MQTT module for custom module
RUN cd /app/MagicMirror/modules/MMM-FaceDetect-MQTT && npm install mqtt

# Copy your config file (assuming your config file is called config.js)
COPY ./config.js /app/MagicMirror/config/config.js

# Expose the port MagicMirror will run on
EXPOSE 8080

# Command to start MagicMirror
CMD ["node", "serveronly"]


