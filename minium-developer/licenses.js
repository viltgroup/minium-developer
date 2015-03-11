var license = require('bower-license');
console.log("Foo");
license.init('.', function(licenseMap){
    console.log(licenseMap);
});
