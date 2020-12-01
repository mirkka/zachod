import { Construct, Duration } from '@aws-cdk/core'
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda'
import { ManagedPolicy } from '@aws-cdk/aws-iam'
import { CfnPolicyPrincipalAttachment, CfnPolicy, CfnThing, CfnThingPrincipalAttachment } from '@aws-cdk/aws-iot'

export interface IoTProps {
    appsyncUrl: string
}

export class IoT extends Construct {
    constructor(scope: Construct, id: string, props: IoTProps) {
        super(scope, id)

        const { appsyncUrl } = props

        const policyDocument = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "iot:*"
                    ],
                    "Resource": [
                        "*"
                    ]
                }
            ]
        }

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

        const thing = new CfnThing(this, "Thing", {
            thingName: 'pir'
        })

        const policy = new CfnPolicy(this, "ThingPolicy", {
            policyDocument: policyDocument
        })

        new CfnThingPrincipalAttachment(this, "ThingCertificateAttachment", {
            principal: "arn:aws:iot:eu-west-1:495127000729:cert/231b26ef689baa7bdd1ac536bef6db30afce903d602a3a5a018b2d1f9d3abc31",
            thingName: 'pir'
        })

        new CfnPolicyPrincipalAttachment(this, "ThingPolicyAttachment", {
            principal: "arn:aws:iot:eu-west-1:495127000729:cert/231b26ef689baa7bdd1ac536bef6db30afce903d602a3a5a018b2d1f9d3abc31",
            policyName: policy.ref
        })
    }
}
