function DashboardModel() {

    var _self = this;
    this.users = ko.observableArray(null);
    this.teams = [];
    this.manageUser = new UserDetailsModel();

    this.initialize = function (data) {
        var users = _.map(data.UserList, function (user, index) {
            return new UserDetailsModel(user);
        });
        _self.users(users);

        var teams = _.map(data.TeamList, function (team,index) {
            return new TeamModel(team);
        });

        _self.teams = (teams);
    };
    this.errorMessage = ko.observableArray(null);
   

    this.CreateUser = function () {
       
        $('#errors').html('');
        $.ajax({
            url: "Account/CreateUser",//Account controller CreateUser methodja
            type: "POST",
            data: {
                firstName: _self.manageUser.firstName(), 
                lastName: _self.manageUser.lastName(),
                AspnetUsers: {
                    email: _self.manageUser.email()
                },
            hireDate: _self.manageUser.hireDate(),
            maxDays: _self.manageUser.maxDays(),
            teamId: _self.manageUser.team().id,
            },
            datatype:"json",
            success: function (data) {
              
                if (data.Success == false) {
                    _self.errorMessage = data.EMessage;
                    $('#errors').html("Error:" + _self.errorMessage);
                }
                else{
                    _self.manageUser.id(data.newUser.ID);
                    _self.users.push(_self.manageUser);
                    alert("Successfully created.");
                    $('#myModalHorizontal').modal('hide');
                }
            }
        });
    };



    this.OpenEditUser = function (user) {
        _self.manageUser.id(user.id());
        _self.manageUser.firstName(user.firstName());
        _self.manageUser.lastName(user.lastName());
        _self.manageUser.hireDate(user.hireDate());
        _self.manageUser.maxDays(user.maxDays());
        _self.manageUser.email(user.email());

        if (user.team() != null) {
            _self.manageUser.team(user.team());
        } else
            _self.manageUser.team(new TeamModel());

    }

    this.ResetManageUser = function () {
        _self.manageUser.id(0);
        _self.manageUser.firstName(null);
        _self.manageUser.lastName(null);
        _self.manageUser.hireDate(null);
        _self.manageUser.maxDays(null);
        _self.manageUser.email(null);

        _self.manageUser.team(new TeamModel());


    }
    //h edit vagy create button jelenjen meg egy if, ... mivel van tobb az edit buttonnak
    this.EditUser = function () {

        $.ajax({
            url: "Account/EditUser",//Account controller CreateUser methodja
            type: "POST",
            data: {
                ID: _self.manageUser.id(),
                firstName: _self.manageUser.firstName(),
                lastName: _self.manageUser.lastName(),
                AspnetUsers: {
                    email: _self.manageUser.email()
                },
                hireDate: _self.manageUser.hireDate(),
                maxDays: _self.manageUser.maxDays(),
                //teamId: _self.manageUser.team().id,
            },
            datatype: "json",
            success: function (data) {
                
                var users = _.map(data.usersList, function (user, index) {
                    return new UserDetailsModel(user);
                });

                _self.users(users);
                alert("Successfully Edited.");
                $('#myModalHorizontal').modal('hide');
            }
        });
       
    };

}

function InitializeDashboardModel(data) {
    DashboardModel.instance = new DashboardModel();
    DashboardModel.instance.initialize(data);
    ko.applyBindings(DashboardModel.instance);
}

