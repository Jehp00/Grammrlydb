using Core.Server.Data;
using Core.Server.Models;
using Microsoft.EntityFrameworkCore;

// Este archivo es el punto de entrada para que el framework .net sepa en que punto correr el codigo
// cuando en mi terminal yo ejecuto dotnet(el paquete de ejecucion de .net) run(comando a ejecutar) desde aqui la API empiza a cargar
namespace Core.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Initializador de la app
            var builder = WebApplication.CreateBuilder(args);

            //Agrega servicios
            builder.Services.AddControllers();
            // Seccion de seguridad
            // Aqui le digo al proyecto que se requiere autorizacion en peticiones que yo le diga en el archivo de controladores
            builder.Services.AddAuthorization();
            // Llave de conexion a la base de datos
            // Esta funciona por un string que contiene las credenciales de mi base de datos
            // gracias a esta linea mi codigo puede manipular la base de datos a mi antojo
            // ir a appsettings.json
            // este archivo en el archivo de configuracion del proyecto
            // aqui se alamacenan data que sea delicada y qyue no se pueda acceder desde el front
            builder.Services.AddDbContext<ApplicationDBContext>(options => {
                options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
            });
            
            builder.Services.AddIdentityApiEndpoints<User>().AddEntityFrameworkStores<ApplicationDBContext>();

            builder.Services.AddIdentityCore<User>(options =>
            {
                options.SignIn.RequireConfirmedAccount = true;
                options.Password.RequireDigit = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 0;

                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 6;
                options.Lockout.AllowedForNewUsers = true;

                // User settings
                options.User.AllowedUserNameCharacters =
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = true;
            }).AddEntityFrameworkStores<ApplicationDBContext>();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.MapIdentityApi<User>();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
