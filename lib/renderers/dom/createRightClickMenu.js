"use strict";
exports.__esModule = true;
var MENU_GLOBAL_ID = "haiku-right-click-menu";
var WIDTH = 167;
var HEIGHT = 44;
var haikuIcon = "" +
    '<svg style="transform:translateY(3px);margin-right:3px;" width="13px" height="13px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
    '    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
    '        <g id="menu" transform="translate(-9.000000, -50.000000)" fill-rule="nonzero" fill="#899497">' +
    '            <g id="favicon" transform="translate(9.000000, 50.000000)">' +
    '                <path d="M5.74649098,4.70558699 L5.74649098,5.7788098 C5.74649098,5.91256161 5.63820821,6.02098888 5.50463465,6.02098888 C5.46594093,6.02098888 5.42936949,6.0118902 5.39693775,5.99571295 C5.39186133,5.99396865 5.38680829,5.99204493 5.38178599,5.98993877 L2.13374851,4.62783436 C2.06585827,4.62681598 2.00074372,4.59703732 1.95556434,4.54557114 C1.89645814,4.50141795 1.85818531,4.43085101 1.85818531,4.35133305 L1.85818531,1.57454768 C1.85079926,1.56515108 1.8440022,1.55516354 1.83787126,1.54461783 L1.68370002,1.48221012 L0.983781643,1.19888682 L0.983781643,7.82711613 L1.85818531,8.18107016 L1.85818531,5.95344076 C1.85818531,5.94997543 1.858258,5.94652709 1.85840193,5.9430972 C1.85672094,5.90820764 1.86258618,5.87240498 1.87695925,5.83803981 C1.92855792,5.7146704 2.07026431,5.65654454 2.19346932,5.70821207 L5.45803735,7.07733924 L5.52116709,7.10578612 C5.64702981,7.11429403 5.74649098,7.21922045 5.74649098,7.34740828 L5.74649098,7.82711613 L6.61247795,8.17766313 L6.62089465,8.18107016 L6.62089465,4.31849373 L5.74649098,4.70558699 Z M5.26277832,4.81941585 L3.49887951,4.07970322 L2.78717926,4.37673832 L5.26277832,5.41491119 L5.26277832,4.81941585 Z M2.34189798,6.29557771 L2.34189798,8.21792436 L3.21630165,7.86397033 L3.21630165,6.66226962 L2.34189798,6.29557771 Z M2.10489107,8.84091277 C2.10327842,8.84094453 2.10166189,8.84096049 2.10004164,8.84096049 C2.03531005,8.84096049 1.97651801,8.81549628 1.93311099,8.77402594 L1.68370002,8.67306569 L0.701593132,8.27551396 C0.587217854,8.25628853 0.500068976,8.15667879 0.500068976,8.03668718 L0.500068976,8.02395302 C0.499977217,8.01997372 0.499976799,8.01598483 0.500068976,8.01198924 L0.500068976,0.83309739 C0.499984517,0.829434725 0.499977444,0.825763881 0.500048734,0.822087163 C0.499977444,0.818410445 0.499984517,0.814739601 0.500068976,0.811076936 L0.500068976,0.808477267 C0.500068976,0.734695385 0.533019284,0.66861973 0.584988773,0.624200019 C0.607223642,0.603893466 0.633376716,0.587129584 0.662911804,0.575173935 L2.00126808,0.0334143141 C2.06884262,-0.00448997495 2.15253254,-0.011953956 2.22949057,0.0203769852 L3.48533098,0.547969766 C3.4886593,0.547833737 3.49200497,0.54776506 3.49536665,0.54776506 C3.62894021,0.54776506 3.73722298,0.656192325 3.73722298,0.789944134 L3.73722298,0.821385651 C3.73731302,0.82532856 3.73731342,0.829280598 3.73722298,0.833238872 L3.73722298,2.40767185 L5.26277832,1.79239207 L5.26277832,0.83309739 C5.26269386,0.829434725 5.26268678,0.825763881 5.26275807,0.822087163 C5.26268678,0.818410445 5.26269386,0.814739601 5.26277832,0.811076936 L5.26277832,0.789944134 C5.26277832,0.660231597 5.36461961,0.55433711 5.49260447,0.548059437 L6.76397742,0.0334143141 C6.83155196,-0.00448997495 6.91524188,-0.011953956 6.99219991,0.0203769852 L8.30051205,0.570013732 C8.41385044,0.590099999 8.49993232,0.689222468 8.49993232,0.808477267 L8.49993232,0.821385589 C8.50002236,0.825328562 8.50002276,0.829280602 8.49993232,0.833238878 L8.49993232,8.03668718 C8.49993232,8.12601922 8.45162927,8.20405443 8.37974945,8.24603352 C8.3570412,8.26726508 8.33012837,8.28475773 8.2996029,8.29711428 L6.99757749,8.82416735 C6.91291064,8.85844005 6.82080599,8.84496071 6.75103698,8.79637735 L6.41724228,8.661259 L5.42562114,8.25985596 C5.34756383,8.22825877 5.29312904,8.1630773 5.27221467,8.08767347 C5.26662904,8.06827265 5.26340051,8.04787145 5.26285962,8.02680084 C5.26269203,8.02187767 5.26266414,8.01693859 5.26277832,8.01198924 L5.26277832,7.52049562 L5.25953529,7.51903428 L5.26277832,7.51181809 L5.26277832,7.52048475 L3.70001431,6.86512047 L3.70001431,8.03470119 C3.70001431,8.04191065 3.69969971,8.04904653 3.6990835,8.05609582 C3.69873979,8.1589341 3.63726868,8.25619133 3.53617314,8.29711428 L2.23486815,8.82387573 C2.19216118,8.84116329 2.14756179,8.84630123 2.10489107,8.84091277 Z M7.10460732,8.21821598 L8.01621965,7.84920008 L8.01621965,1.21243815 L7.10460732,1.58145405 L7.10460732,2.39098426 C7.10460732,2.46741667 7.06924708,2.53557924 7.0140137,2.5799642 C6.98940081,2.61105066 6.95679973,2.63650623 6.91764171,2.65284921 L4.12647169,3.81777145 L5.37396115,4.34092148 L6.74176427,3.73540324 C6.86393122,3.68132067 7.00675126,3.73664611 7.06076176,3.85897608 C7.06205348,3.86190175 7.06328271,3.86483924 7.06445002,3.86778706 C7.08982637,3.90609857 7.10460732,3.95205809 7.10460732,4.00147448 L7.10460732,8.21821598 Z M6.62089465,1.57454768 C6.6135086,1.56515108 6.60671153,1.55516354 6.6005806,1.54461783 L6.44640936,1.48221012 L5.74649098,1.19888682 L5.74649098,1.76114471 L6.62089465,2.11509874 L6.62089465,1.57454768 Z M2.34189798,4.03783399 L3.25351031,3.65736362 L3.25351031,1.21243815 L2.34189798,1.58145405 L2.34189798,4.03783399 Z M3.73722298,2.92984272 L3.73722298,3.45548138 L6.10302085,2.46809239 L5.50003848,2.22400828 C5.49794123,2.22315933 5.49586104,2.22228613 5.49379809,2.22138914 L3.73722298,2.92984272 Z M6.20555471,0.822087163 L6.64164504,0.998614246 L6.89809383,1.10242338 L7.57200867,0.829626174 L6.89232837,0.544084781 L6.20555471,0.822087163 Z M1.44284537,0.822087163 L1.8789357,0.998614246 L2.13538449,1.10242338 L2.80929933,0.829626174 L2.12961903,0.544084781 L1.44284537,0.822087163 Z" id="Combined-Shape"></path>' +
    "            </g>" +
    "        </g>" +
    "    </g>" +
    "</svg>";
