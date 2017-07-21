
function MonthDayModel(model) {
    this.isFreeDay = ko.observable(null);
    this.description = ko.observable(null);
    this.day = ko.observable(null);
    this.bankHoliday = ko.observable(null);
    this.holiday = ko.observable(null);
    this.isHoliday = ko.observable(null);
    this.name = ko.observable(null);
    

    if (model != null) {
        this.isFreeDay(model.isFreeDay);
        this.description(model.description);
        this.day(model.day);
        this.bankHoliday(model.bankHoliday);
        this.name(model.name);
        this.holiday(model.holiday);
        this.isHoliday(model.isHoliday);
    }
}