# API For Form-Demo Connector
### Constructor
    StyleForm ( form, initialization, linkToDemoMethod )
form : The `<form>` element containing all `<input>` tags
initialization : setup JSON 

    {
    "property name" : {
        "type"  : "color-selector"||"range-number"||"checkbox-input"||"select-list"||"radio-list",
        // The default value for <input>
        "value" :    "#FF00FF"    ||       10     ||       false    ||    "none"   || "up"
        // The default unit  for <input>
        "unit"  :       null      ||      "px"    ||       null     ||     null    || null
        // The number of range specific unit
        "range"  : {
            "%" : [0,50],
            "px": [-100,100],
            "none" : [0,1]
        } 
        }
    }

linkToDemoMethod : 
    
    function( form, name, value ) {
        var value = form.styleValueLog[name],
            unit  = form.styleUnitLog[name];
        form.setStyleValue(name,value) 
        /* 
            Force Property Name To be updated to value.
            If Value is undefined, refresh the Property[name]
        */
        //...................................
        //  Processing Data
        //  Do anything with related Demo
        //...................................
    }

### Other Public Method
    exportStyle()
    importStyle(styleLog)
    resetStyle()
##### Useful methods to write color related updateDemo funtion ****
    StyleFormUtility : {
        hexToRGBA : function("#00FF00","0.6"){ return "rgba(0,255,0,0.6)" },
        rgbaToHexOpacity : function("rgba(0,255,0,0.6)"){ return {hex:#00FF00,opacity:0.6} },
        parseColor : function("#00ff00") { return "#00FF00" },
                     // #abc   => #AABBCC
                     // others => undefined
    }
##### Data Base To Process StyleLog
    Log Formmat : {
        "value" : {
            "aaa" : "111",
            "bbb" : "#FF00FF"
        },
        "unit" : {
            "aaa" : "px"
            "bbb" : ""
        }
    }
    StyleFormDataBase(StyleForm) // One database for one StyleForm instance
    saveCurrentStyle()
    resetToDefault()
    openStyleLog(index)
    deleteStyleLog(index) || deleteStyleLog() // clean all
# What is in HTML
    <form>
        ...
    </form>
#### range-number
    <div class="input-item range-number clear-fix">
        <div class="label-field-container clear-fix">
        <label>Height</label>
        <div class="field-unit-container"><input type="number" class="input-field" name="heightValue" /></div>
        </div>
        <input type="range" class="input-ui" name="height" />
    </div>

    {
        "width" : {
            "type" : "range-number",
            "value": 50,
            "unit" : "px",
            "range": {
                "px" : [0,300,1]
            }
        }
    }
#### color-selector
    <div class="input-item color-selector clear-fix">
        <label>Background Color</label>
        <input type="text" class="input-field hex-color" name="backgroundColorValue"/>
        <div class="input-ui color-popup" name="backgroundColor"></div>
    </div>
Normally, color-selector is followed by a opacity selector:

    <div class="input-item range-number clear-fix">
        <div class="label-field-container clear-fix">
            <label>Background Color Opacity</label>
            <div class="field-unit-container">
                <input type="number" class="input-field" name="backgroundColorOpacityValue" />
            </div>
        </div>
        <input type="range" class="input-ui" name="backgroundColorOpacity"/>
    </div>

    {
        "triColor" : {
            "type" : "color-selector",
            "value" : "#000000",
            "unit" : null,
            "range" : null
        },
        "triColorOpacity" : {
            "type" : "range-number",
            "value": 1,
            "unit" : null,
            "range": {
                "none" : [0,1,0.01]
            }
        }
    }
Sample Demo Updater

    name = name.replace(/Opacity$/,"");
    value = StyleFormUtility.hexToRGBA( form.styleValueLog[name], form.styleValueLog[name+"Opacity"] );
    name = name.replace(/^(.*)Color/,"$1-color");
#### select-list
    <div class="input-item select-list clear-fix">
        <label>Border Style</label>
        <select class="input-ui" name="borderStyle">
            <option value="none">none</option>
            <option value="dotted">dotted</option>
            <option value="dashed">dashed</option>
            <option value="solid">solid</option>
            <option value="double">double</option>
            <option value="groove">groove</option>
        </select>
        <input type="text" class="input-field hidden-input" name="borderStyleValue"/>
    </div>

    {
        "borderStyle" : {
            "type" : "select-list",
            "value" : "solid",
            "unit" : null,
            "range" : null
        }
    }
#### radio-list
    <div class="input-item radio-list clear-fix">
        <div>
            <input type="radio" class="input-ui" id="triDirection-up" name="triDirection" value="up" />
            <label for="triDirection-up">Up</label>
        </div>
        <div>
            <input type="radio" class="input-ui" id="triDirection-down" name="triDirection" value="down" />
            <label for="triDirection-down">Down</label>
        </div>
        <div>
            <input type="radio" class="input-ui" id="triDirection-left" name="triDirection" value="left" />
            <label for="triDirection-left">Left</label>
        </div>
    </div>

    {
        "triDirection" : {
            "type" : "radio-list",
            "value" : "up",
            "unit" : null,
            "range" : null
        }
    }
#### checkbox-input
    <div class="input-item checkbox-input clear-fix">
            <label class="checkbox-layout">Free</label><!--
            --><div class="checkbox-layout">
                <div class="checkbox-container">
                    <input type="checkbox" class="input-ui" name="isSymmetry">
                    <div></div>
                </div>
            </div><!--
            --><label class="checkbox-layout">Symmetry</label>
        <input type="text" class="input-field hidden-input" name="isSymmetryValue">
    </div>

    
    {
        "isSymmetry" : {
            "type" : "checkbox-input",
            "value": true,
            "unit" : null,
            "range" : null
        }
    }
