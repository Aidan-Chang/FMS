using Microsoft.Extensions.Configuration.Json;
using Microsoft.Extensions.FileProviders;

namespace Microsoft.Extensions.Configuration;

public class DbJsonFileSource : JsonConfigurationSource {
  public override IConfigurationProvider Build(IConfigurationBuilder builder) {
    FileProvider = builder.Properties["FileProvider"] as PhysicalFileProvider;
    return new DbJosnFileProvider(this);
  }
}
