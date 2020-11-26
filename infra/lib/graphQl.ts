import { GraphqlApi, Schema, AuthorizationType, MappingTemplate, PrimaryKey, Values, AttributeValues } from '@aws-cdk/aws-appsync'
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb'
import { Construct } from '@aws-cdk/core'

export class GraphQl extends Construct {
    constructor(scope: Construct, id: string, props?: any) {
        super(scope, id)
        const api = this.createApi()
        const table = this.createTable()

        const motionTableDS = api.addDynamoDbDataSource('dynamoDataSource', table)
        const createIoTModelTypeRequestMT = MappingTemplate.fromFile('../backend/mapping-templates/createIoTModelType-reques-template.txt')
        const createIoTModelTypeResponseMT = MappingTemplate.fromFile('../backend/mapping-templates/createIoTModelType-response-template.txt')
        const getIoTModelTypeRequestMT = MappingTemplate.fromFile('../backend/mapping-templates/getIoTModelType-request-template.txt')
        const genericResponseMT = MappingTemplate.fromFile('../backend/mapping-templates/generic-response-template.txt')
        const listIoTModelTypesMT = MappingTemplate.fromFile('../backend/mapping-templates/listIoTModelTypes-request-template.txt')
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
