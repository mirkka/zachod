import { App, Stack, StackProps } from '@aws-cdk/core'
import { Frontend } from './frontend'
import { GraphQl } from './graphQl'


export class InfraStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    new Frontend(this, 'frontend', {
      serviceName: 'zachod',
      certArn: 'arn:aws:acm:us-east-1:495127000729:certificate/41cd25c5-f0cc-4c77-a70c-7ce0fff9d739',
      hzId: 'Z2TJSCNWDHQYQ7'
    })

    new GraphQl(this, 'graphql')
  }
}
