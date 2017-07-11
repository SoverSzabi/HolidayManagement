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
        // GET: Dashboard
        public ActionResult Index()
        {
            return View();
        }
        public PartialViewResult Users()
        {
            return PartialView("_Users");
        }
        public PartialViewResult GroupManagment()
        {
            return PartialView("_GroupManagment");
        }
        public PartialViewResult MyCalendar()
        {
            return PartialView("_MyCalendar");
        }
        public PartialViewResult Settings()
        {
            return PartialView("_Settings");
        }
    }
}