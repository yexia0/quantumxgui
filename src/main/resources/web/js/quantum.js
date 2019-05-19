var products;
var product;
var scale;

function init() {
    console.log("init");
    for (var i = 0; i < products.size(); i++) {
        var newKeymapButton = $("<a>").attr("href", "#").text(products.get(i).getDescription()).addClass("dropdown-item").data("modelId", products.get(i).getModelId()).click(newKeymap);
        $("#menu").append(newKeymapButton);
    }
}

function assignProduct(modelId) {
    for (var i = 0; i < products.size(); i++) {
        var p = products.get(i);
        if (p.getModelId() == modelId) {
            product = p;
            return product;
        }
    }
    return undefined;
}

function newKeymap() {
    var modelId = $(this).data("modelId");
    if (assignProduct(modelId) != undefined) {
        model.newMap(modelId, product.getNumKeys());
        showModel(modelId);
        generateNavBar(model.getNumLayers());
        displayKey();
    }
}

function deployToDevice() {
    model.deploy();
}

function saveToFile() {
    model.saveToFile();
}

function loadFromFile() {
    model.loadFromFile();
    var modelId = model.getModelId();
    if (assignProduct(modelId) != undefined) {
        showModel(modelId);
        generateNavBar(model.getNumLayers());
        displayKey();
    }
}

function loadFromDevice() {
    model.loadFromDevice();
    var modelId = model.getModelId();
    console.log(modelId);
    if (assignProduct(modelId) != undefined) {
        console.log("show")
        showModel(modelId);
        generateNavBar(model.getNumLayers());
        displayKey();
    }
}

function clearKeyPressed() {
    $("#keymap").find("button").removeClass("keypressed");
}

function modelKeyOnClick() {
    var activeLayer = getActiveLayer();
    var n = $(this).data("key");
    clearKeyPressed();
    $(this).addClass("keypressed");
    loadKeyToEditor(activeLayer, n);
}

function showModel(modelId) {
    for (var i = 0; i < products.size(); i++) {
        product = products.get(i);
        if (product.getModelId() == modelId) {
            console.log(product.getDescription());
            window.model.setNumKeys(product.getNumKeys());
            var width = 1000;
            scale = width / product.getWidth();
            var height = product.getHeight() * scale;
            $("#keymap").css("width", width).css("height", height).css("position", "relative");
            $("#keymap").empty();
            var keyPositions = product.getKeyPositions();
            for (var j = 1; j <= product.getNumKeys(); j++) {
                var keyPosition = keyPositions.get(j);
                var child = $("<button>");
                child.css("display","block").css("position","absolute").attr("id","key" + j).addClass("keyshow").text(j).data("key", j);
                child.css("font-size", "10px");
                child.css("left", (keyPosition.getX() - keyPosition.getWidth() / 2) * scale);
                child.css("bottom", (keyPosition.getY() - keyPosition.getHeight() / 2 ) * scale );
                child.css("height", (keyPosition.getHeight() * scale) );
                child.css("width", (keyPosition.getWidth() * scale) );
                child.css("transform", "rotate(" + keyPosition.getRotation() + "deg)");
                child.click(modelKeyOnClick);
                $("#keymap").append(child);
            }
            break;
        }
    }
}

function displayKey() {
    var activeLayer = getActiveLayer();
    var numKeys = product.getNumKeys();
    for (var i = 1; i <= numKeys; i++) {
        var keyFunction = model.getKey(activeLayer, i);
        var displayContainer = $("#key" + i);
        displayKeyStyle(displayContainer, keyFunction);
    }
}

