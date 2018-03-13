import fs from 'fs';
import dotenv from 'dotenv';

let envConfig = {};

if (fs.existsSync('.env')) {
  envConfig = dotenv.parse(fs.readFileSync('.env'));
}

export default envConfig;
