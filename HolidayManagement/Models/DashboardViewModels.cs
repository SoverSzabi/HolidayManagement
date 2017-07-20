using HolidayManagement.Repository.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HolidayManagement.Models
{
    public class DashboardViewModels
    {
        public List<Team> TeamList { get; set; }
        public List<UserDetails> UserList { get; set; }
        public List<IdentityRole> RoleList { get; set; }
        public CalendarViewModel Calendar { get; set; }
    }

    public class CalendarViewModel
    {
        public List<BankHoliday> BankHolidayList { get; set; }
        public List<Vacation> VacationList { get; set; }

    }

}