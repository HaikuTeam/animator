"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateUUIDv4() {
    let uuid = "";
    for (let i = 0; i < 32; i++) {
        const rnd = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += "-";
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (rnd & 3 | 8) : rnd)).toString(16);
    }
    return uuid;
}
exports.default = generateUUIDv4;
//# sourceMappingURL=generateUUIDv4.js.map