#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StoreBackendStack } from '../lib/store-backend-stack';

const app = new cdk.App();
new StoreBackendStack(app, 'StoreBackendStack', {
    env: {
        region: 'us-east-1'
    }
});
