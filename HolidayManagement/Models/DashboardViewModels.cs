using HolidayManagement.Repository.Models;
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
    }
}