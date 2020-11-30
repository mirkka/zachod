import { GraphqlApi, Schema, AuthorizationType, MappingTemplate } from '@aws-cdk/aws-appsync'
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb'
import { Construct, Duration } from '@aws-cdk/core'
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda'
import { StringParameter } from '@aws-cdk/aws-ssm'

export class GraphQl extends Construct {
    public endpoint: string

    constructor(scope: Construct, id: string, props?: any) {
        super(scope, id)
        const parameter = new StringParameter(this, 'Parameter', {
            parameterName: 'IOT_IGNORE_EVENTS',
            description: '-',
            stringValue: 'false'
        })
        const api = this.createApi()
        const table = this.createTable()
        const deleteEventLambda = this.createLambda('deleteEventLambda', table)
        const listTimestampsLambda = this.createLambda('listTimestamps', table)
        const ignoreEventsLambda = this.createLambda('toggleIgnoreEventsLambda')
        const getIgnoreEventsLambda = this.createLambda('getIgnoreEventsLambda')

        // Data sources
        const deleteEventDS = api.addLambdaDataSource('deleteEvent', deleteEventLambda)
        const listTimestampsDS = api.addLambdaDataSource('listTimestamps', listTimestampsLambda)
        const motionTableDS = api.addDynamoDbDataSource('dynamoDataSource', table)
        const ignoreEventsDS = api.addLambdaDataSource('ignoreEvent', ignoreEventsLambda)
        const getIgnoreEventsDS = api.addLambdaDataSource('getIgnoreEvents', getIgnoreEventsLambda)

        // grant dynamo access to lambda data sources
        new Array(deleteEventLambda, listTimestampsLambda).forEach(lambda => {
            table.grantReadWriteData(lambda)
        })

        parameter.grantWrite(ignoreEventsLambda)
        parameter.grantRead(getIgnoreEventsLambda)

        // Mapping tempaltes
        const createIoTModelTypeRequestMT = MappingTemplate.fromFile('../backend/mapping-templates/createIoTModelType-reques-template.txt')
        const createIoTModelTypeResponseMT = MappingTemplate.fromFile('../backend/mapping-templates/createIoTModelType-response-template.txt')
        const getIoTModelTypeRequestMT = MappingTemplate.fromFile('../backend/mapping-templates/getIoTModelType-request-template.txt')
        const genericResponseMT = MappingTemplate.fromFile('../backend/mapping-templates/generic-response-template.txt')
        const listIoTModelTypesMT = MappingTemplate.fromFile('../backend/mapping-templates/listIoTModelTypes-request-template.txt')
        const genericLambdaInvokeMT = MappingTemplate.fromFile('../backend/mapping-templates/lambda-request-template.txt')

        //Resolvers
        motionTableDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'createIoTModelType',
            requestMappingTemplate: createIoTModelTypeRequestMT,
            responseMappingTemplate: createIoTModelTypeResponseMT
        })

        motionTableDS.createResolver({
            typeName: 'Query',
            fieldName: 'getIoTModelType',
            requestMappingTemplate: getIoTModelTypeRequestMT,
            responseMappingTemplate: genericResponseMT
        })

        motionTableDS.createResolver({
            typeName: 'Query',
            fieldName: 'listIoTModelTypes',
            requestMappingTemplate: listIoTModelTypesMT,
            responseMappingTemplate: genericResponseMT
        })

        getIgnoreEventsDS.createResolver({
            typeName: 'Query',
            fieldName: 'getIgnoreEvents',
            requestMappingTemplate: genericLambdaInvokeMT,
            responseMappingTemplate: genericResponseMT
        })

        listTimestampsDS.createResolver({
            typeName: 'Query',
            fieldName: 'getTimestamps',
            requestMappingTemplate: genericLambdaInvokeMT,
            responseMappingTemplate: genericResponseMT
        })

        deleteEventDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'deleteEvent',
            requestMappingTemplate: genericLambdaInvokeMT
        })

        ignoreEventsDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'ignoreEvents',
            requestMappingTemplate: genericLambdaInvokeMT,
            responseMappingTemplate: genericResponseMT
        })

        this.endpoint = api.graphqlUrl
    }

    createLambda(filename: string, table?: Table) {
        const environment: any = {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        }
        if(table) {
            environment.TABLE_NAME = table.tableName
        }
        const lambda = new Function(this, filename, {
            code: Code.fromAsset('../backend/resolvers'),
            handler: `${filename}.handler`,
            runtime: Runtime.NODEJS_12_X,
            timeout: Duration.seconds(30),
            memorySize: 128,
            environment
        })
        return lambda
    }

    createApi() {
        return new GraphqlApi(this, 'Api', {
            name: 'ZachodApp',
            schema: Schema.fromAsset('../backend/schema.graphql'),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AuthorizationType.IAM
                },
            }
        })
    }

    createTable() {
        return new Table(this, 'ZachodMotionTable', {
            partitionKey: {
                name: 'date',
                type: AttributeType.STRING,
            },
            sortKey: {
                name: 'timestamp',
                type: AttributeType.NUMBER
            }
        })
    }
}
