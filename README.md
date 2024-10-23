# Aplicación de Aprendizaje de Inglés

Esta es una aplicación web para el aprendizaje de inglés que incluye funciones de login y registro, manejo de cuentas de usuario, una sección para resolver preguntas sobre los temas estudiados, y una página principal que actúa como guía de los temas disponibles. La aplicación tiene un backend construido en .NET C# con ASP.NET y un frontend en React JS.

## Contenidos
- [Características](#características)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Diagramas](#diagramas)

## Características

- **Login y Registro**: Permite a los usuarios registrarse y autenticarse en la plataforma.
- **Página de cuenta**: Muestra la información del usuario registrado y permite su edición.
- **Resolución de preguntas**: Los usuarios pueden responder a preguntas relacionadas con los temas de inglés.
- **Homepage**: Una guía con los temas disponibles, junto con información de contacto para obtener asistencia.

## Requisitos previos

Asegúrate de tener instalados los siguientes programas y herramientas en tu sistema:

- [.NET SDK](https://dotnet.microsoft.com/download) (Versión 6.0 o superior)
- [Node.js](https://nodejs.org/en/download/) (Versión 14.x o superior)
- [Visual Studio Code](https://code.visualstudio.com/) o cualquier IDE compatible con .NET y React

### Instalación de .NET y ASP.NET

1. **Instalar .NET SDK**:
   - Visita la [página de descargas de .NET](https://dotnet.microsoft.com/download).
   - Descarga e instala el **.NET SDK** correspondiente a tu sistema operativo.

2. **Verificar la instalación**:
   - Abre una terminal y ejecuta el siguiente comando para confirmar que .NET está instalado correctamente:
     ```bash
     dotnet --version
     ```
     Esto debería devolver la versión de .NET instalada.

### Instalación de React

1. **Instalar Node.js**:
   - Descarga e instala la versión recomendada de [Node.js](https://nodejs.org/).

2. **Verificar la instalación**:
   - Ejecuta el siguiente comando para comprobar que Node.js está instalado:
     ```bash
     node --version
     ```

   - También verifica si `npm` (Node Package Manager) está instalado ejecutando:
     ```bash
     npm --version
     ```

3. **Instalar dependencias del frontend**:
   - Navega a la carpeta del frontend de React:
     ```bash
     cd /Client/Client.App
     ```
   - Instala las dependencias de npm:
     ```bash
     npm install
     ```

## Ejecución

### Backend (ASP.NET)

1. Navega a la carpeta del servidor en el proyecto:
   ```bash
   cd /Core/Core.Server
   dotnet run

Cliente (React) ---> Servidor (ASP.NET Core) ---> Base de Datos
                          |
                        APIs Externas (si aplican)
