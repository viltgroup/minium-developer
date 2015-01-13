After(function (scenario) {
  
  if (scenario.isFailed()) {
    var io = Packages.java.io;
    var data = new io.ByteArrayOutputStream();
    takeWindowScreenshot($(wd), data);
    scenario.embed(data.toByteArray(), "image/png");     
  }
  
});