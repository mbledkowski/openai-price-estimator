import { encode } from "gpt-3-encoder";
import readline from "readline";
import yargs from "yargs";


const pricing = {
  base: {
    ada: 0.0004,
    babbage: 0.0005,
    curie: 0.0020,
    davinci: 0.0200
  },
  fineTuning: {
    ada: 0.0004,
    babbage: 0.0006,
    curie: 0.0030,
    davinci: 0.0300
  },
  fineTunningUsage: {
    ada: 0.0016,
    babbage: 0.0024,
    curie: 0.0120,
    davinci: 0.1200
  },
  embedding: {
    1: {
      ada: 0.0040,
      babbage: 0.0050,
      curie: 0.0200,
      davinci: 0.2000
    },
    2: {
      ada: 0.0004,
    }
  }
}

interface arguments {
  tokens: boolean;
  pricing: "ada" | "babbage" | "curie" | "davinci";
  fineTunning: boolean;
  usage: boolean;
  epochs: number;
  embedding: 0 | 1 | 2;
};

function main() {
  const argv: arguments = yargs(process.argv.slice(2))
    .options({
      t: {
        alias: "tokens",
        describe: "Get number of tokens",
        type: "boolean",
        default: false,
      },
      p: {
        alias: "pricing",
        describe: "Get pricing for davinci, curie, babbage and ada models in USD (default: davinci)",
        type: "string",
        default: "davinci",
      },
      f: {
        alias: "fine-tunning",
        describe: "Get fine-tunning training cost, define model with -p flag, define epochs with -e flag",
        type: "boolean",
        default: false,
      },
      u: {
        alias: "usage",
        describe: "Get fine-tuned model usage cost, define model with -p flag",
        type: "boolean",
        default: false,
      },
      e: {
        alias: "epochs",
        describe: "Set number of epochs",
        type: "number",
        default: 4,
      },
      s: {
        alias: "embedding",
        describe: "Get embedding usage price, define version with this flag (e.g. -s=2), define model with -p flag",
        type: "number",
        default: 0,
      }
    })
    .parseSync() as any;

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
    try {
      if (argv.tokens) {
        console.log(tokenCount);
        process.exit(0);
      } else if (argv.fineTunning) {
        const cost = (tokenCount * pricing.fineTuning[argv.pricing] * argv.epochs) / 1000;
        console.log(cost);
        process.exit(0);
      } else if (argv.usage) {
        const cost = (tokenCount * pricing.fineTunningUsage[argv.pricing]) / 1000;
        console.log(cost);
        process.exit(0);
      } else if (argv.embedding) {
        if (argv.embedding === 1) {
          const cost = (tokenCount * pricing.embedding[argv.embedding][argv.pricing]) / 1000;
          console.log(cost);
        } else if (argv.embedding === 2 && argv.pricing === "ada") {
          const cost = (tokenCount * pricing.embedding[argv.embedding][argv.pricing]) / 1000;
          console.log(cost);
        } else {
          throw new Error("Invalid model");
        }
      } else {
        const cost = (tokenCount * pricing.base[argv.pricing]) / 1000;
        console.log(cost);
      }
      process.exit(0);
    } catch {
      console.log("Incorrect parameters");
      process.exit(1);
    }
  });
}

if (require.main === module) {
  main();
}
