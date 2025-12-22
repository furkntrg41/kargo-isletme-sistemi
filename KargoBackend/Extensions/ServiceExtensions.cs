using System.Text;
using KargoBackend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace KargoBackend.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddJwtConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            // 1. JwtService'i burada kaydedelim (Dependency Injection)
            services.AddScoped<JwtService>();

            // 2. Gizli Anahtarı Al
            var jwtKey = configuration["Jwt:Key"];
            // Fallback (Hata önleyici):
            if (string.IsNullOrEmpty(jwtKey)) jwtKey = "BuKeyEnAz32KarakterOlmali_YoksaHataVerir_12345";
            
            var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

            // 3. Authentication ve JwtBearer Ayarları
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                    
                    ValidateIssuer = false, // Test ortamı için false
                    ValidateAudience = false, // Test ortamı için false
                    
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero // Token süresi bittiği an geçersiz olsun
                };
            });
        }
    }
}