function getTextSize(str) {
    if (str.length == 1) {
        return 8;
    } else if (str.length <= 3) {
        return 6;
    } else {
        return 3.5;
    }
}
function displayKeyStyle(container, keyFunction) {
    container.empty();
    container.removeClass("nopKey normalKey modifierKey transKey comboKey layerKey defaultLayerKey resetOneshotKey bootKey macroKey");
    var keyType = keyFunction.type.get().toString();
    switch (keyType) {
        case "NORMAL":
            var value = keyFunction.value.normalKey.id.get().toString();
            var showText = keyCodeToText(value);
            var textSize = getTextSize(showText);
            container.text(showText).addClass("normalKey").css("font-size", textSize*scale + "px");
            break;
        case "COMBO":
            var value = keyFunction.value.comboKey.id.get().toString();
            var modifierMap = keyFunction.value.comboKey.modifierMap.get();
            container.empty();

            var showText = keyCodeToText(value);
            var textSize = getTextSize(showText);
            container.addClass("comboKey").css("font-size", textSize*scale + "px");
            container.text(showText);
            if ((modifierMap & 0x11) != 0) {
                container.append($("<span>").addClass("showtag").css("top",0).css("left", 0).text("C"));
            }
            if ((modifierMap & 0x22) != 0) {
                container.append($("<span>").addClass("showtag").css("top",0).css("right", 0).text("S"));
            }
            if ((modifierMap & 0x44) != 0) {
                container.append($("<span>").addClass("showtag").css("bottom",0).css("left", 0).text("A"));
            }
            if ((modifierMap & 0x88) != 0) {
                container.append($("<span>").addClass("showtag").css("bottom",0).css("right", 0).text("G"));
            }
            break;
        case "MODIFIER":
            var map = keyFunction.value.modifierKey.map.get();
            var showText = modifierCodeToText(map);
            var textSize = getTextSize(showText);
            container.text(showText).addClass("modifierKey").css("font-size", textSize*scale + "px");
            break;
        case "LAYER":
            var layer = keyFunction.value.layerKey.layer.get();
            var showText = "Layer " + layer;
            var textSize = getTextSize(showText);
            container.addClass("layerKey").css("font-size", textSize*scale + "px").text(showText);
            break;
        case "DFT_LAYER":
            var defaultLayer = keyFunction.value.defaultLayer.get();
            var showText = "Default Layer " + defaultLayer;
            var textSize = getTextSize(showText);
            container.text(showText).addClass("defaultLayerKey").css("font-size", textSize*scale + "px");
            break;
        case "NOP":
            var showText = "(Empty)"
            var textSize = getTextSize(showText);
            container.text(showText).addClass("nopKey").css("font-size", textSize*scale + "px");
            break;
        case "TRANS":
            var showText = "Trans"
            var textSize = getTextSize(showText);
            container.text(showText).addClass("transKey").css("font-size", textSize*scale + "px");
            break;
        case "BOOT":
            var showText = "Boot"
            var textSize = getTextSize(showText);
            container.text(showText).addClass("bootKey").css("font-size", textSize*scale + "px");
            break;
        case "RESET_ONESHOT":
            var showText = "Reset Oneshot"
            var textSize = getTextSize(showText);
            container.text(showText).addClass("resetOneshotKey").css("font-size", textSize*scale + "px");
            break;

        case "MACRO":
            var showText = keyFunction.value.macroAddr.getS();
            if (showText.length >= 8) {
                showText = "[Macro]";
            }
            container.empty();
            container.append($("<span>").addClass("showtag").css("left",0).css("top", 0).text("M"));
            container.append(showText).addClass("macroKey").css("font-size", 3.5*scale + "px");
            break;
        default:
            container.text(keyFunction);
    }

}

function getActiveLayer() {
    var currentActiveBar = $(".nav-link.active");
    if (currentActiveBar.length != 0) {
        return currentActiveBar.data("layer");
    } else {
        return 0;
    }

}

function selectLayerCallback(e) {
    var activeLayer = $(this).find(".nav-link").data("layer");
    selectLayer(activeLayer);
}

function selectLayer(activeLayer) {
    console.log("Layer " + activeLayer + " selected.");
    $(".nav-link").removeClass("active");

    $(".nav-link").each(function() {
        if ($(this).data("layer") == activeLayer) {
            $(this).addClass("active");
        }
    });
    displayKey();
    clearKeyInEditor();
    clearKeyPressed();
}

