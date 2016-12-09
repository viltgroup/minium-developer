# Third-Party Dependencies and Licenses

Here you can see all third party libraries used by Minium and their licenses.

## Maven Dependencies

Group ID           | Artifact ID           | Version            | Name                              | License
------------------ | --------------------- | ------------------ | --------------------------------- | -------------------
<#list artifactLicenses as license>
${license.groupId} | ${license.artifactId} | ${license.version} | [${license.name}](${license.url}) | ${license.licenses}
</#list>

## Bower Dependencies

Library Name                           | Version            | License
-------------------------------------- | ------------------ | -------------------
<#list bowerLicenses as license>
[${license.name}](${license.homepage}) | ${license.version} | ${license.licenses}
</#list>