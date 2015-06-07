//// CONSTANTS
INDENT_INCREASE = 4;

OPERATION_2_CLASS_NAME = {
    '+': 'added-line-div',
    '-': 'removed-line-div',
    '': 'unchanged-line-div',
    '&nbsp': 'unchanged-line-div'
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
                _appendToTheOutput(div, operation, indent(ind) + getJsonKey(o.key) + o.value + comma());
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
                    _appendToTheOutput(div, operation, indent(ind) + getJsonKey(singleDiff.key) + singleDiff.value + comma());
                } else if(singleDiff.valueType === 'ARRAY') {
                    _appendToTheOutput(div, operation, indent(ind) + getJsonKey(singleDiff.key) + '[');
                    _traverseAndPrintJsonDiff(singleDiff.value, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, operation, indent(ind) + ']' + comma());
                } else {
                    _appendToTheOutput(div, operation, indent(ind) + getJsonKey(singleDiff.key) + '{');
                    _traverseAndPrintJsonDiff(singleDiff.value, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, operation, indent(ind) + '}' + comma());
                }
            } else {
                if(singleDiff.valueType === 'ARRAY') {
                    _appendToTheOutput(div, operation, indent(ind) + getJsonKey(singleDiff.key) + '[');
                    _printRestOfTheJsonWithOperation(singleDiff.value, operation, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, operation,  indent(ind) + ']' + comma());
                } else if(singleDiff.valueType === 'OBJECT') {
                    _appendToTheOutput(div, operation, indent(ind) + getJsonKey(singleDiff.key) + '{');
                    _printRestOfTheJsonWithOperation(singleDiff.value, operation, ind + INDENT_INCREASE, div);
                    _appendToTheOutput(div, operation, indent(ind) + '}' + comma());
                } else {
                    _appendToTheOutput(div, operation, indent(ind) + getJsonKey(singleDiff.key) + singleDiff.value + comma());
                }
            }
        }
    }

    function _appendToTheOutput(div, operation, text) {
        div.append('<div class="' + OPERATION_2_CLASS_NAME[operation] +'">' + operation + text + '<br /></div>');
    }

    if (obj.topType === 'ARRAY') {
        div.append('<div class="top-line-div">'+ indent(ind) + '[<br /></div>');
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
        div.append('<div class="bottom-line-div">' + indent(ind) + ']<br /></div>');
    } else if(obj.topType === 'OBJECT') {
        div.append('<div class="top-line-div">' + indent(ind) + '{<br /></div>');
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
        div.append('<div class="bottom-line-div">' + indent(ind) + '}<br /></div>');
    } else if(obj.topType === 'NONE') {
        _traverseAndPrintJsonDiff(obj.diff, ind + INDENT_INCREASE, div);
    } else {
        throw "Unexpected diff type !";
    }
}
