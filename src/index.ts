import { encode } from "gpt-3-encoder";
import readline from "readline";

function main() {
  let input = "";
  // read stdin
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  rl.on('line', (line) => {
    input += line;
  });
  rl.once('close', () => {
    // encode input
    const encoded = encode(input);
    const tokenCount = encoded.length;
    console.log(tokenCount);
  });
}

if (require.main === module) {
  main();
}
