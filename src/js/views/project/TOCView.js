define(["jquery",
    "underscore",
    "Backbone",
    "text!templates/project/projectTOC.html"], function($, _, Backbone, ProjectTOCTemplate){

    /* The Table of Contents View is the area on the left-hand side of the project's page
     * that will allow a user to navigate within the current tab of the project page.
     */
    var ProjectTOCView = Backbone.View.extend({

        /* The Project TOC Element */
        el: "#ProjectTOC",

        /* TODO: Decide if we need this */
        type: "ProjectTOC",

        /* Renders the compiled template into HTML */
        template: _.template(ProjectTOCTemplate),

        /* The events that this view listens to */
        events: {

        },

        /* Construct a new instance of ProjectTOCView */
        initialize: function() {

        },

        /* Render the view */
        render: function() {

        },

        /* Close and destroy the view */
        onClose: function() {

        }

    });

    return ProjectTOCView;
});
