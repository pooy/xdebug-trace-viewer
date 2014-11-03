define(['jquery', 'utils'], function($, utils) {
    var api = {};

    function drawCallHierarchy(node, idPrefix, level)
    {
        level = level || 0;
        var list = '';
        var basename = /^.*\//;
        for (var i in node) {
            list += '<div>';
            var id = idPrefix + utils.hashCode(node[i].file + ':' + node[i].line);
            var href = '/trace/view/?trace=' + encodeURIComponent(utils.queryParam.trace) +
                '&file=' + encodeURIComponent(node[i].file) +
                '#line' + encodeURIComponent(node[i].line);
            var children = utils.count(node[i].children);
            list +=
                '<div>' +
                    (children ? '<span id="' + id + '" class="toggler store glyphicon ' + (children == 1 ? 'glyphicon-minus' : 'glyphicon-plus') + '"></span>' : '') +
                    '<a href="' + href + '" title="' + node[i].file + '">' + node[i].file.replace(basename, '') + ':' + node[i].line + '</a> ' + node[i].function +
                    '</div>';
            if (children) {
                list += '<div class="sub-list' + (children == 1 ? ' open' : '') + '">';
                list += drawCallHierarchy(node[i].children, idPrefix, level + 1);
                list += '</div>';
            }
            list += '</div>';
        }
        return list;
    }

    api.TraceLevelUp = function(request)
    {
        $.getJSON('/trace/level-up', request, function(data) {
            var idPrefix = utils.hashCode(request.file + ':' + request.line);
            $('<div title="One level up">' +
                '<div class="pre">' + drawCallHierarchy(data, idPrefix) + '</div>' +
                '</div>')
                .dialog({width: '90%'})
                .find('.toggler').each(function() {
                    var self = $(this);
                    if (window.localStorage.getItem(self.attr('id')) == 1) {
                        self.parent().parent().children('.sub-list').addClass('open');
                        self.removeClass('glyphicon-plus').addClass('glyphicon-minus');
                    }
                });
        });
    };

    api.TraceLevelDown = function(request)
    {
        $.getJSON('/trace/level-down', request, function(data) {
            var idPrefix = utils.hashCode(request.file + ':' + request.line);
            $('<div title="One level down">' +
                '<div class="pre">' + drawCallHierarchy(data, idPrefix) + '</div>' +
                '</div>')
                .dialog({width: '90%'})
                .find('.toggler').each(function() {
                    var self = $(this);
                    if (window.localStorage.getItem(self.attr('id')) == 1) {
                        self.parent().parent().children('.sub-list').addClass('open');
                        self.removeClass('glyphicon-plus').addClass('glyphicon-minus');
                    }
                });
        });
    };

    api.TraceCallTree = function(request)
    {
        $.getJSON('/trace/call-tree', request, function(data) {
            var idPrefix = utils.hashCode(request.file + ':' + request.line);
            $('<div title="Here is call hierarchy leading to selected line of code">' +
                '<div class="pre">' + drawCallHierarchy(data, idPrefix) + '</div>' +
                '</div>')
                .dialog({width: '90%'})
                .find('.toggler').each(function() {
                    var self = $(this);
                    if (window.localStorage.getItem(self.attr('id')) == 1) {
                        self.parent().parent().children('.sub-list').addClass('open');
                        self.removeClass('glyphicon-plus').addClass('glyphicon-minus');
                    }
                });
        });
    };

    return api;
});