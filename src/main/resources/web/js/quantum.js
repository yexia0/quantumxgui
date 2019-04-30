var products;
var product;

function init() {
    console.log("init");
    for (var i = 0; i < products.size(); i++) {
        var newKeymapButton = $("<a>").text(products.get(i).getDescription()).addClass("dropdown-item").data("modelId", products.get(i).getModelId()).click(newKeymap);
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
        showKey();
    }
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
        showKey();
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
            var scale = width / product.getWidth()
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

function showKey() {
    var activeLayer = getActiveLayer();
    var numKeys = product.getNumKeys();
    for (var i = 1; i <= numKeys; i++) {
        console.log("show key");
        $("#key" + i).text(model.getKey(activeLayer, i));
        console.log(model.getKey(activeLayer, i));
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
    showKey();
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
        var layerTab = $("<li>").addClass("nav-item").append($("<a>").addClass("nav-link").text("Layer " + i).data("layer", i)).click(selectLayerCallback);
        layerNav.append(layerTab);
    }
    var trimTab = $("<li>").addClass("nav-item").append($("<a>").addClass("nav-link").text("-").data("layers", numLayers)).click(function (e) {
                          var n = $(e.target).data("layers");
                          if (n > 1) {
                            generateNavBar(n-1);
                            window.model.setNumLayers(n-1);
                            }
                      } );
    layerNav.append(trimTab)
    var appendTab = $("<li>").addClass("nav-item").append($("<a>").addClass("nav-link").text("+").data("layers", numLayers)).click(function (e) {
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
    keySelector.append(newOption(4, "A"));
    keySelector.append(newOption(5, "B"));
    keySelector.append(newOption(6, "C"));
    keySelector.append(newOption(7, "D"));
    keySelector.append(newOption(8, "E"));
    keySelector.append(newOption(9, "F"));
    keySelector.append(newOption(10, "G"));
    keySelector.append(newOption(11, "H"));
    keySelector.append(newOption(12, "I"));
    keySelector.append(newOption(13, "J"));
    keySelector.append(newOption(14, "K"));
    keySelector.append(newOption(15, "L"));
    keySelector.append(newOption(16, "M"));
    keySelector.append(newOption(17, "N"));
    keySelector.append(newOption(18, "O"));
    keySelector.append(newOption(19, "P"));
    keySelector.append(newOption(20, "Q"));
    keySelector.append(newOption(21, "R"));
    keySelector.append(newOption(22, "S"));
    keySelector.append(newOption(23, "T"));
    keySelector.append(newOption(24, "U"));
    keySelector.append(newOption(25, "V"));
    keySelector.append(newOption(26, "W"));
    keySelector.append(newOption(27, "X"));
    keySelector.append(newOption(28, "Y"));
    keySelector.append(newOption(29, "Z"));
    keySelector.append(newOption(30, "1"));
    keySelector.append(newOption(31, "2"));
    keySelector.append(newOption(32, "3"));
    keySelector.append(newOption(33, "4"));
    keySelector.append(newOption(34, "5"));
    keySelector.append(newOption(35, "6"));
    keySelector.append(newOption(36, "7"));
    keySelector.append(newOption(37, "8"));
    keySelector.append(newOption(38, "9"));
    keySelector.append(newOption(39, "0"));
    keySelector.append(newOption(40, "Enter"));
    keySelector.append(newOption(41, "Esc"));
    keySelector.append(newOption(42, "Backspace"));
    keySelector.append(newOption(43, "Tab"));
    keySelector.append(newOption(44, "Space"));
    keySelector.append(newOption(45, "-"));
    keySelector.append(newOption(46, "="));
    keySelector.append(newOption(47, "["));
    keySelector.append(newOption(48, "]"));
    keySelector.append(newOption(49, "\\"));
    keySelector.append(newOption(50, "Number"));
    keySelector.append(newOption(51, ";"));
    keySelector.append(newOption(52, "'"));
    keySelector.append(newOption(53, "`"));
    keySelector.append(newOption(54, ","));
    keySelector.append(newOption(55, "."));
    keySelector.append(newOption(56, "/"));
    keySelector.append(newOption(57, "Caps Lock"));
    keySelector.append(newOption(58, "F1"));
    keySelector.append(newOption(59, "F2"));
    keySelector.append(newOption(60, "F3"));
    keySelector.append(newOption(61, "F4"));
    keySelector.append(newOption(62, "F5"));
    keySelector.append(newOption(63, "F6"));
    keySelector.append(newOption(64, "F7"));
    keySelector.append(newOption(65, "F8"));
    keySelector.append(newOption(66, "F9"));
    keySelector.append(newOption(67, "F10"));
    keySelector.append(newOption(68, "F11"));
    keySelector.append(newOption(69, "F12"));
    keySelector.append(newOption(70, "Print Screen"));
    keySelector.append(newOption(71, "Scroll Lock"));
    keySelector.append(newOption(72, "Pause"));
    keySelector.append(newOption(73, "Insert"));
    keySelector.append(newOption(74, "Home"));
    keySelector.append(newOption(75, "Page Up"));
    keySelector.append(newOption(76, "Delete"));
    keySelector.append(newOption(77, "End"));
    keySelector.append(newOption(78, "Page Down"));
    keySelector.append(newOption(79, "Right"));
    keySelector.append(newOption(80, "Left"));
    keySelector.append(newOption(81, "Down"));
    keySelector.append(newOption(82, "Up"));
    keySelector.append(newOption(83, "Num Lock"));
    keySelector.append(newOption(84, "Keypad /"));
    keySelector.append(newOption(85, "Keypad *"));
    keySelector.append(newOption(86, "Keypad -"));
    keySelector.append(newOption(87, "Keypad +"));
    keySelector.append(newOption(88, "Keypad Enter"));
    keySelector.append(newOption(89, "Keypad 1"));
    keySelector.append(newOption(90, "Keypad 2"));
    keySelector.append(newOption(91, "Keypad 3"));
    keySelector.append(newOption(92, "Keypad 4"));
    keySelector.append(newOption(93, "Keypad 5"));
    keySelector.append(newOption(94, "Keypad 6"));
    keySelector.append(newOption(95, "Keypad 7"));
    keySelector.append(newOption(96, "Keypad 8"));
    keySelector.append(newOption(97, "Keypad 9"));
    keySelector.append(newOption(98, "Keypad 0"));
    keySelector.append(newOption(99, "Keypad ."));

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

    showKey();
}

function closeEditorKey() {
    clearKeyInEditor();
    clearKeyPressed();
}