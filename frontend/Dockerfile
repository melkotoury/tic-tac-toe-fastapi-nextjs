FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./ 
RUN npm install

COPY . .

# Install prettier and format
RUN npm install -g prettier
RUN prettier --write .

RUN npm run build

CMD ["npm", "start"]
