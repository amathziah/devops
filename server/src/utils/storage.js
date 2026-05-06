const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const BUCKET = process.env.S3_BUCKET;
const KEY = 'data.json';
const EMPTY = { users: [], items: [] };

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });

const readData = async () => {
  if (!BUCKET) return { ...EMPTY };
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
  if (!BUCKET) return false;
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: KEY,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json',
  }));
  return true;
};

module.exports = { readData, writeData };
