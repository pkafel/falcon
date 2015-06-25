function showCompareForm() {
    $('#compare-form').show();
    $('#diff-rep-container').hide();
    $('#json1').focus();
}

$(document).ready(function () {
    showCompareForm();

    $("#compare-form").submit(function (event) {
        /* stop form from submitting normally */
        event.preventDefault();

        var diff_rep = $('#diff-rep');

        diff_rep.text('');
        var diff = getDiffRepresentation($('#json1').val(), $('#json2').val());
        printJsonDiff(diff, 1, diff_rep);

        $('#compare-form').hide();
        $('#diff-rep-container').show();
    });

    $("#back-button").click(function () {
        showCompareForm();
    });
});
