import { IUserPool, UserPool, UserPoolClient } from '@aws-cdk/aws-cognito';
import { Construct } from '@aws-cdk/core'

export class Cognito extends Construct {
    public userPool: IUserPool
    constructor(scope: Construct, id: string, props?: any) {
        super(scope, id)

        const userPool = new UserPool(this, "UserPool", {
            selfSignUpEnabled: false,
            passwordPolicy: {
                minLength: 6,
                requireLowercase: false,
                requireDigits: false,
                requireUppercase: false,
                requireSymbols: false
            }
        })

        const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
            userPool,
            generateSecret: false
        })

        this.userPool = userPool
    }
}
