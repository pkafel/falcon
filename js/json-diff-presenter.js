//// CONSTANTS
INDENT_INCREASE = 4;

OPERATION_2_CLASS_NAME = {
    '+': 'added-line-div',
    '-': 'removed-line-div',
    '*': 'unchanged-line-div'
};

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

function getJsonValue(v) {
    return (typeof v == 'string' || v instanceof String)
        ? '\"' + v  + '\"' : v;
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
                _appendToTheOutput(div, operation, indent(ind) + getJsonKey(o.key) + getJsonValue(o.value) + comma());
            } else if (type === 'ARRAY') {
                _appendToTheOutput(div, operation, indent(ind) + getJsonKey(o.key) + '[');
                _printRestOfTheJsonWithOperation(o.value, operation, ind + INDENT_INCREASE, div);
                _appendToTheOutput(div, operation, indent(ind) + ']' + comma());
            } else {
                _appendToTheOutput(div, operation, indent(ind) + getJsonKey(o.key) + '{');
                _printRestOfTheJsonWithOperation(o.value, operation, ind + INDENT_INCREASE, div);
                _appendToTheOutput(div, operation, indent(ind) + '}' + comma());
            }
        }
    }

    function _getOperationSignFromName(operationName) {
        if(operationName === 'ADD') return '+';
        else if(operationName === 'REMOVE') return '-';
        else return '*';
    }

    function _traverseAndPrintJsonDiff(json, ind, div) {
        for(var i = 0; i < json.length; i++) {
            function comma() {
                return ((i + 1 < json.length) ? ',' : '');
            }
            var singleDiff = json[i];

            if(singleDiff.op === 'NONE') {
                if(singleDiff.valueType === 'SCALAR') {
                    _appendToTheOutput(div, singleDiff.op, indent(ind) + getJsonKey(singleDiff.key) + getJsonValue(singleDiff.value) + comma());
                } else if(singleDiff.valueType === 'ARRAY') {
                    _appendToTheOutput(div, singleDiff.op, indent(ind) + getJsonKey(singleDiff.key) + '[');
                    _traverseAndPrintJsonDiff(singleDiff.value, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, singleDiff.op, indent(ind) + ']' + comma());
                } else {
                    _appendToTheOutput(div, singleDiff.op, indent(ind) + getJsonKey(singleDiff.key) + '{');
                    _traverseAndPrintJsonDiff(singleDiff.value, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, singleDiff.op, indent(ind) + '}' + comma());
                }
            } else {
                if(singleDiff.valueType === 'ARRAY') {
                    _appendToTheOutput(div, singleDiff.op, indent(ind) + getJsonKey(singleDiff.key) + '[');
                    _printRestOfTheJsonWithOperation(singleDiff.value, singleDiff.op, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, singleDiff.op,  indent(ind) + ']' + comma());
                } else if(singleDiff.valueType === 'OBJECT') {
                    _appendToTheOutput(div, singleDiff.op, indent(ind) + getJsonKey(singleDiff.key) + '{');
                    _printRestOfTheJsonWithOperation(singleDiff.value, singleDiff.op, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, singleDiff.op, indent(ind) + '}' + comma());
                } else {
                    _appendToTheOutput(div, singleDiff.op, indent(ind) + getJsonKey(singleDiff.key) + getJsonValue(singleDiff.value) + comma());
                }
            }
        }
    }

    function _appendToTheOutput(div, operation, text) {
        var operationSign = _getOperationSignFromName(operation);
        var operationSpanVisibility = operation === 'NONE' ? 'hidden' : 'visible';
        var operationSpan = '<span style="visibility: ' + operationSpanVisibility + '">' + operationSign + '</span>';

        div.append('<div class="' + OPERATION_2_CLASS_NAME[operationSign] +'">' + operationSpan + text + '<br /></div>');
    }

    if (obj.topType === 'ARRAY') {
        div.append('<div class="top-line-div">'+ indent(ind) + '[<br /></div>');
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
        div.append('<div class="bottom-line-div">' + indent(ind) + ']<br /></div>');
    } else if(obj.topType === 'OBJECT') {
        div.append('<div class="top-line-div">' + indent(ind) + '{<br /></div>');
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
        div.append('<div class="bottom-line-div">' + indent(ind) + '}<br /></div>');
    } else if(obj.topType === 'NULL') {
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
    } else {
        throw "Unexpected diff type !";
    }
}
