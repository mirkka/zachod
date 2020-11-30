import { Construct, Duration } from '@aws-cdk/core'
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda'
import { ManagedPolicy } from '@aws-cdk/aws-iam'

export interface IoTProps {
    appsyncUrl: string
}

export class IoT extends Construct {
    constructor(scope: Construct, id: string, props: IoTProps) {
        super(scope, id)

        const { appsyncUrl } = props

        const environment: any = {
            APPSYNC_ENDPOINT_URL: appsyncUrl
        }

        const lambda = new Function(this, 'iotPIR', {
            code: Code.fromAsset('../backend/lambda'),
            handler: 'index.handler',
            runtime: Runtime.NODEJS_12_X,
            timeout: Duration.seconds(30),
            memorySize: 128,
            environment
        })

        lambda.role?.addManagedPolicy(ManagedPolicy.fromManagedPolicyArn(this, 'ssmManagedPolicy', 'arn:aws:iam::aws:policy/AmazonSSMFullAccess'))
    }
}
