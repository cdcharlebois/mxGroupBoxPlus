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

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "GroupBoxPlus/lib/jquery-1.11.2",
    "dojo/text!GroupBoxPlus/widget/template/GroupBoxPlus.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, _jQuery, widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare("GroupBoxPlus.widget.GroupBoxPlus", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements

        target:null,

        // Parameters configured in the Modeler.
        roleMaps: {},
        isNonCollapsible: null,
        gbColor: null,

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,
        _readOnly: false,
        _numberOfRoles: 0,
        _myRoles: null,
        _useDefaultBehavior: true,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            // user role is mx.session.getUserRoles()[0].jsonData.attributes.Name.value
            if (mx && mx.session && mx.session.getUserRoles && typeof mx.session.getUserRoles == "function") {
                this._myRoles = mx.session.getUserRoles()
                this.numberOfRoles = this._myRoles.length || 0
            }

            var self = this
            this._myRoles.forEach(function(mr) {
                self.roleMaps.forEach(function(rm) {
                    if(     self.isNonCollapsible             == false
                       &&   mr.jsonData.attributes.Name.value == rm.role) self._useDefaultBehavior = false
                })
            })

            if (this.isNonCollapsible != true) {
                if (    this._useDefaultBehavior == false
                    &&  this.roleMaps.length     >  0) {
                    this._setInitialState();
                }
                this._setupListeners();
            }

            if (this.gbColor != null) {
                this._setGbColor();
            }
        },

        _setInitialState: function(){
            // user has some roles
            this._myRoles = this._myRoles.map(function(r){
              return (r && r.jsonData && r.jsonData.attributes && r.jsonData.attributes.Name && r.jsonData.attributes.Name.value ? r.jsonData.attributes.Name.value : "")
            })

            //names has the array of all the names of the user's role
            var startOpen = false
            ,   rolesToOpen = this.roleMaps.filter(function(r){return r.view})

            var self = this
            // is the user in a role where it should be opened?
            rolesToOpen.forEach(function(rto){
              self._myRoles.forEach(function(mr){
                if (rto.role == mr) startOpen = true
              })
            })

            // gather nodes
            var $gbBody = $(this.target.parentElement.parentElement)
            ,   $gbHeader = $gbBody.prev()
            ,   $gbIcon = $gbHeader.find('i')
            ,   clsOpen = 'glyphicon-minus glyphicon mx-groupbox-collapse-icon'
            ,   clsClosed = 'glyphicon-plus glyphicon mx-groupbox-collapse-icon'

            if (startOpen){
              // open it
              $gbBody.css('display', 'block')
              $gbIcon.attr('class', clsOpen)
            } else {
              // close it
              $gbBody.css('display', 'none')
              $gbIcon.attr('class', clsClosed)
            }
        },

        _setupListeners: function(){
          var element = this.target.parentElement.parentElement.previousSibling

          //clone the node to remove the event listeners
          var clone = element.cloneNode();
          while (element.firstChild) {
            clone.appendChild(element.lastChild);
          }
          element.parentNode.replaceChild(clone, element);

          // gather nodes
          var $gbBody = $(this.target.parentElement.parentElement)
          ,   $gbHeader = $gbBody.prev()
          ,   $gbIcon = $gbHeader.find('i')
          ,   clsOpen = 'glyphicon-minus glyphicon mx-groupbox-collapse-icon'
          ,   clsClosed = 'glyphicon-plus glyphicon mx-groupbox-collapse-icon'

          // setup
          $gbHeader.on('click', function(){
            if ($gbBody.css('display') == 'none'){
              $gbBody.slideDown(function(){
                  $gbIcon.attr('class', clsOpen)
              });
            }
            else {
              $gbBody.slideUp(function(){
                  $gbIcon.attr('class', clsClosed)
              });
            }
          })
        },

        // MC: Update header and border color
        _setGbColor: function() {
            // gather nodes
            var $gbBody = $(this.target.parentElement.parentElement)
            ,   $gbHeader = $gbBody.prev()

            $gbHeader.css('background-color', this.gbColor)
            $gbHeader.css('border-color', this.gbColor)
            $gbBody.css('border-color', this.gbColor)
        },
    });
});

require(["GroupBoxPlus/widget/GroupBoxPlus"]);
