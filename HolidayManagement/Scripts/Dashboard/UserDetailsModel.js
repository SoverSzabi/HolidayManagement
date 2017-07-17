
function UserDetailsModel(model) {
    this.id = ko.observable(0);
    this.firstName = ko.observable(null);
    this.lastName = ko.observable(null);
    this.email = ko.observable(null);
    this.hireDate = ko.observable(null);
    this.maxDays = ko.observable(null);
    this.team =  ko.observable(new TeamModel());

    if(model!=null)
    {
        this.id(model.ID);
        if (model.AspnetUsers!=null)
        {
            this.email(model.AspnetUsers.Email);
        }
    
        this.firstName(model.FirstName);
        this.lastName(model.LastName);
        this.hireDate(model.HireDate);
        this.maxDays(model.MaxDays);
        this.team(new TeamModel(model.Team));
        
    }
}
