 
function BankHoliday(model) {
    this.ID = ko.observable(0);
    this.Description = ko.observable();
    this.Day = ko.observable();
    this.Month = ko.observable();
 
    if (model != null) {
        this.ID(model.ID);
        this.Description(model.Description);
        this.Day(model.Day);
        this.Month(model.Month);
    }
}