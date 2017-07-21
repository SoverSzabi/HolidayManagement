using HolidayManagement.Repository.Interfaces;
using HolidayManagement.Repository.Models;
using System.Collections.Generic;
using System.Linq;

namespace HolidayManagement.Repository
{
    public class VacationStateRepository : BaseRepository<VacationState>, IVacationStateRepository
    {
        public VacationState GetVacationStateById(int vacationStateId)
        {
            return DbContext.VacationStates.FirstOrDefault(x => x.ID == vacationStateId);
        }

        public List<VacationState> GetVacationStates()
        {
            var states= DbContext.VacationStates.ToList();

           

            foreach (var s in states)
            {
                if (s.Vacations != null)
                    foreach (var v in s.Vacations)
                        v.State = null;
            }

            return states;
        }
    }
}
