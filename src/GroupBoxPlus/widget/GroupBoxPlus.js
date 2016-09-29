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
        // inputNodes: null,
        // colorSelectNode: null,
        // colorInputNode: null,
        // infoTextNode: null,
        target:null,

        // Parameters configured in the Modeler.
        mfToExecute: "",
        // messageString: "",
        // backgroundColor: "",
        roleMaps: {},

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,
        _readOnly: false,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            ////// CONNER //////
            console.log(this.roleMaps)
            if (this.roleMaps.length > 0){
                this._setInitialState();
            }
            this._setupListeners();
        },

        _setInitialState: function(){
          // user role is mx.session.getUserRoles()[0].jsonData.attributes.Name.value
          var numberOfRoles = 0
          ,   roleName = ""
          ,   roles;
          if (mx && mx.session && mx.session.getUserRoles && typeof mx.session.getUserRoles == "function"){
            roles = mx.session.getUserRoles()
            numberOfRoles = roles.length || 0
          }
          if (numberOfRoles >= 1){
            // user has some roles
            var myRoles = roles.map(function(r){
              return (r && r.jsonData && r.jsonData.attributes && r.jsonData.attributes.Name && r.jsonData.attributes.Name.value ? r.jsonData.attributes.Name.value : "")
            })
            //names has the array of all the names of the user's role
            console.log("my roles...")
            console.log(myRoles)
            var startOpen = false
            ,   rolesToOpen = this.roleMaps.filter(function(r){return r.view})
            console.log("open for...")
            console.log(rolesToOpen)
            // is the user in a role where it should be opened?
            rolesToOpen.forEach(function(rto){
              myRoles.forEach(function(mr){
                // console.log(rto.role + " == " + mr)
                if (rto.role == mr) startOpen = true
              })
            })
            console.log(startOpen)

            if (startOpen){
              //TODO: open it
            } else {
              //TODO: close it
            }

          }
        },

        _setupListeners: function(){
          var element = this.target.parentElement.parentElement.previousSibling

          // clone the node to remove the event listeners
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
        }

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        // update: function (obj, callback) {
        //     logger.debug(this.id + ".update");
        //
        //     this._contextObj = obj;
        //     this._resetSubscriptions();
        //     this._updateRendering(callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
        // },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        // enable: function () {
        //   logger.debug(this.id + ".enable");
        // },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        // disable: function () {
        //   logger.debug(this.id + ".disable");
        // },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        // resize: function (box) {
        //   logger.debug(this.id + ".resize");
        // },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        // uninitialize: function () {
        //   logger.debug(this.id + ".uninitialize");
        //     // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        // },

        // // We want to stop events on a mobile device
        // _stopBubblingEventOnMobile: function (e) {
        //     logger.debug(this.id + "._stopBubblingEventOnMobile");
        //     if (typeof document.ontouchstart !== "undefined") {
        //         dojoEvent.stop(e);
        //     }
        // },

        // // Attach events to HTML dom elements
        // _setupEvents: function () {
        //     logger.debug(this.id + "._setupEvents");
        //     // this.connect(this.colorSelectNode, "change", function (e) {
        //     //     // Function from mendix object to set an attribute.
        //     //     this._contextObj.set(this.backgroundColor, this.colorSelectNode.value);
        //     // });
        //
        //     // this.connect(this.infoTextNode, "click", function (e) {
        //     //     // Only on mobile stop event bubbling!
        //     //     this._stopBubblingEventOnMobile(e);
        //     //
        //     //     // If a microflow has been set execute the microflow on a click.
        //     //     if (this.mfToExecute !== "") {
        //     //         mx.data.action({
        //     //             params: {
        //     //                 applyto: "selection",
        //     //                 actionname: this.mfToExecute,
        //     //                 guids: [ this._contextObj.getGuid() ]
        //     //             },
        //     //             store: {
        //     //                 caller: this.mxform
        //     //             },
        //     //             callback: function (obj) {
        //     //                 //TODO what to do when all is ok!
        //     //             },
        //     //             error: dojoLang.hitch(this, function (error) {
        //     //                 logger.error(this.id + ": An error occurred while executing microflow: " + error.description);
        //     //             })
        //     //         }, this);
        //     //     }
        //     // });
        // },

        // // Rerender the interface.
        // _updateRendering: function (callback) {
        //     logger.debug(this.id + "._updateRendering");
        //     // this.colorSelectNode.disabled = this._readOnly;
        //     // this.colorInputNode.disabled = this._readOnly;
        //
        //     // if (this._contextObj !== null) {
        //     //     dojoStyle.set(this.domNode, "display", "block");
        //     //
        //     //     var colorValue = this._contextObj.get(this.backgroundColor);
        //     //
        //     //     this.colorInputNode.value = colorValue;
        //     //     this.colorSelectNode.value = colorValue;
        //     //
        //     //     dojoHtml.set(this.infoTextNode, this.messageString);
        //     //     dojoStyle.set(this.infoTextNode, "background-color", colorValue);
        //     // } else {
        //     //     dojoStyle.set(this.domNode, "display", "none");
        //     // }
        //
        //     // Important to clear all validations!
        //     this._clearValidations();
        //
        //     // The callback, coming from update, needs to be executed, to let the page know it finished rendering
        //     mendix.lang.nullExec(callback);
        // },

        // // Handle validations.
        // _handleValidation: function (validations) {
        //     logger.debug(this.id + "._handleValidation");
        //     this._clearValidations();
        //
        //     // var validation = validations[0],
        //     //     message = validation.getReasonByAttribute(this.backgroundColor);
        //     //
        //     // if (this._readOnly) {
        //     //     validation.removeAttribute(this.backgroundColor);
        //     // } else if (message) {
        //     //     this._addValidation(message);
        //     //     validation.removeAttribute(this.backgroundColor);
        //     // }
        // },

        // // Clear validations.
        // _clearValidations: function () {
        //     logger.debug(this.id + "._clearValidations");
        //     dojoConstruct.destroy(this._alertDiv);
        //     this._alertDiv = null;
        // },

        // // Show an error message.
        // _showError: function (message) {
        //     logger.debug(this.id + "._showError");
        //     if (this._alertDiv !== null) {
        //         dojoHtml.set(this._alertDiv, message);
        //         return true;
        //     }
        //     this._alertDiv = dojoConstruct.create("div", {
        //         "class": "alert alert-danger",
        //         "innerHTML": message
        //     });
        //     dojoConstruct.place(this._alertDiv, this.domNode);
        // },

        // // Add a validation.
        // _addValidation: function (message) {
        //     logger.debug(this.id + "._addValidation");
        //     this._showError(message);
        // },

        // _unsubscribe: function () {
        //   if (this._handles) {
        //       dojoArray.forEach(this._handles, function (handle) {
        //           mx.data.unsubscribe(handle);
        //       });
        //       this._handles = [];
        //   }
        // },```

        // // Reset subscriptions.
        // _resetSubscriptions: function () {
        //     logger.debug(this.id + "._resetSubscriptions");
        //     // Release handles on previous object, if any.
        //     this._unsubscribe();
        //
        //     // When a mendix object exists create subscribtions.
        //     if (this._contextObj) {
        //         var objectHandle = mx.data.subscribe({
        //             guid: this._contextObj.getGuid(),
        //             callback: dojoLang.hitch(this, function (guid) {
        //                 this._updateRendering();
        //             })
        //         });
        //
        //         var attrHandle = mx.data.subscribe({
        //             guid: this._contextObj.getGuid(),
        //             attr: this.backgroundColor,
        //             callback: dojoLang.hitch(this, function (guid, attr, attrValue) {
        //                 this._updateRendering();
        //             })
        //         });
        //
        //         var validationHandle = mx.data.subscribe({
        //             guid: this._contextObj.getGuid(),
        //             val: true,
        //             callback: dojoLang.hitch(this, this._handleValidation)
        //         });
        //
        //         this._handles = [ objectHandle, attrHandle, validationHandle ];
        //     }
        // }
    });
});

require(["GroupBoxPlus/widget/GroupBoxPlus"]);
