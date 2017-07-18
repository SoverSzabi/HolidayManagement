
function MonthDayModel(model) {
    this.IsFreeDay = ko.observable(null);
    this.Description = ko.observable(null);
    this.Day = ko.observable(null);

    if (model != null) {
        this.IsFreeDay(model.IsFreeDay);
        this.Description(model.Description);
        this.Day(model.Day);
    }
}