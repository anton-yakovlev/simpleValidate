// jQuery validation plugin by Anton Yakovlev

;(function ($) {
    $.extend($.fn, {
        validate: function (options) {
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
                    validator.clearForm();
                    return true;
                } else {
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
                this.errorList = [];
                $this = this;
            },

            // Check whole form procedure
            form: function () {
                this.checkForm();

                return $this.valid();
            },

            // Check all inputs
            checkForm: function () {
                var selectors = $(this.currentForm).find('input, textarea').not('input[type="file"], input[type="hidden"]');

                for (var i = 0; i < selectors.length; i++) {
                    $this.check( $(selectors[i]) );
                }

                return $this.valid();
            },

            // Check current input
            check: function (selector) {
                var elementValue = selector.val(),
                    elementValid = !$this.isEmpty(elementValue),
                    elementFormName = selector.attr('name'),
                    indexInErrorList = $.inArray(elementFormName, $this.errorList);

                if (elementValid) {

                    // Do markup validation
                    $this.doValid(selector);

                    // Remove error from Errors Array
                    $this.errorList.splice(indexInErrorList, 1);

                    return true;
                } else {
                    if (indexInErrorList < 0) { // Check if error already have been applied

                        // Write error to Error Array
                        $this.errorList.push(elementFormName);

                        // Do invalid markup
                        $this.doInvalid(selector);

                        // Add error listener for the future
                        $this.addErrorListener(selector);
                    }

                    return;
                }
            },

            // Add error listener for current input
            addErrorListener: function (selector) {
                var itemId = '#' + selector.attr('id');

                $(document).on('keyup', itemId, function () {
                    $this.check(selector);
                });
            },

            // Remove listeners from every input
            removeErrorListeners: function () {
                var formInputs = $($this.currentForm).find('input, textarea').not('input[type="file"], input[type="hidden"]');

                for (var i = 0; i < formInputs.length; i++) {
                    var currentItemId = '#' + $(formInputs[i]).attr('id');
                    $(document).off('keyup', currentItemId);
                }
            },

            // Generate valid markup in form
            doValid: function (selector) {
                var errorLabelId = selector.attr('name') + '-error';

                selector.removeClass($this.settings.errorInputClass);
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

                selector.addClass($this.settings.errorInputClass);

                if (!$errorLabelId.length) {
                    $('<label>', {
                        id: errorLabelId,
                        text: function () {
                            return errorLabelMessage ? errorLabelMessage : $this.settings.emptyMessage;
                        },
                        'for': itemId,
                        'class': (function () {
                            var errorLabelClasses;

                            if (errorLabelLeft) {
                                errorLabelClasses = $this.settings.errorLabelClass + ' ' + (errorLabelLeftClass ? errorLabelLeftClass : $this.settings.errorLabelLeftClass);
                            } else {
                                errorLabelClasses = $this.settings.errorLabelClass;
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

            // Clear form and remove listeners
            clearForm: function () {
                $($this.currentForm)[0].reset();
                $this.removeErrorListeners();
            },

            // Validate for empty data
            isEmpty: function (value) {
                return !Boolean(value);
            }
        }

    });

}(jQuery));