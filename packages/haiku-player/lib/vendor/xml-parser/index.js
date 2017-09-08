module.exports = parse;
function parse(xml) {
    xml = xml.trim();
    xml = xml.replace(/<!--[\s\S]*?-->/g, "");
    return document();
    function document() {
        return {
            declaration: declaration(),
            root: tag()
        };
    }
    function declaration() {
        var m = match(/^<\?xml\s*/);
        if (!m)
            return;
        var node = {
            attributes: {}
        };
        while (!(eos() || is("?>"))) {
            var attr = attribute();
            if (!attr)
                return node;
            node.attributes[attr.name] = attr.value;
        }
        match(/\?>\s*/);
        return node;
    }
    function tag() {
        var m = match(/^<([\w-:.]+)\s*/);
        if (!m)
            return;
        var node = {
            name: m[1],
            attributes: {},
            children: []
        };
        while (!(eos() || is(">") || is("?>") || is("/>"))) {
            var attr = attribute();
            if (!attr)
                return node;
            node.attributes[attr.name] = attr.value;
        }
        if (match(/^\s*\/>\s*/)) {
            return node;
        }
        match(/\??>\s*/);
        node.content = content();
        var child = tag();
        while (child) {
            node.children.push(child);
            child = tag();
        }
        match(/^<\/[\w-:.]+>\s*/);
        return node;
    }
    function content() {
        var m = match(/^([^<]*)/);
        if (m)
            return m[1];
        return "";
    }
    function attribute() {
        var m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m)
            return;
        return { name: m[1], value: strip(m[2]) };
    }
    function strip(val) {
        return val.replace(/^['"]|['"]$/g, "");
    }
    function match(re) {
        var m = xml.match(re);
        if (!m)
            return;
        xml = xml.slice(m[0].length);
        return m;
    }
    function eos() {
        return xml.length === 0;
    }
    function is(prefix) {
        return xml.indexOf(prefix) === 0;
    }
}
