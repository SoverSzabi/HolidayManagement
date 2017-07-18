
function VacationModel(model) {
    this.ID = ko.observable(null);
    this.StateId = ko.observable(null);
    this.UserId = ko.observable(null);
    this.StartDate = ko.observable(null);
    this.EndDate = ko.observable(null);
    this.Date = ko.observable(null);

    if (model != null) {
        this.ID(model.ID);
        this.StateId(model.StateId);
        this.UserId(model.UserId);
        this.StartDate(model.StartDate);
        this.EndDate(model.EndDate);
        this.Date(model.Date);
    }
}
