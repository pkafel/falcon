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
                    _appendToTheOutput(div, operation + indent(ind) + getJsonKey(singleDiff.key) + singleDiff.value + comma());
                } else if(singleDiff.valueType === 'ARRAY') {
                    _appendToTheOutput(div, operation + indent(ind) + getJsonKey(singleDiff.key) + '[');
                    _traverseAndPrintJsonDiff(singleDiff.value, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, operation + indent(ind) + ']' + comma());
                } else {
                    _appendToTheOutput(div, operation + indent(ind) + getJsonKey(singleDiff.key) + '{');
                    _traverseAndPrintJsonDiff(singleDiff.value, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, operation + indent(ind) + '}' + comma());
                }
            } else {
                if(singleDiff.valueType === 'ARRAY') {
                    _appendToTheOutput(div, operation + indent(ind) + getJsonKey(singleDiff.key) + '[');
                    _printRestOfTheJsonWithOperation(singleDiff.value, operation, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, operation + indent(ind) + ']' + comma());
                } else if(singleDiff.valueType === 'OBJECT') {
                    _appendToTheOutput(div, operation + indent(ind) + getJsonKey(singleDiff.key) + '{');
                    _printRestOfTheJsonWithOperation(singleDiff.value, operation, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, operation + indent(ind) + '}' + comma());
                } else {
                    _appendToTheOutput(div, operation + indent(ind) + getJsonKey(singleDiff.key) + singleDiff.value + comma());
                }
            }
        }
    }

    function _appendToTheOutput(div, text) {
        div.append('<div>' + text + '<br /></div>');
    }

    if (obj.type === 'ARRAY') {
        _appendToTheOutput(div, indent(ind) + '[');
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
        _appendToTheOutput(div, indent(ind) + ']');
    } else {
        _appendToTheOutput(div, indent(ind) + '{');
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
        _appendToTheOutput(div, indent(ind) + '}');
    }
}
