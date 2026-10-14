require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand, 
  ListObjectsV2Command 
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Servir la interfaz web estática desde la carpeta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET = process.env.S3_BUCKET || 'lab-09-carrasco-20261014';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

// 1) Generar Presigned URL para subir archivos (PUT)
app.post('/api/upload-url', async (req, res) => {
  try {
    const { filename, contentType, sizeBytes } = req.body;

    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(400).json({ error: 'Tipo de archivo no permitido. Solo JPG, PNG o WEBP.' });
    }
    if (sizeBytes > MAX_SIZE_MB * 1024 * 1024) {
      return res.status(400).json({ error: 'El archivo excede el límite de 5MB.' });
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `originales/${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeName}`;

    // Sin firma rígida de headers extras para evitar rechazos por firmas no coincidentes
    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: 300 });
    res.json({ uploadUrl: url, key });
  } catch (err) {
    console.error('Error generando Presigned URL:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2) Listar imágenes con Presigned URLs de lectura (GET)
app.get('/api/images', async (req, res) => {
  try {
    const list = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'originales/'
    }));

    const items = await Promise.all(
      (list.Contents || [])
        .filter(obj => obj.Size > 0)
        .map(async obj => {
          const url = await getSignedUrl(
            s3,
            new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }),
            { expiresIn: 900 }
          );
          return {
            key: obj.Key,
            size: obj.Size,
            lastModified: obj.LastModified,
            url
          };
        })
    );

    res.json(items);
  } catch (err) {
    console.error('Error al listar objetos:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3) Eliminar objeto de S3 (DELETE)
app.delete('/api/images/:key(*)', async (req, res) => {
  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: req.params.key
    }));
    res.json({ deleted: true });
  } catch (err) {
    console.error('Error al eliminar objeto:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});