using Microsoft.Extensions.Configuration.Json;
using Microsoft.Extensions.FileProviders;

namespace Microsoft.Extensions.Configuration;

public  class DbJosnFileProvider : JsonConfigurationProvider {
  public DbJosnFileProvider(DbJsonFileSource source) : base(source) { }
  public override void Load(Stream stream) {
    base.Load(stream);
    var contentDbPath = string.Empty;
    foreach (var item in Data) {
      switch(item.Key) {
        case string key when key.StartsWith("ContentDbPath"):
          contentDbPath = Path.Combine([(Source.FileProvider as PhysicalFileProvider)?.Root ?? "", .. item.Value?.Split(['/', '\\']) ?? []]);
          break;
        case string key when key.StartsWith("ConnectionStrings:"):
          Data[item.Key] = item.Value?.Replace("%ContentDbPath%", contentDbPath);
          break;
      }
    }
  }
}
