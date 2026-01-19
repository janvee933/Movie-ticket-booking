import 'dotenv/config';
console.log('Current Directory:', process.cwd());
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');
