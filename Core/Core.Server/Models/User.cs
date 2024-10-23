using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// namespace es usado para empaquetar el modulo y que otros archivos puedan acceder a su contenido, es como el export y el import de javascript
namespace Core.Server.Models
{
    // Creo un modelo de clase que actua a modo de plantilla para el molde del usuario para que cuando la API
    // se comunique con la db tome este modelo como plantilla y entienda por cuales paramateros la API esta preguntando
    public class User: IdentityUser
    // Se clase se llama User haciendo referencia al modelo de usuario osea todos los usuarios van a tener esta propiedades
    // Se usa algo llamado herencia para obtener un modelo que .Net ya tiene integrado para facilitar el desarrollo
    // este modelo se llama IdentityUser que ya trae bastantes propiedades y asi el desarrollador no tiene que crear mas de 100 props
    {
        // Propiedades requeridas para los perfiles usuario
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string SurName { get; set; }

        [MaxLength(10)]
        public string Level { get; set; }

        [Column(TypeName="datetime")]
        public DateTime CreatedDate { get; set; } = DateTime.Now; // Estas propiedades son valores predefinidos

        [Column(TypeName = "datetime")]
        public DateTime UpdatedDate { get; set; } = DateTime.Now; // Estas propiedades son valores predefinidos

        [Column(TypeName = "datetime")]
        public DateTime LastLogin { get; set; } = DateTime.Now; // Estas propiedades son valores predefinidos

        public bool IsAdmin { get; set; } = false;

        public int TotalQuestions { get; set; } = 23; // Estas propiedades son valores predefinidos

        public int TotalAnsweredQuestions { get; set; } = 0; // Esta su valor determinado sera 0 al crear un usuario y aumentar a medida que el usuario responda preguntas

    }
}
