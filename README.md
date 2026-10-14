# ☁️ AWS S3 Cloud Studio - Presigned URLs & Secure Asset Management

Aplicación web enterprise desarrollada para la gestión segura de objetos en Amazon S3 mediante el uso de **Presigned URLs**, implementando el SDK v3 de AWS, Node.js con Express y una interfaz interactiva con telemetría en tiempo real.

---

## 📹 Demostración en Video del Proyecto

https://github.com/eder3105/lab-s3-app/raw/main/frontend/VIDEO.mp4

---

## ⚙️ Arquitectura de Seguridad & Características

- **Bucket Privado S3:** La configuración deshabilita el acceso público directo. Todos los objetos están protegidos mediante firmas criptográficas de AWS IAM.
- **Subida Directa (PUT Presigned URLs):** El cliente transfiere archivos binarios directamente hacia `s3.amazonaws.com` sin recargar el servidor backend.
- **Lectura Temporal (GET Presigned URLs):** Las imágenes se previsualizan con URLs firmadas de duración limitada (15 minutos).
- **Validación Estricta:** Control de formatos permitidos (`image/jpeg`, `image/png`, `image/webp`) y restricciones de tamaño máximo (5 MB).
- **CORS Configurado:** Reglas CORS explícitas que autorizan los métodos `GET`, `PUT`, `POST` y `DELETE`.

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js, Express.js, AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`), dotenv, cors.
- **Frontend:** HTML5, CSS3 Glassmorphism, JavaScript ES6+, HTML5 Canvas API (Particle Network).
- **AWS Services:** Amazon S3, AWS IAM.

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/eder3105/lab-s3-app.git
   cd lab-s3-app/backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (`.env`):**
   Crea un archivo `.env` dentro de la carpeta `backend/` con tus credenciales de AWS:
   ```env
   PORT=3000
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=TU_ACCESS_KEY
   AWS_SECRET_ACCESS_KEY=TU_SECRET_KEY
   S3_BUCKET_NAME=lab-09-carrasco-20261014
   ```

4. **Iniciar el servidor:**
   ```bash
   node server.js
   ```

5. **Abrir en el navegador:**
   Accede a `http://localhost:3000`.