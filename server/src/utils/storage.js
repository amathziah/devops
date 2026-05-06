const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const BUCKET = process.env.S3_BUCKET;
const KEY = 'data.json';
const EMPTY = { users: [], items: [] };
const LOCAL_FILE = path.join(__dirname, '../../data.json');

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });

const readData = async () => {
  if (!BUCKET) {
    try {
      if (!fs.existsSync(LOCAL_FILE)) return { ...EMPTY };
      return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8'));
    } catch {
      return { ...EMPTY };
    }
  }
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: KEY }));
    const body = await streamToString(res.Body);
    return JSON.parse(body);
  } catch (err) {
    if (err.name === 'NoSuchKey') return { ...EMPTY };
    throw err;
  }
};

const writeData = async (data) => {
  if (!BUCKET) {
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2));
    return true;
  }
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: KEY,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json',
  }));
  return true;
};

module.exports = { readData, writeData };
