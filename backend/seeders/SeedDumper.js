import { MongoClient } from 'mongodb';
import { spawn } from 'child_process';
import fs from 'fs';

const DB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'fairydiary_api_test_db';
const OUTPUT_DIR = 'output-directory';
const client = new MongoClient(DB_URI);

async function run() {
  try {
    await client.connect();

    const db = client.db(DB_NAME);
    const collections = await db.collections();

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    collections.forEach(async (c) => {
      const name = c.collectionName;
      await spawn('mongoexport', [
        '--db',
        DB_NAME,
        '--collection',
        name,
        '--jsonArray',
        '--pretty',
        `--out=./${OUTPUT_DIR}/${name}.json`,
      ]);
    });
  } finally {
//    await client.close();
    console.log(`DB Data for ${DB_NAME} has been written to ./${OUTPUT_DIR}/`);
  }
}

const seedData = () =>{
 return run().catch(console.dir);  
}


export default seedData;