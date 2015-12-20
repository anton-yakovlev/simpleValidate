// jQuery validation plugin by Anton Yakovlev

;(function ($) {
    $.extend($.fn, {
        validate: function (options) {
            console.log('[ Validate func ...]');

            // If nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && options.debug && window.console) {
                    console.warn("Nothing selected, can't validate, returning nothing.");
                }
                return;
            }

            // Check if a validator for this form was already created
            var validator = $.data(this[0], "validator");
            if (validator) {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr("novalidate", "novalidate");

            validator = new $.validator(this[0], options);
            $.data(this[0], "validator", validator);

            this.on('submit', function (event) {
                event.preventDefault();

                if (validator.form()) {
                    console.log('validator.form() : true');
                    return true;
                } else {
                    console.log('validator.form() : false');
                    //validator.focusInvalid();
                    return false;
                }
            });

            return validator;
        },
        valid: function () {

        }
    });


    // -------- Validator constructor -------- //
    $.validator = function (formElement, options) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = formElement;
        this.init();
    };

    $.extend($.validator, {

        // -------- Default settings -------- //
        defaults: {
            errorInputClass: 'error', // Class for invalid input
            errorLabelClass: 'label-error', // Class for generated label, if input is invalid
            errorLabelLeftClass: 'label-error_left', // Class for generated label with left position, if input is invalid
            emptyMessage: 'Заполните поле' // Default message in tooltip
        },

        setDefaults: function (options) {
            $.extend($.validator.defaults, options);
        },

        prototype: {
            // Init function
            init: function () {
                this.submitted = {};
                this.invalid = {};
                this.valid = true;
                this.errorList = [];
            },

            // Check whole form procedure
            form: function () {
                console.log('[ form() function ...]');

                this.checkForm();

                if (!this.valid()) {
                    // Invalid form
                    console.log('[ form() function ... addErrorListeners]');
                    this.addErrorListeners();
                }

                return this.valid();
            },

            // Check all inputs
            checkForm: function () {
                var selectors = $(this.currentForm).find('input, textarea').not('input[type="file"], input[type="hidden"]');

                for (var i = 0; i < selectors.length; i++) {
                    this.check( $(selectors[i]) );
                }

                return this.valid();
            },

            // Check current input
            check: function (selector) {
                var elementValue = selector.val();

                if (this.isEmpty(elementValue)) {
                    this.errorList.push('error');
                    return;
                }

                return true;
            },

            // Add listeners on every input
            addErrorListeners: function () {
                var formInputs = $(this.currentForm).find('input, textarea').not('input[type="file"], input[type="hidden"]'),
                    checkFn = this.check;

                for (var i = 0; i < formInputs.length; i++) {
                    var currentItem = $(formInputs[i]),
                        currentItemId = '#' + $(formInputs[i]).attr('id');

                    (function (ci) {
                        $(document).on('keyup', currentItemId, function () {
                            checkFn(ci);
                        });
                    })(currentItem);
                }
            },

            // Remove listeners from every input
            removeErrorListeners: function () {
                var formInputs = $(this.currentForm).find('input, textarea').not('input[type="file"], input[type="hidden"]');

                for (var i = 0; i < formInputs.length; i++) {
                    var currentItemId = '#' + $(formInputs[i]).attr('id');
                    $(document).off('keyup', currentItemId);
                }
            },

            // Generate valid markup in form
            doValid: function (selector) {
                var errorLabelId = selector.attr('name') + '-error';

                selector.removeClass(settings.errorInputClass);
                $('#' + errorLabelId).remove();
            },

            // Generate invalid markup in form
            doInvalid: function (selector) {
                var itemId = selector.attr('id'),
                    errorLabelId = selector.attr('name') + '-error',
                    $errorLabelId = $('#' + errorLabelId),
                    errorLabelLeft = selector.data('errorLeft'),
                    errorLabelLeftClass = selector.data('errorLeftClass'),
                    errorLabelMessage = selector.data('emptyError');

                selector.addClass(this.settings.errorInputClass);

                if (!$errorLabelId.length) {
                    $('<label>', {
                        id: errorLabelId,
                        text: function () {
                            return errorLabelMessage ? errorLabelMessage : this.settings.emptyMessage;
                        },
                        'for': itemId,
                        'class': (function () {
                            var errorLabelClasses;

                            if (errorLabelLeft) {
                                errorLabelClasses = this.settings.errorLabelClass + ' ' + (errorLabelLeftClass ? errorLabelLeftClass : this.settings.errorLabelLeftClass);
                            } else {
                                errorLabelClasses = this.settings.errorLabelClass;
                            }

                            return errorLabelClasses;
                        })()
                    }).insertAfter(selector);
                }
            },

            // IsValid form
            valid: function () {
                return this.size() === 0;
            },

            // Error list length
            size: function () {
                return this.errorList.length;
            },

            // Validate for empty data
            isEmpty: function (value) {
                return !Boolean(value);
            }
        }

    });

}(jQuery));