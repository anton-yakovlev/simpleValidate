// jQuery validation plugin

;(function ($) {
    var defaults = {
      errorInputClass: 'error',
      errorLabelClass: 'label-error',
      emptyMessage: 'Заполните поле'
    };

    function Validate(element, options){
      this.settings = $.extend({}, defaults, options);
      this.element = element;
      this.init();
    }

    Validate.prototype.init = function(){
      console.log('[ Start Validate Module ... ]');

      var form = this.element,
          formInputs = form.find('input, textarea'),
          errors = [],
          settings = this.settings,
          serverUrl = form.attr('data-url');

        form.on('submit', function(e){
          e.preventDefault();

          _checkEvery(formInputs);
          _addListeners(formInputs);
          _sendData();
        });

        function _addListeners(selectors){
          if (selectors) {
            
            for (var i = 0; i < selectors.length; i++) {
              var currentItem = $(selectors[i]);

              (function(ci) {
                  currentItem.on('keyup', function(){
                    _checkCurrent(ci);
                  });
              })(currentItem);
            
            }

          }
        }

        function _checkCurrent(selector){
            var valid = !_isEmpty(selector.val());
            valid ? _doValid(selector) : _doInvalid(selector);
        }

        function _checkEvery(selectors){
          if (selectors) {
            errors = [];

            for (var i = 0; i< selectors.length; i++) {
              var currentInput = $(selectors[i]);
              _checkCurrent(currentInput);
            }
          }
        }

        function _isEmpty(value){
          return !Boolean(value);
        }

        function _doValid(selector){
          var itemId = selector.attr('id'),
              errorLabelId = selector.attr('name') + '-error',
              index;

          selector.removeClass(settings.errorInputClass);
          index = $.inArray(itemId, errors);
          errors.splice(index, 1);
          $('#' + errorLabelId).remove();
        }

        function _doInvalid(selector){
          var itemId = selector.attr('id'),
              errorLabelId = selector.attr('name') + '-error',
              errorLabelMessage = selector.attr('data-empty-error');

          selector.addClass(settings.errorInputClass);
          errors.push(itemId);

          if ( $('#' + errorLabelId).length === 0 ){
            $('<label>', {
              id: errorLabelId,
              text: function(){
                return errorLabelMessage ? errorLabelMessage : settings.emptyMessage
              },
              'for': itemId,
              'class': settings.errorLabelClass
            }).insertAfter(selector);
          }
        }

        function _clearForm(form){
          form[0].reset();
        }

        function _createModal(status){
          var messageHtml;

          if (status === 'fail') {
            messageHtml = $('<div/>', {
              'class': 'modal',
              id: 'errorMessage',
              html: 'Ошибка сервера, попробуйте еще раз'
            });
          } else if (status === 'success'){
            messageHtml = $('<div/>', {
              'class': 'modal',
              id: 'successMessage',
              html: 'Все круто. Даннын отправились на сервер!'
            });
          }

          messageHtml
          .appendTo('body')
          .bPopup({
            transition: 'slideDown'
          });
        }

        function _sendData(){
          if (errors.length) {
            console.log('You have arrors');
          } else {
            $.ajax({
              url: serverUrl,
              type: 'POST',
              contentType: 'application/json; charset-utf-8',
              dataType: 'json',
              data: form.serialize()
            })
            .done(function() {
              console.log("success");
            })
            .fail(_createModal('fail'))
            .always(function() {
              console.log("complete");
            });
          }
        }
    };

    $.fn.validate = function (options) {
      new Validate(this.first(), options);
      return this.first();
    };

}(jQuery));