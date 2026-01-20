using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Diagnostics.CodeAnalysis;

namespace FMS.Lib.Tqm.Track.Controller;

[Route("api/tqm/track/capture")]
[ApiController]
public class Capture: ControllerBase {

  IConfiguration configuration;

  public Capture(IConfiguration configuration) {
    this.configuration = configuration;
  }

  [HttpGet("[action]")]
  public async Task<object> GetList([AllowNull]string? path, CancellationToken token) {
    List<object> content = new();
    DirectoryInfo dir = new DirectoryInfo(string.IsNullOrEmpty(path) ? (configuration["TQM:Track:Path"] ?? "d:\\") : path);
    foreach (var d in dir.GetDirectories("*", SearchOption.TopDirectoryOnly)) {
      content.Add(new { Name = d.Name, Date = d.LastWriteTime });
    }
    foreach (var f in dir.GetFiles("*", SearchOption.TopDirectoryOnly)) {
      content.Add(new { Name = f.Name, Date = f.LastWriteTime, Size = f.Length });
    }
    return new { Path = dir.FullName, Items = content };
  }

}
