#!/usr/bin/env node
import 'source-map-support/register';
import {App} from 'aws-cdk-lib';

import {ConfigurationExamplesHostingStack} from '../stacks/configuration-examples-hosting-stack';
import configuration from "../cfg/configuration";

const app = new App();
new ConfigurationExamplesHostingStack(app, `${configuration.COMMON.project}-stack`, {
    env: {
        account: configuration.COMMON.account,
        region: configuration.COMMON.region
    }
});
