After(function (scenario) {
  var TakesScreenshot = Packages.org.openqa.selenium.TakesScreenshot;
  var OutputType      = Packages.org.openqa.selenium.OutputType;
  
  if (scenario.isFailed()) {
    if (wd instanceof org.openqa.selenium.TakesScreenshot) {
      scenario.embed(wd.getScreenshotAs(OutputType.BYTES), "image/png");     
    }
  }
});