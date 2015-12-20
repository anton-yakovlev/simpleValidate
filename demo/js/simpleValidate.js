// jQuery validation plugin by Anton Yakovlev

;(function ($) {

    // -------- Public methods -------- //
    var defaults = {
        errorInputClass: 'error', // Class for invalid input
        errorLabelClass: 'label-error', // Class for generated label, if input is invalid
        errorLabelLeftClass: 'label-error_left', // Class for generated label with left position, if input is invalid
        emptyMessage: 'Заполните поле' // Default message in tooltip
    };


    // -------- Module constructor -------- //
    function Validator(element, options) {
        this.settings = $.extend({}, defaults, options);
        this.element = element;
        this.init();
    }


    // -------- Module init -------- //
    Validator.prototype.init = function () {
        var formElement = $(this.element),
            settings = this.settings;

        _addGeneralListeners();

        // -------- Listeners -------- //
        // General listeners
        function _addGeneralListeners() {
            $(document).on('submit', formElement, function (e) {
                console.log('[ Start Validate Module by submit ... ]');

                e.preventDefault();

                // Validate form
                var valid = _validation(formElement);

                // Add error listeners if inputs are invalid
                if (!_validation(formElement)) {
                    _addErrorListeners(formElement);
                    console.log('[_addErrorListeners ...]');
                } else {
                    console.log('[return valid] : ' + valid);
                    _clearForm(formElement);
                    return valid;
                }
            });
        }

        // Add listeners on every input
        function _addErrorListeners(form) {
            var formInputs = form.find('input, textarea').not('input[type="file"], input[type="hidden"]');

            for (var i = 0; i < formInputs.length; i++) {
                var currentItem = $(formInputs[i]),
                    currentItemId = '#' + $(formInputs[i]).attr('id');

                (function (ci) {
                    $(document).on('keyup', currentItemId, function () {
                        _checkCurrent(ci);
                    });
                })(currentItem);
            }
        }

        // Remove listeners from every input
        function _removeErrorListeners(form) {
            var formInputs = form.find('input, textarea').not('input[type="file"], input[type="hidden"]');

            for (var i = 0; i < formInputs.length; i++) {
                var currentItemId = '#' + $(formInputs[i]).attr('id');
                $(document).off('keyup', currentItemId);
            }
        }


        // -------- Validate form -------- //
        // General validation
        function _validation(form) {
            var formInputs = form.find('input, textarea').not('input[type="file"], input[type="hidden"]'),
                valid = true;

            if (!_checkEvery(formInputs)) valid = false;

            return valid;
        }

        // Check every input for valid data
        function _checkEvery(selectors) {
            var valid = true;

            for (var i = 0; i < selectors.length; i++) {
                if (!_checkCurrent($(selectors[i]))) valid = false;
            }

            return valid;
        }

        // Check current input
        function _checkCurrent(selector) {
            var valid = !_isEmpty(selector.val());
            valid ? _doValid(selector) : _doInvalid(selector);
            return valid;
        }

        // Validate for empty data
        function _isEmpty(value) {
            return !Boolean(value);
        }

        // Generate valid markup in form
        function _doValid(selector) {
            var errorLabelId = selector.attr('name') + '-error';

            selector.removeClass(settings.errorInputClass);
            $('#' + errorLabelId).remove();
        }

        // Generate invalid markup in form
        function _doInvalid(selector) {
            var itemId = selector.attr('id'),
                errorLabelId = selector.attr('name') + '-error',
                $errorLabelId = $('#' + errorLabelId),
                errorLabelLeft = selector.data('errorLeft'),
                errorLabelLeftClass = selector.data('errorLeftClass'),
                errorLabelMessage = selector.data('emptyError');

            selector.addClass(settings.errorInputClass);

            if (!$errorLabelId.length) {
                $('<label>', {
                    id: errorLabelId,
                    text: function () {
                        return errorLabelMessage ? errorLabelMessage : settings.emptyMessage;
                    },
                    'for': itemId,
                    'class': (function () {
                        var errorLabelClasses;

                        if (errorLabelLeft) {
                            errorLabelClasses = settings.errorLabelClass + ' ' + (errorLabelLeftClass ? errorLabelLeftClass : settings.errorLabelLeftClass);
                        } else {
                            errorLabelClasses = settings.errorLabelClass;
                        }

                        return errorLabelClasses;
                    })()
                }).insertAfter(selector);
            }
        }

        // Clear form and reset validation markup
        function _clearForm(form) {
            form[0].reset();
            _removeErrorListeners(form);
        }
    };

    $.fn.validate = function (options) {
        new Validator(this, options);
        return this
    }

}(jQuery));