import { Bucket } from '@aws-cdk/aws-s3'
import { CloudFrontWebDistribution, OriginAccessIdentity } from '@aws-cdk/aws-cloudfront'
import { ARecord, HostedZone } from '@aws-cdk/aws-route53'
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets'
import { Construct, RemovalPolicy } from '@aws-cdk/core'
import { CanonicalUserPrincipal, PolicyStatement } from '@aws-cdk/aws-iam'

export interface FrontendProps {
    serviceName: string
    certArn: string
    hzId: string
}

export class Frontend extends Construct {
    constructor(scope: Construct, id: string, props: FrontendProps) {
        super(scope, id)

        const { serviceName, certArn, hzId} = props

        const identity = new OriginAccessIdentity(this, 'identity')

        const bucket = new Bucket(this, 'bucket', {
            bucketName: serviceName,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            publicReadAccess: false,
            removalPolicy: RemovalPolicy.DESTROY,
        })

        const bucketPolicy = new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [bucket.arnForObjects('*')],
            principals: [new CanonicalUserPrincipal(identity.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        })

        bucket.addToResourcePolicy(bucketPolicy)

        const distribution = new CloudFrontWebDistribution(this, 'cloudfront', {
            aliasConfiguration: {
                names: [`${serviceName}.cicushik.com`],
                acmCertRef: certArn
            },
            originConfigs: [{
                behaviors: [
                    {
                        isDefaultBehavior: true,
                        pathPattern: '*'
                    }
                ],
                s3OriginSource: {
                    s3BucketSource: bucket,
                    originAccessIdentity: identity
                }
            }]
        })

        const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'zone', { hostedZoneId: hzId, zoneName: `${serviceName}.cicushik.com` })

        new ARecord(this, 'record', {
            zone: hostedZone,
            target: {
                aliasTarget: new CloudFrontTarget(distribution)
            }
        })
    }
}
