
function RoleModel(model) {
    var _self = this;

    this.id =0;
    this.name = "";

    if (model != null) {
        this.id = model.Id;
        if (model.RoleId != null) {
            this.id = model.RoleId;
            var role = _.find(DashboardModel.instance.roles(), function (r) {
                return r.id == _self.id;
            });

            if (role != null)
                this.name = role.name;
        }else
            this.name = model.Name;
    }
}
