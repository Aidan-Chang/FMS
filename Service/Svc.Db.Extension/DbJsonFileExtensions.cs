namespace Microsoft.Extensions.Configuration;

public enum DbType {
  Local,
  Remote,
}

public static class DbJsonFileExtensions {
  public static IConfigurationBuilder AddJsonFile(this IConfigurationBuilder builder, string path, DbType dbType) {
    return builder.Add(new DbJsonFileSource { Path = path });
  }
}
