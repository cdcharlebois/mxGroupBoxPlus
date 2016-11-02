/*global logger*/
/*
    GroupBoxPlus
    ========================

    @file      : GroupBoxPlus.js
    @version   : 1.0.0
    @author    : Conner Charlebois
    @date      : 9/28/2016
    @copyright : Mendix 2016
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    // "mxui/dom",
    // "dojo/dom",
    // "dojo/dom-prop",
    // "dojo/dom-geometry",
    // "dojo/dom-class",
    // "dojo/dom-style",
    // "dojo/dom-construct",
    // "dojo/_base/array",
    // "dojo/_base/lang",
    "dojo/text",
    // "dojo/html",
    // "dojo/_base/event",

    "GroupBoxPlus/lib/jquery-1.11.2",
    "dojo/text!GroupBoxPlus/widget/template/GroupBoxPlus.html"
], function(declare,
    _WidgetBase,
    _TemplatedMixin,
    // dom,
    // dojoDom,
    // dojoProp,
    // dojoGeometry,
    // dojoClass,
    // dojoStyle,
    // dojoConstruct,
    // dojoArray,
    // dojoLang,
    dojoText,
    // dojoHtml,
    // dojoEvent,
    _jQuery,
    widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare("GroupBoxPlus.widget.GroupBoxPlus", [_WidgetBase, _TemplatedMixin], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        target: null,

        // Parameters configured in the Modeler.
        roleMaps: {},
        isNonCollapsible: null,
        mfStartOpen: null,

        // globals
        CLASS_OPEN: 'glyphicon-minus glyphicon mx-groupbox-collapse-icon',
        CLASS_CLOSED: 'glyphicon-plus glyphicon mx-groupbox-collapse-icon',

        _contextObj: null,
        _alreadySet: false,

        update: function(obj, cb){
          // if there's context, set it
          if (obj){
            this._contextObj = obj
          }
          // if this is a context *update*
          if (!this._alreadySet) {
            // determine what method to use to set the initial state of the GB
            if (this.mfStartOpen != '' && this._contextObj) {
                // use microflow
                this._setInitialStateFromMF(this.mfStartOpen)
                this._alreadySet = true
            } else if (this.roleMaps.length > 0) {
                // use roles
                this._setInitialStateFromRoles()
                this._alreadySet = true
            }
            // only add listeners if groupbox is collapsible
            var nodes = this._getViewNodes()
            if (nodes.header.parent().hasClass('mx-groupbox-collapsible'))
              this._setupListeners();
          }
          cb();
        },

        _setInitialStateFromRoles: function() {
            // use the user roles to determine if it should start open
            var thisUserRoles = this._getCurrentUserRoles(),
                mappedRoles = this.roleMaps,
                self = this,
                roleIsMapped = false,
                shouldBeOpen = false
                // does the widget specify a behavior for this user's role?
                // is the user in a role where it should be opened?
            mappedRoles.forEach(function(mappedRole) {
                thisUserRoles.forEach(function(myRole) {
                    if (mappedRole.role == myRole) roleIsMapped = true
                    if (mappedRole.role == myRole && mappedRole.view) shouldBeOpen = true
                })
            })
            if (roleIsMapped) {
                this._setViewState(shouldBeOpen)
            }

        },
        _setInitialStateFromMF: function(mfName) {
            // console.log('Executing: ' + mfName)
                // debugger;
            var self = this
            mx.data.action({
                params: {
                    actionname: mfName,
                    applyto: 'selection',
                    guids:[self._contextObj.getGuid()]
                },
                callback: function(res) {
                  self._setViewState(res)
                },
                error: function(err) {
                    ret = err
                }
            }, this)

        },
        _setupListeners: function() {
            var element = this.target.parentElement.parentElement.previousSibling

            //clone the node to remove the event listeners
            var clone = element.cloneNode();
            while (element.firstChild) {
                clone.appendChild(element.lastChild);
            }
            element.parentNode.replaceChild(clone, element);

            // gather nodes
            var self  = this
            ,   nodes = this._getViewNodes()


            // setup
            nodes.header.on('click', function() {
                if (nodes.body.css('display') == 'none') {
                    nodes.body.slideDown(function() {
                        nodes.icon.attr('class', self.CLASS_OPEN)
                    });
                } else {
                    nodes.body.slideUp(function() {
                        nodes.icon.attr('class', self.CLASS_CLOSED)
                    });
                }
            })
        },
        _getCurrentUserRoles: function() {
            var userRoles, numberOfRoles
            if (mx && mx.session && mx.session.getUserRoles && typeof mx.session.getUserRoles == "function") {
                userRoles = mx.session.getUserRoles()
            }
            return userRoles.map(function(r) {
                return (r && r.jsonData && r.jsonData.attributes && r.jsonData.attributes.Name && r.jsonData.attributes.Name.value ? r.jsonData.attributes.Name.value : "")
            })
        },
        _setViewState: function(open){
          var self  = this
          ,   nodes = this._getViewNodes()
          if (open) {
              // open it
              nodes.body.css('display', 'block')
              nodes.icon.attr('class', self.CLASS_OPEN)
          } else {
              // close it
              nodes.body.css('display', 'none')
              nodes.icon.attr('class', self.CLASS_CLOSED)
          }
        },
        _getViewNodes: function(){
          var $gbBody   = $(this.target.parentElement.parentElement),
              $gbHeader = $gbBody.prev(),
              $gbIcon   = $gbHeader.find('i');

          return {
            body   : $gbBody,
            header : $gbHeader,
            icon   : $gbIcon
          }
        }

    });
});

require(["GroupBoxPlus/widget/GroupBoxPlus"]);
