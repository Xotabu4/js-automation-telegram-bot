// avoiding exposing token to world
process.env.TELEGRAM_TOKEN = "";
console.log(`${3}: ${process.argv[3]}`);
eval(process.argv[3]);
