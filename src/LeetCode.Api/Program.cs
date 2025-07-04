
using EventSystem.Server.Configurations;
using EventSystem.Server.Endpoints;
using LeetCode.Api.Configurations;
using LeetCode.Api.Endpoints;
using LeetCode.Api.Extensions;
using LeetCode.Api.Middlewares;

namespace LeetCode.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            builder.WebHost.ConfigureKestrel(options =>
            {
                options.ListenAnyIP(5000); // Hamma IP-lardan 5000-portda qabul qiladi
            });



            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            ServiceCollectionExtensions.AddSwaggerWithJwt(builder.Services);

            builder.ConfigureSerilog();
            builder.ConfigureDataBase();
            builder.ConfigurationJwtAuth();
            builder.ConfigureJwtSettings();
            builder.Services.ConfigureDependecies();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost5173", policy =>
                {
                    policy.WithOrigins(
                        "http://localhost:5173",
                        "http://192.168.206.152:5173",
                        "http://172.29.64.1:5173"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });





            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowLocalhost5173");
            app.UseMiddleware<ExceptionHandlingMiddleware>();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapAdminEndpoints();
            app.MapAuthEndpoints();
            app.MapRoleEndpoints();
            app.MapLanguageEndpoints();
            app.MapProblemEndpoints();
            app.MapTestCaseEndpoints();
            app.MapSubmissionEndpoints();
            app.MapUserStatsEndpoints();


            app.MapControllers();

            app.Run();
        }
    }
}
