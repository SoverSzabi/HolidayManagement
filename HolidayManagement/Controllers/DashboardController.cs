﻿using HolidayManagement.Models;
using HolidayManagement.Repository;
using HolidayManagement.Repository.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HolidayManagement.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        public HolidayManagementContext db = new HolidayManagementContext();

        // GET: Dashboard
        public ActionResult Index()
        {

            var DbUsers = db.UserDetailsModel.ToList();
            DashboardViewModels dashboardVM = new DashboardViewModels();

            UserDetailsRepository UDR = new UserDetailsRepository();
            dashboardVM.UserList = UDR.GetUsers();

            TeamRepository TR = new TeamRepository();
            dashboardVM.TeamList = TR.GetTeams();

            List<IdentityRole> roles = db.Roles.ToList();
            dashboardVM.RoleList = roles;

            VacationRepository vac = new VacationRepository();
            BankHolidayRepository bank = new BankHolidayRepository();

            CalendarViewModel calendar = new CalendarViewModel();
            calendar.BankHolidayList = bank.GetBankHolidays();
            calendar.VacationList = vac.GetVacations();

           


            dashboardVM.Calendar = calendar;
            return View(dashboardVM);
        }


    }

}