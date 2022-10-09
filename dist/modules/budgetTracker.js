import * as Elements from "./Elements.js";
export default class BudgetTracker {
    constructor(root) {
        this.rows = [];
        this.data = { rows: [] };
        this.dataError = false;
        this.root = root;
        const rowCnt = Elements.divElement(this.root, "rows");
        const header = Elements.divElement(rowCnt, "row header");
        const headerData = {
            headerTitles: ["Date", "Description", "Type", "Amount", ""],
            headerCSS: ["date", "description", "headerType", "amount", "headerRemove"]
        };
        headerData.headerTitles.forEach((title, i) => {
            Elements.divElement(header, headerData.headerCSS[i], title);
        });
        const btnNew = Elements.divElement(this.root, "new", "New");
        btnNew.addEventListener("click", e => {
            this.rows.push(new Row(this, rowCnt, new RowData()));
        });
        const total = Elements.divElement(this.root, "total", "Total: €<span>0,00</span>");
        this.total = total.querySelector("span");
        this.getData();
        this.data.rows.forEach(row => {
            this.rows.push(new Row(this, rowCnt, new RowData(row.date, row.description, row.type, row.amount)));
        });
        this.updateTotal();
    }
    getData() {
        if (localStorage) {
            const response = localStorage.getItem("budgetTracker");
            if (response !== null) {
                this.data = JSON.parse(response);
            }
        }
        else {
            throw new Error("Local Storage not supported");
        }
    }
    saveData() {
        this.data.rows = [];
        this.rows.forEach(row => {
            this.data.rows.push(row.rowData);
        });
        if (localStorage) {
            localStorage.setItem("budgetTracker", JSON.stringify(this.data));
        }
        this.updateTotal();
    }
    updateTotal() {
        let total = 0;
        this.rows.forEach(row => {
            const amount = parseFloat(row.rowData.amount);
            if (!isNaN(amount))
                row.rowData.type === 0 ? total += amount : total -= amount;
        });
        this.total.textContent = total.toString();
    }
    removeRow(rmRow) {
        this.rows.forEach((row, i) => {
            if (row === rmRow)
                this.rows.splice(i, 1);
        });
    }
}
class Row {
    constructor(owner, parent, rowData) {
        this.owner = owner;
        this.rowData = rowData;
        this.root = Elements.divElement(parent, "row");
        const date = Elements.inputElement(this.root, "date", rowData.date.toString(), "date");
        date.addEventListener("change", e => { this.updateDate(date.value); });
        const descr = Elements.inputElement(this.root, "text", rowData.description, "description", "Type here...");
        descr.addEventListener("change", e => this.updateDescr(descr.value));
        const cnt = Elements.divElement(this.root, "type");
        this.btnIn = Elements.divElement(cnt, rowData.type === 0 ? "in selected" : "in", "In");
        this.btnIn.tabIndex = 0;
        this.btnIn.addEventListener("click", e => this.updateType(RowType.in));
        this.btnIn.addEventListener("keyup", e => {
            if (e.code === "Space" || e.code === "Enter")
                this.updateType(RowType.in);
        });
        this.btnOut = Elements.divElement(cnt, rowData.type === 1 ? "out selected" : "out", "Out");
        this.btnOut.tabIndex = 0;
        this.btnOut.addEventListener("click", e => this.updateType(RowType.out));
        this.btnOut.addEventListener("keyup", e => {
            if (e.code === "Space" || e.code === "Enter")
                this.updateType(RowType.out);
        });
        const amount = Elements.inputElement(this.root, "number", rowData.amount.toString(), "amount", "0", ".01");
        amount.addEventListener("change", e => this.updateAmount(amount.value));
        const rmBtn = Elements.divElement(this.root, "removeBtn");
        Elements.imageElement(rmBtn, "media/remove.svg", "removeImg", "x", "Remove");
        rmBtn.tabIndex = 0;
        rmBtn.addEventListener("click", e => this.removeRow());
    }
    updateDate(date) {
        this.rowData.date = date;
        this.owner.saveData();
    }
    updateDescr(descr) {
        this.rowData.description = descr;
        this.owner.saveData();
    }
    updateType(type) {
        if (type === 0) {
            this.rowData.type = 0;
            this.btnIn.classList.add("selected");
            this.btnOut.classList.remove("selected");
        }
        else {
            this.rowData.type = 1;
            this.btnOut.classList.add("selected");
            this.btnIn.classList.remove("selected");
        }
        this.owner.saveData();
    }
    updateAmount(amount) {
        this.rowData.amount = amount;
        this.owner.saveData();
    }
    removeRow() {
        this.owner.removeRow(this);
        this.root.remove();
        this.owner.saveData();
    }
}
var RowType;
(function (RowType) {
    RowType[RowType["in"] = 0] = "in";
    RowType[RowType["out"] = 1] = "out";
})(RowType || (RowType = {}));
;
class RowData {
    constructor(date = new Date().toDateString(), description = "", type = RowType.in, amount = "") {
        this.date = date;
        this.description = description;
        this.type = type;
        this.amount = amount;
    }
}
//# sourceMappingURL=budgetTracker.js.map