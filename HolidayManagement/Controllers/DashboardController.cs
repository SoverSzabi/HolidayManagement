using HolidayManagement.Models;
using HolidayManagement.Repository;
using HolidayManagement.Repository.Models;
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
            dashboardVM.UserList= UDR.GetUsers();

            TeamRepository TR = new TeamRepository();
            dashboardVM.TeamList = TR.GetTeams();
            return View(dashboardVM);
        }
       

    }

}