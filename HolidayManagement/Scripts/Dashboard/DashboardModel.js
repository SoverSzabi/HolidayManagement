function DashboardModel() {

    var _self = this;
    this.users = ko.observableArray(null);
    this.teams = ko.observableArray(null);
    this.roles = ko.observableArray(null);//
    this.bankDays = ko.observableArray(null);//
    this.days = ko.observableArray(null);//
    this.manageUser = new UserDetailsModel();

    this.initialize = function (data) {
        var users = _.map(data.UserList, function (user, index) {
            return new UserDetailsModel(user);
        });

        _self.users(users);
      
        var teams = _.map(data.TeamList, function (team,index) {
            return new TeamModel(team);
        });
        _self.teams(teams);

        var roles = _.map(data.RoleList, function (role,index) {
            return new RoleModel(role);
        });
        _self.roles(roles);

        var bankDays = _.map(data.Calendar.HolidayList, function (day) {
            return new BankHoliday(day);
        });
        _self.bankDays(bankDays);



        var d = new Date();
        setWeekdaysInMonth(d.getMonth(), d.getYear());
      
    };

    var daysInMonth = function (month, year) {//daysInMonth(year,month);
        return new Date(year, month, 0).getDate();
    }

    var isWeekday = function (year, month, day) {
        var day = new Date(year, month, day).getDay();
        return day != 0 && day != 6;
    }

    var setWeekdaysInMonth = function(month, year) {
        var days = daysInMonth(month, year);
        var weekdays = 0;
                
        for(var i=0; i< days+1; i++) {
            if (isWeekday(year, month, i + 1))
            {
                _self.days.push(new MonthDayModel({Day:i+1, IsFeeDay:false}));
            }
            else {
                _self.days.push(new MonthDayModel({Day:i+1, IsFreeDay:true}));
            }
                weekdays++;
        }
    }

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
                    email: _self.manageUser.email(),
                    Roles: _self.manageUser.role() != null ? [{ RoleId: _self.manageUser.role().id }] : null
                },
                hireDate:_self.manageUser.hireDate(),
            maxDays: _self.manageUser.maxDays(),
            TeamId: _self.manageUser.team().id
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

        if (user.role() != null) {
            _self.manageUser.role(user.role());
        } else
            _self.manageUser.role(new RoleModel());

    }

    this.ResetManageUser = function () {
        _self.manageUser.id(0);
        _self.manageUser.firstName(null);
        _self.manageUser.lastName(null);
        _self.manageUser.hireDate(null);
        _self.manageUser.maxDays(null);
        _self.manageUser.email(null);

        _self.manageUser.team(new TeamModel());
        _self.manageUser.role(new RoleModel());

    }
    
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
                TeamId: _self.manageUser.team().id,
                RoleId: _self.manageUser.role().id,
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
    //Date format
    var setDateWithZero = function (date) {
        if (date < 10)
            date = "0" + date;

        return date;
    };

    var dateTimeReviver = function (value) {
        var match;

        if (typeof value === 'string') {
            match = /\/Date\((\d*)\)\//.exec(value);
            if (match) {
                var date = new Date(+match[1]);
                return date.getFullYear() + "-" + setDateWithZero(date.getMonth() + 1) + "-" + setDateWithZero(date.getDate()) +
                       "T" + setDateWithZero(date.getHours()) + ":" + setDateWithZero(date.getMinutes()) + ":" + setDateWithZero(date.getSeconds()) + "." + date.getMilliseconds();
            }
        }
        return value;
    };


}


function InitializeDashboardModel(data) {
    DashboardModel.instance = new DashboardModel();
    DashboardModel.instance.initialize(data);
    ko.applyBindings(DashboardModel.instance);
}

