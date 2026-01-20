using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using System.Text.Json;
using System.Web;
using FMS.Svc.File.Smb;

namespace FMS.Lib.Tqm.Track.Controller;

[Route("api/tqm/track/capture")]
[ApiController]
public class Capture : ControllerBase {

  SMBClient client;
  string folderPath = string.Empty;

  public Capture(IConfiguration configuration) {
    // setting parameters
    string host = configuration["TQM:Track:Host"] ?? string.Empty;
    string domainName = configuration["TQM:Track:Login:Domain"] ?? string.Empty;
    string userName = configuration["TQM:Track:Login:User"] ?? string.Empty;
    string password = configuration["TQM:Track:Login:Password"] ?? string.Empty;
    string basePath = configuration["TQM:Track:BasePath"] ?? string.Empty;
    // smb client
    folderPath = configuration["TQM:Track:FolderPath"] ?? string.Empty;
    client = new SMBClient(host, domainName, userName, password, basePath);
  }

  [HttpPost("[action]")]
  public async Task<object> GetList([FromBody] JsonElement data, CancellationToken token) {
    string path = HttpUtility.UrlDecode(data.GetProperty("path").GetString() ?? string.Empty);
    List<object> items = new();
    // SMB Connect
    var list = client.GetList(folderPath + path);
    if (list != null) {
      string[] imageExtensions = { "png", "jpg" };
      foreach (var file in list) {
        switch (file.FileAttributes) {
          case SMBLibrary.FileAttributes.Directory:
            items.Add(new { Name = file.FileName, Date = file.LastWriteTime, Path = path + "\\" + file.FileName, Type = "folder" });
            break;
          case SMBLibrary.FileAttributes.Archive:
            if (imageExtensions.Any(x => file.FileName.ToLower().EndsWith(x)) == false)
              continue;
            items.Add(new { Name = file.FileName, Date = file.LastWriteTime, Size = file.Length, Path = path + "\\" + file.FileName, Type = "file" });
            break;
        }
      }
    }
    return new { Path = path, Items = items, Parent = string.Join('\\', path.Split("\\").SkipLast(1).ToArray()) };
  }

  [HttpGet("{path}")]
  public async Task<IActionResult> GetImage([FromQuery] string path, [FromQuery] int width, [FromQuery] int height, CancellationToken token) {
    path = HttpUtility.UrlDecode(path);
    var data = client.GetFile(folderPath + path);
    try {
      using var ms = new MemoryStream(data);
      using Image image = await Image.LoadAsync(ms, token);
      image.Mutate(x => x.Resize(new ResizeOptions { Mode = ResizeMode.Crop, Size = new Size(width, height) }));
      var output = new MemoryStream();
      await image.SaveAsync(output, new PngEncoder());
      output.Position = 0;
      return File(output, "image/png");
    }
    catch {
      return File(Array.Empty<byte>(), "image/png");
    }
  }

  [HttpPost("[action]")]
  public async Task<object> SaveImage([FromForm] string path, IFormFile file, CancellationToken token) {
    path = HttpUtility.UrlDecode(path);
    string imagePath = folderPath + path + "\\" + DateTime.Now.ToString("yyMMddHHmmss") + ".png";
    using var ms = new MemoryStream();
    using Image image = await Image.LoadAsync(file.OpenReadStream(), token);
    var size = new Size(image.Width / 8 < 768 ? 768 : image.Width / 8, image.Height / 8 < 1020 ? 1020 : image.Height / 8);
    ms.Position = 0;
    image.Save(ms, new PngEncoder());
    var result = client.SaveFile(imagePath, ms.ToArray());
    return new { Path = HttpUtility.UrlEncode(imagePath) };
  }

  [HttpPost("[action]")]
  public async Task<object> CreateFolder([FromBody] JsonElement data, CancellationToken token) {
    string path = HttpUtility.UrlDecode(data.GetProperty("path").GetString() ?? string.Empty);
    string name = $"{DateTime.Today.Year - 1911}{DateTime.Today.ToString("MMdd")}({data.GetProperty("name").GetString() ?? string.Empty})";
    string fullPath = folderPath + path + "\\" + name;
    var result = client.CreateDirectory(fullPath);
    if (result) {
      return new { Path = HttpUtility.UrlEncode(fullPath) };
    }
    return new { Path = HttpUtility.UrlEncode(folderPath + path) };
  }
}
