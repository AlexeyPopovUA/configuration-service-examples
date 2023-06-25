import {name} from "../package.json";

export default {
    COMMON: {
        project: name,
        region: process.env?.AWS_DEPLOYMENT_REGION || "",
        account: process.env?.AWS_ACCOUNT || ""
    },
    HOSTING: {
        hostedZoneID: process.env?.HOSTED_ZONE_ID || "",
        hostedZoneName: "oleksiipopov.com",
        domainName: "config-demo.examples.oleksiipopov.com",
        demoNames: [
            "main.dev.config-demo.examples.oleksiipopov.com",
            "feature-123.dev.config-demo.examples.oleksiipopov.com",
            "special.dev.config-demo.examples.oleksiipopov.com",
            "prod.config-demo.examples.oleksiipopov.com",
            "acc.config-demo.examples.oleksiipopov.com"
        ]
    }
};
