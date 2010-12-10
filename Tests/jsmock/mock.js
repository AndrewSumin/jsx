/*
 * Copyright 2004 ThoughtWorks, Inc
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

// A simple mock library for Javascript
//
// Original code by Aslak Hellesoy and Ji Wang

function Mock() {
    this.expectedInvocations = [];
    this.registredInvocations = [];
    this.expectedArgs = [];
    this.registeredArgs = [];
    this.returnValues = {};
    this.attrs = [];
    this.expectedProperties = {};

    this.expects = function() {
        var functionName = arguments[0];

        var expectedArgs = [];
        for(var i = 1; i < arguments.length; i++)
            expectedArgs[i-1] = arguments[i];

        return this._registerExpectation(functionName, expectedArgs);
    };

    this.doesNotExpect = function(functionName) {
        this._registerFunction(functionName);
    };

    this.expectsProperty = function() {
        var propertyName = arguments[0];
        if(arguments.length == 2) {
            this.expectedProperties[propertyName] = arguments[1];
            this.attrs[this.attrs.length] = "dummy";
            return false;
        }
        return new PropertySetter(this, propertyName);
    };

    this.verify = function () {
        // loop over all expected invocations and see if they were called

        for(var functionName in this.expectedInvocations)
          this._verifyFunction(functionName);

        var currentAttrs = [];
        var currentAttrCount = 0;

    };

    var attrCount = 0;
    for(var attr in this) {
        this.attrs[attrCount] = attr;
        attrCount++;
    }
};

Mock.prototype = {
  _registerExpectation: function (functionName, expectedArgs) {
    this._registerFunction(functionName);

    var callNumber = this.expectedInvocations[functionName]++;

    this.expectedArgs[functionName][callNumber] = [];
    for(var i = 0; i < expectedArgs.length; i++)
      this.expectedArgs[functionName][callNumber][i] = expectedArgs[i];

    this.attrs[this.attrs.length] = "dummy";

    return new Returner(this, functionName, callNumber);
  },

  _registerFunction: function (functionName) {
    if (!this.expectedInvocations[functionName]) {
      this.expectedInvocations[functionName] = 0;
      this.registredInvocations[functionName] = 0;
      this.expectedArgs[functionName] = [];
      this.registeredArgs[functionName] = [];
      eval(this._getNewFunctionCode(functionName));
    }
  },

  _verifyFunction: function(functionName)
  {

    var expectedInvocationsCount = this.expectedArgs[functionName].length;
    var registredInvocationsCount = this.registeredArgs[functionName].length;
    assertEquals("It was expected " + expectedInvocationsCount + " call of "+ functionName + " but was " +
                 registredInvocationsCount,
                 expectedInvocationsCount, registredInvocationsCount);

    for(var callNumber in this.expectedArgs[functionName])
      this._verifyFunctionCall(functionName, callNumber);
  },

  _verifyFunctionCall: function(functionName, callNumber)
  {
    var expectedParamsCount = this.expectedArgs[functionName][callNumber].length;
    var registeredParamsCount = this.registeredArgs[functionName][callNumber].length;

    assertEquals("It was expected " + expectedParamsCount + " parameters of "+ functionName +"#"+callNumber +
                 " but was "+ registeredParamsCount,
                 expectedParamsCount, registeredParamsCount);

    for(var paramNumber in this.expectedArgs[functionName][callNumber])
      this._verifyFunctionArg(functionName, callNumber, paramNumber);
  },

  _verifyFunctionArg: function(functionName, callNumber, paramNumber)
  {
    var expectedArg =this.expectedArgs[functionName][callNumber][paramNumber];
    var registeredArg = this.registeredArgs[functionName][callNumber][paramNumber];
    assertEquals("parameter #" + paramNumber + " of "+ functionName +"#"+callNumber+ " expected to be " +
                 expectedArg + " but was " + registeredArg,
                 expectedArg, registeredArg);
  },

  _getNewFunctionCode: function(functionName)
  {
    return "this." + functionName + " = function () {\n" +
      "  var callNumber = this.registredInvocations[\"" + functionName + "\"]++;" +
      "  this.expectedInvocations[\"" + functionName + "\"][callNumber] --;\n" +
      "  this.registeredArgs[\"" + functionName + "\"][callNumber] = []; \n" +
      "  for(var i = 0; i < arguments.length; i++) \n" +
      "    this.registeredArgs[\"" + functionName + "\"][callNumber][i] = arguments[i];\n" +
      "  var returnValue; \n" +
      "  if (this.returnValues[\"" + functionName + "\"])\n" +
      "     returnValue = this.returnValues[\"" + functionName + "\"][callNumber];\n" +
      "  if (returnValue && returnValue.isMockError) { throw returnValue };\n" +
      "  return returnValue;\n" +
      "}";
  }
};

function Returner(mock, functionName, callNumber) {
    this.mock = mock;
    this.functionName = functionName;
    this.callNumber = callNumber;
};

Returner.prototype = {
  returns: function (returnValue)
  {
    if (!this.mock.returnValues[this.functionName])
      this.mock.returnValues[this.functionName] = [];
    this.mock.returnValues[this.functionName][this.callNumber] = returnValue;
  },

  andThrows: function (message)
  {
    var error = new Error(message);
    error.isMockError = true;
    return this.returns(error);
  }
}

function PropertySetter(mock, propertyName) {
    this.mock = mock;
    this.propertyName = propertyName;
};

PropertySetter.prototype = {
  returns: function(returnValue)
  {
    var ref = new Object();
    ref.value = returnValue;
    eval("this.mock." + this.propertyName + "=ref.value");
  }
}
