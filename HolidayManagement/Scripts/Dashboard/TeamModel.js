
function TeamModel(model) {
    this.id =0;
    this.description = "";

    if (model != null) {
        this.id=model.ID;
        this.description = model.Description;
        
    }
}