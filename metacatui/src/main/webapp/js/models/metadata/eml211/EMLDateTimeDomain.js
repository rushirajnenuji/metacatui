define(["jquery", "underscore", "backbone",
        "models/DataONEObject"],
    function($, _, Backbone, DataONEObject) {

        /*
         * EMLDateTimeDomain represents the measurement scale of a date/time
         * attribute.
         *
         * @see https://github.com/NCEAS/eml/blob/master/eml-attribute.xsd
         */
        var EMLDateTimeDomain = Backbone.Model.extend({

            /* Attributes of an EMLDateTimeDomain object */
            el: "dateTime",

            defaults: {

                /* Attributes from EML */
                xmlID: null, // The XML id of the attribute
                formatString: null, // Required format string (e.g. YYYY)
                dateTimePrecision: null, // The precision of the date time value
                dateTimeDomain: null, // Zero or more bounds, or a references object
                /* Attributes not from EML */
                parentModel: null, // The parent model this attribute belongs to
                objectXML: null, // The serialized XML of this EML measurement scale
                objectDOM: null  // The DOM of this EML measurement scale
            },

            /*
             * The map of lower case to camel case node names
             * needed to deal with parsing issues with $.parseHTML().
             * Use this until we can figure out issues with $.parseXML().
             */
            nodeNameMap: {
                "datetime": "dateTime",
                "formatstring": "formatString",
                "datetimeprecision": "dateTimePrecision",
                "datetimedomain": "dateTimeDomain"
            },

            /* Initialize an EMLDateTimeDomain object */
            initialize: function(attributes, options) {

                this.on(
                    "change:formatString " +
                    "change:dateTimePrecision " +
                    "change:dateTimeDomain",
                    this.trickleUpChange);
            },

            /*
             * Parse the incoming measurementScale's XML elements
             */
            parse: function(attributes, options) {
                var $objectDOM;

                $objectDOM = $(attributes.objectDOM);

                // Add the XML id
                if ( $objectDOM.attr("id") ) {
                    attributes.xmlID = $objectDOM.attr("id");
                }

                // Add the formatString
                attributes.formatString = $objectDOM.children("formatString");

                // Add the dateTimePrecision
                attributes.dateTimePrecision = $objectDOM.children("dateTimePrecision");

                // Add in the dateTimeDomain
                var dateTimeDomain = $objectDOM.children("dateTimeDomain");
                if ( dateTimeDomain.length ) {
                    attributes.dateTimeDomain = this.parseDateTimeDomain(dateTimeDomain);

                }
                return attributes;
            },

            parseDateTimeDomain: function(dateTimeDomainXML) {
                var domain = {
                    bounds: []
                }
                var bounds = $(dateTimeDomainXML).find("bounds");

                // bounds.each(function())

                return domain;
            },

            /* Serialize the model to XML */
            serialize: function() {
                var objectDOM = this.updateDOM();
                var xmlString = objectDOM.outerHTML;

                // Camel-case the XML
                xmlString = this.formatXML(xmlString);

                return xmlString;
            },

            /* Copy the original XML DOM and update it with new values from the model */
            updateDOM: function() {
                var objectDOM;

                if ( this.get("objectDOM") ) {
                    objectDOM = this.get("objectDOM").cloneNode(true);
                } else {
                    objectDOM = document.createElement(this.el);
                }

                // TODO: Populate the DOM with model values
            },

            formatXML: function(xmlString){
                return DataONEObject.prototype.formatXML.call(this, xmlString);
            },

            /**/
            getEMLPosition: function(objectDOM, nodeName) {
                var nodeOrder = ["formatString", "dateTimePrecision", "dateTimeDomain"];

                var position = _.indexOf(nodeOrder, nodeName);

                // Append to the bottom if not found
                if ( position == -1 ) {
                    return $(objectDOM).children().last();
                }

                // Otherwise, go through each node in the node list and find the
                // position where this node will be inserted after
                for ( var i = position - 1; i >= 0; i-- ) {
                    if ( $(objectDOM).find(nodeOrder[i]).length ) {
                        return $(objectDOM).find(nodeOrder[i].last());
                    }
                }
            },

            /* Let the top level package know of attribute changes from this object */
            trickleUpChange: function(){
                MetacatUI.rootDataPackage.packageModel.set("changed", true);
            },

        });

        return EMLDateTimeDomain;
    }
);
