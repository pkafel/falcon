function getType(v) {
    var type = typeof(v);
    if (type === 'number' || type === 'string' || type === 'boolean') return 'scalar';
    if (type === 'object') {
        if (v.constructor === Array) return 'array';
        else return 'object';
    }
}

function indent(ind) {
    var s = '';
    while (s.length < ind * 2)
        s += '&nbsp';
    return s;
}
/*
* json - object which needs to be printed
* operation - character that will be printed at the begin of each line
* ind - level od indention
* div - html div in which result should be printed
 */
function prettyPrint(json, operation, ind, div) {

    function JsonInfo(json) {
        if(json instanceof Array) {
            this.numberOfElements = json.length;
            this.getValueForIndex = function(index) { return json[index]; }
            this.getKeyIfJson = function(index) { return ''; }
        } else {
            this.keys = Object.keys(json);
            this.numberOfElements = this.keys.length;
            this.getValueForIndex = function(index) { return json[this.keys[index]]; }
            this.getKeyIfJson = function(index) { return this.keys[index] + ': '; }
        }
    }

    var jsonInfo = new JsonInfo(json);
    for (var i = 0; i < jsonInfo.numberOfElements; i++) {
        function comma() { return ((i + 1 < jsonInfo.numberOfElements) ? ',' : ''); }
        var o = jsonInfo.getValueForIndex(i);
        var type = getType(o);
        if(type === 'scalar') div.append(operation + indent(ind) + jsonInfo.getKeyIfJson(i) + o + comma() + '<br />');
        else if(type === 'array') {
            div.append(operation + indent(ind) + jsonInfo.getKeyIfJson(i) + '[<br />');
            prettyPrint(o, operation, ind + 4, div);
            div.append(operation + indent(ind) + ']' + comma() + '<br />');
        } else {
            div.append(operation + indent(ind) + jsonInfo.getKeyIfJson(i) + '{<br />');
            prettyPrint(o, operation, ind + 4, div);
            div.append(operation + indent(ind) + '}' + comma() + '<br />');
        }
    }
}
