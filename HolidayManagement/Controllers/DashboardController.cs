using HolidayManagement.Models;
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

        //ket datum kozott kiszamolja a hetkoznapok szamat es kivonja belole a bankholidayeket
        public  int BusinessDaysUntil( DateTime firstDay, DateTime lastDay,  List<BankHoliday> bankHolidays)
        {
            firstDay = firstDay.Date;
            lastDay = lastDay.Date;
            if (firstDay > lastDay)
                throw new ArgumentException("Incorrect TODate! FromDate > ToDate " + lastDay);

            TimeSpan span = lastDay - firstDay;
            int businessDays = span.Days + 1;
            int fullWeekCount = businessDays / 7;
            // find out if there are weekends during the time exceedng the full weeks
            if (businessDays > fullWeekCount * 7)
            {
                // we are here to find out if there is a 1-day or 2-days weekend
                // in the time interval remaining after subtracting the complete weeks
                int firstDayOfWeek = (int)firstDay.DayOfWeek;
                int lastDayOfWeek = (int)lastDay.DayOfWeek;
                if (lastDayOfWeek < firstDayOfWeek)
                    lastDayOfWeek += 7;
                if (firstDayOfWeek <= 6)
                {
                    if (lastDayOfWeek >= 7)// Both Saturday and Sunday are in the remaining time interval
                        businessDays -= 2;
                    else if (lastDayOfWeek >= 6)// Only Saturday is in the remaining time interval
                        businessDays -= 1;
                }
                else if (firstDayOfWeek <= 7 && lastDayOfWeek >= 7)// Only Sunday is in the remaining time interval
                    businessDays -= 1;
            }

            // subtract the weekends during the full weeks in the interval
            businessDays -= fullWeekCount + fullWeekCount;

            // subtract the number of bank holidays during the time interval
            foreach (var bankHoliday in bankHolidays)
            {
                DateTime bh = new DateTime(firstDay.Year, Convert.ToInt16( bankHoliday.Month), Convert.ToInt16(bankHoliday.Day));

                if(firstDay <= bh && bh <= lastDay && bh.DayOfWeek != DayOfWeek.Sunday && bh.DayOfWeek != DayOfWeek.Saturday)
                    --businessDays;
            }

            return businessDays;
        }




        [HttpPost]
        public ActionResult AddHoliday(Vacation model)
        {
            
            //ha a model userid null akkor a bejelentkezett usernek irod ha enm a kivalasztott usernek
            var loginedUserUserId= User.Identity.GetUserId();
            UserDetailsRepository udr = new UserDetailsRepository();
            var loginedUserId = udr.GetUserDetailsByUserId(loginedUserUserId);

            if (model.UserId == 0)
                model.UserId = loginedUserId.ID;

            BankHolidayRepository bhr = new BankHolidayRepository();
            var holidayDays = bhr.GetBankHolidays();

            string message = "ok";
            bool successed = true;
           
            model.Date = DateTime.Now;
            model.StateId = 1;

            int businessDaysUntil=0;
            try
            {
                businessDaysUntil = BusinessDaysUntil(model.StartDate, model.EndDate, holidayDays);
            }
            catch (ArgumentException e)
                {
                successed = false;
                message = e.Message;
            }
            model.NrDays = businessDaysUntil;

            using (HolidayManagementContext db = new HolidayManagementContext())
            {

                int sumUsedDays = 0;
                sumUsedDays = (int?)((from c in db.Vacations
                                      where c.UserId == model.UserId
                                      select c.NrDays).Sum()) ?? 0;


                var userMaxDays = db.UserDetailsModel.FirstOrDefault(p => p.ID == model.UserId);
                if (userMaxDays.MaxDays - sumUsedDays > businessDaysUntil)
                {
                    db.Vacations.Add(model);

                    try
                    {
                        db.SaveChanges();
                    }
                    catch (Exception e)
                    {
                        successed = false;
                        message = "Save in  Error" + e.ToString();
                    }
                }
                else
                {
                    successed = false;
                    message = "Selected user has not enough holiday days";
                    }
                }
            VacationRepository vacationR = new VacationRepository();
            var res = new { Success = successed, EMessage = message, BusinessDaysUntil = businessDaysUntil };
            return Json(res, JsonRequestBehavior.DenyGet);
        }
    }

}