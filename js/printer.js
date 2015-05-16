function indent(ind) {
    var s = '';
    while (s.length < ind * 2)
        s += '&nbsp;';
    return s;
}

function getJsonKey(s) {
    return s ? '\"' + s  + '\": ' : '';
}

function printDiffJson(json, operation, ind, div) {
    for (var i = 0; i < json.length; i++) {
        function comma() {
            return ((i + 1 < json.length) ? ',' : '');
        }

        var o = json[i];
        var type = o.valueType;
        if (type === 'SCALAR') {
            div.append(operation + indent(ind) + getJsonKey(json.key) + o.value + comma() + '<br />');
        } else if (type === 'ARRAY') {
            div.append(operation + indent(ind) + getJsonKey(o.key) + '[<br />');
            printDiffJson(o.value, operation, ind + 4, div);
            div.append(operation + indent(ind) + ']' + comma() + '<br />');
        } else {
            div.append(operation + indent(ind) + getJsonKey(o.key) + '{<br />');
            printDiffJson(o.value, operation, ind + 4, div);
            div.append(operation + indent(ind) + '}' + comma() + '<br />');
        }
    }
}


function getOperationSignFromName(operationName) {
    if(operationName === 'ADD') return '+';
    else if(operationName === 'REMOVE') return '-';
    else if(operationName === 'REPLACE') return '+\\-';
    else return '&nbsp;';
}

function printTopDiff(obj, ind, div) {
    if (obj.type === 'ARRAY') {
        div.append(indent(ind) + '[<br />');
        printNoneDiffJson(obj.diff, ind + 4, div);
        div.append(indent(ind) + ']');
    } else {
        div.append(indent(ind) + '{<br />');
        printNoneDiffJson(obj.diff, ind + 4, div);
        div.append(indent(ind) + '}');
    }
}

function printNoneDiffJson(json, ind, div) {
    for(var i = 0; i < json.length; i++) {
        var singleDiff = json[i];
        var operation = getOperationSignFromName(singleDiff.op);

        if(singleDiff.op === 'NONE') {
            if(singleDiff.valueType === 'SCALAR') {
                div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + singleDiff.value + '<br />');
            } else if(singleDiff.valueType === 'ARRAY') {
                div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + '[<br />');
                printNoneDiffJson(singleDiff.value, ind + 4, div);
                div.append(operation + indent(ind) + ']' + '<br />');
            } else {
                div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + '{<br />');
                printNoneDiffJson(singleDiff.value, ind + 4, div);
                div.append(operation + indent(ind) + '}' + '<br />');
            }
        } else {
            if(singleDiff.valueType === 'ARRAY') {
                div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + '[<br />');
                printDiffJson(singleDiff.value, operation, ind + 4, div);
                div.append(operation + indent(ind) + ']' + '<br />');
            } else if(singleDiff.valueType === 'OBJECT') {
                div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + '{<br />');
                printDiffJson(singleDiff.value, operation, ind + 4, div);
                div.append(operation + indent(ind) + '}' + '<br />');
            } else {
                div.append(operation + indent(ind) + getJsonKey(singleDiff.key) + singleDiff.value + '<br />');
            }
        }
    }
}
