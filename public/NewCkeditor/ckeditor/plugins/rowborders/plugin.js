CKEDITOR.plugins.add('rowborders', {
    requires: 'richcombo',
    init: function (editor) {
        var config = editor.config;

        // available border styles
        var borderOptions = {
            'none': 'No Border',
            'bottom': 'Bottom Border',
            'top': 'Top Border',
            'left': 'Left Border',
            'right': 'Right Border',
            'all': 'All Borders'
        };

        editor.ui.addRichCombo('RowBorders', {
            label: 'Row Borders',
            title: 'Row Borders',
            toolbar: 'insert,10',
            panel: {
                css: [CKEDITOR.skin.getPath('editor')].concat(config.contentsCss),
                multiSelect: false
            },

            init: function () {
                for (var value in borderOptions) {
                    this.add(value, borderOptions[value], borderOptions[value]);
                }
            },

            onClick: function (value) {
                var selection = editor.getSelection();
                var element = selection.getStartElement();
                if (!element) return;

                var tr = element.getAscendant('tr', true);
                if (!tr) return;

                // reset existing border styles
                var style = tr.getAttribute('style') || '';
                style = style.replace(/border[^;]+;?/g, '');

                switch (value) {
                    case 'none':
                        break;
                    case 'bottom':
                        style += 'border-bottom:1px solid black;';
                        break;
                    case 'top':
                        style += 'border-top:1px solid black;';
                        break;
                    case 'left':
                        style += 'border-left:1px solid black;';
                        break;
                    case 'right':
                        style += 'border-right:1px solid black;';
                        break;
                    case 'all':
                        style += 'border:1px solid black;';
                        break;
                }
                tr.setAttribute('style', style);
            }
        });
    }
});
