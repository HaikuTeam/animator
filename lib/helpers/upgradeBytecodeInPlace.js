var xmlToMana = require("./xmlToMana");
var visitManaTree = require("./visitManaTree");
var STRING_TYPE = "string";
function upgradeBytecodeInPlace(bytecode, options) {
    if (!bytecode.states) {
        bytecode.states = {};
    }
    if (bytecode.properties) {
        var properties = bytecode.properties;
        delete bytecode.properties;
        for (var i = 0; i < properties.length; i++) {
            var propertySpec = properties[i];
            var updatedSpec = {};
            if (propertySpec.value !== undefined)
                updatedSpec.value = propertySpec.value;
            if (propertySpec.type !== undefined)
                updatedSpec.type = propertySpec.type;
            if (propertySpec.setter !== undefined)
                updatedSpec.set = propertySpec.setter;
            if (propertySpec.getter !== undefined)
                updatedSpec.get = propertySpec.getter;
            if (propertySpec.set !== undefined)
                updatedSpec.set = propertySpec.set;
            if (propertySpec.get !== undefined)
                updatedSpec.get = propertySpec.get;
            bytecode.states[propertySpec.name] = updatedSpec;
        }
    }
    if (Array.isArray(bytecode.eventHandlers)) {
        var eventHandlers = bytecode.eventHandlers;
        delete bytecode.eventHandlers;
        bytecode.eventHandlers = {};
        for (var j = 0; j < eventHandlers.length; j++) {
            var eventHandlerSpec = eventHandlers[j];
            if (!bytecode.eventHandlers[eventHandlerSpec.selector])
                bytecode.eventHandlers[eventHandlerSpec.selector] = {};
            bytecode.eventHandlers[eventHandlerSpec.selector][eventHandlerSpec.name] = {
                handler: eventHandlerSpec.handler
            };
        }
    }
    if (typeof bytecode.template === STRING_TYPE) {
        bytecode.template = xmlToMana(bytecode.template);
    }
    if (options && options.referenceUniqueness) {
        var referencesToUpdate_1 = {};
        var alreadyUpdatedReferences_1 = {};
        if (bytecode.template) {
            visitManaTree("0", bytecode.template, function _visitor(elementName, attributes, children, node) {
                if (elementName === "filter") {
                    if (attributes.id && !alreadyUpdatedReferences_1[attributes.id]) {
                        var prev = attributes.id;
                        var next = prev + "-" + options.referenceUniqueness;
                        attributes.id = next;
                        referencesToUpdate_1["url(#" + prev + ")"] = "url(#" + next + ")";
                        alreadyUpdatedReferences_1[attributes.id] = true;
                    }
                }
            }, null, 0);
        }
        if (bytecode.timelines) {
            for (var timelineName in bytecode.timelines) {
                for (var selector in bytecode.timelines[timelineName]) {
                    for (var propertyName in bytecode.timelines[timelineName][selector]) {
                        if (propertyName !== "filter") {
                            continue;
                        }
                        for (var keyframeMs in bytecode.timelines[timelineName][selector][propertyName]) {
                            var keyframeDesc = bytecode.timelines[timelineName][selector][propertyName][keyframeMs];
                            if (keyframeDesc && referencesToUpdate_1[keyframeDesc.value]) {
                                keyframeDesc.value = referencesToUpdate_1[keyframeDesc.value];
                            }
                        }
                    }
                }
            }
        }
    }
}
module.exports = upgradeBytecodeInPlace;
