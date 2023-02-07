# OpenAI-Price-Estimator

This repository contains code to calculate the cost of using OpenAI's GPT-3. The costs are based on the pricing information provided in the pricing object. The costs can be calculated based on the number of tokens, fine-tuning, fine-tuning usage, and embedding.

## Usage

To run the calculator, you can pass the following command-line arguments:

```
-t, --tokens        Get number of tokens
-p, --pricing       Get pricing for davinci, curie, babbage and ada models in USD (default: davinci)
-f, --fine-tunning  Get fine-tunning training cost, define model with -p flag, define epochs with -e flag
-u, --usage         Get fine-tuned model usage cost, define model with -p flag
-e, --epochs        Set number of epochs (default: 4)
-s, --embedding     Get embedding usage price, define version with this flag (e.g. -s=2), define model with -p flag
```

For example, to calculate the cost of using the "davinci" model for fine-tuning with 4 epochs, you would run:

```
openai-price-estimator --fine-tunning --pricing "davinci" --epochs 4 < input.txt
```

The input text should be piped into the program via standard input. The cost will be outputted to standard output.

## Error handling

If the input parameters are incorrect, an error message "Incorrect parameters" will be displayed and the program will exit with a status code of 1.