function generateNavBar(numLayers) {
    console.log("into", numLayers);
    var oldActiveLayer = getActiveLayer();
    console.log(oldActiveLayer);
    var layerNav = $("#layernav");
    layerNav.data("layer", numLayers);
    layerNav.empty();
    for (var i = 0; i < numLayers; i++) {
        var layerTab = $("<li>").addClass("nav-item").append($("<a>").addClass("nav-link").attr("href", "#").text("Layer " + i).data("layer", i)).click(selectLayerCallback);
        layerNav.append(layerTab);
    }
    var trimTab = $("<li>").addClass("nav-item").append($("<a>").addClass("nav-link").attr("href", "#").text("-").data("layers", numLayers)).click(function (e) {
                          var n = $(e.target).data("layers");
                          if (n > 1) {
                            generateNavBar(n-1);
                            window.model.setNumLayers(n-1);
                            }
                      } );
    layerNav.append(trimTab)
    var appendTab = $("<li>").addClass("nav-item").append($("<a>").addClass("nav-link").attr("href", "#").text("+").data("layers", numLayers)).click(function (e) {
        var n = $(e.target).data("layers");
        if (n < 6) {
            generateNavBar(n+1);
            window.model.setNumLayers(n+1);
        }
    } )
    layerNav.append(appendTab);
    if (oldActiveLayer < numLayers) {
        console.log("re "+ oldActiveLayer);
        selectLayer(oldActiveLayer);
    } else {
        console.log("re " + numLayers);
        selectLayer(numLayers - 1);
    }
}

function newModifierCheckbox(v, text) {
    var result = $("<div>").css("display", "inline");
    var input = $("<input type='checkbox'>").attr("name", "modifier").addClass("modifier").attr("value", v);
    var t = $("<div>").css("display", "inline").text(text);
    result.append(input);
    result.append(t);
    return result;
}

function newOption(v, text) {
    return $("<option>").attr("value", v).text(text);
}

function hideEditor() {
    $("#editor").css("display", "none");
}

function showEditor() {
    $("#editor").css("display", "block");
}

function hideModifierMultiChecker() {
    $("#modifierMultiChecker").css("display", "none");
}

function hideKeySelector() {
    $("#keySelector").css("display", "none");
}

function hideThresholdSelector() {
    $("#thresholdSelector").css("display", "none");
}

function hideComboSelector() {
    $("#comboSelector").css("display", "none");
}

function hideLayerSelector() {
    $("#layerSelector").css("display", "none");
}

function hideMacroInput() {
    $("#macroInput").css("display", "none");
}

function showModifierMultiChecker() {
    $("#modifierMultiChecker").css("display", "inline");
    $("#modifierMultiChecker").children("input").prop("checked", false);
}

function showKeySelector() {
    $("#keySelector").css("display", "inline");
    $("#keySelector").val(0);
}

function showThresholdSelector() {
    $("#thresholdSelector").css("display", "inline");
    $("#thresholdSelector").val(-1);
}

function showComboSelector() {
    $("#comboSelector").css("display", "inline");
    $("#comboSelector").val(0);
}

function showLayerSelector() {
    $("#layerSelector").css("display", "inline");
    $("#layerSelector").val(-1);
}

function showMacroInput() {
    $("#macroInput").css("display", "inline");
    $("#macroInput").val("");
}

function onChangeType() {
    var targetType = $(this).find("option:selected").attr("value");
    changeType(targetType);
}

function changeType(targetType) {
    switch (targetType) {
    case "NOP":
    case "TRANS":
    case "BOOT":
    case "RESET_ONESHOT":
        hideModifierMultiChecker();
        hideKeySelector();
        hideThresholdSelector();
        hideComboSelector();
        hideLayerSelector();
        hideMacroInput();
        break;
    case "NORMAL":
        hideModifierMultiChecker();
        showKeySelector();
        hideThresholdSelector();
        hideComboSelector();
        hideLayerSelector();
        hideMacroInput();
        break;
    case "MODIFIER":
        showModifierMultiChecker();
        hideKeySelector();
        showThresholdSelector();
        hideComboSelector();
        hideLayerSelector();
        hideMacroInput();
        break;
    case "LAYER":
        hideModifierMultiChecker();
        hideKeySelector();
        showThresholdSelector();
        hideComboSelector();
        showLayerSelector();
        hideMacroInput();
        break;
    case "DFT_LAYER":
        hideModifierMultiChecker();
        hideKeySelector();
        hideThresholdSelector();
        hideComboSelector();
        showLayerSelector();
        hideMacroInput();
        break;
    case "COMBO":
        hideModifierMultiChecker();
        showKeySelector();
        hideThresholdSelector();
        showComboSelector();
        hideLayerSelector();
        hideMacroInput();
        break;
    case "MACRO":
        hideModifierMultiChecker();
        hideKeySelector();
        hideThresholdSelector();
        hideComboSelector();
        hideLayerSelector();
        showMacroInput();
        break;
    default:
        console.log(targetType);
    }
}

function setNormalKey(id) {
    $("#keySelector").val(id);
}

