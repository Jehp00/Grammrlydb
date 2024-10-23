using Core.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;

namespace Core.Server.Controllers
{
    // Este archivo es la API en si misma
    // Esta es una REST API, se define como la comunicacion entre el back y el front a trves de un protocolo llamado http
    // Esto significa que desde el front hago peticiones y la api se comunica con la base de datos y retorna una respuesta al front que este renderisa al usuario
    [Route("api/[controller]")]
    [ApiController]
    public class SecureWebController(SignInManager<User> sm, UserManager<User> um) : ControllerBase
    {
        // controladores que se encargan de revisar la data de las peticiones
        // cuando se hace una peticion, estas variable revisan lo datos de la peticion para ver si son validos en el login
        private readonly SignInManager<User> signInManager = sm;
        private readonly UserManager<User> userManager = um;

        // Esto es lo que se le llama un endpoint
        // cuando uste accede a la ruta en la que esta hosteada la API en este caso localhost:[puerto de la api] 
        // agregando esta ruta www.pagina.com/register se ejecuta una peticion tipo POST para el registro de usuarios
        // cuando yo llamo esa ruto y paso los datos del registro de usuario la api con esta funcion crear un fila en la tabla
        // de usuarios de la base de datos
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(User user)
        {
            if (user == null)
            {
                // Si usuario es nulo responde con un error
                // una practica del manejo de errores y se usa en todos los controladores
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

        // Peticioness que envia el correo y la contrasena y r3evisa si son correctas
        [HttpPost("login")]
        public async Task<ActionResult> LoginUser(Login login)
        {
            string message;
            try
            {
                // Revisa si el correo no es nulo
                if (string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
                {
                    return BadRequest(new {message= "Email and password are required" });
                }

                User user_ = await userManager.FindByEmailAsync(login.Email);

                // Se asegura que el usuario exista
                if (user_ == null)
                {
                    return Unauthorized(new {message = "User does not exist or email not confirmed" });
                }

                // Crea una variable para usuario confirmado
                if (!user_.EmailConfirmed)
                {
                    user_.EmailConfirmed = true;
                }

                // Respuesta que es enviada al front
                var result = await signInManager.PasswordSignInAsync(user_, login.Password, login.Remember, false);

                // Si no es una respuesta exitosa responde con un error al front, sea no esta autorizado, los datos no son correctos o faltan datos
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

        // Peticion que cierra sesion
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

        // Revisa si un usuario tiene el rol de administrador por el nombre de usuario
        [HttpGet("admin"), Authorize]
        public ActionResult AdminPage()
        {
            string[] admins = { "Admin Jose", "Admin Escudeo", "Admin Emmanuel", "Admin Daniel", "Admin Andres" };


            return Ok(new { trustedPartners = admins });
        }

        // Responde con la informacion del usuario
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

        // Revisa si el usuario ha iniciado sesion o no
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

        // Envia una respuesta con el nivel y el total de preguntas completadas al front
        [HttpGet("user-info/{email}"), Authorize]
        public async Task<ActionResult> GetUserInfo(string email)
        {
            try
            {
                // Encuentra usuario por email
                User user = await userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found." });
                }

                // Retorna los campos requeridos
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

        // Por cada pregunta completada suma 1 al valor del total de preguntas completadas
        [HttpPut("update-answer/{email}"), Authorize]
        public async Task<ActionResult> UpdateAnsweredQuestions(string email)
        {
            try
            {
                // Encuentra usuario por email
                User user = await userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found." });
                }

                // Cada vez que el usuario responda un pregunta corectamente en el front se ejecuta esta
                // peticion para sumar 1 a la variable que cuenta las respuestas correctas del suaurio
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
