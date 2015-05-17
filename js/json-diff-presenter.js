//// CONSTANTS
INDENT_INCREASE = 4;

//// UTILS
function indent(ind) {
    var s = '';
    while (s.length < ind * 2)
        s += '&nbsp;';
    return s;
}

function getJsonKey(s) {
    return s ? '\"' + s  + '\": ' : '';
}

//// MAIN FUNCTION
function printJsonDiff(obj, ind, div) {

    function _printRestOfTheJsonWithOperation(json, operation, ind, div) {
        for (var i = 0; i < json.length; i++) {
            function comma() {
                return ((i + 1 < json.length) ? ',' : '');
            }

            var o = json[i];
            var type = o.valueType;
            if (type === 'SCALAR') {
                div.append(operation + indent(ind) + getJsonKey(o.key) + o.value + comma() + '<br />');
            } else if (type === 'ARRAY') {
                div.append(operation + indent(ind) + getJsonKey(o.key) + '[<br />');
                _printRestOfTheJsonWithOperation(o.value, operation, ind + INDENT_INCREASE, div);
                div.append(operation + indent(ind) + ']' + comma() + '<br />');
            } else {
                div.append(operation + indent(ind) + getJsonKey(o.key) + '{<br />');
                _printRestOfTheJsonWithOperation(o.value, operation, ind + INDENT_INCREASE, div);
                div.append(operation + indent(ind) + '}' + comma() + '<br />');
            }
        }
    }

    function _getOperationSignFromName(operationName) {
        if(operationName === 'ADD') return '+';
        else if(operationName === 'REMOVE') return '-';
        else return '&nbsp;';
    }

    function _traverseAndPrintJsonDiff(json, ind, div) {
        for(var i = 0; i < json.length; i++) {
            function comma() {
                return ((i + 1 < json.length) ? ',' : '');
            }
            var singleDiff = json[i];
            var operation = _getOperationSignFromName(singleDiff.op);

            if(singleDiff.op === 'NONE') {
                if(singleDiff.valueType === 'SCALAR') {
                    div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + singleDiff.value + comma() +'<br />');
                } else if(singleDiff.valueType === 'ARRAY') {
                    div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + '[<br />');
                    _traverseAndPrintJsonDiff(singleDiff.value, ind + INDENT_INCREASE, div);
                    div.append(operation + indent(ind) + ']' + comma() + '<br />');
                } else {
                    div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + '{<br />');
                    _traverseAndPrintJsonDiff(singleDiff.value, ind + INDENT_INCREASE, div);
                    div.append(operation + indent(ind) + '}' + comma() + '<br />');
                }
            } else {
                if(singleDiff.valueType === 'ARRAY') {
                    div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + '[<br />');
                    _printRestOfTheJsonWithOperation(singleDiff.value, operation, ind + INDENT_INCREASE, div);
                    div.append(operation + indent(ind) + ']' + comma() + '<br />');
                } else if(singleDiff.valueType === 'OBJECT') {
                    div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + '{<br />');
                    _printRestOfTheJsonWithOperation(singleDiff.value, operation, ind + INDENT_INCREASE, div);
                    div.append(operation + indent(ind) + '}' + comma() + '<br />');
                } else {
                    div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + singleDiff.value + comma() + '<br />');
                }
            }
        }
    }

    if (obj.type === 'ARRAY') {
        div.append(indent(ind) + '[<br />');
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
        div.append(indent(ind) + ']');
    } else {
        div.append(indent(ind) + '{<br />');
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
        div.append(indent(ind) + '}');
    }
}