function getNormalKey() {
    var id = $("#keySelector").val();
    if (id == 0) {
        throw "Please select a key";
    }
    return id;
}

function setModifierMultiChecker(bitmap) {
    $("#modifierMultiChecker").find("input").each(function () {
        if ($(this).attr("value") & bitmap) {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }
    });
}

function getModifierMultiChecker(bitmap) {
    var bitmap = 0x00;
    $("#modifierMultiChecker").find("input").each(function () {
        if ($(this).prop("checked")) {
            bitmap |= $(this).attr("value");
        }
    })
    return bitmap;
}

function setThresholdSelector(threshold) {
    $("#thresholdSelector").val(threshold);
}

function getThresholdSelector() {
    var result = $("#thresholdSelector").val();
    if (result == -1) {
        throw "Please select a threshold";
    }
    return result;
}

function setLayerSelector(layer) {
    $("#layerSelector").val(layer);
}

function getLayerSelector(layer) {
    var result = $("#layerSelector").val();
    if (result == -1) {
        throw "Please select a layer";
    }
    return result;
}

function setComboSelector(map) {
    $("#comboSelector").val(map);
}

function getComboSelector() {
    var result = $("#comboSelector").val();
    if (result == 0) {
        throw "Please select combo modifier";
    }
    return result;
}

function setMacroInput(str) {
    $("#macroInput").val(str);
}

function getMacroInput() {
    return $("#macroInput").val();
}

function changeValue(keyType, value) {
    switch(keyType) {
        case "NOP":
        case "TRANS":
        case "BOOT":
        case "RESET_ONESHOT":
            break;
        case "NORMAL":
            setNormalKey(value.normalKey.id.get());
            break;
        case "MODIFIER":
            setModifierMultiChecker(value.modifierKey.map.get());
            setThresholdSelector(value.modifierKey.stickyThreshold.get());
            break;
        case "LAYER":
            setThresholdSelector(value.layerKey.stickyThreshold.get());
            setLayerSelector(value.layerKey.layer.get());
            break;
        case "DFT_LAYER":
            setLayerSelector(value.defaultLayer.get());
            break;
        case "COMBO":
            setNormalKey(value.comboKey.id.get());
            setComboSelector(value.comboKey.modifierMap.get());
            break;
        case "MACRO":
            setMacroInput(value.macroAddr.getS());
            break;
        default:
            console.log(targetType);
        }

}

