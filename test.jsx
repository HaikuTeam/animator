#target illustrator

var dest = '/Users/roperzh/Projects/Haiku/mono/illustrator-export/'

if ( app.documents.length > 0 ) {
  var exportOptions = new ExportOptionsSVG();
  var type = ExportType.SVG;
  var fileSpec = new File(dest);
  exportOptions.embedRasterImages = true;
  exportOptions.embedAllFonts = false;
  exportOptions.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
  exportOptions.fontSubsetting = SVGFontSubsetting.None;
  exportOptions.documentEncoding = SVGDocumentEncoding.UTF8;
  saveMultipleArtboards = true;
  app.activeDocument.exportFile( fileSpec, type, exportOptions );
}
