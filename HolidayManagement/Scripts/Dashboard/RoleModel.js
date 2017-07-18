
function RoleModel(model) {
    this.id =0;
    this.name = "";

    if (model != null) {
        this.id=model.Id;
        this.name = model.Name;
    }
}