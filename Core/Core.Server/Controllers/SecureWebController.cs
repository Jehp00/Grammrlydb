using Core.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;

namespace Core.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecureWebController(SignInManager<User> sm, UserManager<User> um) : ControllerBase
    {
        private readonly SignInManager<User> signInManager = sm;
        private readonly UserManager<User> userManager = um;

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            IdentityResult result = new();
            try
            {
                User user_ = new User()
                {
                    Name = user.Name,
                    SurName = user.SurName,
                    Level = user.Level,
                    Email = user.Email,
                    UserName = user.UserName,
                };

                result = await userManager.CreateAsync(user_, user.PasswordHash);

                if (!result.Succeeded)
                {
                    return BadRequest(result);
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new {message = "Someything went wrong, please try again" + ex.Message });
            }

            return Ok(new { message = "Register Successfully", result = result });
        }

        [HttpPost("login")]
        public async Task<ActionResult> LoginUser(Login login)
        {
            string message;
            try
            {
                // Check if email is provided
                if (string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
                {
                    return BadRequest(new {message= "Email and password are required" });
                }

                User user_ = await userManager.FindByEmailAsync(login.Email);

                // Ensure user exists and their email is confirmed
                if (user_ == null)
                {
                    return Unauthorized(new {message = "User does not exist or email not confirmed" });
                }

                if (!user_.EmailConfirmed)
                {
                    user_.EmailConfirmed = true;  // Temporary for development purposes
                }


                var result = await signInManager.PasswordSignInAsync(user_, login.Password, login.Remember, false);

                Console.WriteLine(result);

                if (!result.Succeeded)
                {
                    return Unauthorized(new { message = "Check your login credentials and try it again" });
                }

                user_.LastLogin = DateTime.Now;
                var updateResult = await userManager.UpdateAsync(user_);

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong, please try again. " + ex.Message });
            }

            return Ok(new { message = "Login Successfully" });
        }


        [HttpGet("logout"), Authorize]
        public async Task<ActionResult> LogoutUser()
        {
            try
            {
                await signInManager.SignOutAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(new {message = "Someything went wrong, please try again" + ex.Message });
            }

            return Ok(new { message = "Nos vemos la proxima!!" });
        }

        [HttpGet("admin"), Authorize]
        public ActionResult AdminPage()
        {
            string[] admins = { "Admin Jose", "Admin Escudeo", "Admin Emmanuel", "Admin Daniel", "Admin Andres" };


            return Ok(new { trustedPartners = admins });
        }

        [HttpGet("account/{email}"), Authorize]
        public async Task<ActionResult> AccountPage(string email)
        {
            User userInfo = await userManager.FindByEmailAsync(email);
            if (userInfo == null)
            {
                return BadRequest(new { message = "Something went wrong, try again." });
            }

            return Ok(userInfo = userInfo);
        }

        [HttpGet("xhtlekd"), Authorize]
        public async Task<ActionResult> CheckUSer()
        {
            User currentUser = new();

            try
            {
                var user_ = HttpContext.User;
                var principals = new ClaimsPrincipal(user_);
                var result = signInManager.IsSignedIn(principals);
                if (result)
                {
                    currentUser = await signInManager.UserManager.GetUserAsync(principals);
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception ex) { 
                return BadRequest(new {message = "Something went wrong checking the user. " + ex.Message });
            }

            return Ok(new { message = "Logged In", user = currentUser});
            
        }

        [HttpGet("user-info/{email}"), Authorize]
        public async Task<ActionResult> GetUserInfo(string email)
        {
            try
            {
                // Find user by email
                User user = await userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found." });
                }

                // Return the required fields
                var userInfo = new
                {
                    user.Level,
                    user.TotalQuestions,
                    user.TotalAnsweredQuestions
                };

                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong. " + ex.Message });
            }
        }

        [HttpPut("update-answer/{email}"), Authorize]
        public async Task<ActionResult> UpdateAnsweredQuestions(string email)
        {
            try
            {
                // Find user by email
                User user = await userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found." });
                }

                // Increment TotalAnsweredQuestions by 1
                user.TotalAnsweredQuestions += 1;

                // Save changes
                var result = await userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Failed to update user info." });
                }

                return Ok(new { message = "TotalAnsweredQuestions updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong. " + ex.Message });
            }
        }


    }
}
