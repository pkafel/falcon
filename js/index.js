ComparisonForms = {
    textArea1: function() { return $('#json1');},
    textArea2: function() { return $('#json2');},
    compareForm: function () { return $('#compare-form');},

    init: function() {
        this.show();
        this.addHotKeys();
        this.compareForm().submit(this._submitForm);
    },

    show: function() {
        this.textArea1().parent().removeClass('has-error');
        this.textArea2().parent().removeClass('has-error');

        ComparisonResut.hide();
        this.compareForm().show();
        this.textArea1().focus();
    },

    hide: function() {
        this.compareForm().hide();
    },

    _submitForm: function(e) {
        e.preventDefault();

        ComparisonResut.clean();
        var strategy = ModeDropdown.getStrategy();

        try {
            var diff = getDiffRepresentation(ComparisonForms.textArea1().val(), ComparisonForms.textArea2().val(), strategy);
            ComparisonResut.renderDiff(diff);
        } catch (ex) {
            ComparisonForms.textArea1().parent().toggleClass('has-error', ex.leftError != undefined);
            ComparisonForms.textArea2().parent().toggleClass('has-error', ex.rightError != undefined);
        }
    },

    addHotKeys: function() {
        this.textArea1().bind('keydown', 'tab', function(e) {
            e.preventDefault();
            ComparisonForms.textArea2().focus();
        });
        this.textArea2().bind('keydown', 'tab', function(e) {
            e.preventDefault();
            ComparisonForms.textArea1().focus();
        });
        this.textArea1().bind('keydown', 'ctrl+return', function(e) {
            ComparisonForms._submitForm(e);
            BackButton.backButton().focus();
        });
        this.textArea2().bind('keydown', 'ctrl+return', function(e) {
            ComparisonForms._submitForm(e);
            BackButton.backButton().focus();
        });
        this.textArea1().bind('keydown', 'ctrl+m', function(e) {
            e.preventDefault();
            ModeDropdown.changeValue();
        });
        this.textArea2().bind('keydown', 'ctrl+m', function(e) {
            e.preventDefault();
            ModeDropdown.changeValue();
        });
    }
};

ComparisonResut = {
    resultContainerDiv: function() { return $('#diff-rep-container');},
    resultDiv: function() { return $('#diff-rep');},

    init: function() {
        this.hide();
    },

    show: function() {
        ComparisonForms.hide();
        this.resultContainerDiv().show();
    },

    hide: function() {
        this.resultContainerDiv().hide();
    },

    clean: function() {
        this.resultDiv().text('');
    },

    renderDiff: function(diff) {
        printJsonDiff(diff, 1, this.resultDiv());
        this.show();
    }
};

ModeDropdown = {
    init: function() {
        $('#strategy-list li').click(function() {
            $('#strategy').text($(this).text());
            $('#strategy').val($(this).val());
        });
    },

    changeValue: function() {
        if($('#strategy').val() === '0') {
            $('#strategy').text('Compare by Key');
            $('#strategy').val('1');
        } else {
            $('#strategy').text('Compare by Value');
            $('#strategy').val('0');
        }
    },

    getStrategy: function() {
        return $('#strategy').val() === '1' ? new ComparingKeyStrategy() : new ComparingValueStrategy();
    }
};

BackButton = {
    backButton: function() { return $("#back-button");},

    init: function() {
        this.backButton().click(function () {
            ComparisonForms.show();
        });

        this.backButton().bind('keydown', 'backspace', function(e) {
            e.preventDefault();
            ComparisonForms.show();
        });
    }
};

function setHotkeys() {
    $(document).bind('keydown', 'ctrl+return', function(e) {
        submitForm(e);
        $("#back-button").focus();
    });
    $(document).bind('keydown', 'ctrl+m', function(e) {
        e.preventDefault();
        ModeDropdown.changeValue();
    });
}

$(document).ready(function () {
    ComparisonForms.init();
    ComparisonResut.init();
    ModeDropdown.init();
    BackButton.init();

    setHotkeys();
});
