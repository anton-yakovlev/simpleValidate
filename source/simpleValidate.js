// jQuery validation plugin

;(function ($) {
    var defaults = {
        errorInputClass: 'error',
        errorLabelClass: 'label-error',
        errorLabelLeftClass: 'label-error_left',
        emptyMessage: 'Заполните поле',
        serverErrorMessage: 'Ошибка сервера, попробуйте еще раз',
        serverSuccessMessage: 'Все круто. Данные отправились на сервер!',
        serverErrorDataMessage: 'Вы ввели не верные данные'
    };

    function Validate(element, options) {
        this.settings = $.extend({}, defaults, options);
        this.element = element;
        this.init();
    }

    Validate.prototype.init = function () {
        console.log('[ Start Validate Module ... ]');

        var form = $(this.element),
            settings = this.settings,
            errors = [];

        _addListeners(form);

        function _addListeners(form) {
            $(document).on('submit', form, function (e) {
                e.preventDefault();

                if (!_sendData(form)) _addErrorListeners(form);
            });
        }

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

        function _removeErrorListeners(form) {
            var formInputs = form.find('input, textarea').not('input[type="file"], input[type="hidden"]');

            for (var i = 0; i < formInputs.length; i++) {
                var currentItemId = '#' + $(formInputs[i]).attr('id');
                $(document).off('keyup', currentItemId);
            }
        }

        function _sendData(form) {
            var serverUrl = form.attr('data-url'),
                serverAnswer = _ajaxForm(form, serverUrl);

            if (serverAnswer) {
                serverAnswer.done(function (answer) {
                    answer.status === 'success' ? _createModal('success', settings.serverSuccessMessage) : _createModal('error-data', settings.serverErrorDataMessage);
                });

                _clearForm(form);
            }

            return serverAnswer;
        }

        function _validation(form) {
            var formInputs = form.find('input, textarea').not('input[type="file"], input[type="hidden"]'),
                valid = true;

            if (!_checkEvery(formInputs)) valid = false;

            return valid;
        }

        function _checkCurrent(selector) {
            var valid = !_isEmpty(selector.val());
            valid ? _doValid(selector) : _doInvalid(selector);
            return valid;
        }

        function _checkEvery(selectors) {
            var valid = true;

            for (var i = 0; i < selectors.length; i++) {
                if (!_checkCurrent($(selectors[i]))) valid = false;
            }

            return valid;
        }

        function _isEmpty(value) {
            return !Boolean(value);
        }

        function _doValid(selector) {
            var itemId = selector.attr('id'),
                errorLabelId = selector.attr('name') + '-error',
                index;

            selector.removeClass(settings.errorInputClass);
            index = $.inArray(itemId, errors);
            errors.splice(index, 1);
            $('#' + errorLabelId).remove();
        }

        function _doInvalid(selector) {
            var itemId = selector.attr('id'),
                errorLabelId = selector.attr('name') + '-error',
                errorLabelLeft = selector.attr('data-error-left'),
                errorLabelLeftClass = selector.attr('data-error-left-class'),
                errorLabelMessage = selector.attr('data-empty-error'),
                errorLabelClasses;

            selector.addClass(settings.errorInputClass);
            errors.push(itemId);

            if ($('#' + errorLabelId).length === 0) {
                $('<label>', {
                    id: errorLabelId,
                    text: function () {
                        return errorLabelMessage ? errorLabelMessage : settings.emptyMessage;
                    },
                    'for': itemId,
                    'class': (function () {
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

        function _clearForm(form) {
            form[0].reset();
            _removeErrorListeners(form);
        }

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

        function _ajaxForm(form, url) {
            if (!_validation(form)) return false;

            var data = form.serialize(),
                result;

            result = $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    data: data
                })
                .fail(function () {
                    _createModal('server-error', settings.serverErrorMessage);
                });

            return result;
        }
    };

    $.fn.validate = function (options) {
        new Validate(this, options);
        return this
    }

}(jQuery));