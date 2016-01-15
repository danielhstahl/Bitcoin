(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['links'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <li id='"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "' role=\"presentation\" class=\"\"><a  href=\"#/"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" >"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"navmenu navmenu-default navmenu-fixed-left offcanvas-xs\">\n    <!--<a class=\"navmenu-brand visible-md visible-lg\" href=\"#\">Project name</a>-->\n\n    <ul class=\"nav nav-pills nav-stacked\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.link : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</div>\n\n<div class=\"container\">\n    <div class=\"navbar navbar-default visible-xs\">\n        <div class=\"navbar-toggle pull-left\" data-toggle=\"offcanvas\" data-target=\".navmenu\">\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n        </div>\n    </div> \n    <div id='landscape' class='col-xs-12'>\n\n    </div>\n\n\n\n</div>";
},"useData":true});
templates['market'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id='marketTSChart'></div>";
},"useData":true});
templates['portfolio'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});
templates['progressbar'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"progress\">\n  <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" id='progressBar' aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "
    + container.escapeExpression(((helper = (helper = helpers.percent || (depth0 != null ? depth0.percent : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"percent","hash":{},"data":data}) : helper)))
    + "%\">\n    <!--<span class=\"sr-only\">45% Complete</span>-->\n  </div>\n</div>";
},"useData":true});
templates['settings'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});
})();