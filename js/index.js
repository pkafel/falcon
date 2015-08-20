function showCompareForm() {
    $('#json1').parent().removeClass('has-error');
    $('#json2').parent().removeClass('has-error');

    $('#compare-form').show();
    $('#diff-rep-container').hide();
    $('#json1').focus();
}

function showDiffForm() {
    $('#compare-form').hide();
    $('#diff-rep-container').show();
}

function showValidationError(ex) {
  $('#json1').parent().toggleClass('has-error', ex.leftError != undefined);
  $('#json2').parent().toggleClass('has-error', ex.rightError != undefined);
}

function setHotkeys() {
    $("#json1").bind('keydown', 'tab', function(e) {
        e.preventDefault();
        $('#json2').focus();
    });
    $("#json2").bind('keydown', 'tab', function(e) {
        e.preventDefault();
        $('#json1').focus();
    });
    $("#json1").bind('keydown', 'ctrl+return', function(e) {
        submitForm(e);
        $("#back-button").focus();
    });
    $("#json2").bind('keydown', 'ctrl+return', function(e) {
        submitForm(e);
        $("#back-button").focus();
    });
    $(document).bind('keydown', 'ctrl+return', function(e) {
        submitForm(e);
        $("#back-button").focus();
    });
    $("#back-button").bind('keydown', 'backspace', function(e) {
        e.preventDefault();
        showCompareForm();
    });
}

function submitForm(event) {
    /* stop form from submitting normally */
    event.preventDefault();

    var diff_rep = $('#diff-rep');
    diff_rep.text('');

    try {
        var strategy = $('#strategy').val() === '1' ? new ComparingKeyStrategy() : new ComparingValueStrategy();
        var diff = getDiffRepresentation($('#json1').val(), $('#json2').val(), strategy);

        printJsonDiff(diff, 1, diff_rep);
        showDiffForm();
    } catch (ex) {
        showValidationError(ex);
    }
}

$(document).ready(function () {
    showCompareForm();
    setHotkeys();

    $("#compare-form").submit(submitForm);
    $("#back-button").click(function () {
        showCompareForm();
    });

    $('#strategy-list li').click(function() {
      $('#strategy').text($(this).text());
      $('#strategy').val($(this).val());
    });
});
