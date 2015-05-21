/**
 * This module creates and append the new elements create for new tabs
 *
 */
miniumDeveloper.factory('TabFactory', function($http, $q) {
    //settings
    var tabFactory = {
        height: '700',
    };

    tabFactory.createTab = function(tabUniqueId, fileProps) {
        var fileName = fileProps.name || "console";

        var tabsElement = $('#tabs');
        var tabsUlElement = tabsElement.find('ul');

        if (fileProps === "") {
            var newTabNavElement = $('<li id="panel_nav_' + tabUniqueId + '" data-id="' + tabUniqueId + '"><a href="#panel_' + tabUniqueId + '" title="' + fileProps.relativeUri + '" name="' + fileName + '">' + fileName + '<span id="save_' + tabUniqueId + '" class="hide">*</span></a> </li>');
        } else {
            // create a navigation bar item for the new panel
            var newTabNavElement = $('<li id="panel_nav_' + tabUniqueId + '" data-id="' + tabUniqueId + '"><a href="#panel_' + tabUniqueId + '" title="' + fileProps.relativeUri + '" name="' + fileName + '">' + fileName + '<span id="save_' + tabUniqueId + '" class="hide">*</span></a> <span class="ui-icon ui-icon-close close-tab" ></span></li>');
        }

        // add the new nav item to the DOM
        tabsUlElement.append(newTabNavElement);

        // create a new panel DOM
        var newTabPanelElement = $('<div id="panel_' + tabUniqueId + '" data-tab-id="' + tabUniqueId + '"></div>');

        tabsElement.append(newTabPanelElement);

        // refresh the tabs widget
        tabsElement.tabs('refresh');

        var tabIndex = $('#tabs ul li').index($('#panel_nav_' + tabUniqueId));

        // activate the new panel
        tabsElement.tabs('option', 'active', tabIndex);

        // create the editor dom
        var newEditorElement = $('<div id="editor_' + tabUniqueId + '"></div>');

        newTabPanelElement.append(newEditorElement);

        // set the size of the panel
        // newTabPanelElement.width('600');
        // newTabPanelElement.height('600');

        // // set the size of the editor
        // newEditorElement.width('1180');
        newEditorElement.height(this.height);
    };

    return tabFactory;

});
