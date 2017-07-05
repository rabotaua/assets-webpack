/* https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.js */

/* Call me once, override defaults */
(function ($) {
    $.extend($.ui.dialog.prototype.options, {
        appendTo: 'form',
        dialogClass: 'f-paper fd-p30 f-modal',
        autoOpen: false,
        closeOnEscape: true,
        draggable: false,
        modal: true,
        resizable: false
    })

    let originalDialogTitleMethod = $.ui.dialog.prototype._title
    let originalDialogCreateOverlayMethod = $.ui.dialog.prototype._createOverlay
    $.widget('ui.dialog', $.extend({}, $.ui.dialog.prototype, {
        _title: function(/*title*/) {
            originalDialogTitleMethod.apply(this, arguments)
            this.element.closest('.ui-dialog').addClass('f-paper fd-p30 f-modal') // classes defined in old dialogs overwrite our desired
            this.element.closest('.ui-dialog').addClass(this.options.title ? 'f-modal--with-title' : 'f-modal--without-title')
            this.element.closest('.ui-dialog').find('button.ui-dialog-titlebar-close .ui-icon').addClass('fi-close-big')
        },
        _createOverlay: function() {
            originalDialogCreateOverlayMethod.apply(this, arguments)
            let self = this
            this.overlay.on('click', function () {
                self.close()
            })
        }
    }));
})(jQuery)