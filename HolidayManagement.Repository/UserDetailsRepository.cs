using HolidayManagement.Repository.Models;
using System.Collections.Generic;
using System.Linq;

namespace HolidayManagement.Repository
{
    public class UserDetailsRepository : BaseRepository<UserDetails>, IUserDetailsRepository
    {
        public UserDetails GetUserDetailsById(int userDetailsId)
        {
            return DbContext.UserDetailsModel.FirstOrDefault(x => x.ID == userDetailsId);
        }
        public UserDetails GetUserDetailsByUserId(string userDetailsUserId)
        {
            return DbContext.UserDetailsModel.FirstOrDefault(x => x.UserID == userDetailsUserId);
        }

        public List<UserDetails> GetUsers()
        {
            var users = DbContext.UserDetailsModel.ToList();

            foreach (var user in users)
            {
                if (user.Team != null)
                    user.Team.Users = null;
            }

            return users;
        }
    }
}
