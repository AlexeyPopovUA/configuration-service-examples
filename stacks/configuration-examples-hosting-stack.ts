import {Construct} from 'constructs';
import {Duration, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {
    AllowedMethods,
    CacheCookieBehavior,
    CachedMethods,
    CachePolicy,
    Distribution,
    HttpVersion,
    SecurityPolicyProtocol,
    ViewerProtocolPolicy,
    PriceClass, OriginAccessIdentity
} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import {AaaaRecord, ARecord, HostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {CloudFrontTarget} from "aws-cdk-lib/aws-route53-targets";

import configuration from "../cfg/configuration";
import {BlockPublicAccess, Bucket} from "aws-cdk-lib/aws-s3";

export class ConfigurationExamplesHostingStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const region = props.env?.region;
        const project =  configuration.COMMON.project;

        const s3Bucket = new Bucket(this, `${project}-origin-bucket`, {
            bucketName: `${project}-hosting`,
            removalPolicy: RemovalPolicy.RETAIN,
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL
        });

        const originAccessIdentity = new OriginAccessIdentity(this, `${project}-origin-access-identity`, {
            comment: "Maps SDK JS examples access identity"
        });

        s3Bucket.grantRead(originAccessIdentity);

        const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${project}-hosted-zone`, {
            hostedZoneId: configuration.HOSTING.hostedZoneID,
            zoneName: configuration.HOSTING.hostedZoneName
        });

        const certificate = new Certificate(this, `${project}-cert`, {
            domainName: configuration.HOSTING.domainName,
            subjectAlternativeNames: [
                `*.${configuration.HOSTING.domainName}`,
                `*.dev.${configuration.HOSTING.domainName}`
            ],
            validation: CertificateValidation.fromDns(hostedZone)
        });

        const cachePolicy = new CachePolicy(this, `${project}-cache-policy`, {
            cachePolicyName: `${project}-cache-policy`,
            cookieBehavior: CacheCookieBehavior.none(),
            enableAcceptEncodingBrotli: true,
            enableAcceptEncodingGzip: true,
            minTtl: Duration.seconds(1),
            maxTtl: Duration.days(365),
            defaultTtl: Duration.hours(24)
        });

        const distribution = new Distribution(this, `${project}-api-distribution`, {
            comment: `${project} configuration distribution`,
            httpVersion: HttpVersion.HTTP2,
            priceClass: PriceClass.PRICE_CLASS_100,
            certificate: certificate,
            enableIpv6: true,
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
            enableLogging: true,
            enabled: true,
            domainNames: [
                configuration.HOSTING.domainName,
                `*.${configuration.HOSTING.domainName}`,
                `*.dev.${configuration.HOSTING.domainName}`,
            ],
            defaultBehavior: {
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachePolicy: cachePolicy,
                cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
                compress: true,
                viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
                origin: new S3Origin(s3Bucket, {
                    originAccessIdentity: originAccessIdentity,
                    originShieldRegion: region
                }),
            }
        });

        new ARecord(this, `${project}-record-a`, {
            recordName: configuration.HOSTING.domainName,
            zone: hostedZone,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
        });

        new AaaaRecord(this, `${project}-record-4a`, {
            recordName: configuration.HOSTING.domainName,
            zone: hostedZone,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
        });
    }
}
