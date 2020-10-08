// attach events to form elements
document.getElementById("operator").addEventListener("change", setTableCellConditions);
document.getElementById("compareValue").addEventListener("change", setTableCellConditions);
document.getElementById("trueColor").addEventListener("change", setTableCellConditions);
document.getElementById("falseColor").addEventListener("change", setTableCellConditions);

document.getElementById("enableCondition").addEventListener("change", function (event) { enableCellConditions(event.target.checked); });

document.getElementById("mergeDocument").addEventListener("click", mergeDocument);

// check cell status on input position changes
TXTextControl.addEventListener("inputPositionChanged", function () {
    TXTextControl.tables.getItem(function (table) { // table at input pos?

        if (table === null) { // return if no table available
            EnableFormElements(
                ["operator", "compareValue", "trueColor", "falseColor", "enableCondition"],
                false); return;
        }

        // enable form elements
        EnableFormElements(
            ["operator", "compareValue", "trueColor", "falseColor", "enableCondition"],
            true);

        table.cells.getItemAtInputPosition(function (cell) { // cell at input pos

            if (cell == null) { // return if more cells are selected
                enableCellConditions(false);
                document.getElementById("enableCondition").setAttribute("disabled", "disabled");
                return;
            }

            // check the cell name that stores the conditions
            cell.getName(function (cellName) {
                if (cellName === "") { enableCellConditions(false); return; }
                updateSettings(JSON.parse(cellName));
            });
        });

    })
});

// enables the form elements
function enableCellConditions(enable) {
    EnableFormElements(["operator", "compareValue", "trueColor", "falseColor"], enable);
    setTableCellConditions(!enable);
}

// stores the selected conditions in the cell name
function setTableCellConditions(empty = false) {

    TXTextControl.tables.getItem(function (table) {

        if (table === null)
            return; // no table

        // create a cellFilterInstructions object
        var cellFilterInstructions = {
            compareValue: document.getElementById("compareValue").value,
            operator: document.getElementById("operator").value,
            trueColor: document.getElementById("trueColor").value,
            falseColor: document.getElementById("falseColor").value
        }

        table.cells.getItemAtInputPosition(function (cell) {

            if (cell === null)
                return; // no cell

            if (empty === true)
                cell.setName(""); // delete instructions
            else
                // sel instructions to cell name
                cell.setName(JSON.stringify(cellFilterInstructions));

        });

    })
}

// apply settings to form elements
function updateSettings(condition) {
    document.getElementById("compareValue").value = condition.compareValue;
    document.getElementById("operator").value = condition.operator;
    document.getElementById("trueColor").value = condition.trueColor;
    document.getElementById("falseColor").value = condition.falseColor;
}

// enable/disable form elements
function EnableFormElements(elements, enabled) {

    if (enabled === false) {

        elements.forEach(function (element) {
            document.getElementById(element).setAttribute("disabled", "disabled");
            document.getElementById("enableCondition").checked = false;
        });
    }
    else {
        elements.forEach(function (element) {
            document.getElementById(element).removeAttribute("disabled");
            document.getElementById("enableCondition").checked = true;
        });
    }
}

function mergeDocument() {
    TXTextControl.saveDocument(TXTextControl.streamType.InternalUnicodeFormat,
        function (e) {
            var serviceURL = "/Home/MergeDocument";

            $.ajax({
                type: "POST",
                url: serviceURL,
                contentType: 'application/json',
                data: JSON.stringify({
                    Document: e.data,
                }),
                success: successFunc,
                error: errorFunc
            });

            function successFunc(data, status) {
                TXTextControl.loadDocument(TXTextControl.streamType.InternalUnicodeFormat, data);
            }

            function errorFunc(error) {
                console.log(error);
            }
        });
}