function DashboardModel() {
    this.users = ko.observableArray(null);
    this.initialize = function (data) {
        users.push(data.UserList);
    }
}

function InitializeDashboardModel(data) {
    DashboardModel.instance = new DashboardModel();

    DashboardModel.instance.initialize(data);

    ko.applyBindings(DashboardModel.instance);
}

