import 'dotenv/config';
console.log('Current Directory:', process.cwd());
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');
if (process.env.MONGO_URI) {
    console.log('MONGO_URI Length:', process.env.MONGO_URI.length);
}
// Do not print the actual value for security
