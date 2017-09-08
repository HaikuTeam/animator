var parseCssTransformString = require("./../helpers/parseCssTransformString");
var visitManaTree = require("./../helpers/visitManaTree");
var parseCssValue = require("./../vendor/css-value");
var ROOT_LOCATOR = "0";
var TRANSFORM_COMPONENT_WHITELIST = {
    "rotation.x": true,
    "rotation.y": true,
    "rotation.z": true,
    "rotation.w": true,
    "scale.x": true,
    "scale.y": true,
    "scale.z": true,
    "translation.x": true,
    "translation.y": true,
    "translation.z": true,
    "mount.x": true,
    "mount.y": true,
    "mount.z": true,
    "origin.x": true,
    "origin.y": true,
    "origin.z": true,
    "align.x": true,
    "align.y": true,
    "align.z": true
};
function determineSizingProp(sizeAxis, attributeValue) {
    var parsedValues = parseCssValue(attributeValue);
    var parsedValue = parsedValues[0];
    switch (parsedValue.unit) {
        case "%":
            return {
                name: "sizeProportional",
                value: parsedValue.value / 100,
                mode: 0
            };
        case "px":
            return {
                name: "sizeAbsolute",
                value: parsedValue.value,
                mode: 1
            };
        case "":
            return {
                name: "sizeAbsolute",
                value: parsedValue.value,
                mode: 1
            };
        default:
            return false;
    }
}
module.exports = function convertManaLayout(mana) {
    visitManaTree(ROOT_LOCATOR, mana, function _visitor(name, attributes, children, node, locator, parent, index) {
        if (!attributes)
            return void 0;
        if (name.states) {
            var width_1 = name.states.width;
            var height = name.states.height;
            if (width_1 && width_1.type === "number") {
                attributes["sizeAbsolute.x"] = width_1.value;
                attributes["sizeMode.x"] = 1;
            }
            if (height && height.type === "number") {
                attributes["sizeAbsolute.y"] = height.value;
                attributes["sizeMode.y"] = 1;
            }
        }
        if (attributes.width !== undefined && attributes.width !== null) {
            var widthProp = determineSizingProp("x", attributes.width);
            if (widthProp) {
                attributes[widthProp.name + ".x"] = widthProp.value;
                attributes["sizeMode.x"] = widthProp.mode;
                delete attributes.width;
            }
        }
        if (attributes.height !== undefined && attributes.height !== null) {
            var heightProp = determineSizingProp("y", attributes.height);
            if (heightProp) {
                attributes[heightProp.name + ".y"] = heightProp.value;
                attributes["sizeMode.y"] = heightProp.mode;
                delete attributes.height;
            }
        }
        if (attributes.style && typeof attributes.style === "object") {
            if (attributes.style.width !== undefined &&
                attributes.style.width !== null) {
                var widthStyleProp = determineSizingProp("x", attributes.style.width);
                if (widthStyleProp) {
                    attributes[widthStyleProp.name + ".x"] = widthStyleProp.value;
                    attributes["sizeMode.x"] = widthStyleProp.mode;
                    delete attributes.style.width;
                }
            }
            if (attributes.style.height !== undefined &&
                attributes.style.height !== null) {
                var heightStyleProp = determineSizingProp("y", attributes.style.height);
                if (heightStyleProp) {
                    attributes[heightStyleProp.name + ".y"] = heightStyleProp.value;
                    attributes["sizeMode.y"] = heightStyleProp.mode;
                    delete attributes.style.height;
                }
            }
        }
        if (attributes.transform !== undefined && attributes.transform !== null) {
            var transformAttributes = parseCssTransformString(attributes.transform);
            for (var transformAttributeName in transformAttributes) {
                var transformValue = transformAttributes[transformAttributeName];
                if (!TRANSFORM_COMPONENT_WHITELIST[transformAttributeName]) {
                    console.warn("Skipping transform attribute " +
                        transformAttributeName +
                        " because it is not yet supported");
                    continue;
                }
                attributes[transformAttributeName] = transformValue;
            }
            delete attributes.transform;
            delete attributes.x;
            delete attributes.y;
        }
    });
    return mana;
};
