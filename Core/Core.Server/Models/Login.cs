namespace Core.Server.Models
{
    public class Login
    {
        // El usuario no es necesario por parte del front pero se adquiere solo desde el back con el simbolo ?
        public string? UserName { get; set; }

        public string? Email { get; set; }

        public string? Password { get; set; }

        public bool Remember { get; set; }
    }
}