var sharePageIcon = "" +
    '<svg style="transform:translate(-1px, 3px);margin-right:3px;" width="14px" height="14px" viewBox="0 0 11 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
    '  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
    '      <g id="menu" transform="translate(-8.000000, -32.000000)">' +
    '          <g id="0884-focus" transform="translate(8.500000, 32.000000)">' +
    '              <rect id="Rectangle-3" fill="#899497" x="4.72222222" y="0" width="1" height="1.66666667" rx="0.5"></rect>' +
    '              <rect id="Rectangle-3-Copy" fill="#899497" x="4.72222222" y="8.33333333" width="1" height="1.66666667" rx="0.5"></rect>' +
    '              <g id="Group" transform="translate(5.000000, 5.555556) rotate(90.000000) translate(-5.000000, -5.555556) translate(3.888889, 0.555556)" fill="#899497">' +
    '                  <rect id="Rectangle-3-Copy-3" x="0.277777778" y="0" width="1" height="1.66666667" rx="0.5"></rect>' +
    '                  <rect id="Rectangle-3-Copy-2" x="0.277777778" y="8.33333333" width="1" height="1.66666667" rx="0.5"></rect>' +
    "              </g>" +
    '              <circle id="Oval" stroke="#899497" stroke-width="0.66" cx="5" cy="5" r="3.33333333"></circle>' +
    '              <circle id="Oval-2" fill="#899497" cx="5" cy="5" r="1.11111111"></circle>' +
    "          </g>" +
    "      </g>" +
    "  </g>" +
    "</svg>";
