using Chat.API.Extensions;
using Chat.API.Hubs;
using Chat.API.Middlewares;
using Chat.Domain.Interfaces;
using Chat.Domain.Services;
using Chat.Infrastructure.Authentication;
using Chat.Infrastructure.Persistence;
using Chat.Infrastructure.Persistence.Repositories;
using Chat.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ChatDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("No connection string 'DefaultConnection'"));
});

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis")
        ?? throw new InvalidOperationException("No connection string 'Redis'")));

builder.Services.AddSingleton<IUserStatusTracker, RedisUserStatusTracker>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSignalR(options =>
{
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
});

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(nameof(JwtOptions)));

builder.Services.AddJwtAuthentication(builder.Configuration);

/* Repositories */
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IMessagesRepository, MessagesRepository>();
builder.Services.AddScoped<IChatRoomsRepository, ChatRoomsRepository>();
builder.Services.AddScoped<IChatMembersRepository, ChatMembersRepository>();
builder.Services.AddScoped<IRefreshTokensRepository, RefreshTokensRepository>();
builder.Services.AddScoped<IMessageReactionsRepository, MessageReactionsRepository>();

/* Infrastructure services */
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

/* Domain services */
builder.Services.AddScoped<UsersService>();
builder.Services.AddScoped<ChatRoomsService>();
builder.Services.AddScoped<MessagesService>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.UseWebSockets();

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.Run();
