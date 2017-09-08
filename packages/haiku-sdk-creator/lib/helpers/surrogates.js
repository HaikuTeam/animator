"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = 60399;
const PATH = "/";
const HOST = "localhost";
class SurrogateManager {
    static registerHandler(uniqueKey, instance) {
    }
    static makeRequest(uniqueKey, args) {
        return new Promise((accept, reject) => {
        });
    }
    static ensureInit(role) {
        SurrogateManager.connection = 'TODO';
        SurrogateManager.requestQueue = [];
    }
}
function SurrogateHandler(className) {
    return function (target) {
        var original = target;
        function construct(constructor, args) {
            var c = function () {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        var surrogateConstructor = function (uniqueKey, ...args) {
            var instance = construct(original, args);
            SurrogateManager.registerHandler(uniqueKey, instance);
            return instance;
        };
        surrogateConstructor.prototype = original.prototype;
    };
}
exports.SurrogateHandler = SurrogateHandler;
function SurrogateClient(className) {
    return function (target) {
        var original = target;
        function construct(constructor, args) {
            var c = function () {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        var surrogateConstructor = function (uniqueKey, ...args) {
            var instance = construct(original, args);
            for (var property in instance) {
                if (instance.hasOwnProperty(property)) {
                    var original = instance[property];
                    instance[property] = (...args) => {
                        return SurrogateManager.makeRequest(uniqueKey, args);
                    };
                }
            }
            return instance;
        };
        surrogateConstructor.prototype = original.prototype;
    };
}
exports.SurrogateClient = SurrogateClient;
function requestor(prototype, name, descriptor) {
}
exports.requestor = requestor;
//# sourceMappingURL=surrogates.js.map