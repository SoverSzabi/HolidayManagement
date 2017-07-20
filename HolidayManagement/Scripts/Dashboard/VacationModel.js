
function VacationModel(model) {
    this.id = ko.observable(null);
    this.stateId = ko.observable(null);
    this.userId = ko.observable(null);
    this.startDate = ko.observable(null);
    this.endDate = ko.observable(null);
    this.date = ko.observable(null);

    if (model != null) {
        this.id(model.id);
        this.stateId(model.stateId);
        this.userId(model.userId);
        this.startDate(model.startDate);
        this.endDate(model.endDate);
        this.date(model.date);
    }
}
