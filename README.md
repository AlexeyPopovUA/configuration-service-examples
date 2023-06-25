# configuration-service-examples

## Description

This project provides a configuration service examples infrastructure

## Installation

To install the project dependencies, run the following command:

```
npm ci
```

## Scripts

- `clean`: Removes the `cdk.out` directory.
- `cdk-synth-stacks`: Synthesizes the AWS CloudFormation stacks using the AWS CDK.
- `cdk-diff-stacks`: Shows the differences between the local AWS CloudFormation stacks and the deployed stacks.
- `deploy`: Deploys the AWS CDK stacks for the configuration service.
- `type-check`: Runs TypeScript type checking.
- `update-dependencies`: Updates the project dependencies using npm-check-updates.

To execute a script, run the following command:

```
npm run <script-name>
```

## License

This project is licensed under the [MIT License](LICENSE).
