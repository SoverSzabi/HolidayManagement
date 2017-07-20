function DashboardModel() {

    var _self = this;
    this.users = ko.observableArray(null);
    this.teams = ko.observableArray(null);
    this.roles = ko.observableArray(null);//
    this.bankDays = ko.observable(null);//
    this.days = ko.observableArray(null);//
    this.manageUser = new UserDetailsModel();
    this.monthName = ko.observableArray(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);    
    this.dayName = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.monthN = ko.observable(null);//
    this.month = ko.observable(null);//
    this.year = ko.observable(null);//
    //this.vaction = ko.observable(null);//

    this.initialize = function (data) {
        var users = _.map(data.UserList, function (user, index) {
            return new UserDetailsModel(user);
        });

        _self.users(users);

        var teams = _.map(data.TeamList, function (team, index) {
            return new TeamModel(team);
        });
        _self.teams(teams);

        var roles = _.map(data.RoleList, function (role, index) {
            return new RoleModel(role);
        });
        _self.roles(roles);

        var bankDays = _.map(data.Calendar.BankHolidayList, function (day) {
            return new BankHoliday(day);
        });
        _self.bankDays(bankDays);

        //var vacation = _.map(data.Calendar.VacationList, function (day) {
        //    return new VacationModel(day);
        //});
        //_self.vacation(vacation);

        var current = new Date();
        _self.month(current.getMonth());
        setWeekdaysInMonth(_self.month(), current.getFullYear());
    }


    this.nextMonth = function () {
        if (_self.month() == 11) {
            _self.month(0);
            _self.year(_self.year() + 1);
        }
        else {
            _self.month(_self.month() + 1);
        }
        setWeekdaysInMonth(_self.month(), _self.year());
    }

    this.prevMonth = function () {
        if (_self.month() == 0) {
            _self.month(11);
            _self.year(_self.year() - 1);
        }
        else {
            _self.month(_self.month() - 1);
        }
        setWeekdaysInMonth(_self.month(), _self.year());
    }

    var daysInMonth = function (month, year) {
        return new Date(year, month+1, 0).getDate();
    }

    var isWeekday = function (date) {
        var day = date.getDay();  
        return day != 0 && day != 6;
    }

    var setWeekdaysInMonth = function(month, year) {
        var days = daysInMonth(month, year);
        
        _self.monthN(_self.monthName()[month]);
       
        _self.year(year);

        _self.days.removeAll();
        for (var i = 0; i < days ; i++) {
            var bankHoliday = _.find(_self.bankDays(), function (bH) {
                return bH.Day() == i+1 && bH.Month() == month+1;
            });
            //var vacation = _.find(_self.vacation(), function (vac) {
            //    return vac.day() == i + 1 && bH.Month() == month + 1;
            //});

            var date = new Date(year, month, i + 1);
            
            _self.days.push(new MonthDayModel({
                day: i + 1,
                isFreeDay: !isWeekday(date),
                bankHoliday: bankHoliday,
                description: !isWeekday(date) ? 'Weekend' : 'Weekday' && bankHoliday? 'BankHoliday':'Weekday',
                name: _self.dayName[date.getDay()]
            }));
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
                hireDate:dateTimeReviver( _self.manageUser.hireDate()),
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

    //this.AddHoliday = function () {

    //    $('#errors').html('');
    //    $.ajax({
    //        url: "Account/AddHoliday",
    //        type: "POST",
    //        data: {
    //            firstName: _self.manageUser.firstName(),
    //            lastName: _self.manageUser.lastName(),
    //            AspnetUsers: {
    //                email: _self.manageUser.email(),
    //                Roles: _self.manageUser.role() != null ? [{ RoleId: _self.manageUser.role().id }] : null
    //            },
    //            hireDate: dateTimeReviver(_self.manageUser.hireDate()),
    //            maxDays: _self.manageUser.maxDays(),
    //            TeamId: _self.manageUser.team().id
    //        },
    //        datatype: "json",
    //        success: function (data) {

    //            if (data.Success == false) {
    //                _self.errorMessage = data.EMessage;
    //                $('#errors').html("Error:" + _self.errorMessage);
    //            }
    //            else {
    //                _self.manageUser.id(data.newUser.ID);
    //                _self.users.push(_self.manageUser);
    //                alert("Successfully created.");
    //                $('#myModalHorizontal').modal('hide');
    //            }
    //        }
    //    });
    //};
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
                    email: _self.manageUser.email(),
                    Roles: _self.manageUser.role() != null ? [{ RoleId: _self.manageUser.role().id }] : null
                },
                hireDate: _self.manageUser.hireDate(),
                maxDays: _self.manageUser.maxDays(),
                TeamId: _self.manageUser.team().id

                
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

