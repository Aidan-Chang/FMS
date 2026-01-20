using ElmahCore.Mvc;
using FMS.Svc.Web.Profiler.Error;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Routing;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
  .SetBasePath(Path.Combine(builder.Environment.ContentRootPath, "content", "configuration"))
  .AddJsonFile("jwt.json", false)
  .AddJsonFile("serilog.json", false)
  .AddJsonFile("elmah.json", false)
  .AddJsonFile("db.json", DbType.Local)
  .AddJsonFile("fqm.json", false);

builder.Host.UseSerilog((context, provider, configuration) => configuration.ReadFrom.Configuration(context.Configuration));

builder.Services.AddSerilog();

builder.Services.AddMiniProfiler(options => {
  options.RouteBasePath = "/profiler";
  options.PopupStartHidden = true;
  }).AddEntityFramework();

//builder.Services
//  .AddHangfire(options =>
//    options.UseSqlServerStorage(builder.Configuration.GetConnectionString("default") ?? ""))
//  .AddHangfireServer(options => {
//    options.WorkerCount = Environment.ProcessorCount / 2;
//    options.Queues = [builder.Environment.EnvironmentName];
//  });

builder.Services.AddOpenApi()
  //.AddElmah<SqlErrorLog>(options => {
  //  options.Path = "/elmah";
  //  options.FiltersConfig = "content/configuration/elmah.xml";
  //  options.Filters.Add(new SpaServiceFilter());
  //})
  .AddCors(options => options.AddPolicy(
    "default", policy =>
      policy.WithOrigins("*")
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()
    ))
  .AddHttpContextAccessor()
  .AddSpaStaticFiles(options => options.RootPath = "content/client/dist");

builder.Services.AddHealthChecks();

//builder.Services.AddSignalR();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options => {
    options.Audience = builder.Configuration["Jwt:Audience"];
  });

builder.Services.AddControllers();

var app = builder.Build();

//app.UseElmah();

app.UseMiniProfiler();

app.UseCors("default");

app.UseDefaultFiles()
  .UseStaticFiles()
  .UseSpaStaticFiles();

app.MapOpenApi();
app.MapScalarApiReference(
  "/docs",
  options => {
    options.WithTitle("FMS")
      //.WithCustomCss(".scalar-app > aside > div:last-child { display: none; }") // remove the scalar label mark
      .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Fetch);
    options.ShowDeveloperTools = DeveloperToolsVisibility.Never;
    options.HideClientButton = true;
  });

app.UseSerilogRequestLogging();

app.UseRouting().UseAuthentication().UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/healthz");

//app.UseHangfireDashboard(
//  "/hangfire",
//  new() {
//    AppPath = null,
//    DisplayStorageConnectionString = false,
//    DashboardTitle = "Task Dashboard",
//    DarkModeEnabled = true,
//  });

app.UseSpa(spa => {
  spa.Options.SourcePath = "content/client";
  if (app.Environment.IsDevelopment()) {
    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
  }
});

// the path not starts with /api, /docs, /openapi, /hangfire, /elmah, /healthz will be served as spa
//app.MapWhen(u => new[] { "/api", "/docs", "/openapi", "/hangfire", "/elmah", "/profiler", "/healthz" }.Any(p => u.Request.Path.Value?.StartsWith(p) ?? false) == false, route =>
//  route.UseSpa(spa => {
//    spa.Options.SourcePath = "content/client";
//    if (app.Environment.IsDevelopment()) {
//      spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
//    }
//  }));

app.Run();