var SUBSTITUTION_STRING = "HAIKU" + "_" + "SHARE" + "_" + "UUID";
function setBoxShadow(el, color) {
    el.style["-webkit-box-shadow"] = "0 1px 4px 0 " + color;
    el.style["-moz-box-shadow"] = "0 1px 4px 0 " + color;
    el.style["box-shadow"] = "0 1px 4px 0 " + color;
}
function px(num) {
    return num + "px";
}
function findOrCreateMenuElement(doc) {
    var menu = doc.getElementById(MENU_GLOBAL_ID);
    if (menu)
        return menu;
    menu = doc.createElement("div");
    menu.setAttribute("id", MENU_GLOBAL_ID);
    menu.style.position = "absolute";
    menu.style.zIndex = 2147483647;
    setBoxShadow(menu, "rgba(10,2,21,0.25)");
    menu.style.borderRadius = px(3);
    menu.style.display = "none";
    menu.style.backgroundColor = "rgba(255,255,255,0.95)";
    menu.style.overflow = "hidden";
    menu.style.cursor = "default";
    menu.style.fontFamily = "Helvetica, Arial, sans-serif";
    menu.style.fontWeight = "Bold";
    menu.style.fontSize = px(10);
    menu.style.padding = "0 0 7px";
    menu.style.color = "black";
    menu.style.margin = "0";
    menu.style.boxSizing = "content-box";
    menu.style.textDecoration = "none";
    menu.style.fontStyle = "none";
    doc.body.appendChild(menu);
    return menu;
}
function truncate(str, len) {
    if (str.length > len) {
        return str.slice(0, len - 3) + "...";
    }
    return str;
}
function createRightClickMenu(domElement, component) {
    var doc = domElement.ownerDocument;
    var menu = findOrCreateMenuElement(doc);
    var escaper = doc.createElement("textarea");
    function escapeHTML(html) {
        escaper.textContent = html;
        return escaper.innerHTML.replace(/[><,{}[\]"']/gi, "");
    }
    function revealMenu(mx, my) {
        var height = HEIGHT;
        var lines = [];
        var titleLine = null;
        var metadata = component._bytecode && component._bytecode.metadata;
        if (metadata && metadata.project) {
            var who = truncate(escapeHTML(metadata.project), 25);
            var org = "";
            if (metadata.organization) {
                org = truncate(escapeHTML(metadata.organization), 11);
                who = '"' + who + '" <span style="font-weight:normal;">by</span> ' + org;
            }
            var byline = who;
            titleLine =
                '<p style="margin:0;margin-bottom:4px;padding:12px 0 7px;line-height:12px;text-align:center;border-bottom:1px solid rgba(140,140,140,.14);">' +
                    byline +
                    "</p>";
        }
        if (metadata && metadata.uuid && metadata.uuid !== SUBSTITUTION_STRING) {
            lines.push('<a onMouseOver="this.style.backgroundColor=\'rgba(140,140,140,.07)\'" onMouseOut="this.style.backgroundColor=\'transparent\'" style="display:block;color:black;text-decoration:none;padding: 5px 13px;line-height:12px;" href="https://share.haiku.ai/' +
                escapeHTML(metadata.uuid) +
                '" target="_blank">' +
                sharePageIcon +
                "  View Component</a>");
        }
        lines.push('<a onMouseOver="this.style.backgroundColor=\'rgba(140,140,140,.07)\'" onMouseOut="this.style.backgroundColor=\'transparent\'" style="display:block;color:black;text-decoration:none;padding: 5px 13px;line-height:12px;" href="https://www.haiku.ai" target="_blank">' +
            haikuIcon +
            "  Crafted in Haiku</a>");
        if (lines.length < 1)
            return undefined;
        height = lines.length > 1 ? 88 : 61;
        height = titleLine ? height : 22;
        menu.style.width = px(WIDTH);
        menu.style.height = px(height);
        menu.style.top = px(my);
        menu.style.left = px(mx);
        menu.style.pointerEvents = "auto";
        menu.style.display = "block";
        menu.innerHTML = titleLine ? titleLine + lines.join("\n") : lines.join("\n");
    }
    function hideMenu() {
        menu.style.width = px(0);
        menu.style.height = px(0);
        menu.style.top = px(0);
        menu.style.left = px(0);
        menu.style.pointerEvents = "none";
        menu.style.display = "none";
    }
    domElement.addEventListener("contextmenu", function (contextmenuEvent) {
        contextmenuEvent.preventDefault();
        var mx = contextmenuEvent.pageX;
        var my = contextmenuEvent.pageY;
        if (component.mixpanel) {
            component.mixpanel.track("component:contextmenu");
        }
        revealMenu(mx, my);
    });
    doc.addEventListener("click", hideMenu);
}
exports["default"] = createRightClickMenu;
//# sourceMappingURL=createRightClickMenu.js.map