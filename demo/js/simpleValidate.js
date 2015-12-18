// jQuery validation plugin by Anton Yakovlev

;(function ($) {

    // -------- Public methods -------- //
    var defaults = {
        errorInputClass: 'error', // Class for invalid input
        errorLabelClass: 'label-error', // Class for generated label, if input is invalid
        errorLabelLeftClass: 'label-error_left', // Class for generated label with left position, if input is invalid
        emptyMessage: 'Заполните поле', // Default message in tooltip
        serverErrorMessage: 'Ошибка сервера, попробуйте еще раз', // Server error message if ajax failed
        serverSuccessMessage: 'Все круто. Данные отправились на сервер!', // Server message if ajax succeed
        serverErrorDataMessage: 'Вы ввели не верные данные' // Server error message if data invalid
    };


    // -------- Module constructor -------- //
    function Validate(element, options) {
        this.settings = $.extend({}, defaults, options);
        this.element = element;
        this.init();
    }


    // -------- Module init -------- //
    Validate.prototype.init = function () {
        console.log('[ Start Validate Module ... ]');

        var formElement = $(this.element),
            settings = this.settings;

        _addListeners();


        // -------- Listeners -------- //
        // General listeners
        function _addListeners() {
            $(document).on('submit', formElement, function (e) {
                e.preventDefault();

                // Validate form
                var valid = _validation(formElement);

                // Send data to server if valid else and show errors
                valid ? _sendData(formElement) : _addErrorListeners(formElement);
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


        // -------- Send data to server -------- //
        // Send data to server
        function _sendData(form) {
            var data = form.serialize(),
                serverUrl = form.attr('data-url'),
                defObj;

            // Ajax request to server
            defObj = $.ajax({
                    url: serverUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: data
                });

            defObj
                .fail(function () {
                    _createModal('server-error', settings.serverErrorMessage);
                })
                .done(function (answer) {
                    //Show modals depend on result
                    answer.status === 'success' ?
                        _createModal('success', settings.serverSuccessMessage) :
                        _createModal('error-data', settings.serverErrorDataMessage);

                    // Clear form
                    _clearForm(form);
                });

            return defObj;
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

        // Check one input
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


        // -------- Modals -------- //
        function _createModal(status, message) {
            var modalHeaderHtml = '<div class="modal__header"><div class="b-close modal__close">Close</div> </div>',
                messageHtml = $('<div/>', {
                    'class': (function () {
                        return 'modal modal-' + status;
                    })(),
                    html: function () {
                        return modalHeaderHtml + '<div class="modal__body">' + message + '</div>';
                    }
                })
                ;

            messageHtml
                .appendTo('body')
                .bPopup({
                    transition: 'slideDown'
                });
        }
    };

    $.fn.validate = function (options) {
        new Validate(this, options);
        return this
    }

}(jQuery));