function loadKeyToEditor(layer, key) {
    var keyFunction = model.getKey(layer, key);
    var typeSelector = $("<select>").attr("id", "typeSelector").change(onChangeType);
    typeSelector.append(newOption("NOP", "(Empty)"));
    typeSelector.append(newOption("TRANS", "Transparent"));
    typeSelector.append(newOption("NORMAL", "Normal Key"));
    typeSelector.append(newOption("MODIFIER", "Modifier Key"));
    typeSelector.append(newOption("LAYER", "Layer Change"));
    typeSelector.append(newOption("DFT_LAYER", "Default Layer"));
    typeSelector.append(newOption("COMBO", "Modifier Combo"));
    typeSelector.append(newOption("RESET_ONESHOT", "Reset Oneshot"));
    typeSelector.append(newOption("MACRO", "Macro"));
    typeSelector.append(newOption("BOOT", "Bootloader"));

    var modifierMultiChecker = $("<div>").css("display", "inline").attr("id", "modifierMultiChecker");
    modifierMultiChecker.append(newModifierCheckbox(0x01, "Left Control"));
    modifierMultiChecker.append(newModifierCheckbox(0x02, "Left Shift"));
    modifierMultiChecker.append(newModifierCheckbox(0x04, "Left Alt"));
    modifierMultiChecker.append(newModifierCheckbox(0x08, "Left Gui"));
    modifierMultiChecker.append(newModifierCheckbox(0x10, "Right Control"));
    modifierMultiChecker.append(newModifierCheckbox(0x20, "Right Shift"));
    modifierMultiChecker.append(newModifierCheckbox(0x40, "Right Alt"));
    modifierMultiChecker.append(newModifierCheckbox(0x80, "Right Gui"));

    var keySelector = $("<select>").attr("id", "keySelector");
    keySelector.append(newOption(0, "Select Key..."));

    for (var k = 4; k <= 99; k++) {
        keySelector.append(newOption(k, keyCodeToText(k)));
    }

    var thresholdSelector = $("<select>").attr("id", "thresholdSelector");
    thresholdSelector.append(newOption(-1, "Select Sticky Threshold..."));
    for (var i = 0; i <= 200; i++) {
        thresholdSelector.append(newOption(i, (i*10) + "ms"));
    }

    var comboSelector = $("<select>").attr("id", "comboSelector");
    comboSelector.append(newOption(0x00, "Select Modifiers..."));
    comboSelector.append(newOption(0x11, "Control"));
    comboSelector.append(newOption(0x22, "Shift"));
    comboSelector.append(newOption(0x44, "Alt"));
    comboSelector.append(newOption(0x88, "Gui"));
    comboSelector.append(newOption(0x33, "Control Shift"));
    comboSelector.append(newOption(0x55, "Control Alt"));
    comboSelector.append(newOption(0x99, "Control Gui"));
    comboSelector.append(newOption(0x66, "Alt Shift"));
    comboSelector.append(newOption(0xCC, "Alt Gui"));
    comboSelector.append(newOption(0xAA, "Shift Gui"));
    comboSelector.append(newOption(0x77, "Control Alt Shift"));
    comboSelector.append(newOption(0xDD, "Control Alt Gui"));
    comboSelector.append(newOption(0xBB, "Control Shift Gui"));
    comboSelector.append(newOption(0xEE, "Alt Shift Gui"));
    comboSelector.append(newOption(0xFF, "Control Alt Shift Gui"));

    var layerSelector = $("<select>").attr("id", "layerSelector");
    var numLayers = $("#layernav").data("layer");
    layerSelector.append(newOption(-1, "Select Layer..."))
    for (var i = 0; i < numLayers; i++) {
        layerSelector.append(newOption(i, i))
    }

    var macroInput = $("<input>").attr("id", "macroInput");

    console.log(keyFunction);
    //keyFunction.type.set("NOP");
    var keyType = keyFunction.type.get().toString();

    var saveKey = $("<button>").attr("id", "saveEditor").text("Save").click(saveEditorKey);
    var closeKey = $("<button>").attr("id", "closeEditor").text("Close").click(closeEditorKey);

    //model.setKey(layer, key, keyFunction);
    $("#editor").empty();
    $("#editor").data("layer", layer);
    $("#editor").data("key", key);
    $("#editor").append(typeSelector);
    $("#editor").append(modifierMultiChecker);
    $("#editor").append(comboSelector);
    $("#editor").append(keySelector);
    $("#editor").append(layerSelector);
    $("#editor").append(thresholdSelector);
    $("#editor").append(macroInput);
    $("#editor").append(saveKey);
    $("#editor").append(closeKey);

    typeSelector.val(keyType);
    changeType(keyType);
    changeValue(keyType, keyFunction.value);

    showEditor();
}

function clearKeyInEditor() {
    $("#editor").data("layer", undefined);
    $("#editor").data("key", undefined);
    $("#editor").empty();
    hideEditor();
}

function saveEditorKey() {
    var layer = $("#editor").data("layer");
    var key = $("#editor").data("key");

    var typeString = $("#typeSelector").val();

    var newKey = model.newKey(typeString);
    try {
        switch (typeString) {
            case "NOP":
            case "TRANS":
            case "BOOT":
            case "RESET_ONESHOT":
                break;
            case "NORMAL":
                newKey.value.normalKey.id.set(getNormalKey());
                break;
            case "MODIFIER":
                newKey.value.modifierKey.map.set(getModifierMultiChecker());
                newKey.value.modifierKey.stickyThreshold.set(getThresholdSelector());
                break;
            case "LAYER":
                newKey.value.layerKey.stickyThreshold.set(getThresholdSelector());
                newKey.value.layerKey.layer.set(getLayerSelector());
                break;
            case "DFT_LAYER":
                newKey.value.defaultLayer.set(getLayerSelector());
                break;
            case "COMBO":
                newKey.value.comboKey.id.set(getNormalKey());
                newKey.value.comboKey.modifierMap.set(getComboSelector());
                break;
            case "MACRO":
                newKey.value.macroAddr.setS(getMacroInput());
                break;
            default:
                console.log(targetType);
        }
    } catch (err) {
        console.log("catched");
    }
    model.setKey(layer, key, newKey);

    displayKey();
}

function closeEditorKey() {
    clearKeyInEditor();
    clearKeyPressed();
}