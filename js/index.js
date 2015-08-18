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

$(document).ready(function () {
    showCompareForm();

    $("#compare-form").submit(function (event) {
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
    });

    $("#back-button").click(function () {
        showCompareForm();
    });

    $('#strategy-list li').click(function() {
      $('#strategy').text($(this).text());
      $('#strategy').val($(this).val());
    });
});
