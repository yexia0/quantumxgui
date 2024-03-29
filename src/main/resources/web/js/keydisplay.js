var keycodeMap = [
    "",
    "",
    "",
    "",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "Enter",
    "Esc",
    "Back space",
    "Tab",
    "Space",
    "-",
    "=",
    "[",
    "]",
    "\\",
    "Number",
    ";",
    "'",
    "`",
    ",",
    ".",
    "/",
    "Caps Lock",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "Print Screen",
    "Scroll Lock",
    "Pause",
    "Insert",
    "Home",
    "Page Up",
    "Delete",
    "End",
    "Page Down",
    "Right",
    "Left",
    "Down",
    "Up",
    "Num Lock",
    "Keypad /",
    "Keypad *",
    "Keypad -",
    "Keypad +",
    "Keypad Enter",
    "Keypad 1",
    "Keypad 2",
    "Keypad 3",
    "Keypad 4",
    "Keypad 5",
    "Keypad 6",
    "Keypad 7",
    "Keypad 8",
    "Keypad 9",
    "Keypad 0",
    "Keypad ."

]

var modifierCodeMap = [];
modifierCodeMap[0x01] = "Left Control";
modifierCodeMap[0x02] = "Left Shift";
modifierCodeMap[0x04] = "Left Alt";
modifierCodeMap[0x08] = "Left Gui";
modifierCodeMap[0x10] = "Right Control";
modifierCodeMap[0x20] = "Left Shift";
modifierCodeMap[0x40] = "Left Alt";
modifierCodeMap[0x80] = "Left Gui";

function keyCodeToText(code) {
    return keycodeMap[code];
}

function modifierCodeToText(code) {
    if ((code & (code - 1)) != 0) {
        return "Multi Mod";
    } else {
        return modifierCodeMap[code];
    }
}

